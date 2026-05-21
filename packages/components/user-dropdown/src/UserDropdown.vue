<script lang="ts" setup>
import type { UserDropdownMenuItem } from './user-dropdown'
import { ElAvatar, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon } from 'element-plus'
import { computed } from 'vue'
import IconUserAvatar from '~icons/carbon/user-avatar-filled'
import { flUserDropdownProps } from './user-dropdown'

defineOptions({
  name: 'FlUserDropdown',
})

const props = defineProps(flUserDropdownProps)

const emit = defineEmits<{
  /**
   * 菜单项点击事件
   */
  menuClick: [key: string, item: UserDropdownMenuItem]
  /**
   * 退出登录事件
   */
  logout: []
}>()

// 合并菜单
const mergedMenus = computed(() => {
  return [...props.defaultMenus, ...props.menus]
})

function handleCommand(key: string) {
  const item = mergedMenus.value.find(m => m.key === key)
  if (!item)
    return

  if (key === 'logout') {
    emit('logout')
  }
  emit('menuClick', key, item)
}
</script>

<template>
  <div class="fizz-user-dropdown">
    <ElDropdown
      trigger="click"
      :popper-options="{
        modifiers: [{ name: 'preventOverflow', options: { padding: 12 } }],
      }"
      @command="handleCommand"
    >
      <div class="fizz-user-dropdown-trigger">
        <ElAvatar
          v-if="avatar"
          :src="avatar"
          :size="avatarSize"
          class="fizz-user-dropdown-avatar"
        />
        <ElAvatar v-else :size="avatarSize" class="fizz-user-dropdown-avatar default-avatar">
          <ElIcon :size="avatarSize - 8">
            <IconUserAvatar />
          </ElIcon>
        </ElAvatar>
        <span v-if="username" class="fizz-user-dropdown-name">{{ username }}</span>
      </div>

      <template #dropdown>
        <ElDropdownMenu class="fizz-user-dropdown-menu">
          <ElDropdownItem
            v-for="menu in mergedMenus"
            :key="menu.key"
            :command="menu.key"
            :disabled="menu.disabled"
            :divided="menu.divided"
          >
            <ElIcon v-if="menu.icon" class="fizz-user-dropdown-menu-icon">
              <component :is="menu.icon" />
            </ElIcon>
            {{ menu.label }}
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </div>
</template>
