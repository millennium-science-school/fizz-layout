import { describe, expect, it } from 'vitest'
import { findRootMenuPath, getMixedHeaderMenus, getMixedSidebarMenus, resolveMixedRootPath } from './resolveMixedNav'

const menus = [
  {
    name: 'System',
    path: '/system',
    children: [
      { name: 'Users', path: '/system/users', parents: ['/system'] },
      { name: 'Roles', path: '/system/roles', parents: ['/system'] },
    ],
  },
  {
    name: 'Reports',
    path: '/reports',
    children: [
      { name: 'Daily', path: '/reports/daily', parents: ['/reports'] },
    ],
  },
]

describe('resolveMixedNav', () => {
  it('removes children from header menus', () => {
    expect(getMixedHeaderMenus(menus)).toEqual([
      { name: 'System', path: '/system', children: undefined },
      { name: 'Reports', path: '/reports', children: undefined },
    ])
  })

  it('finds the root path for a child route', () => {
    expect(findRootMenuPath(menus, '/system/users')).toBe('/system')
  })

  it('falls back to the first menu path when current path does not match', () => {
    expect(resolveMixedRootPath(menus, '/missing')).toBe('/system')
  })

  it('returns children for the active root path', () => {
    expect(getMixedSidebarMenus(menus, '/reports')).toEqual([
      { name: 'Daily', path: '/reports/daily', parents: ['/reports'] },
    ])
  })
})
