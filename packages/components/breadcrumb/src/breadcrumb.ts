import type { ExtractPropTypes, PropType } from 'vue'

/**
 * 面包屑样式类型
 */
export type BreadcrumbStyleType = 'normal' | 'background'

/**
 * 面包屑项
 */
export interface BreadcrumbItem {
  /**
   * 路径
   */
  path: string
  /**
   * 标题
   */
  title?: string
  /**
   * 图标
   */
  icon?: string
  /**
   * 是否为首页
   */
  isHome?: boolean
}

export const flBreadcrumbProps = {
  /**
   * 是否只有一个时隐藏
   */
  hideWhenOnlyOne: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否显示首页
   */
  showHome: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否显示图标
   */
  showIcon: {
    type: Boolean,
    default: true,
  },
  /**
   * 样式类型
   */
  styleType: {
    type: String as PropType<BreadcrumbStyleType>,
    default: 'normal',
  },
  /**
   * 国际化翻译函数
   */
  t: {
    type: Function as PropType<(key: string) => string>,
    default: (key: string) => key,
  },
} as const

export type FlBreadcrumbProps = ExtractPropTypes<typeof flBreadcrumbProps>
