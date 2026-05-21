import type { MenuItemType } from '@fizz-layout/components'
import type { Component, ExtractPropTypes, PropType } from 'vue'

export const layoutProps = {
  /**
   * 菜单数据（用于头部/侧边菜单）
   */
  menus: {
    type: Array as PropType<MenuItemType[]>,
    default: () => [],
  },
  /**
   * 头部菜单数据（不传则复用 menus）
   */
  headerMenus: {
    type: Array as PropType<MenuItemType[]>,
    default: undefined,
  },
  /**
   * 侧边菜单数据（不传则复用 menus）
   */
  sidebarMenus: {
    type: Array as PropType<MenuItemType[]>,
    default: undefined,
  },
  /**
   * 菜单主题（不传则使用偏好计算）
   */
  menuTheme: {
    type: String as PropType<'dark' | 'light'>,
    default: undefined,
  },
  /**
   * 当前激活的菜单路径
   */
  currentPath: {
    type: String,
    default: '',
  },
  /**
   * 自定义头部菜单组件
   */
  headerMenuComponent: {
    type: Object as PropType<Component>,
    default: undefined,
  },
  /**
   * 自定义侧边菜单组件
   */
  sidebarMenuComponent: {
    type: Object as PropType<Component>,
    default: undefined,
  },
} as const

export type FizzLayoutProps = ExtractPropTypes<typeof layoutProps>
