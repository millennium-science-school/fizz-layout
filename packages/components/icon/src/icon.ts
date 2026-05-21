import type { Component, ExtractPropTypes, PropType } from 'vue'

export const flIconProps = {
  /**
   * 图标名称或组件
   * - 字符串: carbon 图标名, 如 'home', 'settings', 'user'
   * - 也可以使用完整前缀格式: 'carbon:home'
   * - Vue 组件: 直接传入图标组件
   */
  icon: {
    type: [String, Object, Function] as PropType<string | Component>,
    default: undefined,
  },
  /**
   * 图标大小 (CSS class 或具体值)
   */
  size: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
  /**
   * 图标颜色
   */
  color: {
    type: String,
    default: undefined,
  },
} as const

export type FlIconProps = ExtractPropTypes<typeof flIconProps>
