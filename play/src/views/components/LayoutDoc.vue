<script setup lang="ts">
import { usePreferences } from '@fizz-layout/core'
import { ref } from 'vue'
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocEventsTable from '../../components/DocEventsTable.vue'
import DocPropsTable from '../../components/DocPropsTable.vue'
import DocSection from '../../components/DocSection.vue'
import DocSlotsTable from '../../components/DocSlotsTable.vue'
import DocTip from '../../components/DocTip.vue'

const { updatePreferences } = usePreferences()
const vueSfcExt = '.vue'

// ========== 交互 Demo ==========
const layouts = ['sidebar-nav', 'header-nav', 'mixed-nav'] as const
const currentLayout = ref<string>('sidebar-nav')

function switchLayout(layout: string) {
  currentLayout.value = layout
  updatePreferences({ app: { layout: layout as any } })
}

// ========== 代码示例 ==========
const minimalCode = `<script setup lang="ts">
import { FizzLayout } from '@fizz/layout'
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const currentPath = computed(() => route.path)

const menus = [
  { name: '首页', path: '/', icon: 'carbon:home' },
  { name: '设置', path: '/settings', icon: 'carbon:settings' },
]

function handleMenuSelect(path: string) {
  router.push(path)
}
<\/script>

<template>
  <FizzLayout
    :menus="menus"
    :current-path="currentPath"
    @sidebar-menu-select="handleMenuSelect"
    @header-menu-select="handleMenuSelect"
  />
</template>`

const slotsCode = `<FizzLayout
  :menus="menus"
  :current-path="currentPath"
  @sidebar-menu-select="handleMenuSelect"
  @header-menu-select="handleMenuSelect"
>
  <!-- 面包屑 -->
  <template #breadcrumb>
    <FlBreadcrumb :show-home="true" :show-icon="true" />
  </template>

  <!-- 主题切换 -->
  <template #theme-toggle>
    <FlAppearance :mode="theme" @change="mode => theme = mode" />
  </template>

  <!-- 全屏按钮 -->
  <template #fullscreen>
    <FlFullscreen />
  </template>

  <!-- 通知 -->
  <template #notification>
    <FlNotification :notifications="notifications" />
  </template>

  <!-- 全局搜索 -->
  <template #global-search>
    <FlGlobalSearch :menus="menus" @select="handleSearch" />
  </template>

  <!-- 语言切换 -->
  <template #language-toggle="{ locale, toggleLanguage }">
    <FlTranslation :locale="locale.name" :languages="langs" @change="toggleLanguage" />
  </template>

  <!-- 用户下拉 -->
  <template #user-dropdown>
    <FlUserDropdown username="Admin" @logout="handleLogout" />
  </template>

  <!-- Logo 自定义 -->
  <template #logo>
    <img src="/logo.png" alt="Logo" style="height: 32px" />
    <span>My App</span>
  </template>

  <!-- 页脚 -->
  <template #footer>
    <FlCopyright company-name="My Company" />
  </template>

  <!-- 默认插槽：页面内容 -->
  <router-view />
</FizzLayout>`

const mixedMenuCode = `<!-- 为不同布局分别指定菜单数据 -->
<FizzLayout
  :menus="menus"
  :header-menus="topMenus"
  :sidebar-menus="sideMenus"
  :current-path="currentPath"
  @sidebar-menu-select="handleMenuSelect"
  @header-menu-select="handleMenuSelect"
/>`

const customMenuCode = `<script setup lang="ts">
import { FizzLayout } from '@fizz/layout'
import MyCustomMenu from './MyCustomMenu${vueSfcExt}'
<\/script>

<template>
  <FizzLayout
    :menus="menus"
    :sidebar-menu-component="MyCustomMenu"
  />
</template>`

// ========== Props 数据 ==========
const propsData = [
  { name: 'menus', type: 'MenuItemType[]', default: '[]', description: '菜单数据，作为侧边栏和顶部菜单的默认数据源' },
  { name: 'headerMenus', type: 'MenuItemType[]', default: 'undefined', description: '顶部菜单数据（不传则使用 menus）' },
  { name: 'sidebarMenus', type: 'MenuItemType[]', default: 'undefined', description: '侧边栏菜单数据（不传则使用 menus）' },
  { name: 'menuTheme', type: '\'dark\' | \'light\'', default: 'undefined', description: '菜单主题色（覆盖偏好设置中的主题）' },
  { name: 'currentPath', type: 'string', default: '\'\'', description: '当前激活的路由路径，用于高亮菜单项', required: true },
  { name: 'headerMenuComponent', type: 'Component', default: 'undefined', description: '自定义顶部菜单组件（替换默认 FlMenu）' },
  { name: 'sidebarMenuComponent', type: 'Component', default: 'undefined', description: '自定义侧边栏菜单组件（替换默认 FlMenu）' },
]

// ========== Events 数据 ==========
const eventsData = [
  { name: 'headerMenuSelect', params: '(key: string, menu: MenuItemType | undefined, mode?: string)', description: '顶部菜单项被点击时触发' },
  { name: 'sidebarMenuSelect', params: '(key: string, menu: MenuItemType | undefined, mode?: string)', description: '侧边栏菜单项被点击时触发' },
  { name: 'clickLogo', params: '()', description: 'Logo 被点击时触发' },
  { name: 'update:sidebarCollapsed', params: '(value: boolean)', description: '侧边栏折叠状态变化时触发' },
]

