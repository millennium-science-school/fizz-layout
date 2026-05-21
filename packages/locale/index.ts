export { default as enUS } from './lang/en-US'
export { default as zhCN } from './lang/zh-CN'

export interface TranslatePair {
  [key: string]: string | string[] | TranslatePair
}

export interface Language {
  name: string
  fizz: TranslatePair
}
