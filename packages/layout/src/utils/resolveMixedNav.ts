import type { MenuItemType } from '@fizz-layout/components'
import { findMenuByPath } from './findMenuByPath'

function getMixedHeaderMenus(menus: MenuItemType[]): MenuItemType[] {
  return menus.map(menu => ({
    ...menu,
    children: undefined,
  }))
}

function getMixedSidebarMenus(menus: MenuItemType[], activeRootPath: string): MenuItemType[] {
  const rootMenu = menus.find(menu => menu.path === activeRootPath)
  return rootMenu?.children ?? []
}

function findRootMenuPath(menus: MenuItemType[], path: string | undefined): string {
  if (!path)
    return ''

  const menu = findMenuByPath(menus, path)
  if (!menu)
    return ''

  if (menu.parents?.[0])
    return menu.parents[0]

  for (const item of menus) {
    if (item.children?.some(child => child.path === path))
      return item.path ?? ''
  }

  return menu.path ?? ''
}

function getFallbackRootPath(menus: MenuItemType[]): string {
  return menus.find(item => item.path)?.path ?? ''
}

function resolveMixedRootPath(menus: MenuItemType[], path?: string): string {
  return findRootMenuPath(menus, path) || getFallbackRootPath(menus)
}

export {
  findRootMenuPath,
  getFallbackRootPath,
  getMixedHeaderMenus,
  getMixedSidebarMenus,
  resolveMixedRootPath,
}
