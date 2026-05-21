<script setup lang="ts">
import { usePreferences } from '@fizz-layout/core'
import { ref } from 'vue'
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocDemoBox from '../../components/DocDemoBox.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

const { preferences, isDark, sidebarCollapsed, updatePreferences, layout, toggleSidebarCollapse } = usePreferences()

// 当前激活的代码 Tab
const activeCodeTab = ref('app')
const vueSfcExt = '.vue'

function toggleHeader() {
  updatePreferences({ header: { enable: !preferences.value.header.enable } })
}
function toggleTabs() {
  updatePreferences({ tabs: { enable: !preferences.value.tabs.enable } })
}
function toggleFooter() {
  updatePreferences({ footer: { enable: !preferences.value.footer.enable } })
}
function changeLayout(newLayout: string) {
  updatePreferences({ app: { layout: newLayout as any } })
}

// ========== 代码示例 ==========
const appVueCode = `<script setup lang="ts">
import {
  FizzLayout,
  FlAppearance,
  FlBreadcrumb,
  FlCopyright,
  FlFullscreen,
  FlGlobalSearch,
  FlNotification,
  FlTranslation,
  FlUserDropdown,
  usePreferences,
} from '@fizz/layout'
import { useMenuAdapter, useMenuClick } from '@fizz/layout/hooks'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { theme, breadcrumb, widget, sidebar, footer, copyright } = usePreferences()

// 菜单适配
const { menus, generateFromRoutes, createBinding } = useMenuAdapter()
generateFromRoutes(router.getRoutes())

// 菜单点击
const { onMenuClick } = useMenuClick()
onMenuClick((menu) => {
  if (menu.path.startsWith('http')) {
    window.open(menu.path, '_blank')
  } else {
    router.push(menu.path)
  }
})

const currentPath = computed(() => route.path)
<\/script>

<template>
  <FizzLayout
    :menus="menus"
    :current-path="currentPath"
    v-bind="createBinding()"
  >
    <!-- 面包屑 -->
    <template #breadcrumb>
      <FlBreadcrumb v-bind="breadcrumb" />
    </template>

    <!-- 顶栏右侧工具区 -->
    <template #theme-toggle>
      <FlAppearance v-if="widget.themeToggle" />
    </template>

    <template #language-toggle="{ locale, toggleLanguage }">
      <FlTranslation
        v-if="widget.languageToggle"
        :locale="locale.name"
        :languages="[
          { label: '简体中文', value: 'zh-CN' },
          { label: 'English', value: 'en-US' },
        ]"
        @change="toggleLanguage"
      />
    </template>

    <template #notification>
      <FlNotification v-if="widget.notification" />
    </template>

    <template #fullscreen>
      <FlFullscreen v-if="widget.fullscreen" />
    </template>

    <template #global-search>
      <FlGlobalSearch v-if="widget.globalSearch" />
    </template>

    <template #user-dropdown>
      <FlUserDropdown
        avatar="https://i.pravatar.cc/150"
        username="Admin"
        :menus="[
          { label: '个人中心', key: 'profile', icon: 'carbon:user' },
          { label: '退出登录', key: 'logout', icon: 'carbon:logout' },
        ]"
        @menu-click="handleUserMenu"
      />
    </template>

    <!-- 底栏 -->
    <template #footer>
      <FlCopyright v-bind="copyright" />
    </template>
  </FizzLayout>
</template>`

const mainTsCode = `import { createLocaleAdapter } from '@fizz/layout'
import { enUS, zhCN } from '@fizz/layout/locale'
import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App${vueSfcExt}'
import { router } from './router'

// 引入样式
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@fizz/layout/theme-chalk/src/index.scss'

// 国际化
const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': { ...enUS, ...appEnUS },
    'zh-CN': { ...zhCN, ...appZhCN },
  },
})

// 创建应用
createApp(App)
  .use(router)
  .use(ElementPlus)
  .use(i18n)
  .use(createLocaleAdapter(i18n))
  .mount('#app')`

