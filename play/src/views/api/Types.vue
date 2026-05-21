<script setup lang="ts">
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

// ========== 类型别名 ==========
const typeAliasesCode = `// 布局类型
type LayoutType = 'full-content' | 'header-nav' | 'mixed-nav' | 'side-nav'

// 主题模式
type ThemeModeType = 'auto' | 'dark' | 'light'

// 内容紧凑类型
type ContentCompactType = 'compact' | 'wide'

// 导航样式
type NavigationStyleType = 'plain' | 'rounded'

// 标签栏样式
type TabsStyleType = 'brisk' | 'card' | 'chrome' | 'plain'

// 过渡动画名称
type TransitionNameType = 'fade' | 'fade-down' | 'fade-slide' | 'fade-up' | 'none' | 'slide-down'

// 深度可选类型
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}`

// ========== LayoutPreferences 主接口 ==========
const layoutPrefsTypeCode = `interface LayoutPreferences {
  app: AppPreferences
  breadcrumb: BreadcrumbPreferences
  copyright: CopyrightPreferences
  footer: FooterPreferences
  header: HeaderPreferences
  logo: LogoPreferences
  navigation: NavigationPreferences
  sidebar: SidebarPreferences
  tabs: TabsPreferences
  theme: ThemePreferences
  transition: TransitionPreferences
  widget: WidgetPreferences
}`

// ========== 12 个子接口 ==========
const appPrefsCode = `interface AppPreferences {
  /** 内容紧凑模式 */
  contentCompact: ContentCompactType  // 'wide'
  /** 布局模式 */
  layout: LayoutType                  // 'side-nav'
  /** 应用名称 */
  name: string                        // 'Fizz Layout'
}`

const headerPrefsCode = `interface HeaderPreferences {
  /** 是否启用顶栏 */
  enable: boolean       // true
  /** 顶栏高度（px） */
  height: number        // 48
  /** 是否显示顶栏 */
  hidden: boolean       // false
  /** 顶栏模式：static 跟随滚动 / fixed 固定 */
  mode: 'fixed' | 'static'  // 'fixed'
}`

const sidebarPrefsCode = `interface SidebarPreferences {
  /** 是否折叠侧边栏 */
  collapsed: boolean          // false
  /** 折叠时是否显示标题 */
  collapsedShowTitle: boolean // false
  /** 折叠时的宽度（px） */
  collapseWidth: number       // 48
  /** 是否启用侧边栏 */
  enable: boolean             // true
  /** 额外折叠区域宽度 */
  extraCollapse: boolean      // true
  /** 是否隐藏侧边栏 */
  hidden: boolean             // false
  /** 侧边栏展开宽度（px） */
  width: number               // 210
}`

const breadcrumbPrefsCode = `interface BreadcrumbPreferences {
  /** 是否启用面包屑 */
  enable: boolean       // true
  /** 是否隐藏第一项 */
  hideOnlyOne: boolean  // false
  /** 是否显示图标 */
  showIcon: boolean     // true
  /** 是否显示首页面包屑 */
  showHome: boolean     // true
  /** 面包屑样式类型 */
  styleType: 'background' | 'normal'  // 'normal'
}`

const footerPrefsCode = `interface FooterPreferences {
  /** 是否启用底栏 */
  enable: boolean    // true
  /** 是否固定在底部 */
  fixed: boolean     // true
}`

const logoPrefsCode = `interface LogoPreferences {
  /** 是否启用 Logo */
  enable: boolean  // true
  /** Logo 图片地址 */
  source: string   // 'fizz-layout 默认 logo'
}`

const navigationPrefsCode = `interface NavigationPreferences {
  /** 手风琴模式（同级只展开一个） */
  accordion: boolean            // true
  /** 导航样式类型 */
  styleType: NavigationStyleType  // 'rounded'
}`

