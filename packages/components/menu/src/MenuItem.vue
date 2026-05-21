<script lang="ts" setup>
import type { MenuContext, MenuItem } from './menu'

import { FlIcon } from '@fizz-layout/components'
import { ElMenuItem } from 'element-plus'
import { computed, inject } from 'vue'
import { MENU_CONTEXT_KEY } from './constants'

defineOptions({ name: 'FlMenuItem' })

const props = defineProps<{
  item: MenuItem
  itemKey: string
}>()

const menuContext = inject<MenuContext>(MENU_CONTEXT_KEY)

/** 是否激活 */
const isActive = computed(() => {
  return !!props.item.path && menuContext?.activePath.value === props.item.path
})

/** 处理点击 */
function handleClick() {
  if (props.item.path) {
    menuContext?.handleSelect?.(props.item.path)
  }
}
</script>

<template>
  <ElMenuItem
    :index="itemKey"
    :class="{ 'is-active': isActive }"
    :disabled="item.disabled || !item.path"
    class="sub-menu-item"
    @click="handleClick"
  >
    <FlIcon v-if="item.icon" :icon="item.icon" class="fizz-menu-item__icon" />
    <template #title>
      <span class="fizz-menu-item__title">{{ item.name }}</span>
      <span v-if="item.badge" class="fizz-menu-item__badge">{{ item.badge }}</span>
    </template>
  </ElMenuItem>
</template>
