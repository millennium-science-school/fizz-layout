<script setup lang="ts">
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocPropsTable from '../../components/DocPropsTable.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

const preferencesCode = `import { usePreferences } from '@fizz/layout'

const {
  preferences,
  layout,
  layoutMode,
  sidebarCollapsed,
  updatePreferences,
  resetPreferences,
  getPreference,
} = usePreferences()

// 读取当前布局
console.log(layout.value) // 'header-nav'

// 更新偏好，支持深度合并
updatePreferences({
  app: { layout: 'sidebar-nav' },
  sidebar: { collapsed: true },
})

// 切换侧边栏折叠状态
sidebarCollapsed.value = !sidebarCollapsed.value

// 读取派生状态
if (layoutMode.value.isMixedNav) {
  console.log('当前是混合导航')
}

// 获取单个配置模块
const tabs = getPreference('tabs')

// 重置所有偏好
resetPreferences()`

const tabsCode = `import { useTabs } from '@fizz/layout'

const {
  tabs,
  activeTab,
  addTab,
  closeTab,
  closeCurrentTab,
  closeOtherTabs,
  closeAllTabs,
  refreshTab,
  setTabTitle,
} = useTabs()

// 添加当前路由标签
addTab(route)

// 关闭指定标签
closeTab('/system/users')

// 刷新当前标签
refreshTab()

// 设置动态标题
setTabTitle('/system/users/1', '用户详情')`

const defaultPrefsCode = `import { DEFAULT_PREFERENCES } from '@fizz/layout'

console.log(DEFAULT_PREFERENCES.app.layout) // 'header-nav'
console.log(DEFAULT_PREFERENCES.tabs.styleType) // 'chrome'

// 自定义时复制后覆盖，不要直接修改默认对象
const preferences = {
  ...DEFAULT_PREFERENCES,
  app: {
    ...DEFAULT_PREFERENCES.app,
    name: 'Admin Console',
    layout: 'mixed-nav',
  },
}`

const preferencesReturnProps = [
  { name: 'preferences', type: 'Readonly<Ref<LayoutPreferences>>', description: '完整偏好对象，只读访问' },
  { name: 'layout', type: 'ComputedRef<LayoutType>', description: '当前布局模式' },
  { name: 'layoutMode', type: 'ComputedRef<{ isHeaderNav; isMixedNav; isSideNav }>', description: '布局模式派生判断' },
  { name: 'sidebarCollapsed', type: 'WritableComputedRef<boolean>', description: '侧边栏折叠状态' },
  { name: 'updatePreferences', type: '(updates: DeepPartial<LayoutPreferences>) => void', description: '深度合并更新偏好' },
  { name: 'resetPreferences', type: '() => void', description: '重置为默认偏好' },
  { name: 'getPreference', type: '(key: keyof LayoutPreferences) => LayoutPreferences[key]', description: '读取指定偏好模块' },
]

const tabsReturnProps = [
  { name: 'tabs', type: 'ComputedRef<TabDefinition[]>', description: '当前标签页列表' },
  { name: 'activeTab', type: 'ComputedRef<TabDefinition | undefined>', description: '当前激活标签' },
  { name: 'addTab', type: '(route) => void', description: '添加路由标签' },
  { name: 'closeTab', type: '(path) => void', description: '关闭指定标签' },
  { name: 'closeCurrentTab', type: '() => void', description: '关闭当前标签' },
  { name: 'closeOtherTabs', type: '(path?) => void', description: '关闭其他标签' },
  { name: 'closeAllTabs', type: '() => void', description: '关闭全部可关闭标签' },
  { name: 'refreshTab', type: '(name?) => void', description: '刷新标签对应页面缓存' },
  { name: 'setTabTitle', type: '(path, title) => void', description: '设置标签自定义标题' },
]
</script>

<template>
  <DocSection title="状态 API" description="usePreferences / useTabs / DEFAULT_PREFERENCES — 面向业务使用的状态接口">
    <DocTip type="warning" title="公开 API 边界">
      常规业务使用 <code>usePreferences()</code> 和 <code>useTabs()</code>。
      底层 store 属于内部实现，不作为 <code>@fizz/layout</code> 的公开 API 文档化。
    </DocTip>

    <div>
      <h2>usePreferences</h2>
      <p>
        读取和更新布局偏好，包括布局模式、侧边栏折叠、主题、标签页和组件开关等配置。
      </p>
      <DocCodeBlock :code="preferencesCode" language="typescript" />
    </div>

    <DocPropsTable title="usePreferences 返回值" :data="preferencesReturnProps" />

    <div>
      <h2>useTabs</h2>
      <p>
        管理多标签页，包括添加、关闭、刷新和动态标题。
      </p>
      <DocCodeBlock :code="tabsCode" language="typescript" />
    </div>

    <DocPropsTable title="useTabs 返回值" :data="tabsReturnProps" />

    <div>
      <h2>DEFAULT_PREFERENCES</h2>
      <p>
        默认偏好常量可用于查看初始配置，覆盖默认值时应复制后合并。
      </p>
      <DocCodeBlock :code="defaultPrefsCode" language="typescript" />
    </div>
  </DocSection>
</template>