const tabsPrefsCode = `interface TabsPreferences {
  /** 是否启用标签栏 */
  enable: boolean        // true
  /** 是否启用拖拽排序 */
  draggable: boolean     // true
  /** 是否启用右键菜单 */
  contextMenu: boolean   // true
  /** 是否启用 KeepAlive */
  keepAlive: boolean     // true
  /** 是否显示图标 */
  showIcon: boolean      // true
  /** 标签栏风格 */
  styleType: TabsStyleType  // 'chrome'
  /** 最大缓存数量 */
  cacheLimit: number     // 20
}`

const themePrefsCode = `interface ThemePreferences {
  /** 内置主题名称 */
  builtinType: string    // 'default'
  /** 色彩模式 */
  mode: ThemeModeType    // 'auto'
  /** 主题色 */
  colorPrimary: string   // '#1677ff'
  /** 是否使用圆角 */
  radius: string         // '0.5rem'
}`

const transitionPrefsCode = `interface TransitionPreferences {
  /** 是否启用页面过渡 */
  enable: boolean               // true
  /** 是否启用加载进度条 */
  loading: boolean              // true
  /** 过渡动画名称 */
  name: TransitionNameType      // 'fade-slide'
}`

const widgetPrefsCode = `interface WidgetPreferences {
  /** 是否显示全屏切换按钮 */
  fullscreen: boolean           // true
  /** 是否显示全局搜索按钮 */
  globalSearch: boolean         // true
  /** 是否显示语言切换按钮 */
  languageToggle: boolean       // true
  /** 是否显示通知按钮 */
  notification: boolean         // true
  /** 是否显示主题切换按钮 */
  themeToggle: boolean          // true
}`

const copyrightPrefsCode = `interface CopyrightPreferences {
  /** 是否启用版权信息 */
  enable: boolean     // true
  /** 版权开始年份 */
  date: string        // '2024'
  /** 公司/组织名称 */
  companyName: string // 'Fizz'
  /** 公司网站链接 */
  companySiteLink: string // ''
}`

// ========== 标签页类型 ==========
const tabTypesCode = `interface TabDefinition {
  /** 页面组件名称 */
  name: string
  /** 显示标题 */
  title: string
  /** 路由路径 */
  path: string
  /** 图标 */
  icon?: string
  /** 完整 URL（含 query） */
  fullPath: string
  /** 是否固定 */
  affix?: boolean
  /** 自定义标题（覆盖 title） */
  customTitle?: string | ComputedRef<string>
  /** 元信息 */
  meta?: RouteMeta
}

interface TabConfig {
  /** 标签页列表 */
  tabs: TabDefinition[]
  /** 缓存的路由名称列表 */
  cacheTabNames: Set<string>
  /** 是否正在刷新 */
  refreshing: boolean
  /** 更新时间戳（用于触发渲染） */
  updateTime: number
}

interface ContextMenuItem {
  /** 是否禁用 */
  disabled: boolean
  /** 菜单项图标 */
  icon: Component
  /** 唯一标识 */
  key: string
  /** 显示文本 */
  label: string
  /** 是否显示分割线 */
  separator?: boolean
}

type IContextMenuItem = 'close-all' | 'close-current' | 'close-left'
  | 'close-other' | 'close-right' | 'open-in-new-window'
  | 'pin' | 'refresh' | 'unpin'`

// ========== RouteMeta ==========
const routeMetaCode = `// 通过 TypeScript 声明合并扩展 vue-router 的 RouteMeta
declare module 'vue-router' {
  interface RouteMeta {
    /** 是否固定到标签栏 */
    affixTab?: boolean
    /** 固定标签排序权重 */
    affixTabOrder?: number
    /** 徽标文本 */
    badge?: string
    /** 徽标颜色类型 */
    badgeType?: 'dot' | 'normal'
    /** 徽标颜色变体 */
    badgeVariants?: 'danger' | 'default' | 'destructive' | 'primary' | 'success' | 'warning'
    /** 菜单项 CSS 类名 */
    activePath?: string
    /** 菜单图标 */
    icon?: string
    /** 是否使用 KeepAlive 缓存 */
    keepAlive?: boolean
    /** 最大缓存数 */
    maxNumOfOpenTab?: number
    /** 是否在菜单中隐藏 */
    hideInMenu?: boolean
    /** 是否在标签栏中隐藏 */
    hideInTab?: boolean
    /** 是否在面包屑中隐藏 */
    hideInBreadcrumb?: boolean
    /** 是否隐藏子菜单 */
    hideChildrenInMenu?: boolean
    /** 菜单排序权重 */
    order?: number
    /** 菜单标题（支持 i18n key） */
    title?: string
  }
}`
</script>

