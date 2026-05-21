<script setup lang="ts">
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocEventsTable from '../../components/DocEventsTable.vue'
import DocPropsTable from '../../components/DocPropsTable.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

// ========== DEFAULT_PREFERENCES ==========
const defaultPrefsCode = `const DEFAULT_PREFERENCES: LayoutPreferences = {
  app: {
    contentCompact: 'wide',
    layout: 'side-nav',
    name: 'Fizz Layout',
  },
  breadcrumb: {
    enable: true,
    hideOnlyOne: false,
    showHome: true,
    showIcon: true,
    styleType: 'normal',
  },
  copyright: {
    companyName: 'Fizz',
    companySiteLink: '',
    date: '2024',
    enable: true,
  },
  footer: {
    enable: true,
    fixed: true,
  },
  header: {
    enable: true,
    height: 48,
    hidden: false,
    mode: 'fixed',
  },
  logo: {
    enable: true,
    source: '', // 使用内置默认
  },
  navigation: {
    accordion: true,
    styleType: 'rounded',
  },
  sidebar: {
    collapsed: false,
    collapsedShowTitle: false,
    collapseWidth: 48,
    enable: true,
    extraCollapse: true,
    hidden: false,
    width: 210,
  },
  tabs: {
    cacheLimit: 20,
    contextMenu: true,
    draggable: true,
    enable: true,
    keepAlive: true,
    showIcon: true,
    styleType: 'chrome',
  },
  theme: {
    builtinType: 'default',
    colorPrimary: '#1677ff',
    mode: 'auto',
    radius: '0.5rem',
  },
  transition: {
    enable: true,
    loading: true,
    name: 'fade-slide',
  },
  widget: {
    fullscreen: true,
    globalSearch: true,
    languageToggle: true,
    notification: true,
    themeToggle: true,
  },
}`

// ========== usePreferencesStore ==========
const prefsStoreCode = `import { usePreferencesStore } from '@fizz/layout'

// ⚠️ 内部 API — 推荐使用 usePreferences() 替代
const store = usePreferencesStore()

// 返回值
store.preferences          // Ref<LayoutPreferences> — 完整偏好（响应式）
store.app                  // ComputedRef<AppPreferences>
store.header               // ComputedRef<HeaderPreferences>
store.sidebar              // ComputedRef<SidebarPreferences>
store.breadcrumb           // ComputedRef<BreadcrumbPreferences>
store.footer               // ComputedRef<FooterPreferences>
store.logo                 // ComputedRef<LogoPreferences>
store.navigation           // ComputedRef<NavigationPreferences>
store.tabs                 // ComputedRef<TabsPreferences>
store.theme                // ComputedRef<ThemePreferences>
store.transition           // ComputedRef<TransitionPreferences>
store.widget               // ComputedRef<WidgetPreferences>
store.copyright            // ComputedRef<CopyrightPreferences>

// 方法
store.updatePreferences(updates)   // 深度合并更新
store.resetPreferences()           // 重置为 DEFAULT_PREFERENCES
store.getPreference('app')         // 获取某个模块的当前值`

const prefsStorePersistCode = `// 持久化机制
// usePreferencesStore 使用 @vueuse/core 的 useStorage：
// - 存储 key: 'fizz-layout-preferences'
// - 存储方式: localStorage
// - 自动序列化/反序列化
// - 页面刷新后自动恢复

// 等价于：
const preferences = useStorage(
  'fizz-layout-preferences',
  DEFAULT_PREFERENCES,
  localStorage,
)`

const prefsStoreReturnProps = [
  { name: 'preferences', type: 'Ref<LayoutPreferences>', description: '完整偏好对象（可读写，自动持久化）' },
  { name: 'app / header / sidebar / ...', type: 'ComputedRef<XxxPreferences>', description: '各配置模块的计算属性（只读）' },
  { name: 'updatePreferences', type: '(updates: DeepPartial<LayoutPreferences>) => void', description: '深度合并更新偏好' },
  { name: 'resetPreferences', type: '() => void', description: '重置为 DEFAULT_PREFERENCES' },
  { name: 'getPreference', type: '(key: keyof LayoutPreferences) => any', description: '获取某个模块的当前值' },
]

// ========== useTabsStore ==========
const tabsStoreCode = `import { useTabsStore } from '@fizz/layout'

// ⚠️ 内部 API — 推荐使用 useTabs() 替代
const tabsStore = useTabsStore()

// 状态
tabsStore.tabs              // Ref<TabDefinition[]> — 标签列表
tabsStore.cacheTabNames     // Ref<Set<string>> — 缓存的路由名称
tabsStore.refreshing        // Ref<boolean> — 是否正在刷新
tabsStore.updateTime        // Ref<number> — 更新时间戳`

