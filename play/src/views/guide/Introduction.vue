<script setup lang="ts">
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

const minimalCode = `<script setup lang="ts">
import { FizzLayout } from '@fizz/layout'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const menus = [
  { name: '首页', path: '/', icon: 'carbon:home' },
  { name: '用户管理', path: '/users', icon: 'carbon:user' },
]
const currentPath = computed(() => route.path)
<\/script>

<template>
  <FizzLayout
    :menus="menus"
    :current-path="currentPath"
    @sidebar-menu-select="key => router.push(key)"
    @header-menu-select="key => router.push(key)"
  />
</template>`

const archData = [
  { level: '🧩 组件层', module: 'FizzLayout + 10 个子组件', desc: '提供完整的 UI 结构与交互能力' },
  { level: '⚙️ 状态层', module: 'usePreferences / useTabs', desc: '管理偏好设置和标签页状态' },
  { level: '🔌 Hook 层', module: 'useLocale / useMenuAdapter 等', desc: '提供菜单适配、国际化、事件拦截等能力' },
  { level: '🎨 主题层', module: 'theme-chalk (SCSS / CSS 变量)', desc: '控制所有视觉样式，支持完整定制' },
]

const featureData = [
  { feature: '三种布局模式', desc: 'sidebar-nav（侧边导航）、header-nav（顶部导航）、mixed-nav（混合导航）' },
  { feature: '12 个偏好模块', desc: '涵盖 app、header、sidebar、tabs、theme、breadcrumb 等，支持深度自定义' },
  { feature: '标签页系统', desc: '固定标签、拖拽排序、右键菜单、KeepAlive 缓存、持久化' },
  { feature: '主题系统', desc: '亮色 / 暗色 / 跟随系统，独立的半深色头部和侧边栏' },
  { feature: '国际化', desc: '内置中/英语言包，通过 createLocaleAdapter 与 vue-i18n 无缝集成' },
  { feature: '10 个功能组件', desc: '面包屑、全局搜索、外观切换、全屏、通知、语言切换、用户菜单等' },
]

const stackData = [
  { dep: 'Vue', version: '≥ 3.3', usage: '核心框架' },
  { dep: 'Element Plus', version: '≥ 2.4', usage: 'UI 组件库' },
  { dep: 'vue-router', version: '≥ 4.0', usage: '路由管理' },
  { dep: 'vue-i18n', version: '≥ 9.0', usage: '国际化（可选但推荐）' },
]
</script>

<template>
  <DocSection title="项目介绍" description="了解 Fizz Layout 的核心概念与设计理念">
    <div>
      <h2>什么是 Fizz Layout？</h2>
      <p>
        Fizz Layout 是一个基于 Vue 3 + Element Plus 的后台管理布局组件库。
        它将后台系统常见的布局结构（侧边栏、顶栏、标签页、内容区、底栏）封装为一个高度可配置的
        <code>FizzLayout</code> 组件，帮助开发者在几分钟内搭建出专业的管理后台界面。
      </p>
    </div>

    <div>
      <h2>为什么选择 Fizz Layout？</h2>
      <p>传统方式构建后台布局通常需要手动处理以下问题：</p>
      <ul>
        <li>🏗️ 布局结构 — 侧边栏、顶栏、内容区的排列与响应式适配</li>
        <li>📋 菜单渲染 — 多级菜单、图标、折叠、路由联动</li>
        <li>🎨 主题切换 — 亮色 / 暗色 / 半深色模式</li>
        <li>📑 标签页管理 — 固定、拖拽、KeepAlive 缓存</li>
        <li>⚙️ 偏好持久化 — 用户配置自动保存与恢复</li>
        <li>🌐 国际化 — 组件内置文案的多语言切换</li>
      </ul>
      <p>Fizz Layout 将这些功能统一封装，只需传入菜单数据和配置偏好，即可获得完整的后台布局。</p>
    </div>

    <DocTip>
      你正在浏览的这个文档站本身就是用 FizzLayout 构建的！
    </DocTip>

    <div>
      <h2>核心架构</h2>
      <p>Fizz Layout 的架构分为以下几层：</p>
      <el-table
        :data="archData"
        stripe
        border
      >
        <el-table-column prop="level" label="层级" width="130" />
        <el-table-column prop="module" label="模块" width="260" />
        <el-table-column prop="desc" label="说明" min-width="200" />
      </el-table>
    </div>

    <div>
      <h2>核心特性</h2>
      <el-table
        :data="featureData"
        stripe
        border
      >
        <el-table-column prop="feature" label="特性" width="160" />
        <el-table-column prop="desc" label="说明" min-width="300" />
      </el-table>
    </div>

    <div>
      <h2>最小示例</h2>
      <p>只需不到 20 行代码，即可渲染一个包含侧边栏菜单的完整布局：</p>
      <DocCodeBlock :code="minimalCode" language="vue" />
    </div>

    <div>
      <h2>技术栈要求</h2>
      <el-table
        :data="stackData"
        stripe
        border
      >
        <el-table-column prop="dep" label="依赖" width="150" />
        <el-table-column prop="version" label="版本要求" width="130" />
        <el-table-column prop="usage" label="用途" min-width="200" />
      </el-table>
    </div>

    <div>
      <h2>下一步</h2>
      <p>
        准备好了吗？前往
        <router-link to="/guide/quick-start">
          快速开始
        </router-link>
        了解安装和配置步骤。
      </p>
    </div>
  </DocSection>
</template>
