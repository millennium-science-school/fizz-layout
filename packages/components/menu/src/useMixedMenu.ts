import type { ComputedRef, Ref } from 'vue'
import type { AnyPreferencesStore, MenuItem } from './menu'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useNavigation } from './useNavigation'

interface UseMixedMenuOptions {
  /**
   * 菜单数据（外部注入）
   */
  menus?: ComputedRef<MenuItem[]> | Ref<MenuItem[]>
  /**
   * 偏好设置 Store
   */
  preferencesStore?: AnyPreferencesStore
  /**
   * 查找根菜单的方法
   */
  findRootMenuByPath?: (menus: MenuItem[], path: string, level?: number) => {
    findMenu?: MenuItem
    rootMenu?: MenuItem
    rootMenuPath?: string
  }
}

interface UseMixedMenuReturn {
  handleMenuSelect: (key: string, mode?: string) => void
  handleMenuOpen: (key: string, parentsPath: string[]) => void
  headerActive: ComputedRef<string>
  headerMenus: ComputedRef<MenuItem[]>
  sidebarActive: ComputedRef<string>
  sidebarMenus: ComputedRef<MenuItem[]>
  mixHeaderMenus: ComputedRef<MenuItem[]>
  mixExtraMenus: Ref<MenuItem[]>
  sidebarVisible: ComputedRef<boolean>
  needSplit: ComputedRef<boolean>
}

function useMixedMenu(options: UseMixedMenuOptions = {}): UseMixedMenuReturn {
  const { navigation, willOpenedByWindow } = useNavigation()
  const preferencesStore = options.preferencesStore
  const findRootMenuByPath = options.findRootMenuByPath

  const layoutMode = preferencesStore?.layoutMode ?? ref({ isMixedNav: false, isHeaderMixedNav: false })
  const navPrefs = preferencesStore?.navigation ?? ref({ split: false })
  const sidebar = preferencesStore?.sidebar ?? ref({ enable: true, autoActivateChild: false })

  const route = useRoute()
  const splitSideMenus = ref<MenuItem[]>([])
  const rootMenuPath = ref<string>('')
  const mixedRootMenuPath = ref<string>('')
  const mixExtraMenus = ref<MenuItem[]>([])
  /** 记录当前顶级菜单下哪个子菜单最后激活 */
  const defaultSubMap = new Map<string, string>()

  const needSplit = computed(
    () =>
      (navPrefs.value.split && layoutMode.value.isMixedNav)
      || layoutMode.value.isHeaderMixedNav,
  )

  const sidebarVisible = computed(() => {
    const enableSidebar = sidebar.value.enable
    if (needSplit.value) {
      return enableSidebar && splitSideMenus.value.length > 0
    }
    return enableSidebar
  })

  // 使用外部注入的菜单或空数组
  const menus = computed(() => options.menus?.value ?? [])

  /**
   * 头部菜单
   */
  const headerMenus = computed(() => {
    if (!needSplit.value) {
      return menus.value
    }
    return menus.value.map((item) => {
      return {
        ...item,
        children: [],
      }
    })
  })

  /**
   * 侧边菜单
   */
  const sidebarMenus = computed(() => {
    return needSplit.value ? splitSideMenus.value : menus.value
  })

  const mixHeaderMenus = computed(() => {
    return layoutMode.value.isHeaderMixedNav ? sidebarMenus.value : headerMenus.value
  })

  /**
   * 侧边菜单激活路径
   */
  const sidebarActive = computed(() => {
    return (route?.meta?.activePath as string) ?? route.path
  })

  /**
   * 头部菜单激活路径
   */
  const headerActive = computed(() => {
    if (!needSplit.value) {
      return (route.meta?.activePath as string) ?? route.path
    }
    return rootMenuPath.value
  })

  /**
   * 菜单点击事件处理
   * @param key 菜单路径
   * @param mode 菜单模式
   */
  const handleMenuSelect = (key: string, mode?: string) => {
    if (!needSplit.value || mode === 'vertical') {
      navigation(key)
      return
    }
    const rootMenu = menus.value.find(item => item.path === key)
    const _splitSideMenus = rootMenu?.children ?? []

    if (!willOpenedByWindow(key)) {
      rootMenuPath.value = rootMenu?.path ?? ''
      splitSideMenus.value = _splitSideMenus
    }

    if (_splitSideMenus.length === 0) {
      navigation(key)
    }
    else if (rootMenu && sidebar.value.autoActivateChild) {
      const targetPath = rootMenu.path && defaultSubMap.has(rootMenu.path)
        ? (defaultSubMap.get(rootMenu.path) as string)
        : rootMenu.path

      if (targetPath)
        navigation(targetPath)
    }
  }

  /**
   * 侧边菜单展开事件
   * @param key 路由路径
   * @param parentsPath 父级路径
   */
  const handleMenuOpen = (key: string, parentsPath: string[]) => {
    if (parentsPath.length <= 1 && sidebar.value.autoActivateChild) {
      navigation(
        defaultSubMap.has(key) ? (defaultSubMap.get(key) as string) : key,
      )
    }
  }

  /**
   * 计算侧边菜单
   * @param path 路由路径
   */
  function calcSideMenus(path: string = route.path) {
    if (!findRootMenuByPath)
      return

    let { rootMenu } = findRootMenuByPath(menus.value, path)
    if (!rootMenu) {
      rootMenu = menus.value.find(item => item.path === path)
    }
    const result = findRootMenuByPath(rootMenu?.children || [], path, 1)
    mixedRootMenuPath.value = result.rootMenuPath ?? ''
    mixExtraMenus.value = result.rootMenu?.children ?? []
    rootMenuPath.value = rootMenu?.path ?? ''
    splitSideMenus.value = rootMenu?.children ?? []
  }

  watch(
    () => route.path,
    (path) => {
      const currentPath = (route?.meta?.activePath as string) ?? (route?.meta?.link as string) ?? path
      if (willOpenedByWindow(currentPath)) {
        return
      }
      calcSideMenus(currentPath)
      if (rootMenuPath.value)
        defaultSubMap.set(rootMenuPath.value, currentPath)
    },
    { immediate: true },
  )

  // 初始化计算侧边菜单
  onBeforeMount(() => {
    calcSideMenus((route.meta?.activePath as string) || route.path)
  })

  return {
    handleMenuSelect,
    handleMenuOpen,
    headerActive,
    headerMenus,
    sidebarActive,
    sidebarMenus,
    mixHeaderMenus,
    mixExtraMenus,
    sidebarVisible,
    needSplit,
  }
}

export { useMixedMenu }
export type { UseMixedMenuOptions }
