<script lang="ts" setup>
import type { MenuContext, MenuItem } from './menu'

import { FlIcon } from '@fizz-layout/components'
import { ElSubMenu } from 'element-plus'
import { computed, inject } from 'vue'
import { MENU_CONTEXT_KEY } from './constants'
import MenuItemComp from './MenuItem.vue'

defineOptions({ name: 'FlSubMenu' })

const props = defineProps<{
  item: MenuItem
}>()

const menuContext = inject<MenuContext>(MENU_CONTEXT_KEY)

/** 是否展开 */
const isOpened = computed(() => {
  return menuContext?.openedMenus.value.includes(props.item.path) ?? false
})

/** 是否有激活的子项 */
const hasActiveChild = computed(() => {
  const activePath = menuContext?.activePath.value ?? ''
  return isChildActive(props.item.children || [], activePath)
})

/** 递归检查子项是否激活 */
function isChildActive(children: MenuItem[], activePath: string): boolean {
  for (const child of children) {
    if (child.path === activePath)
      return true
    if (child.children?.length && isChildActive(child.children, activePath))
      return true
  }
  return false
}

/** 可见的子菜单 */
const visibleChildren = computed(() => {
  return (props.item.children || []).filter(child => child.show !== false)
})
</script>

<template>
  <ElSubMenu
    :index="item.path"
    :class="{ 'is-opened': isOpened, 'has-active-child': hasActiveChild }"
    popper-class="fizz-menu-popper fizz-menu-popper--rounded"
  >
    <template #title>
      <FlIcon v-if="item.icon" :icon="item.icon" class="fizz-menu-item__icon" />
      <span class="fizz-menu-item__title">{{ item.name }}</span>
      <span v-if="item.badge" class="fizz-menu-item__badge">{{ item.badge }}</span>
    </template>

    <template v-for="child in visibleChildren" :key="child.path">
      <FlSubMenu v-if="child.children?.length" :item="child" />
      <MenuItemComp v-else :key="child.path" :item="child" />
    </template>
  </ElSubMenu>
</template>
