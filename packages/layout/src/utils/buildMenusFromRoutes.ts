import type { MenuItemType, MenuStructItem } from '@fizz-layout/components'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 扁平化路由列表，建立 name -> route 的映射
 */
function flattenRoutes(routes: RouteRecordRaw[], parentPath = ''): Map<string, RouteRecordRaw & { fullPath: string }> {
  const map = new Map<string, RouteRecordRaw & { fullPath: string }>()

  for (const route of routes) {
    // 计算完整路径
    let fullPath = route.path
    if (!fullPath.startsWith('/') && !fullPath.startsWith('http')) {
      fullPath = parentPath ? `${parentPath}/${route.path}` : `/${route.path}`
    }

    if (route.name) {
      map.set(route.name as string, { ...route, fullPath })
    }

    if (route.children) {
      const childMap = flattenRoutes(route.children, fullPath)
      childMap.forEach((v, k) => map.set(k, v))
    }
  }

  return map
}

/**
 * 根据后端菜单树和路由列表构建完整菜单
 * @param backendMenus 后端返回的菜单树（仅 code + children）
 * @param routes 前端路由列表
 * @param t i18n 翻译函数
 * @param parentPath 父级路径（用于构建 parents 数组）
 */
function createMenus(
  backendMenus: MenuStructItem[],
  routes: RouteRecordRaw[],
  t?: (key: string) => string,
  parentPath?: string,
): MenuItemType[] {
  const routeMap = flattenRoutes(routes)
  return buildMenusRecursive(backendMenus, routeMap, t ?? (key => key), parentPath)
}

function buildMenusRecursive(
  backendMenus: MenuStructItem[],
  routeMap: Map<string, RouteRecordRaw & { fullPath: string }>,
  t: (key: string) => string,
  parentPath?: string,
  parents: string[] = [],
): MenuItemType[] {
  const result: MenuItemType[] = []

  for (const item of backendMenus) {
    const route = routeMap.get(item.code)

    if (!route) {
      console.warn(`[createMenus] Route not found for code: ${item.code}`)
      continue
    }

    const meta = route.meta || {}
    const path = route.fullPath

    // 构建菜单项
    const menuItem: MenuItemType = {
      name: t(meta.title as string || `app.router.${item.code}`),
      path,
      icon: meta.icon as string,
      activeIcon: meta.activeIcon as string,
      parent: parentPath,
      parents: parents.length > 0 ? [...parents] : undefined,
      show: meta.hideInMenu !== true,
    }

    // 递归处理子菜单
    if (item.children && item.children.length > 0) {
      menuItem.children = buildMenusRecursive(
        item.children,
        routeMap,
        t,
        path,
        [...parents, path],
      )
    }

    result.push(menuItem)
  }

  return result
}

export { createMenus }
