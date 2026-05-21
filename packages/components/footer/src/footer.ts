import type { ExtractPropTypes, PropType } from 'vue'

export const flFooterProps = {
  /**
   * 是否固定在底部
   */
  fixed: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
} as const

export type FlFooterProps = ExtractPropTypes<typeof flFooterProps>
