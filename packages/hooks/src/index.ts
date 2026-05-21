// 国际化适配器和语言切换
export { createLocaleAdapter, setupFizzLocale, useLocale } from './useLocale'
export type { Language, TranslatePair } from './useLocale'

// Logo 点击处理器
export { useLogoClick } from './useLogoClick'
export type { LogoClickHandler } from './useLogoClick'

// 菜单适配器 - 将路由转换为菜单结构
export { useMenuAdapter } from './useMenuAdapter'
export type { MenuAdapterOptions, UseMenuAdapterReturn } from './useMenuAdapter'

// 菜单点击处理器
export { useMenuClick } from './useMenuClick'
export type { MenuClickHandler } from './useMenuClick'
