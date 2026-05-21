import type { Component } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'
import type { TabsStyleType } from './preferences'

interface TabDefinition extends RouteLocationNormalized {
  /**
   * 标签页的key
   */
  key?: string
}

interface TabsEmits {
  'close': [string]
  'sortTabs': [number, number]
  'unpin': [TabDefinition]
  'update:active': [string]
}

interface ContextMenuItem {
  disabled?: boolean
  handler?: (data: any) => void
  icon?: Component
  inset?: boolean
  key: string
  separator?: boolean
  shortcut?: string
  text: string
}

interface TabsProps {
  active?: string
  contentClass?: string
  contextMenus?: (data: TabDefinition) => ContextMenuItem[]
  draggable?: boolean
  gap?: number
  maxWidth?: number
  middleClickToClose?: boolean
  minWidth?: number
  showIcon?: boolean
  styleType?: TabsStyleType
  tabs?: TabDefinition[]
  wheelable?: boolean
}

interface TabConfig extends TabDefinition {
  affixTab: boolean
  closable: boolean
  icon?: string
  key: string
  title: string
}

interface IContextMenuItem {
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 点击事件处理
   * @param data
   */
  handler?: (data: any) => void
  /**
   * 图标
   */
  icon?: Component
  /**
   * 是否显示图标
   */
  inset?: boolean
  /**
   * 唯一标识
   */
  key: string
  /**
   * 是否是分割线
   */
  separator?: boolean
  /**
   * 快捷键
   */
  shortcut?: string
  /**
   * 标题
   */
  text: string
}

export type {
  ContextMenuItem,
  IContextMenuItem,
  TabConfig,
  TabDefinition,
  TabsEmits,
  TabsProps,
}
