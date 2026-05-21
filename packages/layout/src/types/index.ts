import type { ComputedRef } from 'vue'

// 扩展 vue-router 的 RouteMeta 类型
declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 页面标题（i18n key 或纯文本）
     */
    title?: string
    /**
     * 菜单图标
     */
    icon?: string
    /**
     * 激活时的图标
     */
    activeIcon?: string
    /**
     * 是否固定标签页（不可关闭）
     */
    affixTab?: boolean
    /**
     * 固定标签页排序（数字越小越靠前）
     */
    affixTabOrder?: number
    /**
     * 是否在菜单中隐藏
     */
    hideInMenu?: boolean
    /**
     * 是否在标签页中隐藏
     */
    hideInTab?: boolean
    /**
     * 是否启用 KeepAlive 缓存
     * @default true
     */
    keepAlive?: boolean
    /**
     * KeepAlive sugar，等同于 keepAlive: true
     *
     * @deprecated 使用 keepAlive 替代
     * @default true
     */
    cache?: boolean
    /**
     * 是否为外部链接
     */
    isExternal?: boolean
    /**
     * iframe 地址
     */
    iframeSrc?: string
    /**
     * 同名路由最大打开数量
     */
    maxNumOfOpenTab?: number
    /**
     * 是否使用完整路径作为 tab key
     */
    fullPathKey?: boolean
    /**
     * 自定义标签标题（动态设置）
     */
    newTabTitle?: ComputedRef<string> | string
    /**
     * 自定义标签是否可关闭
     */
    tabClosable?: boolean
    /**
     * 是否在面包屑中隐藏
     */
    hideInBreadcrumb?: boolean
    /**
     * 是否在菜单中隐藏子菜单
     */
    hideChildrenInMenu?: boolean
  }
}

export * from './preferences'
export * from './tabs'
