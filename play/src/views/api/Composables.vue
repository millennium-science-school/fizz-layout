<script setup lang="ts">
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocEventsTable from '../../components/DocEventsTable.vue'
import DocPropsTable from '../../components/DocPropsTable.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

// ========== usePreferences ==========
const usePreferencesCode = `import { usePreferences } from '@fizz/layout'

const {
  // ===== 只读状态 =====
  preferences,        // 完整偏好配置（Readonly<LayoutPreferences>）

  // ===== 配置模块（ComputedRef） =====
  app,                // 应用配置
  header,             // 顶栏配置
  sidebar,            // 侧边栏配置
  breadcrumb,         // 面包屑配置
  footer,             // 底栏配置
  logo,               // Logo 配置
  navigation,         // 导航配置
  tabs,               // 标签栏配置
  theme,              // 主题配置
  transition,         // 过渡动画配置
  widget,             // 小部件配置
  copyright,          // 版权配置

  // ===== 派生计算属性 =====
  layout,             // 当前布局模式（ComputedRef<LayoutType>）
  isDark,             // 是否暗色模式（ComputedRef<boolean>）
  layoutMode,         // 布局模式判断对象
  sidebarCollapsed,   // 侧边栏折叠状态（可写 WritableComputedRef）
  locale,             // 当前语言

  // ===== 方法 =====
  updatePreferences,  // 部分更新偏好
  resetPreferences,   // 重置为默认值
  getPreference,      // 获取某个模块的偏好
  updateLocale,       // 更新语言
  toggleSidebarCollapse, // 切换侧边栏折叠
  setSidebarCollapsed,   // 设置侧边栏折叠
} = usePreferences()`

const updatePrefsCode = `// 部分更新 — 仅传入需要修改的字段
updatePreferences({
  app: { layout: 'header-nav' },
  sidebar: { collapsed: true, width: 200 },
  theme: { mode: 'dark' },
})

// 重置为默认值
resetPreferences()

// 获取某个模块
const tabsConfig = getPreference('tabs')
console.log(tabsConfig.keepAlive) // true`

const layoutModeCode = `// layoutMode 提供便捷的布局判断
const { layoutMode } = usePreferences()

// layoutMode.value 结构：
// {
//   isHeaderNav: boolean,
//   isMixedNav: boolean,
//   isSideNav: boolean,
//   isFullContent: boolean,
// }

if (layoutMode.value.isSideNav) {
  // 侧边栏导航模式下的特殊逻辑
}`

const prefsReturnProps = [
  { name: 'preferences', type: 'Readonly<Ref<LayoutPreferences>>', description: '完整偏好配置（只读）' },
  { name: 'app', type: 'ComputedRef<AppPreferences>', description: '应用配置模块' },
  { name: 'header', type: 'ComputedRef<HeaderPreferences>', description: '顶栏配置模块' },
  { name: 'sidebar', type: 'ComputedRef<SidebarPreferences>', description: '侧边栏配置模块' },
  { name: 'breadcrumb', type: 'ComputedRef<BreadcrumbPreferences>', description: '面包屑配置模块' },
  { name: 'footer', type: 'ComputedRef<FooterPreferences>', description: '底栏配置模块' },
  { name: 'logo', type: 'ComputedRef<LogoPreferences>', description: 'Logo 配置模块' },
  { name: 'navigation', type: 'ComputedRef<NavigationPreferences>', description: '导航配置模块' },
  { name: 'tabs', type: 'ComputedRef<TabsPreferences>', description: '标签栏配置模块' },
  { name: 'theme', type: 'ComputedRef<ThemePreferences>', description: '主题配置模块' },
  { name: 'transition', type: 'ComputedRef<TransitionPreferences>', description: '过渡动画配置模块' },
  { name: 'widget', type: 'ComputedRef<WidgetPreferences>', description: '小部件配置模块' },
  { name: 'copyright', type: 'ComputedRef<CopyrightPreferences>', description: '版权配置模块' },
  { name: 'layout', type: 'ComputedRef<LayoutType>', description: '当前布局模式' },
  { name: 'isDark', type: 'ComputedRef<boolean>', description: '是否暗色模式' },
  { name: 'layoutMode', type: 'ComputedRef<{ isHeaderNav, isMixedNav, isSideNav, isFullContent }>', description: '布局模式判断对象' },
  { name: 'sidebarCollapsed', type: 'WritableComputedRef<boolean>', description: '侧边栏折叠状态（可读写）' },
  { name: 'locale', type: 'Ref<Language>', description: '当前语言包' },
]

const prefsMethods = [
  { name: 'updatePreferences', params: '(updates: DeepPartial<LayoutPreferences>)', description: '部分更新偏好设置，支持深度合并' },
  { name: 'resetPreferences', params: '()', description: '重置所有偏好为 DEFAULT_PREFERENCES' },
  { name: 'getPreference', params: '(key: keyof LayoutPreferences)', description: '获取某个偏好模块的完整值' },
  { name: 'updateLocale', params: '(locale: string)', description: '更新当前语言，同步更新 vue-i18n 和偏好存储' },
  { name: 'toggleSidebarCollapse', params: '()', description: '切换侧边栏折叠/展开状态' },
  { name: 'setSidebarCollapsed', params: '(collapsed: boolean)', description: '设置侧边栏折叠状态' },
]

// ========== useTabs ==========
const useTabsCode = `import { useTabs } from '@fizz/layout'

const {
  closeAllTabs,       // 关闭所有非固定标签
  closeCurrentTab,    // 关闭当前标签
  closeOtherTabs,     // 关闭其他标签
  closeTabByKey,      // 按 key 关闭标签
  pinTab,             // 固定标签
  unpinTab,           // 取消固定
  toggleTabPin,       // 切换固定状态
  refreshTab,         // 刷新标签
  openTabInNewWindow, // 新窗口打开
  setTabTitle,        // 设置动态标题
  resetTabTitle,      // 重置标题
  getTabDisableState, // 获取操作禁用状态
} = useTabs()`

