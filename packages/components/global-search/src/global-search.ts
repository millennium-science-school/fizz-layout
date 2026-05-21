import type { Component, ExtractPropTypes, PropType } from 'vue'

/**
 * 搜索菜单项
 */
export interface SearchMenuItem {
  /**
   * 菜单名称
   */
  name?: string
  /**
   * 菜单路径
   */
  path?: string
  /**
   * 图标
   */
  icon?: string | Component
  /**
   * 子菜单
   */
  children?: SearchMenuItem[]
}

export const flGlobalSearchProps = {
  /**
   * 菜单数据
   */
  menus: {
    type: Array as PropType<SearchMenuItem[]>,
    default: () => [],
  },
  /**
   * 是否启用快捷键
   */
  enableShortcutKey: {
    type: Boolean,
    default: true,
  },
  /**
   * 快捷键提示
   */
  shortcutKeyHint: {
    type: String,
    default: 'Ctrl+K',
  },
  /**
   * 国际化翻译函数 (用于菜单项)
   */
  menuTranslate: {
    type: Function as PropType<(key: string) => string>,
    default: (key: string) => key,
  },
} as const

export type FlGlobalSearchProps = ExtractPropTypes<typeof flGlobalSearchProps>
