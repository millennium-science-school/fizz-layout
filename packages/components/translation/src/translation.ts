import type { ExtractPropTypes, PropType } from 'vue'

export interface LanguageItem {
  /**
   * 语言显示名称
   */
  label: string
  /**
   * 语言代码
   */
  value: string
}

export const flTranslationProps = {
  /**
   * 当前语言
   */
  locale: {
    type: String,
    default: 'en-US',
  },
  /**
   * 支持的语言列表
   */
  languages: {
    type: Array as PropType<LanguageItem[]>,
    default: () => [
      { label: 'English', value: 'en-US' },
    ],
  },
} as const

export type FlTranslationProps = ExtractPropTypes<typeof flTranslationProps>
