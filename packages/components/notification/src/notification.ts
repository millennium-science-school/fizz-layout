import type { ExtractPropTypes, PropType } from 'vue'

/**
 * 通知项
 */
export interface NotificationItem {
  /**
   * 唯一标识
   */
  id: string | number
  /**
   * 标题
   */
  title: string
  /**
   * 消息内容
   */
  message: string
  /**
   * 日期
   */
  date: string
  /**
   * 头像
   */
  avatar?: string
  /**
   * 是否已读
   */
  isRead?: boolean
}

export const flNotificationProps = {
  /**
   * 通知列表
   */
  notifications: {
    type: Array as PropType<NotificationItem[]>,
    default: () => [],
  },
  /**
   * 消息列表
   */
  messages: {
    type: Array as PropType<NotificationItem[]>,
    default: () => [],
  },
  /**
   * 待办列表
   */
  todos: {
    type: Array as PropType<NotificationItem[]>,
    default: () => [],
  },
  /**
   * 是否显示徽章
   */
  dot: {
    type: Boolean,
    default: true,
  },
} as const

export type FlNotificationProps = ExtractPropTypes<typeof flNotificationProps>
