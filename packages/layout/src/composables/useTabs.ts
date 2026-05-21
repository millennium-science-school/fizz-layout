import type { ComputedRef } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

import { useRoute, useRouter } from 'vue-router'

import { useTabsStore } from '../store/useTabsStore'

function useTabs() {
  const router = useRouter()
  const route = useRoute()
  const tabsStore = useTabsStore()

  async function closeAllTabs() {
    await tabsStore.closeAllTabs(router)
  }

  async function closeOtherTabs(tab?: RouteLocationNormalized) {
    await tabsStore.closeOtherTabs(tab || route)
  }

  async function closeCurrentTab(tab?: RouteLocationNormalized) {
    await tabsStore.closeTab(tab || route, router)
  }

  async function pinTab(tab?: RouteLocationNormalized) {
    await tabsStore.pinTab(tab || route)
  }

  async function unpinTab(tab?: RouteLocationNormalized) {
    await tabsStore.unpinTab(tab || route)
  }

  async function toggleTabPin(tab?: RouteLocationNormalized) {
    await tabsStore.toggleTabPin(tab || route)
  }

  async function refreshTab(name?: string) {
    await tabsStore.refresh(name || router)
  }

  async function openTabInNewWindow(tab?: RouteLocationNormalized) {
    await tabsStore.openTabInNewWindow(tab || route)
  }

  async function closeTabByKey(key: string) {
    await tabsStore.closeTabByKey(key, router)
  }

  /**
   * 设置当前标签页的标题
   *
   * @description 支持设置静态标题字符串或动态计算标题
   * @description 动态标题会在每次渲染时重新计算,适用于多语言或状态相关的标题
   *
   * @param title - 标题内容
   *   - 静态标题: 直接传入字符串
   *   - 动态标题: 传入 ComputedRef
   *
   * @example
   * // 静态标题
   * setTabTitle('标签页')
   *
   * // 动态标题(多语言)
   * setTabTitle(computed(() => t('page.title')))
   */
  async function setTabTitle(title: ComputedRef<string> | string) {
    tabsStore.setUpdateTime()
    await tabsStore.setTabTitle(route, title)
  }

  async function resetTabTitle() {
    tabsStore.setUpdateTime()
    await tabsStore.resetTabTitle(route)
  }

  /**
   * 获取操作是否禁用
   * @param tab
   */
  function getTabDisableState(tab: RouteLocationNormalized = route) {
    const tabs = tabsStore.getTabs
    const affixTabs = tabsStore.affixTabs
    const index = tabs.value.findIndex(item => item.path === tab.path)

    const disabled = tabs.value.length <= 1

    const { meta } = tab
    const affixTab = meta?.affixTab ?? false
    const isCurrentTab = route.path === tab.path

    // 当前处于最左侧或者减去固定标签页的数量等于0
    const disabledCloseLeft
      = index === 0 || index - affixTabs.value.length <= 0 || !isCurrentTab

    const disabledCloseRight = !isCurrentTab || index === tabs.value.length - 1

    const disabledCloseOther
      = disabled || !isCurrentTab || tabs.value.length - affixTabs.value.length <= 1
    return {
      disabledCloseAll: disabled,
      disabledCloseCurrent: !!affixTab || disabled,
      disabledCloseLeft,
      disabledCloseOther,
      disabledCloseRight,
      disabledRefresh: !isCurrentTab,
    }
  }

  return {
    closeAllTabs,
    closeCurrentTab,
    closeOtherTabs,
    closeTabByKey,
    getTabDisableState,
    openTabInNewWindow,
    pinTab,
    refreshTab,
    resetTabTitle,
    setTabTitle,
    toggleTabPin,
    unpinTab,
  }
}

export { useTabs }
