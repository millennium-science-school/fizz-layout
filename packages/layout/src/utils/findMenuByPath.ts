import type { MenuItemType } from '@fizz-layout/components'

/**
 * 查找菜单
 * @param list 菜单列表
 * @param path 路径
 */
function findMenuByPath(list: MenuItemType[], path?: string): MenuItemType | null {
  for (const menu of list) {
    if (menu.path === path) {
      return menu
    }
    const findMenu = menu.children && findMenuByPath(menu.children, path)
    if (findMenu) {
      return findMenu
    }
  }
  return null
}

/**
 * 查找根菜单
 * @param menus
 * @param path
 */
function findRootMenuByPath(menus: MenuItemType[], path?: string, level = 0) {
  const findMenu = findMenuByPath(menus, path)
  const rootMenuPath = findMenu?.parents?.[level]
  const rootMenu = rootMenuPath
    ? menus.find(item => item.path === rootMenuPath)
    : undefined
  return {
    findMenu,
    rootMenu,
    rootMenuPath,
  }
}

export { findMenuByPath, findRootMenuByPath }
