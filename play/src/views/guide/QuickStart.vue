<script setup lang="ts">
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

// Demo 组件内联源码（Phase 2 验证用）
const installCode = `# 使用 pnpm
pnpm add fizz-layout

# 使用 npm
npm install fizz-layout

# 使用 yarn
yarn add fizz-layout`

const mainTsCode = `import { createLocaleAdapter } from '@fizz/layout'
import { zhCN, enUS } from '@fizz/layout/locale'
import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import { router } from './router'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@fizz/layout/theme-chalk/src/index.scss'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': { ...zhCN },
    'en-US': { ...enUS },
  },
})

createApp(App)
  .use(router)
  .use(ElementPlus)
  .use(i18n)
  .use(createLocaleAdapter(i18n))
  .mount('#app')`

const minimalAppCode = `<script setup lang="ts">
import { FizzLayout } from '@fizz/layout'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const menus = [
  { name: '首页', path: '/', icon: 'carbon:home' },
  { name: '关于', path: '/about', icon: 'carbon:information' },
]

const currentPath = computed(() => route.path)

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

const routerCode = `import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/Home.vue'),
    meta: { title: '首页', icon: 'carbon:home', affixTab: true },
  },
  {
    path: '/users',
    name: 'Users',
    meta: { title: '用户管理', icon: 'carbon:user' },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('./views/users/List.vue'),
        meta: { title: '用户列表', icon: 'carbon:list' },
      },
      {
        path: 'roles',
        name: 'UserRoles',
        component: () => import('./views/users/Roles.vue'),
        meta: { title: '角色管理', icon: 'carbon:user-role' },
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})`

const menuTipCode = `// FizzLayout 会自动从菜单数据渲染侧边栏/顶栏菜单
// 菜单数据可以手动编写，也可以用 createMenus() 从后端数据生成
// 也可以用 useMenuAdapter() 从路由自动生成

// 方式一：手动编写（适合菜单少的场景）
const menus = [
  { name: '首页', path: '/', icon: 'carbon:home' },
  { name: '用户管理', path: '/users', icon: 'carbon:user', children: [...] },
]

// 方式二：从路由自动生成
import { useMenuAdapter } from '@fizz/layout'
const { menus } = useMenuAdapter({ t: key => t(key) })
menus.generateFromRoutes(router.getRoutes())`
</script>

<template>
  <DocSection title="快速开始" description="5 分钟内完成 Fizz Layout 的安装与基本配置">
    <!-- Step 1 -->
    <div>
      <h2>Step 1：安装依赖</h2>
      <p>使用你喜欢的包管理器安装 fizz-layout：</p>
      <DocCodeBlock :code="installCode" language="bash" />
    </div>

    <DocTip>
      Fizz Layout 依赖 Element Plus、vue-router (可选 vue-i18n)，请确保这些依赖已安装。
    </DocTip>

    <!-- Step 2 -->
    <div>
      <h2>Step 2：入口配置</h2>
      <p>在 <code>main.ts</code> 中初始化 Element Plus、i18n 和 FizzLayout 的语言适配器：</p>
      <DocCodeBlock :code="mainTsCode" language="typescript" />
    </div>

    <!-- Step 3 -->
    <div>
      <h2>Step 3：最小 Layout</h2>
      <p>在 <code>App.vue</code> 中使用 FizzLayout 组件，传入菜单数据即可渲染完整布局：</p>
      <DocCodeBlock :code="minimalAppCode" language="vue" />
    </div>

    <!-- DocDemoBox 验证 -->
    <div>
      <h2>Step 4：定义路由与菜单</h2>
      <p>创建路由配置文件。路由的 <code>meta</code> 字段用于控制菜单图标、标签页行为等：</p>
      <DocCodeBlock :code="routerCode" language="typescript" />
    </div>

    <DocTip>
      路由 <code>meta</code> 支持丰富的字段：<code>title</code>（菜单名/标签页标题）、<code>icon</code>（菜单图标）、
      <code>affixTab</code>（固定标签页）、<code>keepAlive</code>（缓存）、<code>hideInMenu</code>（菜单中隐藏）等。
      详见 <router-link to="/guide/menus">
        菜单配置
      </router-link> 章节。
    </DocTip>

    <div>
      <h2>Step 5：菜单数据</h2>
      <p>FizzLayout 需要菜单数据来渲染导航，有多种生成方式：</p>
      <DocCodeBlock :code="menuTipCode" language="typescript" />
    </div>
  </DocSection>
</template>
