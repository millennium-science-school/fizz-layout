import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'

/**
 * 文档站路由配置
 *
 * 路由结构与文档菜单一一对应：
 * /                    → 首页
 * /guide/*             → 指南
 * /components/*        → 组件文档
 * /api/*               → API 参考
 * /examples/*          → 完整示例
 */
const routes: RouteRecordRaw[] = [
  // ========== 首页 ==========
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue'),
    meta: {
      title: 'app.router.home',
      icon: 'carbon:home',
      affixTab: true,
      affixTabOrder: 0,
      tabClosable: false,
    },
  },

  // ========== 指南 ==========
  {
    path: '/guide',
    name: 'Guide',
    redirect: '/guide/introduction',
    meta: { title: 'app.router.guide', icon: 'carbon:book' },
    children: [
      {
        path: 'introduction',
        name: 'Introduction',
        component: () => import('../views/guide/Introduction.vue'),
        meta: { title: 'app.router.introduction', icon: 'carbon:information' },
      },
      {
        path: 'quick-start',
        name: 'QuickStart',
        component: () => import('../views/guide/QuickStart.vue'),
        meta: { title: 'app.router.quickStart', icon: 'carbon:rocket' },
      },
      {
        path: 'layout-modes',
        name: 'LayoutModes',
        component: () => import('../views/guide/LayoutModes.vue'),
        meta: { title: 'app.router.layoutModes', icon: 'carbon:template' },
      },
      {
        path: 'menus',
        name: 'MenusGuide',
        component: () => import('../views/guide/Menus.vue'),
        meta: { title: 'app.router.menus', icon: 'carbon:list' },
      },
      {
        path: 'preferences',
        name: 'Preferences',
        component: () => import('../views/guide/Preferences.vue'),
        meta: { title: 'app.router.preferences', icon: 'carbon:settings-adjust' },
      },
      {
        path: 'tabs',
        name: 'TabsGuide',
        component: () => import('../views/guide/Tabs.vue'),
        meta: { title: 'app.router.tabsGuide', icon: 'carbon:carousel-horizontal' },
      },
      {
        path: 'theming',
        name: 'Theming',
        component: () => import('../views/guide/Theming.vue'),
        meta: { title: 'app.router.theming', icon: 'carbon:paint-brush' },
      },
      {
        path: 'i18n',
        name: 'I18n',
        component: () => import('../views/guide/I18n.vue'),
        meta: { title: 'app.router.i18n', icon: 'carbon:translate' },
      },
    ],
  },

  // ========== 组件文档 ==========
  {
    path: '/components',
    name: 'Components',
    redirect: '/components/layout',
    meta: { title: 'app.router.components', icon: 'carbon:assembly-cluster' },
    children: [
      {
        path: 'layout',
        name: 'LayoutDoc',
        component: () => import('../views/components/LayoutDoc.vue'),
        meta: { title: 'app.router.layoutDoc', icon: 'carbon:template' },
      },
      {
        path: 'breadcrumb',
        name: 'BreadcrumbDoc',
        component: () => import('../views/components/BreadcrumbDoc.vue'),
        meta: { title: 'app.router.breadcrumbDoc', icon: 'carbon:chevron-right' },
      },
      {
        path: 'global-search',
        name: 'GlobalSearchDoc',
        component: () => import('../views/components/GlobalSearchDoc.vue'),
        meta: { title: 'app.router.globalSearchDoc', icon: 'carbon:search' },
      },
      {
        path: 'appearance',
        name: 'AppearanceDoc',
        component: () => import('../views/components/AppearanceDoc.vue'),
        meta: { title: 'app.router.appearanceDoc', icon: 'carbon:light' },
      },
      {
        path: 'fullscreen',
        name: 'FullscreenDoc',
        component: () => import('../views/components/FullscreenDoc.vue'),
        meta: { title: 'app.router.fullscreenDoc', icon: 'carbon:fit-to-screen' },
      },
      {
        path: 'notification',
        name: 'NotificationDoc',
        component: () => import('../views/components/NotificationDoc.vue'),
        meta: { title: 'app.router.notificationDoc', icon: 'carbon:notification' },
      },
      {
        path: 'translation',
        name: 'TranslationDoc',
        component: () => import('../views/components/TranslationDoc.vue'),
        meta: { title: 'app.router.translationDoc', icon: 'carbon:translate' },
      },
      {
        path: 'user-dropdown',
        name: 'UserDropdownDoc',
        component: () => import('../views/components/UserDropdownDoc.vue'),
        meta: { title: 'app.router.userDropdownDoc', icon: 'carbon:user' },
      },
      {
        path: 'icon',
        name: 'IconDoc',
        component: () => import('../views/components/IconDoc.vue'),
        meta: { title: 'app.router.iconDoc', icon: 'carbon:catalog' },
      },
      {
        path: 'copyright',
        name: 'CopyrightDoc',
        component: () => import('../views/components/CopyrightDoc.vue'),
        meta: { title: 'app.router.copyrightDoc', icon: 'carbon:document' },
      },
    ],
  },

  // ========== API 参考 ==========
  {
    path: '/api',
    name: 'Api',
    redirect: '/api/composables',
    meta: { title: 'app.router.api', icon: 'carbon:api' },
    children: [
      {
        path: 'composables',
        name: 'ApiComposables',
        component: () => import('../views/api/Composables.vue'),
        meta: { title: 'app.router.composables', icon: 'carbon:function' },
      },
      {
        path: 'hooks',
        name: 'ApiHooks',
        component: () => import('../views/api/Hooks.vue'),
        meta: { title: 'app.router.hooks', icon: 'carbon:plug' },
      },
      {
        path: 'utilities',
        name: 'ApiUtilities',
        component: () => import('../views/api/Utilities.vue'),
        meta: { title: 'app.router.utilities', icon: 'carbon:tools' },
      },
      {
        path: 'types',
        name: 'ApiTypes',
        component: () => import('../views/api/Types.vue'),
        meta: { title: 'app.router.types', icon: 'carbon:code' },
      },
      {
        path: 'store',
        name: 'ApiStore',
        component: () => import('../views/api/Store.vue'),
        meta: { title: 'app.router.store', icon: 'carbon:data-base' },
      },
    ],
  },

  // ========== 完整示例 ==========
  {
    path: '/examples',
    name: 'Examples',
    redirect: '/examples/full-demo',
    meta: { title: 'app.router.examples', icon: 'carbon:demo' },
    children: [
      {
        path: 'full-demo',
        name: 'FullDemo',
        component: () => import('../views/examples/FullDemo.vue'),
        meta: { title: 'app.router.fullDemo', icon: 'carbon:application-web' },
      },
      {
        path: 'minimal',
        name: 'MinimalDemo',
        component: () => import('../views/examples/MinimalDemo.vue'),
        meta: { title: 'app.router.minimalDemo', icon: 'carbon:minimize' },
      },
      {
        path: 'custom-theme',
        name: 'CustomThemeDemo',
        component: () => import('../views/examples/CustomThemeDemo.vue'),
        meta: { title: 'app.router.customThemeDemo', icon: 'carbon:color-palette' },
      },
    ],
  },

  // ========== 404 ==========
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: 'app.router.notFound', hideInMenu: true },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export { router, routes }