const routerCode = `import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue'),
      meta: { title: '首页', icon: 'carbon:home', affixTab: true },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { title: '仪表盘', icon: 'carbon:dashboard', keepAlive: true },
    },
    {
      path: '/system',
      name: 'System',
      redirect: '/system/users',
      meta: { title: '系统管理', icon: 'carbon:settings' },
      children: [
        {
          path: 'users',
          name: 'Users',
          component: () => import('../views/system/Users.vue'),
          meta: { title: '用户管理', icon: 'carbon:user', keepAlive: true },
        },
        {
          path: 'roles',
          name: 'Roles',
          component: () => import('../views/system/Roles.vue'),
          meta: { title: '角色管理', icon: 'carbon:user-role' },
        },
        {
          path: 'permissions',
          name: 'Permissions',
          component: () => import('../views/system/Permissions.vue'),
          meta: { title: '权限管理', icon: 'carbon:locked' },
        },
      ],
    },
    {
      path: '/data',
      name: 'Data',
      redirect: '/data/dashboard',
      meta: { title: '数据中心', icon: 'carbon:chart-area' },
      children: [
        {
          path: 'dashboard',
          name: 'DataDashboard',
          component: () => import('../views/data/Dashboard.vue'),
          meta: { title: '数据看板', icon: 'carbon:analytics' },
        },
        {
          path: 'reports',
          name: 'Reports',
          component: () => import('../views/data/Reports.vue'),
          meta: { title: '数据报表', icon: 'carbon:report' },
        },
      ],
    },
  ],
})

export { router }`

const menuBackendCode = `// 后端返回菜单结构 + createMenus 合并
import { createMenus } from '@fizz/layout'

// 假设后端返回以下数据
const backendMenus = [
  {
    name: 'Home',
    path: '/',
    children: [],
    meta: { title: '首页', icon: 'carbon:home' },
  },
  {
    name: 'System',
    path: '/system',
    children: [
      { name: 'Users', path: 'users', children: [] },
      { name: 'Roles', path: 'roles', children: [] },
    ],
    meta: { title: '系统管理', icon: 'carbon:settings' },
  },
]

// 与前端路由合并
const menus = createMenus(backendMenus, router.getRoutes(), t)`
</script>

<template>
  <DocSection title="全功能演示" description="展示 Fizz Layout 的完整能力 — 生产级接入参考">
    <DocTip type="tip" title="这是什么？">
      此页面展示了一个生产级应用如何接入 Fizz Layout，包括所有 Slot 配置、多级路由、菜单管理、
      国际化桥接等完整流程。<strong>你现在看到的整个文档站本身就是用 Fizz Layout 构建的。</strong>
    </DocTip>

    <!-- 实时控制面板 -->
    <DocDemoBox title="实时控制面板" description="直接操作当前文档站的布局和偏好设置 — 效果即时可见">
      <div class="full-demo">
        <!-- 布局模式切换 -->
        <div class="full-demo__section">
          <div class="full-demo__section-title">
            布局模式
          </div>
          <div class="full-demo__buttons">
            <el-button
              v-for="l in ['side-nav', 'header-nav', 'mixed-nav']"
              :key="l"
              :type="layout === l ? 'primary' : 'default'"
              @click="changeLayout(l)"
            >
              {{ l }}
            </el-button>
          </div>
        </div>

        <!-- 偏好控制 -->
        <div class="full-demo__section">
          <div class="full-demo__section-title">
            偏好切换
          </div>
          <div class="full-demo__buttons">
            <el-button @click="toggleSidebarCollapse">
              {{ sidebarCollapsed ? '展开' : '折叠' }}侧边栏
            </el-button>
            <el-button @click="toggleHeader">
              {{ preferences.header.enable ? '隐藏' : '显示' }}顶栏
            </el-button>
            <el-button @click="toggleTabs">
              {{ preferences.tabs.enable ? '隐藏' : '显示' }}标签栏
            </el-button>
            <el-button @click="toggleFooter">
              {{ preferences.footer.enable ? '隐藏' : '显示' }}底栏
            </el-button>
          </div>
        </div>

        <!-- 当前状态卡片 -->
        <div class="full-demo__grid">
          <div class="full-demo__card">
            <div class="full-demo__card-title">
              应用配置
            </div>
            <div class="full-demo__card-content">
              <div>布局: {{ preferences.app.layout }}</div>
              <div>名称: {{ preferences.app.name }}</div>
            </div>
          </div>
          <div class="full-demo__card">
            <div class="full-demo__card-title">
              顶栏
            </div>
            <div class="full-demo__card-content">
              <div>启用: {{ preferences.header.enable }}</div>
              <div>高度: {{ preferences.header.height }}px</div>
            </div>
          </div>
          <div class="full-demo__card">
            <div class="full-demo__card-title">
              侧边栏
            </div>
            <div class="full-demo__card-content">
              <div>折叠: {{ preferences.sidebar.collapsed }}</div>
              <div>宽度: {{ preferences.sidebar.width }}px</div>
            </div>
          </div>
          <div class="full-demo__card">
            <div class="full-demo__card-title">
              标签页
            </div>
            <div class="full-demo__card-content">
              <div>启用: {{ preferences.tabs.enable }}</div>
              <div>样式: {{ preferences.tabs.styleType }}</div>
            </div>
          </div>
          <div class="full-demo__card">
            <div class="full-demo__card-title">
              主题
            </div>
            <div class="full-demo__card-content">
              <div>模式: {{ preferences.theme.mode }}</div>
              <div>暗色: {{ isDark }}</div>
            </div>
          </div>
          <div class="full-demo__card">
            <div class="full-demo__card-title">
              底栏
            </div>
            <div class="full-demo__card-content">
              <div>启用: {{ preferences.footer.enable }}</div>
              <div>固定: {{ preferences.footer.fixed }}</div>
            </div>
          </div>
        </div>
      </div>
    </DocDemoBox>

    <!-- 完整源码 -->
    <div>
      <h2>完整接入代码</h2>
      <p>以下是一个生产级项目接入 Fizz Layout 所需的完整代码，包含入口文件、App 壳、路由和菜单配置。</p>
    </div>

    <!-- Tab 式代码展示 -->
    <el-tabs v-model="activeCodeTab" class="full-demo__code-tabs">
      <el-tab-pane label="App.vue" name="app">
        <DocCodeBlock :code="appVueCode" language="vue" />
      </el-tab-pane>
      <el-tab-pane label="main.ts" name="main">
        <DocCodeBlock :code="mainTsCode" language="typescript" />
      </el-tab-pane>
      <el-tab-pane label="router.ts" name="router">
        <DocCodeBlock :code="routerCode" language="typescript" />
      </el-tab-pane>
      <el-tab-pane label="后端菜单" name="menu">
        <DocCodeBlock :code="menuBackendCode" language="typescript" />
      </el-tab-pane>
    </el-tabs>

    <DocTip type="tip" title="Slot 一览">
      FizzLayout 提供的所有 Slot：<code>breadcrumb</code>、<code>theme-toggle</code>、<code>language-toggle</code>、
      <code>notification</code>、<code>fullscreen</code>、<code>global-search</code>、<code>user-dropdown</code>、
      <code>footer</code>、<code>logo</code>、<code>extra-content</code>。所有 Slot 都是可选的。
    </DocTip>

    <!-- 项目结构 -->
    <div>
      <h2>推荐项目结构</h2>
      <p>一个使用 Fizz Layout 的标准项目目录结构参考：</p>
    </div>

    <DocCodeBlock
      code="src/
