import type { MenuItemType } from '@fizz-layout/components'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * 文档站菜单数据
 * 从路由结构静态生成，不依赖后端数据
 */
export function useDocMenu() {
  const { t } = useI18n()

  const menus = computed<MenuItemType[]>(() => [
    {
      name: t('app.router.home'),
      path: '/',
      icon: 'carbon:home',
    },
    {
      name: t('app.router.guide'),
      path: '/guide',
      icon: 'carbon:book',
      children: [
        { name: t('app.router.introduction'), path: '/guide/introduction', icon: 'carbon:information' },
        { name: t('app.router.quickStart'), path: '/guide/quick-start', icon: 'carbon:rocket' },
        { name: t('app.router.layoutModes'), path: '/guide/layout-modes', icon: 'carbon:template' },
        { name: t('app.router.menus'), path: '/guide/menus', icon: 'carbon:list' },
        { name: t('app.router.preferences'), path: '/guide/preferences', icon: 'carbon:settings-adjust' },
        { name: t('app.router.tabsGuide'), path: '/guide/tabs', icon: 'carbon:carousel-horizontal' },
        { name: t('app.router.theming'), path: '/guide/theming', icon: 'carbon:paint-brush' },
        { name: t('app.router.i18n'), path: '/guide/i18n', icon: 'carbon:translate' },
      ],
    },
    {
      name: t('app.router.components'),
      path: '/components',
      icon: 'carbon:assembly-cluster',
      children: [
        { name: t('app.router.layoutDoc'), path: '/components/layout', icon: 'carbon:template' },
        { name: t('app.router.breadcrumbDoc'), path: '/components/breadcrumb', icon: 'carbon:chevron-right' },
        { name: t('app.router.globalSearchDoc'), path: '/components/global-search', icon: 'carbon:search' },
        { name: t('app.router.appearanceDoc'), path: '/components/appearance', icon: 'carbon:light' },
        { name: t('app.router.fullscreenDoc'), path: '/components/fullscreen', icon: 'carbon:fit-to-screen' },
        { name: t('app.router.notificationDoc'), path: '/components/notification', icon: 'carbon:notification' },
        { name: t('app.router.translationDoc'), path: '/components/translation', icon: 'carbon:translate' },
        { name: t('app.router.userDropdownDoc'), path: '/components/user-dropdown', icon: 'carbon:user' },
        { name: t('app.router.iconDoc'), path: '/components/icon', icon: 'carbon:catalog' },
        { name: t('app.router.copyrightDoc'), path: '/components/copyright', icon: 'carbon:document' },
      ],
    },
    {
      name: t('app.router.api'),
      path: '/api',
      icon: 'carbon:api',
      children: [
        { name: t('app.router.composables'), path: '/api/composables', icon: 'carbon:function' },
        { name: t('app.router.hooks'), path: '/api/hooks', icon: 'carbon:plug' },
        { name: t('app.router.utilities'), path: '/api/utilities', icon: 'carbon:tools' },
        { name: t('app.router.types'), path: '/api/types', icon: 'carbon:code' },
        { name: t('app.router.store'), path: '/api/store', icon: 'carbon:data-base' },
      ],
    },
    {
      name: t('app.router.examples'),
      path: '/examples',
      icon: 'carbon:demo',
      children: [
        { name: t('app.router.fullDemo'), path: '/examples/full-demo', icon: 'carbon:application-web' },
        { name: t('app.router.minimalDemo'), path: '/examples/minimal', icon: 'carbon:minimize' },
        { name: t('app.router.customThemeDemo'), path: '/examples/custom-theme', icon: 'carbon:color-palette' },
      ],
    },
  ])

  return { menus }
}
