/**
 * 布局偏好类型定义
 * 从旧的 @fizz/preferences 中提取与布局直接相关的配置字段
 */

import type { BreadcrumbStyleType, ThemeModeType } from '@fizz-layout/components'

/** 布局类型 */
type LayoutType
  = | 'full-content'
    | 'header-nav'
    | 'sidebar-nav'
    | 'mixed-nav'

/** 顶栏菜单对齐方式 */
type LayoutHeaderMenuAlignType = 'center' | 'end' | 'start'

/** 顶栏显示模式 */
type LayoutHeaderModeType
  = | 'auto'
    | 'auto-scroll'
    | 'fixed'
    | 'static'

/** 内容紧凑模式 */
type ContentCompactType = 'compact' | 'wide'

/** 导航菜单风格 */
type NavigationStyleType = 'plain' | 'rounded'

/** 标签页风格 */
type TabsStyleType = 'chrome'

/** 页面切换动画类型 */
type PageTransitionType
  = | 'fade'
    | 'fade-down'
    | 'fade-slide'
    | 'fade-up'
    | 'none'
    | 'slide-down'
    | 'slide-left'
    | 'slide-right'
    | 'slide-up'

/** 应用偏好（仅布局相关） */
interface AppPreferences {
  /** 是否开启内容紧凑模式 */
  contentCompact: ContentCompactType
  /** 内容紧凑宽度 */
  contentCompactWidth: number
  /** 内容内边距 */
  contentPadding: number
  /** 内容底部内边距 */
  contentPaddingBottom: number
  /** 内容左侧内边距 */
  contentPaddingLeft: number
  /** 内容右侧内边距 */
  contentPaddingRight: number
  /** 内容顶部内边距 */
  contentPaddingTop: number
  /** 是否移动端 */
  isMobile: boolean
  /** 布局方式 */
  layout: LayoutType
  /** 应用名 */
  name: string
  /** z-index */
  zIndex: number
  /** 语言 */
  locale?: string
}

/** 面包屑偏好 */
interface BreadcrumbPreferences {
  /** 面包屑是否启用 */
  enable: boolean
  /** 面包屑是否只有一个时隐藏 */
  hideOnlyOne: boolean
  /** 面包屑首页图标是否可见 */
  showHome: boolean
  /** 面包屑图标是否可见 */
  showIcon: boolean
  /** 面包屑风格 */
  styleType: BreadcrumbStyleType
}

/** 版权偏好 */
interface CopyrightPreferences {
  /** 版权公司名 */
  companyName: string
  /** 版权公司名链接 */
  companySiteLink: string
  /** 版权日期 */
  date: string
  /** 版权是否可见 */
  enable: boolean
  /** 备案号 */
  icp: string
  /** 备案号链接 */
  icpLink: string
}

/** 底栏偏好 */
interface FooterPreferences {
  /** 底栏是否可见 */
  enable: boolean
  /** 底栏是否固定 */
  fixed: boolean
  /** 底栏高度 */
  height: number
}

/** 顶栏偏好 */
interface HeaderPreferences {
  /** 顶栏是否启用 */
  enable: boolean
  /** 顶栏高度 */
  height: number
  /** 顶栏是否隐藏（css 隐藏） */
  hidden: boolean
  /** 顶栏菜单位置 */
  menuAlign: LayoutHeaderMenuAlignType
  /** header 显示模式 */
  mode: LayoutHeaderModeType
}

/** Logo 偏好 */
interface LogoPreferences {
  /** logo 是否可见 */
  enable: boolean
  /** logo 图片适应方式 */
  fit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  /** logo 地址 */
  source: string
  /** 暗色主题 logo 地址（可选） */
  sourceDark?: string
}

/** 导航偏好 */
interface NavigationPreferences {
  /** 导航菜单手风琴模式 */
  accordion: boolean
  /** 导航菜单是否切割，只在 layout=mixed-nav 生效 */
  split: boolean
  /** 导航菜单风格 */
  styleType: NavigationStyleType
}