<template>
  <DocSection title="类型定义" description="LayoutPreferences / TabDefinition / RouteMeta 等核心 TypeScript 类型速查">
    <!-- 类型别名 -->
    <div>
      <h2>类型别名</h2>
      <p>Fizz Layout 导出的基础类型别名，用于约束配置选项的取值范围。</p>
    </div>
    <DocCodeBlock :code="typeAliasesCode" language="typescript" />

    <!-- LayoutPreferences -->
    <div>
      <h2>LayoutPreferences</h2>
      <p>
        布局偏好的顶层接口，包含 12 个配置模块。每个模块对应一个子接口。
        使用 <code>DeepPartial&lt;LayoutPreferences&gt;</code> 进行部分更新。
      </p>
    </div>
    <DocCodeBlock :code="layoutPrefsTypeCode" language="typescript" />

    <!-- 12 个子接口 -->
    <div>
      <h2>配置模块接口</h2>
      <p>以下是 12 个配置模块的详细类型定义，每个属性的注释中标注了默认值。</p>
    </div>

    <div>
      <h3>AppPreferences</h3>
      <DocCodeBlock :code="appPrefsCode" language="typescript" />
    </div>

    <div>
      <h3>HeaderPreferences</h3>
      <DocCodeBlock :code="headerPrefsCode" language="typescript" />
    </div>

    <div>
      <h3>SidebarPreferences</h3>
      <DocCodeBlock :code="sidebarPrefsCode" language="typescript" />
    </div>

    <div>
      <h3>BreadcrumbPreferences</h3>
      <DocCodeBlock :code="breadcrumbPrefsCode" language="typescript" />
    </div>

    <div>
      <h3>FooterPreferences</h3>
      <DocCodeBlock :code="footerPrefsCode" language="typescript" />
    </div>

    <div>
      <h3>LogoPreferences</h3>
      <DocCodeBlock :code="logoPrefsCode" language="typescript" />
    </div>

    <div>
      <h3>NavigationPreferences</h3>
      <DocCodeBlock :code="navigationPrefsCode" language="typescript" />
    </div>

    <div>
      <h3>TabsPreferences</h3>
      <DocCodeBlock :code="tabsPrefsCode" language="typescript" />
    </div>

    <div>
      <h3>ThemePreferences</h3>
      <DocCodeBlock :code="themePrefsCode" language="typescript" />
    </div>

    <div>
      <h3>TransitionPreferences</h3>
      <DocCodeBlock :code="transitionPrefsCode" language="typescript" />
    </div>

    <div>
      <h3>WidgetPreferences</h3>
      <DocCodeBlock :code="widgetPrefsCode" language="typescript" />
    </div>

    <div>
      <h3>CopyrightPreferences</h3>
      <DocCodeBlock :code="copyrightPrefsCode" language="typescript" />
    </div>

    <!-- 标签页类型 -->
    <div>
      <h2>标签页类型</h2>
      <p>标签页系统相关的类型定义。</p>
    </div>
    <DocCodeBlock :code="tabTypesCode" language="typescript" />

    <!-- RouteMeta -->
    <div>
      <h2>RouteMeta</h2>
      <p>
        通过 TypeScript 声明合并扩展 <code>vue-router</code> 的 <code>RouteMeta</code> 接口，
        增加布局和菜单相关的元信息字段。
      </p>
    </div>
    <DocCodeBlock :code="routeMetaCode" language="typescript" />

    <DocTip type="tip" title="类型导入">
      所有类型均可从 <code>@fizz/layout</code> 或各子包中导入：
      <code>import type { LayoutPreferences, TabDefinition } from '@fizz/layout'</code>
    </DocTip>
  </DocSection>
</template>
