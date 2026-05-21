import type { MenuItemType } from '@fizz-layout/components'
import type { ComputedRef, Ref, WatchStopHandle } from 'vue'
import type { RouteMeta, RouteRecordRaw } from 'vue-router'

import { computed, ref, watch } from 'vue'

/**
 * 菜单适配器配置
 */
interface MenuAdapterOptions {
  /**
   * 菜单名称翻译函数
   */
  t?: (key: string) => string
  /**
   * 自定义菜单过滤器
   */
  filter?: (route: RouteRecordRaw) => boolean
  /**
   * 自定义菜单转换器
   */
  transform?: (route: RouteRecordRaw, menu: MenuItemType) => MenuItemType
}

/**
 * 将路由转换为菜单项
 */
function routeToMenu(
  route: RouteRecordRaw,
  parentPath: string = '',
  parents: string[] = [],
  options: MenuAdapterOptions = {},
): MenuItemType | null {
  const { t, filter, transform } = options
  const meta = (route.meta || {}) as RouteMeta

  // 如果设置了隐藏菜单，返回 null
  if (meta.hideInMenu) {
    return null
  }

  // 自定义过滤器
  if (filter && !filter(route)) {
    return null
  }

  // 构建完整路径
  const fullPath = route.path.startsWith('/')
    ? route.path
    : parentPath
      // eslint-disable-next-line e18e/prefer-static-regex
      ? `${parentPath}/${route.path}`.replace(/\/+/g, '/')
      : `/${route.path}`

  // 构建菜单项
  let menu: MenuItemType = {
    name: t ? t(meta.title || route.name as string || '') : (meta.title || route.name as string || ''),
    path: fullPath,
    icon: meta.icon,
    activeIcon: meta.activeIcon,
    parent: parents.at(-1),
    parents: [...parents],
  }

  // 处理子路由
  if (route.children && route.children.length > 0) {
    const children = route.children
      .map(child => routeToMenu(child, fullPath, [...parents, fullPath], options))
      .filter((child): child is MenuItemType => child !== null)
      .sort((a, b) => (a.order || 0) - (b.order || 0))

    if (children.length > 0) {
      menu.children = children
    }
  }

  // 自定义转换器
  if (transform) {
    menu = transform(route, menu)
  }

  return menu
}

/**
 * 将路由数组转换为菜单数组
 */
function routesToMenus(
  routes: RouteRecordRaw[],
  options: MenuAdapterOptions = {},
): MenuItemType[] {
  return routes
    .map(route => routeToMenu(route, '', [], options))
    .filter((menu): menu is MenuItemType => menu !== null)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
}

interface UseMenuAdapterReturn {
  menus: ComputedRef<MenuItemType[]>
  menusRef: Ref<MenuItemType[]>
  generateFromRoutes: (routes: RouteRecordRaw[]) => MenuItemType[]
  setMenus: (menus: MenuItemType[]) => void
  createBinding: (source: ComputedRef<RouteRecordRaw[]> | Ref<RouteRecordRaw[]>) => WatchStopHandle
}

/**
 * 菜单适配器
 * 用于将路由或外部数据转换为布局模块所需的菜单格式
 */
function useMenuAdapter(options: MenuAdapterOptions = {}): UseMenuAdapterReturn {
  const menusRef = ref<MenuItemType[]>([])

  /**
   * 从路由生成菜单
   */
  function generateFromRoutes(routes: RouteRecordRaw[]): MenuItemType[] {
    const menus = routesToMenus(routes, options)
    menusRef.value = menus
    return menus
  }

  /**
   * 直接设置菜单数据
   */
  function setMenus(menus: MenuItemType[]) {
    menusRef.value = menus
  }

  /**
   * 创建响应式菜单绑定
   */
  function createBinding(
    source: ComputedRef<RouteRecordRaw[]> | Ref<RouteRecordRaw[]>,
  ) {
    return watch(
      source,
      (routes) => {
        generateFromRoutes(routes)
      },
      { immediate: true, deep: true },
    )
  }

  /**
   * 菜单的计算属性
   */
  const menus = computed(() => menusRef.value)

  return {
    menus,
    menusRef,
    generateFromRoutes,
    setMenus,
    createBinding,
  }
}

export { useMenuAdapter }
export type { MenuAdapterOptions, RouteMeta, UseMenuAdapterReturn }
