<script lang="ts" setup>
import type { NotificationItem } from './notification'
import { useLocale } from '@fizz-layout/hooks'
import { ElBadge, ElButton, ElEmpty, ElIcon, ElPopover, ElScrollbar, ElTabPane, ElTabs } from 'element-plus'
import { computed, ref } from 'vue'
import IconNotification from '~icons/carbon/notification'
import { flNotificationProps } from './notification'

defineOptions({
  name: 'FlNotification',
})

const props = defineProps(flNotificationProps)

const emit = defineEmits<{
  click: [item: NotificationItem, type: string]
  clear: [type: string]
  allRead: [type: string]
}>()

const { t } = useLocale()

const activeTab = ref('notification')

const unreadCount = computed(() => {
  const notificationCount = props.notifications.filter(n => !n.isRead).length
  const messageCount = props.messages.filter(n => !n.isRead).length
  const todoCount = props.todos.filter(n => !n.isRead).length
  return notificationCount + messageCount + todoCount
})

function handleClick(item: NotificationItem, type: string) {
  emit('click', item, type)
}

function handleClear(type: string) {
  emit('clear', type)
}

function handleAllRead(type: string) {
  emit('allRead', type)
}
</script>

<template>
  <ElPopover
    placement="bottom"
    :width="360"
    trigger="click"
    :offset="8"
    :popper-options="{
      modifiers: [{ name: 'preventOverflow', options: { padding: 12 } }],
    }"
  >
    <template #reference>
      <ElBadge
        :value="unreadCount"
        :hidden="!dot || unreadCount === 0"
        :offset="[-6, 6]"
        is-dot
      >
        <ElButton circle text>
          <ElIcon>
            <IconNotification />
          </ElIcon>
        </ElButton>
      </ElBadge>
    </template>

    <ElTabs v-model="activeTab" class="fizz-notification-tabs">
      <ElTabPane :label="`${t('fizz.layout.widgets.notification.notifications')}(${notifications.length})`" name="notification">
        <ElScrollbar height="300px">
          <template v-if="notifications.length > 0">
            <div
              v-for="item in notifications"
              :key="item.id"
              class="fizz-notification-item"
              :class="{ 'is-read': item.isRead }"
              @click="handleClick(item, 'notification')"
            >
              <div class="fizz-notification-item__title">
                {{ item.title }}
              </div>
              <div class="fizz-notification-item__message">
                {{ item.message }}
              </div>
              <div class="fizz-notification-item__date">
                {{ item.date }}
              </div>
            </div>
          </template>
          <ElEmpty v-else :description="t('fizz.layout.widgets.notification.noNotifications')" :image-size="60" />
        </ElScrollbar>
        <div class="fizz-notification-footer">
          <ElButton text size="small" @click="handleClear('notification')">
            {{ t('fizz.layout.widgets.notification.clear') }}
          </ElButton>
          <ElButton text size="small" @click="handleAllRead('notification')">
            {{ t('fizz.layout.widgets.notification.markAllRead') }}
          </ElButton>
        </div>
      </ElTabPane>

      <ElTabPane :label="`${t('fizz.layout.widgets.notification.messages')}(${messages.length})`" name="message">
        <ElScrollbar height="300px">
          <template v-if="messages.length > 0">
            <div
              v-for="item in messages"
              :key="item.id"
              class="fizz-notification-item"
              :class="{ 'is-read': item.isRead }"
              @click="handleClick(item, 'message')"
            >
              <div class="fizz-notification-item__title">
                {{ item.title }}
              </div>
              <div class="fizz-notification-item__message">
                {{ item.message }}
              </div>
              <div class="fizz-notification-item__date">
                {{ item.date }}
              </div>
            </div>
          </template>
          <ElEmpty v-else :description="t('fizz.layout.widgets.notification.noMessages')" :image-size="60" />
        </ElScrollbar>
        <div class="fizz-notification-footer">
          <ElButton text size="small" @click="handleClear('message')">
            {{ t('fizz.layout.widgets.notification.clear') }}
          </ElButton>
          <ElButton text size="small" @click="handleAllRead('message')">
            {{ t('fizz.layout.widgets.notification.markAllRead') }}
          </ElButton>
        </div>
      </ElTabPane>

      <ElTabPane :label="`${t('fizz.layout.widgets.notification.todos')}(${todos.length})`" name="todo">
        <ElScrollbar height="300px">
          <template v-if="todos.length > 0">
            <div
              v-for="item in todos"
              :key="item.id"
              class="fizz-notification-item"
              :class="{ 'is-read': item.isRead }"
              @click="handleClick(item, 'todo')"
            >
              <div class="fizz-notification-item__title">
                {{ item.title }}
              </div>
              <div class="fizz-notification-item__message">
                {{ item.message }}
              </div>
              <div class="fizz-notification-item__date">
                {{ item.date }}
              </div>
            </div>
          </template>
          <ElEmpty v-else :description="t('fizz.layout.widgets.notification.noTodos')" :image-size="60" />
        </ElScrollbar>
        <div class="fizz-notification-footer">
          <ElButton text size="small" @click="handleClear('todo')">
            {{ t('fizz.layout.widgets.notification.clear') }}
          </ElButton>
          <ElButton text size="small" @click="handleAllRead('todo')">
            {{ t('fizz.layout.widgets.notification.markAllRead') }}
          </ElButton>
        </div>
      </ElTabPane>
    </ElTabs>
  </ElPopover>
</template>
