<script setup lang="ts">
import { usePreferences } from '@fizz-layout/core'
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

const { preferences, layout, updatePreferences } = usePreferences()

function changeLayout(newLayout: string) {
  updatePreferences({ app: { layout: newLayout as any } })
}

const layoutModes = [
  {
    key: 'sidebar-nav',
    title: '侧边导航 sidebar-nav',
    desc: '经典的左右结构。侧边栏放置完整菜单树，顶栏放置面包屑和功能按钮。适合菜单层级较多的中大型系统。',
    structure: `┌───────────────────────────┐
│ Logo  │     Header        │
├───────┼───────────────────┤
│       │                   │
│ Menu  │     Content       │
│       │                   │
└───────┴───────────────────┘`,
  },
  {
    key: 'header-nav',
    title: '顶部导航 header-nav',
    desc: '上下结构。菜单放置在顶栏中水平展示，适合菜单项较少的轻量应用。',
    structure: `┌──────────────────────────┐
│  Logo    Menu    Actions │
├──────────────────────────┤
│                          │
│         Content          │
│                          │
└──────────────────────────┘`,
  },
  {
    key: 'mixed-nav',
    title: '混合导航 mixed-nav',
    desc: '顶栏展示一级菜单，点击后侧边栏展示对应的二级菜单。适合一级菜单不多但子菜单较深的大型系统。',
    structure: `┌──────────────────────────┐
│ Logo  一级菜单   Actions  │
├───────┼──────────────────┤
│ 二级  │                   │
│ 菜单  │     Content       │
│       │                   │
└───────┴───────────────────┘`,
  },
]

const usageCode = `import { usePreferences } from '@fizz/layout'

const { updatePreferences, layout } = usePreferences()

// 读取当前布局
console.log(layout.value) // 'sidebar-nav'

// 切换布局
updatePreferences({ app: { layout: 'header-nav' } })`

const propsCode = `// FizzLayout 组件的布局相关 Props
<FizzLayout
  :menus="menus"              // 菜单数据（侧边+顶部共用）
  :header-menus="headerMenus" // 顶部菜单（不传则复用 menus）
  :sidebar-menus="sidebarMenus" // 侧边菜单（不传则复用 menus）
  :current-path="currentPath" // 当前激活路径
  @sidebar-menu-select="handleSidebarSelect"
  @header-menu-select="handleHeaderSelect"
/>`
</script>

<template>
  <DocSection title="布局模式" description="了解并切换 sidebar-nav / header-nav / mixed-nav 三种布局模式">
    <div>
      <h2>概览</h2>
      <p>
        Fizz Layout 内置三种布局模式，通过 <code>preferences.app.layout</code> 控制。
        你可以在运行时随时切换，布局会<strong>立即响应</strong>变化。
      </p>
    </div>

    <DocTip>
      💡 点击下方按钮即可<strong>实时切换</strong>当前文档站的布局模式，体验不同布局的效果！
    </DocTip>

    <!-- Interactive Layout Switcher -->
    <div>
      <h2>交互演示</h2>
      <p>当前布局模式：<code>{{ preferences.app.layout }}</code></p>
      <div class="layout-switcher">
        <el-button
          v-for="mode in layoutModes"
          :key="mode.key"
          :type="layout === mode.key ? 'primary' : 'default'"
          @click="changeLayout(mode.key)"
        >
          {{ mode.key }}
        </el-button>
      </div>
    </div>

    <!-- Mode Details -->
    <div v-for="mode in layoutModes" :key="mode.key">
      <h2>{{ mode.title }}</h2>
      <p>{{ mode.desc }}</p>
      <pre class="layout-structure">{{ mode.structure }}</pre>
    </div>

    <div>
      <h2>模式对比</h2>
      <el-table
        :data="[
          { feature: '侧边栏', sidebar: '✅ 完整菜单', header: '❌ 无', mixed: '✅ 二级菜单' },
          { feature: '顶栏菜单', sidebar: '❌ 无', header: '✅ 完整菜单', mixed: '✅ 一级菜单' },
          { feature: '折叠按钮', sidebar: '✅', header: '❌', mixed: '✅' },
          { feature: 'Logo 位置', sidebar: '侧边栏顶部', header: '顶栏左侧', mixed: '顶栏左侧' },
          { feature: '适用场景', sidebar: '菜单层级多', header: '菜单项少', mixed: '一级少、二级多' },
        ]"
        stripe
        border
      >
        <el-table-column prop="feature" label="特性" width="120" />
        <el-table-column prop="sidebar" label="sidebar-nav" align="center" />
        <el-table-column prop="header" label="header-nav" align="center" />
        <el-table-column prop="mixed" label="mixed-nav" align="center" />
      </el-table>
    </div>

    <div>
      <h2>代码示例</h2>
      <p>通过 <code>usePreferences</code> 切换布局模式：</p>
      <DocCodeBlock :code="usageCode" language="typescript" />
    </div>

    <div>
      <h2>菜单数据分离</h2>
      <p>
        默认情况下侧边栏和顶栏共用 <code>menus</code> 数据。
        你也可以通过 <code>headerMenus</code> 和 <code>sidebarMenus</code> 分别指定：
      </p>
      <DocCodeBlock :code="propsCode" language="vue" />
    </div>

    <DocTip type="warning">
      在 <code>mixed-nav</code> 模式下，点击顶栏一级菜单会自动展示对应子菜单到侧边栏。
      如果设置了 <code>sidebar.autoActivateChild: true</code>，还会自动跳转到第一个子菜单页面。
    </DocTip>
  </DocSection>
</template>

<style scoped>
.layout-switcher {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.layout-structure {
  background: var(--el-fill-color-lighter);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  padding: 1rem;
  font-family: 'Fira Code', Consolas, monospace;
  font-size: 0.8125rem;
  line-height: 1.6;
  overflow-x: auto;
  color: var(--el-text-color-primary);
}
</style>
