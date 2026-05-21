import type { LayoutPreferences } from '../types'

/**
 * 布局偏好的默认配置。
 * 外部用户可以引用此常量进行 partial override，如：
 * ```ts
 * import { DEFAULT_PREFERENCES } from '@fizz-layout/layout'
 *
 * const myPreferences = {
 *   ...DEFAULT_PREFERENCES,
 *   app: { ...DEFAULT_PREFERENCES.app, name: 'My App' },
 * }
 * ```
 */
export const DEFAULT_PREFERENCES: LayoutPreferences = {
  app: {
    contentCompact: 'wide',
    contentCompactWidth: 1200,
    contentPadding: 0,
    contentPaddingBottom: 0,
    contentPaddingLeft: 0,
    contentPaddingRight: 0,
    contentPaddingTop: 0,
    isMobile: false,
    layout: 'header-nav',
    name: 'Fizz Layout',
    zIndex: 200,
  },
  breadcrumb: {
    enable: true,
    hideOnlyOne: false,
    showHome: false,
    showIcon: true,
    styleType: 'normal',
  },
  copyright: {
    companyName: 'Fizz',
    companySiteLink: '',
    date: '2024',
    enable: true,
    icp: '',
    icpLink: '',
  },
  footer: {
    enable: false,
    fixed: false,
    height: 36,
  },
  header: {
    enable: true,
    height: 50,
    hidden: false,
    menuAlign: 'start',
    mode: 'fixed',
  },
  logo: {
    enable: true,
    fit: 'contain',
    source: './logo.svg',
    sourceDark: './logo.svg',
  },
  navigation: {
    accordion: true,
    split: true,
    styleType: 'rounded',
  },
  sidebar: {
    autoActivateChild: false,
    collapsed: false,
    collapsedButton: true,
    collapsedShowTitle: false,
    collapseWidth: 72,
    enable: true,
    expandOnHover: true,
    extraCollapse: false,
    extraCollapsedWidth: 72,
    fixedButton: true,
    hidden: false,
    mixedWidth: 80,
    width: 224,
  },
  tabs: {
    draggable: true,
    enable: true,
    height: 38,
    keepAlive: true,
    maxCount: 0,
    middleClickToClose: false,
    persist: false,
    showIcon: true,
    showMaximize: true,
    showMore: true,
    styleType: 'chrome',
    wheelable: true,
  },
  theme: {
    mode: 'auto',
    semiDarkHeader: false,
    semiDarkSidebar: false,
  },
  transition: {
    enable: true,
    loading: true,
    name: 'fade-slide',
    progress: true,
  },
  widget: {
    fullscreen: true,
    globalSearch: true,
    languageToggle: true,
    notification: true,
    refresh: true,
    sidebarToggle: true,
    themeToggle: true,
  },
}
