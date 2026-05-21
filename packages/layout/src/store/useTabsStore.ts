import type { ComputedRef } from 'vue'
import type {
  RouteLocationNormalized,
  Router,
  RouteRecordNormalized,
} from 'vue-router'
import type { TabDefinition } from '../types'
import { createGlobalState, useStorage } from '@vueuse/core'
import { computed, ref, shallowRef } from 'vue'
import { storageConfig } from './config'
import { usePreferencesStore } from './usePreferencesStore'

const useTabsStore = createGlobalState(() => {
  const preferences = usePreferencesStore()

  /**
   * 根据 persist 配置决定是否使用 sessionStorage 持久化标签页。
   * - persist 为 true 时，标签页数据存储到 sessionStorage，刷新后保留
   * - persist 为 false（默认）时，使用普通 ref，刷新后标签页重置
   */
  const tabs = preferences.tabs.value.persist
    ? useStorage<TabDefinition[]>(storageConfig.tabsStorageKey, [], sessionStorage)
    : ref<TabDefinition[]>([])

  // persist 模式下，初始化时清理无效的 tab 数据（没有 meta 或 matched 为空的）
  if (preferences.tabs.value.persist) {
    const validTabs = tabs.value.filter((tab) => {
      // 如果 meta 为空对象且 matched 为空数组，说明是无效数据
      const hasValidMeta = tab.meta && Object.keys(tab.meta).length > 0
      const hasValidMatched = tab.matched && tab.matched.length > 0
      return hasValidMeta || hasValidMatched
    })
    if (validTabs.length !== tabs.value.length) {
      tabs.value = validTabs
    }
  }

  const cachedTabs = shallowRef<Set<string>>(new Set())
  const excludeCachedTabs = shallowRef<Set<string>>(new Set())
  const menuList = ref([
    'close',
    'affix',
    'maximize',
    'reload',
    'open-in-new-window',
    'close-other',
    'close-all',
  ])
  const renderRouteView = ref(true)
  const dragEndIndex = ref(0)
  const updateTime = ref(Date.now())

  const affixTabs = computed(() =>
    tabs.value
      .filter(isAffixTab)
      .toSorted(
        (a, b) => (a.meta?.affixTabOrder as number ?? 0) - (b.meta?.affixTabOrder as number ?? 0),
      ),
  )
  const getTabs = computed(() => {
    const normalTabs = tabs.value.filter(tab => !isAffixTab(tab))
    return [...affixTabs.value, ...normalTabs]
  })
  const getCachedTabs = computed(() => [...cachedTabs.value])
  const getExcludeCachedTabs = computed(() => [...excludeCachedTabs.value])

  /**
   * 替换所有标签页
   * @param next - 新的标签页列表
   */
  function setTabs(next: TabDefinition[]) {
    tabs.value = next
  }

  /**
   * 批量关闭指定 key 的标签页（内部方法）
   * @param keys - 要关闭的标签 key 列表
   */
  function _bulkCloseByKeys(keys: string[]) {
    const keySet = new Set(keys)
    setTabs(tabs.value.filter(item => !keySet.has(getTabKeyFromTab(item))))
    return updateCacheTabs()
  }

  /**
   * 关闭单个标签页，固定标签不可关闭（内部方法）
   * @param tab - 要关闭的标签定义
   */
  function _close(tab: TabDefinition) {
    if (isAffixTab(tab))
      return
    setTabs(tabs.value.filter(item => !equalTab(item, tab)))
  }

  /**
   * 导航到默认标签页（第一个标签）（内部方法）
   * @param router - Vue Router 实例
   */
  async function _goToDefaultTab(router: Router) {
    const firstTab = getTabs.value[0]
    if (firstTab) {
      await _goToTab(firstTab, router)
    }
  }

  /**
   * 通过路由导航到指定标签页（内部方法）
   * @param tab - 目标标签定义
   * @param router - Vue Router 实例
   */
  async function _goToTab(tab: TabDefinition, router: Router) {
    const { params, path, query } = tab
    const toParams = { params: params || {}, path, query: query || {} }
    await router.replace(toParams)
  }

  /**
   * 添加一个标签页。如果标签已存在则合并更新，不存在则新增。
   * 会自动处理 maxCount 和 maxNumOfOpenTab 限制。
   * @param routeTab - 路由信息作为标签定义
   * @returns 最终添加或更新后的标签定义
   */
  function addTab(routeTab: TabDefinition): TabDefinition {
    let tab = cloneTab(routeTab)
    if (!tab.key)
      tab.key = getTabKey(routeTab)
    if (!isTabShown(tab))
      return tab

    const tabIndex = tabs.value.findIndex(item => equalTab(item, tab))
    const { maxCount } = preferences.tabs.value
    const maxNumOfOpenTab = (routeTab?.meta?.maxNumOfOpenTab ?? -1) as number

    if (tabIndex === -1) {
      if (
        maxNumOfOpenTab > 0
        && tabs.value.filter(t => t.name === routeTab.name).length
        >= maxNumOfOpenTab
      ) {
        const index = tabs.value.findIndex(item => item.name === tab.name)
        if (index !== -1)
          tabs.value.splice(index, 1)
      }
      else if (maxCount > 0 && tabs.value.length >= maxCount) {
        const index = tabs.value.findIndex(item => !isAffixTab(item))
        if (index !== -1)
          tabs.value.splice(index, 1)
      }
      tabs.value.push(tab)
    }
    else {
      const currentTab = tabs.value[tabIndex]
      const mergedTab = {
        ...currentTab,
        ...tab,
        meta: { ...currentTab?.meta, ...tab.meta },
      }
      if (currentTab?.meta?.affixTab)
        mergedTab.meta.affixTab = true
      if (currentTab?.meta?.newTabTitle)
        mergedTab.meta.newTabTitle = currentTab.meta.newTabTitle
      tab = mergedTab
      tabs.value.splice(tabIndex, 1, mergedTab)
    }

    updateCacheTabs()
    return tab
  }

  /**
   * 关闭所有非固定标签页，并导航到默认标签
   * @param router - Vue Router 实例，用于导航
   */
  async function closeAllTabs(router: Router) {
    const affix = tabs.value.filter(isAffixTab)
    setTabs(affix.length > 0 ? affix : tabs.value.slice(0, 1))
    await _goToDefaultTab(router)
    updateCacheTabs()
  }

  /**
   * 关闭除指定标签和固定标签外的所有标签页
   * @param tab - 要保留的标签定义
   */
  async function closeOtherTabs(tab: TabDefinition) {
    const keys = tabs.value
      .filter(item => !equalTab(item, tab) && !isAffixTab(item))
      .map(item => getTabKeyFromTab(item))
    await _bulkCloseByKeys(keys)
  }

  /**
   * 关闭指定标签页，若关闭的是当前激活标签则自动导航到相邻标签
   * @param tab - 要关闭的标签定义
   * @param router - Vue Router 实例，用于导航
   */
  async function closeTab(tab: TabDefinition, router: Router) {
    const { currentRoute } = router
    const isActive
      = getTabKey(currentRoute.value) === getTabKeyFromTab(tab)

    if (!isActive) {
      _close(tab)
      updateCacheTabs()
      return
    }

    const index = getTabs.value.findIndex(
      item => getTabKeyFromTab(item) === getTabKey(currentRoute.value),
    )
    const before = getTabs.value[index - 1]
    const after = getTabs.value[index + 1]

    if (after) {
      _close(tab)
      await _goToTab(after, router)
    }
    else if (before) {
      _close(tab)
      await _goToTab(before, router)
    }
    else {
      console.error('Failed to close the tab; only one tab remains open.')
    }
  }

  /**
   * 通过标签 key 关闭标签页
   * @param key - 标签的唯一标识（URL 编码格式）
   * @param router - Vue Router 实例，用于导航
   */
  async function closeTabByKey(key: string, router: Router) {
    const originKey = decodeURIComponent(key)
    const target = tabs.value.find(
      item => getTabKeyFromTab(item) === originKey,
    )
    if (target) {
      await closeTab(target, router)
    }
  }

  /**
   * 根据 key 获取标签定义
   * @param key - 标签的唯一标识
   * @returns 匹配的标签定义
   */
  function getTabByKey(key: string) {
    return getTabs.value.find(item => getTabKeyFromTab(item) === key)!
  }

  /**
   * 在新窗口中打开标签页（待实现）
   * @param tab - 要打开的标签定义
   */
  function openTabInNewWindow(tab: TabDefinition) {
    const url = tab.fullPath || tab.path
    if (!url) {
      console.warn('Cannot open tab in new window: no path available')
      return
    }
    // 构建完整 URL（支持 hash 路由）
    const fullUrl = url.startsWith('/')
      ? `${window.location.origin}${window.location.pathname}#${url}`
      : url
    window.open(fullUrl, '_blank')
  }

  /**
   * 将标签固定（Pin），固定后标签会移动到固定区域
   * @param tab - 要固定的标签定义
   */
  async function pinTab(tab: TabDefinition) {
    const index = tabs.value.findIndex(item => equalTab(item, tab))
    if (index === -1)
      return
    const oldTab = tabs.value[index]
    tab.meta.affixTab = true
    tab.meta.title = oldTab?.meta?.title as string
    tabs.value.splice(index, 1, tab)
    const affixCount = tabs.value.filter(isAffixTab).length
    await sortTabs(index, affixCount - 1)
  }

  /**
   * 刷新当前标签页，通过临时移除 KeepAlive 缓存实现
   * @param router - Vue Router 实例，或组件名称字符串
   */
  async function refresh(router: Router | string) {
    if (typeof router === 'string')
      return refreshByName(router)

    const { currentRoute } = router
    const { name } = currentRoute.value

    excludeCachedTabs.value.add(name as string)
    renderRouteView.value = false
    // startProgress()

    await new Promise(resolve => setTimeout(resolve, 200))

    excludeCachedTabs.value.delete(name as string)
    renderRouteView.value = true
    // stopProgress()
  }

  /**
   * 通过组件名称刷新标签页缓存
   * @param name - 组件名称
   */
  async function refreshByName(name: string) {
    excludeCachedTabs.value.add(name)
    await new Promise(resolve => setTimeout(resolve, 200))
    excludeCachedTabs.value.delete(name)
  }

  /**
   * 重置标签页标题为默认值（清除自定义标题）
   * @param tab - 要重置标题的标签定义
   */
  async function resetTabTitle(tab: TabDefinition) {
    if (tab?.meta?.newTabTitle)
      return
    const findTab = tabs.value.find(item => equalTab(item, tab))
    if (findTab) {
      findTab.meta.newTabTitle = undefined
      await updateCacheTabs()
    }
  }

  /**
   * 根据路由配置初始化固定标签页
   * @param routes - 包含 affixTab 标记的路由列表
   */
  function setAffixTabs(routes: RouteRecordNormalized[]) {
    for (const tab of routes) {
      tab.meta.affixTab = true
      addTab(routeToTab(tab))
    }
  }

  /**
   * 设置标签页右键菜单可用项
   * @param list - 菜单项 key 列表，如 ['close', 'affix', 'reload']
   */
  function setMenuList(list: string[]) {
    menuList.value = list
  }

  /**
   * 设置标签页的自定义标题
   * @param tab - 要修改标题的标签定义
   * @param title - 新标题，支持字符串或响应式 ComputedRef
   */
  async function setTabTitle(
    tab: TabDefinition,
    title: ComputedRef<string> | string,
  ) {
    const findTab = tabs.value.find(item => equalTab(item, tab))
    if (findTab) {
      findTab.meta.newTabTitle = title
      await updateCacheTabs()
    }
  }

  /**
   * 触发标签页更新时间戳，用于强制刷新标签视图
   */
  function setUpdateTime() {
    updateTime.value = Date.now()
  }

  /**
   * 对标签页进行排序（拖拽或固定/取消固定时使用）
   * @param oldIndex - 标签的原始索引位置
   * @param newIndex - 标签的目标索引位置
   */
  async function sortTabs(oldIndex: number, newIndex: number) {
    const currentTab = tabs.value[oldIndex]
    if (!currentTab)
      return
    const next = [...tabs.value]
    next.splice(oldIndex, 1)
    next.splice(newIndex, 0, currentTab)
    setTabs(next)
    dragEndIndex.value += 1
  }

  /**
   * 切换标签页的固定/取消固定状态
   * @param tab - 要切换状态的标签定义
   */
  async function toggleTabPin(tab: TabDefinition) {
    const affixTab = tab?.meta?.affixTab ?? false
    await (affixTab ? unpinTab(tab) : pinTab(tab))
  }

  /**
   * 取消标签页固定，标签会从固定区域移回普通区域
   * @param tab - 要取消固定的标签定义
   */
  async function unpinTab(tab: TabDefinition) {
    const index = tabs.value.findIndex(item => equalTab(item, tab))
    if (index === -1)
      return
    const oldTab = tabs.value[index]
    tab.meta.affixTab = false
    tab.meta.title = oldTab?.meta?.title as string
    tabs.value.splice(index, 1, tab)
    const affixCount = tabs.value.filter(isAffixTab).length
    await sortTabs(index, affixCount)
  }

  /**
   * 重置标签页状态为初始值，清空所有标签和缓存
   */
  function reset() {
    setTabs([])
    cachedTabs.value = new Set()
    excludeCachedTabs.value = new Set()
    renderRouteView.value = true
    dragEndIndex.value = 0
    updateTime.value = Date.now()
  }

  /**
   * 根据当前标签页列表更新 KeepAlive 的缓存名称集合
   */
  async function updateCacheTabs() {
    const cacheMap = new Set<string>()
    for (const tab of tabs.value) {
      if (tab.meta?.keepAlive === false || tab.meta?.cache === false)
        continue;
      (tab.matched || []).forEach((t, i) => {
        if (i > 0)
          cacheMap.add(t.name as string)
      })
      cacheMap.add(tab.name as string)
    }
    cachedTabs.value = cacheMap
  }

  return {
    // state
    tabs,
    cachedTabs,
    excludeCachedTabs,
    menuList,
    renderRouteView,
    dragEndIndex,
    updateTime,

    // getters
    affixTabs,
    getTabs,
    getCachedTabs,
    getExcludeCachedTabs,

    // actions
    _bulkCloseByKeys,
    _close,
    _goToDefaultTab,
    _goToTab,
    addTab,
    closeAllTabs,
    closeOtherTabs,
    closeTab,
    closeTabByKey,
    getTabByKey,
    openTabInNewWindow,
    pinTab,
    refresh,
    refreshByName,
    resetTabTitle,
    setAffixTabs,
    setMenuList,
    setTabTitle,
    setUpdateTime,
    sortTabs,
    toggleTabPin,
    unpinTab,
    updateCacheTabs,
    reset,
  }
})

