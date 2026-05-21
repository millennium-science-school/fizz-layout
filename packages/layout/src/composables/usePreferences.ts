import type { DeepPartial, LayoutPreferences } from '../types'
import { readonly } from 'vue'
import { usePreferencesStore } from '../store/usePreferencesStore'

/**
 * 用户偏好设置 Composable
 *
 * 提供安全的偏好设置访问和修改接口，保护内部状态不被直接操作
 */
function usePreferences() {
  const store = usePreferencesStore()

  // ========== 方法 ==========

  /**
   * 更新偏好设置
   * @param updates 要更新的偏好设置（支持部分更新）
   */
  function updatePreferences(updates: DeepPartial<LayoutPreferences>) {
    store.updatePreferences(updates)
  }

  /**
   * 重置为默认偏好
   */
  function resetPreferences() {
    store.resetPreferences()
  }

  /**
   * 获取偏好的某个模块
   */
  function getPreference<K extends keyof LayoutPreferences>(key: K): LayoutPreferences[K] {
    return store.getPreference(key)
  }

  /**
   * 更新语言
   */
  function updateLocale(newLocale: string) {
    store.updateLocale(newLocale)
  }

  /**
   * 切换侧边栏折叠状态
   */
  function toggleSidebarCollapse() {
    store.sidebarCollapsed.value = !store.sidebarCollapsed.value
  }

  /**
   * 设置侧边栏折叠状态
   */
  function setSidebarCollapsed(collapsed: boolean) {
    store.sidebarCollapsed.value = collapsed
  }

  return {
    // ===== 只读状态 =====
    /** 完整偏好配置（只读） */
    preferences: readonly(store.preferences),

    // ===== 配置模块（直接使用 store 的 computed） =====
    /** 应用配置 */
    app: store.app,
    /** 顶栏配置 */
    header: store.header,
    /** 侧边栏配置 */
    sidebar: store.sidebar,
    /** 面包屑配置 */
    breadcrumb: store.breadcrumb,
    /** 底栏配置 */
    footer: store.footer,
    /** Logo 配置 */
    logo: store.logo,
    /** 导航配置 */
    navigation: store.navigation,
    /** 标签栏配置 */
    tabs: store.tabs,
    /** 主题配置 */
    theme: store.theme,
    /** 过渡动画配置 */
    transition: store.transition,
    /** 小部件配置 */
    widget: store.widget,
    /** 版权配置 */
    copyright: store.copyright,

    // ===== 派生计算（直接使用 store 的 computed） =====
    /** 当前布局模式 */
    layout: store.layout,
    /** 是否暗色模式 */
    isDark: store.isDark,
    /** 布局模式判断对象 */
    layoutMode: store.layoutMode,
    /** 侧边栏折叠状态（可写） */
    sidebarCollapsed: store.sidebarCollapsed,
    /** 当前语言 */
    locale: store.locale,

    // ===== 方法 =====
    updatePreferences,
    resetPreferences,
    getPreference,
    updateLocale,
    toggleSidebarCollapse,
    setSidebarCollapsed,
  }
}

export { usePreferences }
export type UsePreferencesReturn = ReturnType<typeof usePreferences>
