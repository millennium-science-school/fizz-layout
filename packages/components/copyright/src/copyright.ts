import type { ExtractPropTypes } from 'vue'

export const flCopyrightProps = {
  /**
   * 公司名称
   */
  companyName: {
    type: String,
    default: 'inspur',
  },
  /**
   * 公司网站链接
   */
  companySiteLink: {
    type: String,
    default: '',
  },
  /**
   * 年份
   */
  date: {
    type: String,
    default: new Date().getFullYear().toString(),
  },
  /**
   * ICP 备案号
   */
  icp: {
    type: String,
    default: '',
  },
  /**
   * ICP 备案链接
   */
  icpLink: {
    type: String,
    default: '',
  },
} as const

export type FlCopyrightProps = ExtractPropTypes<typeof flCopyrightProps>