├── App.vue                    # FizzLayout 壳 + 所有 Slot
├── main.ts                    # 入口：ElementPlus + i18n + Fizz
├── router/
│   └── index.ts               # 路由配置（含 meta.title/icon/keepAlive）
├── api/
│   └── menu.ts                # 获取后端菜单数据
├── locales/
│   ├── zh-CN.ts               # 中文翻译
│   └── en-US.ts               # 英文翻译
├── views/
│   ├── dashboard/
│   ├── system/
│   │   ├── Users.vue
│   │   ├── Roles.vue
│   │   └── Permissions.vue
│   └── data/
│       ├── Dashboard.vue
│       └── Reports.vue
└── styles/
    └── variables.scss          # SCSS 变量覆盖（可选）"
      language="text"
    />

    <div>
      <h2>关键要点</h2>
    </div>

    <DocTip type="warning" title="注意事项">
      <ul style="margin: 0; padding-left: 1.2em;">
        <li>确保引入 <code>@fizz/layout/theme-chalk</code> 样式和 Element Plus 暗色变量</li>
        <li>使用 <code>createLocaleAdapter(i18n)</code> 桥接 vue-i18n，不要手动同步语言</li>
        <li>路由 <code>meta.title</code> 支持 i18n key（如 <code>'menu.dashboard'</code>），也支持纯文本</li>
        <li>路由 <code>meta.keepAlive</code> 控制页面缓存，配合标签栏 <code>tabs.keepAlive</code> 使用</li>
        <li>所有 Slot 都是可选的，按需使用即可</li>
      </ul>
    </DocTip>
  </DocSection>
</template>

<style lang="scss" scoped>
.full-demo {
  &__section {
    margin-bottom: 1rem;
    padding: 1rem;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 0.5rem;
    background: var(--el-bg-color);
  }

  &__section-title {
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: var(--el-text-color-primary);
  }

  &__buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    margin-top: 1rem;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__card {
    padding: 0.75rem;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 0.5rem;
    background: var(--el-bg-color);
  }

  &__card-title {
    font-weight: 600;
    font-size: 0.8125rem;
    margin-bottom: 0.375rem;
    color: var(--el-text-color-primary);
  }

  &__card-content {
    font-size: 0.8125rem;
    color: var(--el-text-color-secondary);

    > div {
      margin-bottom: 2px;
    }
  }

  &__code-tabs {
    margin-top: 0.5rem;
  }
}
</style>
