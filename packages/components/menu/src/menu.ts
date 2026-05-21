import type { Component, ComputedRef, ExtractPropTypes, PropType, Ref } from 'vue'

/**
 * 菜单模式
 * - horizontal: 水平菜单（用于顶部导航）
 * - vertical: 垂直菜单（用于侧边导航）
 */
export type MenuMode = 'horizontal' | 'vertical'

/**
 * 徽标类型
 */
export type BadgeType = 'dot' | 'normal'

/**
 * 徽标变体
 */
export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'destructive'

/**
 * 菜单项徽标配置
 */
export interface MenuBadge {
  /**
   * 徽标内容
   */
  badge?: string
  /**
   * 徽标类型
   */
  badgeType?: BadgeType
  /**
   * 徽标变体
   */
  badgeVariants?: BadgeVariant | string
}

/**
 * 菜单项数据
 */
export interface MenuItem extends MenuBadge {
  /**
   * 菜单路径（唯一标识）
   */
  path: string
  /**
   * 菜单名称
   */
  name: string
  /**
   * 图标
   */
  icon?: Component | string
  /**
   * 激活时的图标
   */
  activeIcon?: string
  /**
   * 子菜单
   */
  children?: MenuItem[]
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否显示
   */
  show?: boolean
  /**
   * 排序号
   */
  order?: number
  /**
   * 父级路径
   */
  parent?: string
  /**
   * 所有父级路径
   */
  parents?: string[]
}

/**
 * 后端菜单结构项
 */
export interface MenuStructItem {
  code: string
  children?: undefined | MenuStructItem[]
}

/**
 * 部分偏好设置类型
 * 由于解决循环依赖或者降低耦合等原因，菜单组件可能无法直接依赖完整的偏好设置类型，因此定义一个简化版本
 */
export interface AnyPreferencesStore {
  layoutMode: Ref<{ isMixedNav: boolean, isHeaderMixedNav: boolean }>
  navigation: Ref<{ split: boolean }>
  sidebar: Ref<{ enable: boolean, autoActivateChild: boolean, expandOnHover?: boolean }>
  [key: string]: any
}

export const flMenuProps = {
  /**
   * 菜单数据
   */
  menus: {
    type: Array as PropType<MenuItem[]>,
    default: () => [],
  },
  /**
   * 菜单模式
   * - horizontal: 水平菜单（用于顶部导航）
   * - vertical: 垂直菜单（用于侧边导航）
   */
  mode: {
    type: String as PropType<MenuMode>,
    default: 'vertical',
  },
  /**
   * 是否折叠（仅 vertical 模式有效）
   */
  collapse: {
    type: Boolean,
    default: false,
  },
  /**
   * 折叠时是否显示标题
   */
  collapseShowTitle: {
    type: Boolean,
    default: false,
  },
  /**
   * 默认激活的菜单路径
   */
  defaultActive: {
    type: String,
    default: '',
  },
  /**
   * 默认展开的子菜单路径数组
   */
  defaultOpeneds: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  /**
   * 是否开启手风琴模式（同时只展开一个子菜单）
   */
  accordion: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否使用圆角风格
   */
  rounded: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否自动滚动到激活菜单项
   */
  scrollToActive: {
    type: Boolean,
    default: false,
  },
} as const

/**
 * 菜单上下文（provide/inject）
 */
export interface MenuContext {
  props: FlMenuProps
  activePath: Ref<string>
  openedMenus: Ref<string[]>
  isPopup: ComputedRef<boolean>
  openMenu: (path: string) => void
  closeMenu: (path: string) => void
  handleSelect: (path: string) => void
}

export type FlMenuProps = ExtractPropTypes<typeof flMenuProps>
