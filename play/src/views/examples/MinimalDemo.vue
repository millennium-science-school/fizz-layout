<script setup lang="ts">
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

const vueSfcExt = '.vue'

const step1Code = `# 安装依赖
pnpm add @fizz/layout element-plus`

const step2MainCode = `// main.ts — 最小入口
import { setupFizzLocale } from '@fizz/layout/hooks'
import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import App from './App${vueSfcExt}'
import { router } from './router'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@fizz/layout/theme-chalk/src/index.scss'

createApp(App)
  .use(router)
  .use(ElementPlus)
  .use(setupFizzLocale())  // 不依赖 vue-i18n 的轻量方案
  .mount('#app')`

const step3AppCode = `<!-- App.vue — 最小布局壳 -->
<script setup lang="ts">
import { FizzLayout, FlBreadcrumb } from '@fizz/layout'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const currentPath = computed(() => route.path)

// 最简菜单数据（硬编码）
const menus = ref([
  {
    name: '首页',
    path: '/',
    icon: 'carbon:home',
  },
  {
    name: '用户管理',
    path: '/users',
    icon: 'carbon:user',
  },
  {
    name: '设置',
    path: '/settings',
    icon: 'carbon:settings',
  },
])

function onMenuSelect(path: string) {
  router.push(path)
}
<\/script>

<template>
  <FizzLayout
    :menus="menus"
    :current-path="currentPath"
    @sidebar-menu-select="onMenuSelect"
    @header-menu-select="onMenuSelect"
  >
    <template #breadcrumb>
      <FlBreadcrumb />
    </template>
  </FizzLayout>
</template>`

const step4RouterCode = `// router/index.ts — 最简路由
import { createRouter, createWebHashHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue'),
      meta: { title: '首页', icon: 'carbon:home' },
    },
    {
      path: '/users',
      name: 'Users',
      component: () => import('../views/Users.vue'),
      meta: { title: '用户管理', icon: 'carbon:user' },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('../views/Settings.vue'),
      meta: { title: '设置', icon: 'carbon:settings' },
    },
  ],
})`

const step5ViewCode = `<!-- views/Home.vue — 最简页面 -->
<template>
  <div style="padding: 2rem;">
    <h1>欢迎使用 Fizz Layout 🎉</h1>
    <p>这是一个最小化接入示例。</p>
  </div>
</template>`

const fullMinimalCode = `// 完整文件数量统计：
// main.ts     — 14 行
// App.vue     — 35 行
// router.ts   — 24 行
// views/*.vue — 每个 5 行
// ─────────────────────
// 总计约 80 行代码即可运行一个带侧边栏、面包屑、标签页的后台框架

// 你没有用到的功能会被 Tree-Shaking 自动移除：
// ✅ FizzLayout + FlBreadcrumb（已使用）
// ❌ FlNotification / FlUserDropdown / FlGlobalSearch（未使用，不打包）`

const withI18nCode = `// 如果需要国际化，只需替换 setupFizzLocale 为 createLocaleAdapter
import { createLocaleAdapter } from '@fizz/layout/hooks'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages: { 'zh-CN': { /* ... */ }, 'en-US': { /* ... */ } },
})

createApp(App)
  .use(router)
  .use(ElementPlus)
  .use(i18n)
  .use(createLocaleAdapter(i18n))  // 替换 setupFizzLocale
  .mount('#app')`

const withPrefsCode = `// 需要自定义默认偏好？在使用布局前调用 updatePreferences
import { usePreferences } from '@fizz/layout'

const { updatePreferences } = usePreferences()

// 按需覆盖默认值
updatePreferences({
  app: { layout: 'header-nav', name: 'My App' },
  sidebar: { width: 240 },
  tabs: { styleType: 'card' },
  theme: { mode: 'light', colorPrimary: '#722ed1' },
})`
</script>

<template>
  <DocSection title="最小接入示例" description="用最少的代码快速接入 Fizz Layout — 4 个文件即可运行">
    <DocTip type="tip" title="适用场景">
      当你只需要一个带侧边栏和面包屑的基础后台骨架时，无需配置通知、搜索、用户等复杂功能。
      所有高级功能都可以按需逐步添加。
    </DocTip>

    <!-- Step 1 -->
    <div>
      <h2>Step 1：安装依赖</h2>
    </div>
    <DocCodeBlock :code="step1Code" language="bash" />

    <!-- Step 2 -->
    <div>
      <h2>Step 2：入口文件</h2>
      <p>使用 <code>setupFizzLocale()</code> 免去 vue-i18n 的配置。</p>
    </div>
    <DocCodeBlock :code="step2MainCode" language="typescript" />

    <!-- Step 3 -->
    <div>
      <h2>Step 3：App.vue 布局壳</h2>
      <p>只需一个 <code>&lt;FizzLayout&gt;</code> 包裹，传入菜单和路由信息即可。</p>
    </div>
    <DocCodeBlock :code="step3AppCode" language="vue" />

    <!-- Step 4 -->
    <div>
      <h2>Step 4：路由配置</h2>
      <p>标准 Vue Router 配置，通过 <code>meta.title</code> 和 <code>meta.icon</code> 控制菜单显示。</p>
    </div>
    <DocCodeBlock :code="step4RouterCode" language="typescript" />

    <!-- Step 5 -->
    <div>
      <h2>Step 5：页面组件</h2>
      <p>页面组件就是普通的 Vue 组件，无需任何特殊处理。</p>
    </div>
    <DocCodeBlock :code="step5ViewCode" language="vue" />

    <DocTip type="tip">
      <strong>就这些！</strong>运行 <code>pnpm dev</code> 即可看到一个完整的后台布局。
    </DocTip>

    <DocCodeBlock :code="fullMinimalCode" language="typescript" />

    <!-- 进阶 -->
    <div>
      <h2>逐步增强</h2>
      <p>最小接入完成后，可以按需添加更多功能：</p>
    </div>

    <div>
      <h3>添加国际化</h3>
    </div>
    <DocCodeBlock :code="withI18nCode" language="typescript" />

    <div>
      <h3>自定义默认偏好</h3>
    </div>
    <DocCodeBlock :code="withPrefsCode" language="typescript" />

    <DocTip type="tip" title="下一步">
      查看 <strong>全功能演示</strong> 了解如何添加通知中心、用户菜单、全局搜索等高级功能。
      查看 <strong>自定义主题</strong> 了解如何定制配色方案。
    </DocTip>
  </DocSection>
</template>
