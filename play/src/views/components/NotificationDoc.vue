<script setup lang="ts">
import { FlNotification } from '@fizz-layout/core'
import { ref } from 'vue'
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocEventsTable from '../../components/DocEventsTable.vue'
import DocPropsTable from '../../components/DocPropsTable.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

// ========== 交互 Demo ==========
const notifications = ref([
  { id: 1, title: '系统升级通知', message: '系统将于今晚 22:00 进行维护升级', date: '2025-02-28', isRead: false },
  { id: 2, title: '安全提醒', message: '检测到异常登录行为，请确认是否本人操作', date: '2025-02-27', isRead: false },
  { id: 3, title: '版本发布', message: 'Fizz Layout v1.2.0 已发布，新增多项功能', date: '2025-02-26', isRead: true },
])

const messages = ref([
  { id: 1, title: '张三', message: '请帮忙审核一下需求文档', date: '10 分钟前', isRead: false },
  { id: 2, title: '李四', message: '部署已完成，请验证', date: '30 分钟前', isRead: true },
])

const todos = ref([
  { id: 1, title: 'Bug 修复', message: '修复菜单折叠时图标不显示的问题', date: '截止: 2025-03-01', isRead: false },
  { id: 2, title: '代码审查', message: '审查 PR #128 用户模块重构', date: '截止: 2025-03-02', isRead: false },
])

const lastAction = ref('')

function handleClick(item: any, type: string) {
  lastAction.value = `点击了 [${type}] "${item.title}"`
  item.isRead = true
}

function handleClear(type: string) {
  lastAction.value = `清空了 [${type}] 列表`
  if (type === 'notification')
    notifications.value = []
  else if (type === 'message')
    messages.value = []
  else todos.value = []
}

function handleAllRead(type: string) {
  lastAction.value = `全部已读 [${type}]`
  const list = type === 'notification' ? notifications.value : type === 'message' ? messages.value : todos.value
  list.forEach(item => item.isRead = true)
}

// ========== 代码示例 ==========
const basicCode = `<script setup lang="ts">
import { FlNotification } from '@fizz/layout'
import type { NotificationItem } from '@fizz-layout/components'

const notifications = ref<NotificationItem[]>([
  { id: 1, title: '系统升级', message: '将于今晚维护', date: '2025-02-28', isRead: false },
])

const messages = ref<NotificationItem[]>([])
const todos = ref<NotificationItem[]>([])

function handleClick(item: NotificationItem, type: string) {
  console.log('点击:', type, item)
  item.isRead = true
}

function handleClear(type: string) {
  console.log('清空:', type)
}

function handleAllRead(type: string) {
  console.log('全部已读:', type)
}
<\/script>

<template>
  <FizzLayout ...>
    <template #notification>
      <FlNotification
        :notifications="notifications"
        :messages="messages"
        :todos="todos"
        @click="handleClick"
        @clear="handleClear"
        @all-read="handleAllRead"
      />
    </template>
  </FizzLayout>
</template>`

const typeCode = `interface NotificationItem {
  /** 唯一标识 */
  id: string | number
  /** 标题 */
  title: string
  /** 消息内容 */
  message: string
  /** 日期 */
  date: string
  /** 头像 URL（可选） */
  avatar?: string
  /** 是否已读 */
  isRead?: boolean
}`

// ========== Props / Events ==========
const propsData = [
  { name: 'notifications', type: 'NotificationItem[]', default: '[]', description: '通知列表数据' },
  { name: 'messages', type: 'NotificationItem[]', default: '[]', description: '消息列表数据' },
  { name: 'todos', type: 'NotificationItem[]', default: '[]', description: '待办列表数据' },
  { name: 'dot', type: 'boolean', default: 'true', description: '未读时是否显示红点徽章' },
]

const eventsData = [
  { name: 'click', params: '(item: NotificationItem, type: string)', description: '点击某条通知/消息/待办时触发，type 为 notification / message / todo' },
  { name: 'clear', params: '(type: string)', description: '点击"清空"按钮时触发' },
  { name: 'allRead', params: '(type: string)', description: '点击"全部已读"按钮时触发' },
]
</script>

<template>
  <DocSection title="FlNotification 通知" description="消息通知面板，支持通知、消息和待办三个分类，提供已读、清空等交互">
    <!-- 概览 -->
    <div>
      <h2>概览</h2>
      <p>
        <code>FlNotification</code> 组件以 Popover 弹出面板形式展示三种分类的消息：
        <strong>通知</strong>、<strong>消息</strong> 和 <strong>待办</strong>。
        每个分类独立管理，支持点击、清空和全部已读操作。
        未读消息时在图标旁显示红点提醒。
      </p>
    </div>

    <!-- 交互 Demo -->
    <div>
      <h2>交互演示</h2>
      <p>点击下方的通知铃铛图标体验完整交互：</p>
      <div class="demo-area">
        <FlNotification
          :notifications="notifications"
          :messages="messages"
          :todos="todos"
          @click="handleClick"
          @clear="handleClear"
          @all-read="handleAllRead"
        />
        <span v-if="lastAction" class="demo-action">最后操作：{{ lastAction }}</span>
      </div>
      <DocTip>
        点击通知项可标记为已读，清空和全部已读按钮在每个 Tab 底部。
      </DocTip>
    </div>

    <!-- 基础用法 -->
    <div>
      <h2>基础用法</h2>
      <DocCodeBlock :code="basicCode" language="vue" />
    </div>

    <!-- 类型定义 -->
    <div>
      <h2>类型定义</h2>
      <DocCodeBlock :code="typeCode" language="typescript" />
    </div>

    <!-- Props -->
    <DocPropsTable title="Props" :data="propsData" />

    <!-- Events -->
    <DocEventsTable title="Events" :data="eventsData" />
  </DocSection>
</template>

<style scoped>
.demo-area {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  margin: 12px 0;
}

.demo-action {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  font-family: 'Fira Code', Consolas, monospace;
}
</style>