const tabsTitleCode = `import { computed } from 'vue'
import { useTabs } from '@fizz/layout'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { setTabTitle, resetTabTitle } = useTabs()

// 静态标题
setTabTitle('自定义标题')

// 动态标题（响应语言切换）
setTabTitle(computed(() => t('page.detail.title')))

// 重置为路由 meta.title
resetTabTitle()`

const tabDisableCode = `const { getTabDisableState } = useTabs()

// 获取当前标签的操作禁用状态
const state = getTabDisableState()
// {
//   disabledCloseAll: boolean,     // 是否禁用"关闭全部"
//   disabledCloseCurrent: boolean, // 是否禁用"关闭当前"
//   disabledCloseLeft: boolean,    // 是否禁用"关闭左侧"
//   disabledCloseOther: boolean,   // 是否禁用"关闭其他"
//   disabledCloseRight: boolean,   // 是否禁用"关闭右侧"
//   disabledRefresh: boolean,      // 是否禁用"刷新"
// }`

const tabsMethods = [
  { name: 'closeAllTabs', params: '()', description: '关闭所有非固定标签页，导航到第一个标签' },
  { name: 'closeCurrentTab', params: '(tab?: RouteLocationNormalized)', description: '关闭当前（或指定）标签页，自动导航到相邻标签' },
  { name: 'closeOtherTabs', params: '(tab?: RouteLocationNormalized)', description: '关闭除指定标签和固定标签外的所有标签' },
  { name: 'closeTabByKey', params: '(key: string)', description: '通过标签 key（URL 路径）关闭标签页' },
  { name: 'pinTab', params: '(tab?: RouteLocationNormalized)', description: '固定标签页，移动到固定区域' },
  { name: 'unpinTab', params: '(tab?: RouteLocationNormalized)', description: '取消固定标签页，移回普通区域' },
  { name: 'toggleTabPin', params: '(tab?: RouteLocationNormalized)', description: '切换标签页的固定/取消固定状态' },
  { name: 'refreshTab', params: '(name?: string)', description: '刷新标签页缓存（通过临时移除 KeepAlive）' },
  { name: 'openTabInNewWindow', params: '(tab?: RouteLocationNormalized)', description: '在新浏览器窗口中打开标签页' },
  { name: 'setTabTitle', params: '(title: string | ComputedRef<string>)', description: '设置当前标签页的自定义标题，支持响应式' },
  { name: 'resetTabTitle', params: '()', description: '重置当前标签页标题为路由 meta.title' },
  { name: 'getTabDisableState', params: '(tab?: RouteLocationNormalized)', description: '获取标签页各操作的禁用状态' },
]

// ========== useRefresh ==========
const useRefreshCode = `import { useRefresh } from '@fizz/layout'

const { refresh } = useRefresh()

// 刷新当前页面内容（重新触发 KeepAlive 缓存）
await refresh()`
</script>

<template>
  <DocSection title="Composables" description="usePreferences / useTabs / useRefresh — 核心 Composables API 参考">
    <!-- usePreferences -->
    <div>
      <h2>usePreferences</h2>
      <p>
        布局偏好系统的核心 Composable，提供安全的偏好读取和修改接口。
        内部通过 <code>usePreferencesStore</code> 管理状态，使用 <code>localStorage</code> 持久化。
      </p>
    </div>

    <div>
      <h3>完整返回值</h3>
      <DocCodeBlock :code="usePreferencesCode" language="typescript" />
    </div>

    <div>
      <h3>更新偏好</h3>
      <DocCodeBlock :code="updatePrefsCode" language="typescript" />
    </div>

    <div>
      <h3>布局模式判断</h3>
      <DocCodeBlock :code="layoutModeCode" language="typescript" />
    </div>

    <DocPropsTable title="返回值 — 状态" :data="prefsReturnProps" />
    <DocEventsTable title="返回值 — 方法" :data="prefsMethods" />

    <DocTip type="tip" title="响应式">
      所有配置模块返回的都是 <code>ComputedRef</code>，模板中直接使用 <code>.value</code> 或解构即可。
      <code>sidebarCollapsed</code> 是唯一可写的 <code>WritableComputedRef</code>。
    </DocTip>

    <!-- useTabs -->
    <div>
      <h2>useTabs</h2>
      <p>
        标签页管理 Composable，提供关闭、固定、刷新、重命名等 12 个操作方法。
        所有方法都是异步的，内部操作 <code>useTabsStore</code>。
      </p>
    </div>

    <div>
      <h3>基础用法</h3>
      <DocCodeBlock :code="useTabsCode" language="typescript" />
    </div>

    <div>
      <h3>动态标题</h3>
      <DocCodeBlock :code="tabsTitleCode" language="typescript" />
    </div>

    <div>
      <h3>操作禁用状态</h3>
      <DocCodeBlock :code="tabDisableCode" language="typescript" />
    </div>

    <DocEventsTable title="useTabs 方法" :data="tabsMethods" />

    <DocTip type="tip">
      当 <code>tab</code> 参数省略时，默认操作当前路由对应的标签页。
    </DocTip>

    <!-- useRefresh -->
    <div>
      <h2>useRefresh</h2>
      <p>
        页面刷新 Composable，通过临时移除 KeepAlive 缓存实现页面重新加载。
        等效于 <code>useTabs().refreshTab()</code> 的简化版。
      </p>
    </div>

    <DocCodeBlock :code="useRefreshCode" language="typescript" />
  </DocSection>
</template>
