import type { ExtractPropTypes, PropType } from 'vue'

/**
 * 主题模式类型
 */
export type ThemeModeType = 'light' | 'dark' | 'auto'

export const flAppearanceProps = {
  /**
   * 当前主题模式
   */
  mode: {
    type: String as PropType<ThemeModeType>,
    default: 'auto',
  },
  /**
   * 是否显示 hover 菜单
   */
  shouldOnHover: {
    type: Boolean,
    default: false,
  },
} as const

export type FlAppearanceProps = ExtractPropTypes<typeof flAppearanceProps>