// ========== Slots 数据 ==========
const slotsData = [
  { name: 'default', description: '主内容区域，默认渲染 FlContainer（含 router-view）' },
  { name: 'logo', description: '自定义 Logo 区域' },
  { name: 'breadcrumb', description: '面包屑导航区域' },
  { name: 'sidebar', description: '完全自定义侧边栏菜单内容' },
  { name: 'sidebar-collapse-button', description: '自定义侧边栏折叠按钮' },
  { name: 'header-menu', description: '自定义顶部菜单区域（header-nav / mixed-nav）' },
  { name: 'header-left-*', description: '头部左侧自定义内容区域' },
  { name: 'header-right-*', description: '头部右侧自定义内容区域' },
  { name: 'theme-toggle', description: '主题切换按钮区域' },
  { name: 'fullscreen', description: '全屏切换按钮区域' },
  { name: 'notification', description: '消息通知区域' },
  { name: 'global-search', description: '全局搜索区域' },
  { name: 'language-toggle', params: '{ locale, toggleLanguage }', description: '语言切换区域，提供当前 locale 和切换函数' },
  { name: 'user-dropdown', description: '用户下拉菜单区域' },
  { name: 'footer', description: '页脚内容区域，默认渲染 FlCopyright' },
]

const exposeData = [
  { name: 'toggleSidebar', params: '()', description: '切换侧边栏的显示/隐藏状态' },
]
</script>

<template>
  <DocSection title="FizzLayout 布局" description="核心布局组件，提供完整的后台管理页面骨架，支持 sidebar-nav、header-nav、mixed-nav 三种布局模式">
    <!-- 概览 -->
    <div>
      <h2>概览</h2>
      <p>
        <code>FizzLayout</code> 是 fizz-layout 的核心组件。它根据 <code>usePreferences</code> 中的偏好设置自动渲染页面骨架，
        包括侧边栏、头部、标签页、内容区和页脚。通过丰富的 Props、Events 和 Slots，你可以高度定制后台管理页面的各个区域。
      </p>
    </div>

    <!-- 布局模式 -->
    <div>
      <h2>布局模式预览</h2>
      <p>点击下方按钮实时切换当前文档站的布局模式：</p>
      <div class="layout-switcher">
        <el-button
          v-for="l in layouts"
          :key="l"
          :type="currentLayout === l ? 'primary' : 'default'"
          @click="switchLayout(l)"
        >
          {{ l }}
        </el-button>
      </div>
      <DocTip>
        切换布局模式会即时影响整个文档站的外观，展示了 <code>updatePreferences</code> 的实时响应能力。
      </DocTip>
    </div>

    <!-- 基础用法 -->
    <div>
      <h2>基础用法</h2>
      <p>最简配置：传入菜单数据和当前路径，监听菜单选择事件：</p>
      <DocCodeBlock :code="minimalCode" language="vue" />
    </div>

    <!-- Slots 用法 -->
    <div>
      <h2>Slots 完整示例</h2>
      <p>FizzLayout 提供了丰富的插槽，可以将各个功能组件组合在一起：</p>
      <DocCodeBlock :code="slotsCode" language="vue" />
    </div>

    <!-- 分离菜单 -->
    <div>
      <h2>分离菜单数据</h2>
      <p>在 <code>header-nav</code> 或 <code>mixed-nav</code> 模式下，可为顶部和侧边栏分别传入不同的菜单数据：</p>
      <DocCodeBlock :code="mixedMenuCode" language="vue" />
      <DocTip type="tip" title="mixed-nav 联动">
        在 <code>mixed-nav</code> 模式下，点击顶部一级菜单会自动切换侧边栏显示该菜单的子项。
        如果配置了 <code>sidebar.autoActivateChild</code>，还会自动跳转到第一个子菜单。
      </DocTip>
    </div>

    <!-- 自定义菜单组件 -->
    <div>
      <h2>自定义菜单组件</h2>
      <p>如果内置的 FlMenu 不满足需求，可以传入自定义菜单组件：</p>
      <DocCodeBlock :code="customMenuCode" language="vue" />
    </div>

    <!-- Props -->
    <DocPropsTable title="Props" :data="propsData" />

    <!-- Events -->
    <DocEventsTable title="Events" :data="eventsData" />

    <!-- Slots -->
    <DocSlotsTable title="Slots" :data="slotsData" />

    <!-- Expose -->
    <DocEventsTable title="Expose Methods" :data="exposeData" />

    <!-- 偏好控制说明 -->
    <div>
      <h2>偏好控制</h2>
      <p>
        FizzLayout 的大部分行为由 <code>usePreferences</code> 的偏好状态驱动：
      </p>
      <el-table
        :data="[
          { module: 'app.layout', content: '布局模式（sidebar-nav / header-nav / mixed-nav）' },
          { module: 'header', content: '头部的启用、高度、隐藏、菜单对齐' },
          { module: 'sidebar', content: '侧边栏宽度、折叠、隐藏、折叠按钮' },
          { module: 'tabs', content: '标签页的启用、高度、图标显示' },
          { module: 'footer', content: '页脚的启用、固定、高度' },
          { module: 'logo', content: 'Logo 的启用、图片源、适应模式' },
          { module: 'breadcrumb', content: '面包屑的启用和显示规则' },
          { module: 'navigation', content: '菜单风格（plain / rounded）、手风琴模式' },
          { module: 'theme', content: '主题模式、半深色模式' },
          { module: 'copyright', content: '版权信息' },
        ]"
        stripe
        border
      >
        <el-table-column prop="module" label="偏好模块" width="200">
          <template #default="{ row }">
            <code>{{ row.module }}</code>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="控制内容" />
      </el-table>
      <DocTip type="tip">
        详细的偏好配置请参阅 <strong>指南 → 偏好系统</strong> 页面。
      </DocTip>
    </div>
  </DocSection>
</template>

<style scoped>
.layout-switcher {
  display: flex;
  gap: 12px;
  margin: 12px 0;
}
</style>