const tabsStoreMethodsCode = `// 标签页管理方法
tabsStore.addTab(route)         // 添加标签页
tabsStore.closeTab(path)        // 关闭指定路径的标签
tabsStore.closeAllTabs(router)  // 关闭所有非固定标签
tabsStore.closeOtherTabs(path)  // 关闭其他标签
tabsStore.closeLeftTabs(path)   // 关闭左侧标签
tabsStore.closeRightTabs(path)  // 关闭右侧标签

// 固定与排序
tabsStore.pinTab(tab)           // 固定标签
tabsStore.unpinTab(tab)         // 取消固定
tabsStore.sortTabs(from, to)    // 拖拽排序

// 缓存管理
tabsStore.addCacheName(name)    // 添加 KeepAlive 缓存
tabsStore.removeCacheName(name) // 移除缓存
tabsStore.clearCache()          // 清空所有缓存

// 刷新
tabsStore.refresh(name)         // 刷新指定标签（临时移除缓存）

// 标题
tabsStore.setTabTitle(path, title)   // 设置自定义标题
tabsStore.resetTabTitle(path)        // 重置标题`

const tabsStoreMethods = [
  { name: 'addTab', params: '(route: RouteLocationNormalized)', description: '将当前路由添加为标签页，自动处理去重和缓存' },
  { name: 'closeTab', params: '(path: string, router: Router)', description: '关闭指定路径的标签，自动导航到相邻标签' },
  { name: 'closeAllTabs', params: '(router: Router)', description: '关闭所有非固定标签页' },
  { name: 'closeOtherTabs', params: '(path: string)', description: '关闭除指定路径外的所有非固定标签' },
  { name: 'closeLeftTabs', params: '(path: string)', description: '关闭指定标签左侧的所有非固定标签' },
  { name: 'closeRightTabs', params: '(path: string)', description: '关闭指定标签右侧的所有非固定标签' },
  { name: 'pinTab', params: '(tab: TabDefinition)', description: '固定标签页，移动到固定区域前端' },
  { name: 'unpinTab', params: '(tab: TabDefinition)', description: '取消固定标签页' },
  { name: 'sortTabs', params: '(fromIndex: number, toIndex: number)', description: '拖拽排序标签页' },
  { name: 'addCacheName', params: '(name: string)', description: '将组件名称添加到 KeepAlive 缓存列表' },
  { name: 'removeCacheName', params: '(name: string)', description: '从 KeepAlive 缓存列表移除' },
  { name: 'clearCache', params: '()', description: '清空所有 KeepAlive 缓存' },
  { name: 'refresh', params: '(name?: string)', description: '刷新标签页（临时移除缓存后恢复）' },
  { name: 'setTabTitle', params: '(path: string, title: string | ComputedRef<string>)', description: '设置指定标签的自定义标题' },
  { name: 'resetTabTitle', params: '(path: string)', description: '重置指定标签标题为路由 meta.title' },
]
</script>

<template>
  <DocSection title="Store" description="usePreferencesStore / useTabsStore / DEFAULT_PREFERENCES — 内部 Store API 参考">
    <DocTip type="warning" title="内部 API">
      Store 属于内部实现层，直接操作可能在未来版本中发生变化。建议通过 Composables 层（<code>usePreferences</code> / <code>useTabs</code>）间接使用，
      Composables 提供了更安全、更稳定的 API 封装。
    </DocTip>

    <!-- DEFAULT_PREFERENCES -->
    <div>
      <h2>DEFAULT_PREFERENCES</h2>
      <p>
        完整的默认偏好配置对象，包含所有 12 个模块的初始值。
        <code>resetPreferences()</code> 会将配置重置为此对象的深拷贝。
      </p>
    </div>
    <DocCodeBlock :code="defaultPrefsCode" language="typescript" />

    <DocTip type="tip">
      <code>DEFAULT_PREFERENCES</code> 是冻结对象（<code>Object.freeze</code>），不可直接修改。
      如需自定义默认值，请在安装插件时通过 <code>overrides</code> 选项覆盖。
    </DocTip>

    <!-- usePreferencesStore -->
    <div>
      <h2>usePreferencesStore</h2>
      <p>
        偏好系统的底层状态管理，使用 <code>@vueuse/core</code> 的 <code>createGlobalState</code> 实现单例模式。
        数据通过 <code>useStorage</code> 自动持久化到 <code>localStorage</code>。
      </p>
    </div>

    <div>
      <h3>API 概览</h3>
      <DocCodeBlock :code="prefsStoreCode" language="typescript" />
    </div>

    <div>
      <h3>持久化机制</h3>
      <DocCodeBlock :code="prefsStorePersistCode" language="typescript" />
    </div>

    <DocPropsTable title="返回值" :data="prefsStoreReturnProps" />

    <!-- useTabsStore -->
    <div>
      <h2>useTabsStore</h2>
      <p>
        标签页的底层状态管理。维护标签列表、KeepAlive 缓存和刷新状态。
        同样使用 <code>createGlobalState</code> 实现单例。
      </p>
    </div>

    <div>
      <h3>状态</h3>
      <DocCodeBlock :code="tabsStoreCode" language="typescript" />
    </div>

    <div>
      <h3>方法</h3>
      <DocCodeBlock :code="tabsStoreMethodsCode" language="typescript" />
    </div>

    <DocEventsTable title="useTabsStore 方法列表" :data="tabsStoreMethods" />

    <DocTip type="tip" title="架构关系">
      <strong>Store → Composable → 业务代码</strong>：Store 提供原始状态和操作；Composable 封装为更友好的 API（如自动注入 router）；
      业务代码只需使用 Composable 层。
    </DocTip>
  </DocSection>
</template>