/** 侧边栏偏好 */
interface SidebarPreferences {
  /** 点击目录时自动激活子菜单 */
  autoActivateChild: boolean
  /** 侧边栏是否折叠 */
  collapsed: boolean
  /** 侧边栏折叠按钮是否可见 */
  collapsedButton: boolean
  /** 侧边栏折叠时，是否显示 title */
  collapsedShowTitle: boolean
  /** 侧边栏折叠宽度 */
  collapseWidth: number
  /** 侧边栏是否可见 */
  enable: boolean
  /** 菜单自动展开状态 */
  expandOnHover: boolean
  /** 侧边栏扩展区域是否折叠 */
  extraCollapse: boolean
  /** 侧边栏扩展区域折叠宽度 */
  extraCollapsedWidth: number
  /** 侧边栏固定按钮是否可见 */
  fixedButton: boolean
  /** 侧边栏是否隐藏（css） */
  hidden: boolean
  /** 混合侧边栏宽度 */
  mixedWidth: number
  /** 侧边栏宽度 */
  width: number
}

/** 标签页偏好 */
interface TabsPreferences {
  /** 是否开启多标签页拖拽 */
  draggable: boolean
  /** 是否开启多标签页 */
  enable: boolean
  /** 标签页高度 */
  height: number
  /** 开启标签页缓存功能 */
  keepAlive: boolean
  /** 限制最大数量 */
  maxCount: number
  /** 是否点击中键时关闭标签 */
  middleClickToClose: boolean
  /** 是否持久化标签 */
  persist: boolean
  /** 是否开启多标签页图标 */
  showIcon: boolean
  /** 显示最大化按钮 */
  showMaximize: boolean
  /** 显示更多按钮 */
  showMore: boolean
  /** 标签页风格 */
  styleType: TabsStyleType
  /** 是否开启鼠标滚轮响应 */
  wheelable: boolean
}

/** 主题偏好 */
interface ThemePreferences {
  /** 当前主题 */
  mode: ThemeModeType
  /** 是否开启半深色 header（只在 theme='light' 时生效） */
  semiDarkHeader: boolean
  /** 是否开启半深色菜单（只在 theme='light' 时生效） */
  semiDarkSidebar: boolean
}

/** 动画偏好 */
interface TransitionPreferences {
  /** 页面切换动画是否启用 */
  enable: boolean
  /** 是否开启页面加载 loading */
  loading: boolean
  /** 页面切换动画 */
  name: PageTransitionType | string
  /** 是否开启页面加载进度动画 */
  progress: boolean
}

/** 小部件偏好 */
interface WidgetPreferences {
  /** 是否启用全屏部件 */
  fullscreen: boolean
  /** 是否启用全局搜索部件 */
  globalSearch: boolean
  /** 是否启用语言切换部件 */
  languageToggle: boolean
  /** 是否显示通知部件 */
  notification: boolean
  /** 显示刷新按钮 */
  refresh: boolean
  /** 是否显示侧边栏显示/隐藏部件 */
  sidebarToggle: boolean
  /** 是否显示主题切换部件 */
  themeToggle: boolean
}

/** 完整布局偏好 */
interface LayoutPreferences {
  /** 应用偏好（仅布局相关） */
  app: AppPreferences
  /** 面包屑偏好 */
  breadcrumb: BreadcrumbPreferences
  /** 版权偏好 */
  copyright: CopyrightPreferences
  /** 底栏偏好 */
  footer: FooterPreferences
  /** 顶栏偏好 */
  header: HeaderPreferences
  /** Logo 偏好 */
  logo: LogoPreferences
  /** 导航偏好 */
  navigation: NavigationPreferences
  /** 侧边栏偏好 */
  sidebar: SidebarPreferences
  /** 标签页偏好 */
  tabs: TabsPreferences
  /** 主题偏好 */
  theme: ThemePreferences
  /** 动画偏好 */
  transition: TransitionPreferences
  /** 小部件偏好 */
  widget: WidgetPreferences
}

/** 深度部分类型 */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type {
  AppPreferences,
  BreadcrumbPreferences,
  ContentCompactType,
  CopyrightPreferences,
  DeepPartial,
  FooterPreferences,
  HeaderPreferences,
  LayoutHeaderMenuAlignType,
  LayoutHeaderModeType,
  LayoutPreferences,
  LayoutType,
  LogoPreferences,
  NavigationPreferences,
  NavigationStyleType,
  PageTransitionType,
  SidebarPreferences,
  TabsPreferences,
  TabsStyleType,
  ThemePreferences,
  TransitionPreferences,
  WidgetPreferences,
}
