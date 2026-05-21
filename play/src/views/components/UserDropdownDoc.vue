<script setup lang="ts">
import { FlUserDropdown } from '@fizz-layout/core'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import IconLogout from '~icons/carbon/logout'
import IconSettings from '~icons/carbon/settings'
import IconUser from '~icons/carbon/user'
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocEventsTable from '../../components/DocEventsTable.vue'
import DocPropsTable from '../../components/DocPropsTable.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

// ========== 交互 Demo ==========
const lastAction = ref('')

// 默认菜单项配置
const defaultMenus = [
  { key: 'profile', label: '个人中心', icon: IconUser },
  { key: 'settings', label: '账户设置', icon: IconSettings },
  { key: 'logout', label: '退出登录', icon: IconLogout, divided: true },
]

function handleMenuClick(key: string) {
  lastAction.value = `菜单点击：${key}`
  ElMessage.info(`点击菜单: ${key}`)
}

function handleLogout() {
  lastAction.value = '退出登录'
  ElMessage.warning('退出登录')
}

// ========== 代码示例 ==========
const basicCode = `<script setup lang="ts">
import { FlUserDropdown } from '@fizz/layout'
import IconLogout from '~icons/carbon/logout'
import IconSettings from '~icons/carbon/settings'
import IconUser from '~icons/carbon/user'

// 默认菜单项（由外部配置，支持 i18n）
const defaultMenus = [
  { key: 'profile', label: '个人中心', icon: IconUser },
  { key: 'settings', label: '账户设置', icon: IconSettings },
  { key: 'logout', label: '退出登录', icon: IconLogout, divided: true },
]

function handleMenuClick(key: string) {
  console.log('菜单点击:', key)
}

function handleLogout() {
  console.log('退出登录')
}
<\/script>

<template>
  <FizzLayout ...>
    <template #user-dropdown>
      <FlUserDropdown
        username="Admin"
        avatar="https://i.pravatar.cc/150"
        :default-menus="defaultMenus"
        @menu-click="handleMenuClick"
        @logout="handleLogout"
      />
    </template>
  </FizzLayout>
</template>`

const customMenuCode = `<script setup lang="ts">
import type { UserDropdownMenuItem } from '@fizz-layout/components'
import IconDocument from '~icons/carbon/document'
import IconHelp from '~icons/carbon/help'
import IconLogout from '~icons/carbon/logout'
import IconSettings from '~icons/carbon/settings'
import IconUser from '~icons/carbon/user'

// 默认菜单
const defaultMenus = [
  { key: 'profile', label: '个人中心', icon: IconUser },
  { key: 'settings', label: '账户设置', icon: IconSettings },
  { key: 'logout', label: '退出登录', icon: IconLogout, divided: true },
]

// 自定义菜单
const customMenus: UserDropdownMenuItem[] = [
  { key: 'docs', label: '帮助文档', icon: IconDocument },
  { key: 'feedback', label: '问题反馈', icon: IconHelp },
]
<\/script>

<template>
  <FlUserDropdown
    username="Admin"
    :default-menus="defaultMenus"
    :menus="customMenus"
    @menu-click="handleMenuClick"
    @logout="handleLogout"
  />
</template>`

const typeCode = `interface UserDropdownMenuItem {
  /** 菜单项唯一标识 */
  key: string
  /** 菜单项显示文本 */
  label: string
  /** 菜单项图标（Vue 组件） */
  icon?: Component
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示分割线 */
  divided?: boolean
}`

// ========== Props / Events ==========
const propsData = [
  { name: 'username', type: 'string', default: '\'\'', description: '用户名，显示在头像旁边' },
  { name: 'avatar', type: 'string', default: '\'\'', description: '头像图片 URL，为空时显示默认图标' },
  { name: 'avatarSize', type: 'number', default: '24', description: '头像大小（px）' },
  { name: 'defaultMenus', type: 'UserDropdownMenuItem[]', default: '[]', description: '默认下拉菜单项（建议传入带 i18n key 的文本）' },
  { name: 'menus', type: 'UserDropdownMenuItem[]', default: '[]', description: '自定义下拉菜单项（排在默认菜单之后）' },
]

const eventsData = [
  { name: 'menuClick', params: '(key: string, item: UserDropdownMenuItem)', description: '下拉菜单项被点击时触发' },
  { name: 'logout', params: '()', description: '点击"退出登录"菜单项时触发' },
]
</script>

<template>
  <DocSection title="FlUserDropdown 用户菜单" description="用户信息展示与下拉操作菜单，支持自定义菜单项">
    <!-- 概览 -->
    <div>
      <h2>概览</h2>
      <p>
        <code>FlUserDropdown</code> 展示用户头像和名称，点击后弹出下拉操作菜单。
        默认菜单项由外部通过 <code>defaultMenus</code> prop 传入，支持 i18n 国际化。
        也支持通过 <code>menus</code> prop 传入自定义菜单项。
      </p>
    </div>

    <!-- 交互 Demo -->
    <div>
      <h2>交互演示</h2>
      <p>点击下方的用户头像查看下拉菜单：</p>
      <div class="demo-area">
        <FlUserDropdown
          username="文档演示用户"
          :default-menus="defaultMenus"
          @menu-click="handleMenuClick"
          @logout="handleLogout"
        />
        <span v-if="lastAction" class="demo-action">{{ lastAction }}</span>
      </div>
    </div>

    <!-- 基础用法 -->
    <div>
      <h2>基础用法</h2>
      <DocCodeBlock :code="basicCode" language="vue" />
    </div>

    <!-- 自定义菜单 -->
    <div>
      <h2>自定义菜单项</h2>
      <p>通过 <code>menus</code> 传入额外菜单项，自定义菜单项排在默认菜单之后：</p>
      <DocCodeBlock :code="customMenuCode" language="vue" />
      <DocTip type="tip">
        <code>defaultMenus</code> 和 <code>menus</code> 会合并显示，默认菜单在前，自定义菜单在后。
        组件本身不包含任何硬编码的中文文本，所有菜单项均由外部传入。
      </DocTip>
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