/**
 * 克隆路由,防止路由被修改
 * @param route
 */
function cloneTab(route: TabDefinition): TabDefinition {
  if (!route) {
    return route
  }
  const { matched, meta, ...opt } = route
  return {
    ...opt,
    matched: (matched
      ? matched.map(item => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined) as RouteRecordNormalized[],
    meta: {
      ...meta,
      newTabTitle: meta.newTabTitle,
    },
  }
}

/**
 * 是否是固定标签页
 * @param tab
 */
function isAffixTab(tab: TabDefinition) {
  return tab?.meta?.affixTab ?? false
}

/**
 * 是否显示标签
 * @param tab
 */
function isTabShown(tab: TabDefinition) {
  const matched = tab?.matched ?? []
  const hideInTab = tab?.meta?.hideInTab ?? false
  return !hideInTab && matched.every(item => !(item?.meta?.hideInTab ?? false))
}

/**
 * 从route获取tab页的key
 * @param tab
 */
function getTabKey(tab: RouteLocationNormalized | RouteRecordNormalized) {
  const {
    fullPath,
    path,
    meta: { fullPathKey } = {},
    query = {},
  } = tab as RouteLocationNormalized
  // pageKey可能是数组（查询参数重复时可能出现）
  const pageKey = Array.isArray(query.pageKey)
    ? query.pageKey[0]
    : query.pageKey
  let rawKey
  if (pageKey) {
    rawKey = pageKey
  }
  else {
    rawKey = fullPathKey === false ? path : (fullPath ?? path)
  }
  try {
    return decodeURIComponent(rawKey)
  }
  catch {
    return rawKey
  }
}

/**
 * 从tab获取tab页的key
 * 如果tab没有key,那么就从route获取key
 * @param tab
 */
function getTabKeyFromTab(tab: TabDefinition): string {
  return tab.key ?? getTabKey(tab)
}

/**
 * 比较两个tab是否相等
 * @param a
 * @param b
 */
function equalTab(a: TabDefinition, b: TabDefinition) {
  return getTabKeyFromTab(a) === getTabKeyFromTab(b)
}

function routeToTab(route: RouteRecordNormalized) {
  return {
    meta: route.meta,
    name: route.name,
    path: route.path,
    key: getTabKey(route),
  } as TabDefinition
}

export { getTabKey, useTabsStore }
