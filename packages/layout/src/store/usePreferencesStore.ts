import type { ThemeModeType } from '@fizz-layout/components'
import type { DeepPartial, LayoutPreferences } from '../types'
import { useLocale } from '@fizz-layout/hooks'
import { createGlobalState, useColorMode, usePreferredLanguages, useStorage } from '@vueuse/core'
import { computed, readonly, ref, watch } from 'vue'
import { storageConfig } from './config'
import { DEFAULT_PREFERENCES } from './defaultPreferences'

/**
 * 深度合并对象
 */
function deepMerge<T extends Record<string, any>>(target: T, source: DeepPartial<T>): T {
  const result = { ...target }
  for (const key in source) {
    if (Object.hasOwn(source, key)) {
      const sourceValue = source[key]
      const targetValue = result[key]
      if (
        sourceValue !== undefined
        && sourceValue !== null
        && typeof sourceValue === 'object'
        && !Array.isArray(sourceValue)
        && typeof targetValue === 'object'
        && !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(targetValue, sourceValue as DeepPartial<typeof targetValue>)
      }
      else if (sourceValue !== undefined) {
        result[key] = sourceValue as T[Extract<keyof T, string>]
      }
    }
  }
  return result
}

/**
 * 布局偏好 Store
 * 使用 @vueuse/core 的 createGlobalState + useStorage 实现持久化
 */
const usePreferencesStore = createGlobalState(() => {
  // 持久化存储
  const storedPreferences = useStorage<LayoutPreferences>(
    storageConfig.storageKey,
    DEFAULT_PREFERENCES,
    localStorage,
    { mergeDefaults: true },
  )

  const { locale, availableLocales, setLocale } = useLocale()

  if (!storedPreferences.value.app.locale) {
    const languages = usePreferredLanguages()
    const available = availableLocales.value.find(lang => languages.value.includes(lang)) || 'en-US'
    storedPreferences.value.app.locale = available
  }
  if (storedPreferences.value.app.locale)
    setLocale(storedPreferences.value.app.locale)

  // 内部状态（与存储同步）
  const state = ref<LayoutPreferences>(storedPreferences.value)

  // 监听存储变化，同步到内部状态
  watch(storedPreferences, (newVal) => {
    state.value = newVal
  }, { deep: true })

  // 监听内部状态变化，同步到存储
  watch(state, (newVal) => {
    storedPreferences.value = newVal
  }, { deep: true })

  /**
   * 更新偏好（支持部分更新）
   */
  function updatePreferences(updates: DeepPartial<LayoutPreferences>) {
    state.value = deepMerge(state.value, updates)
  }

  /**
   * 重置为默认偏好
   */
  function resetPreferences() {
    state.value = { ...DEFAULT_PREFERENCES }
  }

  /**
   * 获取偏好的某个模块
   */
  function getPreference<K extends keyof LayoutPreferences>(key: K): LayoutPreferences[K] {
    return state.value[key]
  }

  /**
   * 更新语言
   */
  function updateLocale(newLocale: string) {
    setLocale(newLocale)
    updatePreferences({ app: { locale: newLocale } })
  }

  // ========== 配置模块 ==========
  const app = computed(() => state.value.app)
  const header = computed(() => state.value.header)
  const sidebar = computed(() => state.value.sidebar)
  const breadcrumb = computed(() => state.value.breadcrumb)
  const footer = computed(() => state.value.footer)
  const logo = computed(() => state.value.logo)
  const navigation = computed(() => state.value.navigation)
  const tabs = computed(() => state.value.tabs)
  const transition = computed(() => state.value.transition)
  const widget = computed(() => state.value.widget)
  const copyright = computed(() => state.value.copyright)

  const sidebarCollapsed = computed({
    get: () => state.value.sidebar.collapsed,
    set: (value: boolean) => updatePreferences({ sidebar: { collapsed: value } }),
  })

  const themeMode = computed({
    get: () => state.value.theme.mode,
    set: (value: ThemeModeType) => updatePreferences({ theme: { mode: value } }),
  })

  // ========== 派生计算属性 ==========

  /** 当前布局模式 */
  const layout = computed(() => state.value.app.layout)

  /** 全局色彩模式 */
  const colorMode = useColorMode({ storageRef: themeMode })
  const isDark = computed(() => colorMode.state.value === 'dark')

  /**
   * Header 主题类名
   * - 全局 dark 或全局 light 时 → 无额外类名（跟随系统变量）
   * - 仅在浅色模式下 semiDarkHeader 为 true 时 → 'semi-dark'
   */
  const headerTheme = computed<'' | 'semi-dark'>({
    get: () => {
      if (isDark.value)
        return ''
      return state.value.theme.semiDarkHeader ? 'semi-dark' : ''
    },
    set: value => updatePreferences({ theme: { semiDarkHeader: value === 'semi-dark' } }),
  })

  /**
   * Sidebar 主题类名
   * - 全局 dark 或全局 light 时 → 无额外类名（跟随系统变量）
   * - 仅在浅色模式下 semiDarkSidebar 为 true 时 → 'semi-dark'
   */
  const sidebarTheme = computed<'' | 'semi-dark'>({
    get: () => {
      if (isDark.value)
        return ''
      return state.value.theme.semiDarkSidebar ? 'semi-dark' : ''
    },
    set: value => updatePreferences({ theme: { semiDarkSidebar: value === 'semi-dark' } }),
  })

  /** 布局模式判断（合并为一个对象提高可读性） */
  const layoutMode = computed(() => {
    const current = layout.value
    return {
      isHeaderNav: current === 'header-nav',
      isMixedNav: current === 'mixed-nav',
      isSideNav: current === 'sidebar-nav',
      isFullContent: current === 'full-content',
    }
  })

  return {
    // ===== 状态 =====
    /** 完整偏好配置（只读） */
    preferences: readonly(state),

    // ===== 配置模块（computed，保持响应式） =====
    /** 应用配置 */
    app,
    /** 顶栏配置 */
    header,
    /** 侧边栏配置 */
    sidebar,
    /** 面包屑配置 */
    breadcrumb,
    /** 底栏配置 */
    footer,
    /** Logo 配置 */
    logo,
    /** 导航配置 */
    navigation,
    /** 标签栏配置 */
    tabs,
    /** 主题配置 */
    theme: colorMode.store,
    /** 过渡动画配置 */
    transition,
    /** 小部件配置 */
    widget,
    /** 版权配置 */
    copyright,

    // ===== 派生计算 =====
    /** 当前布局模式 */
    layout,
    /** 是否暗色模式 */
    isDark,
    /** 布局模式判断对象 */
    layoutMode,
    /** 侧边栏折叠状态（可写） */
    sidebarCollapsed,
    /** 当前语言 */
    locale,

    // ===== 主题相关 =====
    /** Header 主题模式：'' | 'semi-dark' */
    headerTheme,
    /** Sidebar 主题模式：'' | 'semi-dark' */
    sidebarTheme,

    // ===== 方法 =====
    updatePreferences,
    resetPreferences,
    getPreference,
    updateLocale,
  }
})

export { deepMerge, usePreferencesStore }
