<script setup lang="ts">
import {
  FizzLayout,
  FlAppearance,
  FlBreadcrumb,
  FlCopyright,
  FlFullscreen,
  FlGlobalSearch,
  FlNotification,
  FlTranslation,
  FlUserDropdown,
  usePreferences,
} from '@fizz-layout/core'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import IconLogout from '~icons/carbon/logout'
import IconSettings from '~icons/carbon/settings'
import IconUser from '~icons/carbon/user'
import { useDocMenu } from './composables/useDocMenu'

const router = useRouter()
const route = useRoute()

const { theme, breadcrumb, widget } = usePreferences()

// 文档菜单（从静态结构生成）
const { menus } = useDocMenu()
const currentPath = computed(() => route.path)

function handleMenuSelect(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    window.open(path, '_blank')
  }
  else {
    router.push(path)
  }
}

// ---- 演示数据：通知 ----
const notifications = ref([
  { id: 1, title: 'v2.0 发布', message: 'FizzLayout v2.0 已正式发布', date: '2025-01-15', isRead: false },
  { id: 2, title: '新组件', message: '新增 GlobalSearch 组件', date: '2025-01-10', isRead: true },
])
const messages = ref([
  { id: 1, title: '系统消息', message: '欢迎使用 FizzLayout 文档站', date: '2025-01-12', isRead: false },
])
const todos = ref([
  { id: 1, title: '阅读指南', message: '完成快速开始指南的阅读', date: '2025-01-14', isRead: false },
])

function handleNotificationClick(item: { id: string | number }, type: string) {
  console.warn('[Doc] 通知点击:', type, item.id)
}

function handleNotificationClear(type: string) {
  if (type === 'notification')
    notifications.value = []
  else if (type === 'message')
    messages.value = []
  else if (type === 'todo')
    todos.value = []
}

function handleNotificationAllRead(type: string) {
  const list = type === 'notification' ? notifications : type === 'message' ? messages : todos
  list.value = list.value.map(item => ({ ...item, isRead: true }))
}

// ---- 演示数据：用户下拉 ----
const defaultUserMenus = [
  { key: 'profile', label: '个人中心', icon: IconUser },
  { key: 'settings', label: '账户设置', icon: IconSettings },
  { key: 'logout', label: '退出登录', icon: IconLogout, divided: true },
]

function handleUserMenuClick(key: string) {
  ElMessage.info(`点击菜单: ${key}`)
}

function handleLogout() {
  ElMessage.warning('退出登录')
}

// ---- 全局搜索 ----
function handleSearchSelect(item: { path?: string }) {
  if (item.path) {
    router.push(item.path)
  }
}
</script>

<template>
  <FizzLayout
    :menus="menus"
    :current-path="currentPath"
    @sidebar-menu-select="handleMenuSelect"
    @header-menu-select="handleMenuSelect"
  >
    <!-- 面包屑 -->
    <template #breadcrumb>
      <FlBreadcrumb
        :show-home="breadcrumb.showHome"
        :show-icon="breadcrumb.showIcon"
        :hide-when-only-one="breadcrumb.hideOnlyOne"
        :style-type="breadcrumb.styleType"
      />
    </template>

    <!-- 全局搜索 -->
    <template #global-search>
      <FlGlobalSearch
        :menus="menus"
        :enable-shortcut="true"
        @select="handleSearchSelect"
      />
    </template>

    <!-- 主题切换 -->
    <template #theme-toggle>
      <FlAppearance
        v-if="widget.themeToggle"
        :mode="theme"
        @change="$event => theme = $event"
      />
    </template>

    <!-- 语言切换 -->
    <template #language-toggle="{ locale, toggleLanguage }">
      <FlTranslation
        v-if="widget.languageToggle"
        :locale="locale.name"
        :languages="[
          { label: '简体中文', value: 'zh-CN' },
          { label: 'English', value: 'en-US' },
        ]"
        @change="toggleLanguage"
      />
    </template>

    <!-- 全屏按钮 -->
    <template #fullscreen>
      <FlFullscreen />
    </template>

    <!-- 通知中心 -->
    <template #notification>
      <FlNotification
        :notifications="notifications"
        :messages="messages"
        :todos="todos"
        :dot="true"
        @click="handleNotificationClick"
        @clear="handleNotificationClear"
        @all-read="handleNotificationAllRead"
      />
    </template>

    <!-- 用户下拉菜单 -->
    <template #user-dropdown>
      <FlUserDropdown
        username="User Fizz"
        avatar="https://avatars.githubusercontent.com/u/61108370?v=4&size=64"
        :default-menus="defaultUserMenus"
        @menu-click="handleUserMenuClick"
        @logout="handleLogout"
      />
    </template>

    <!-- 页脚 -->
    <template #footer>
      <FlCopyright
        company-name="FizzLayout"
        company-link="https://github.com/nicepkg/fizz-layout"
      />
    </template>
  </FizzLayout>
</template>
