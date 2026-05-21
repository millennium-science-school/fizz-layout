import type { Component, ExtractPropTypes, PropType } from 'vue'

/**
 * 用户下拉菜单项
 */
export interface UserDropdownMenuItem {
  /**
   * 菜单项唯一标识
   */
  key: string
  /**
   * 菜单项显示文本
   */
  label: string
  /**
   * 菜单项图标
   */
  icon?: Component
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否显示分割线
   */
  divided?: boolean
}

export const flUserDropdownProps = {
  /**
   * 用户名
   */
  username: {
    type: String,
    default: '',
  },
  /**
   * 用户头像 URL
   */
  avatar: {
    type: String,
    default: '',
  },
  /**
   * 头像大小
   */
  avatarSize: {
    type: Number,
    default: 24,
  },
  /**
   * 默认下拉菜单项
   */
  defaultMenus: {
    type: Array as PropType<UserDropdownMenuItem[]>,
    default: () => [],
  },
  /**
   * 自定义下拉菜单项
   */
  menus: {
    type: Array as PropType<UserDropdownMenuItem[]>,
    default: () => [],
  },
} as const

export type FlUserDropdownProps = ExtractPropTypes<typeof flUserDropdownProps>
