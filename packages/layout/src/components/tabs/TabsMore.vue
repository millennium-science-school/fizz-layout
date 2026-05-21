<script lang="ts" setup>
import type { Component } from 'vue'

import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus'
import IconChevronDown from '~icons/carbon/list-boxes'

defineProps<{
  menus: {
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
     * 标题
     */
    label: string
    /**
     * 是否是分割线
     */
    separator?: boolean
    /**
     * 唯一标识
     */
    value: string
  }[]
}>()
</script>

<template>
  <ElDropdown
    class="fizz-tabs-more"
    popper-class="fizz-tabs-more__popper"
    :popper-options="{
      modifiers: [{ name: 'preventOverflow', options: { padding: 12 } }],
    }"
  >
    <div class="fizz-tabs-more__btn">
      <IconChevronDown class="fizz-tabs-more__icon" />
    </div>

    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem
          v-for="menu in menus"
          :key="menu.value"
          :disabled="menu.disabled"
          :divided="menu.separator"
          @click="menu.handler && menu.handler(menu)"
        >
          <i v-if="menu.icon" class="fizz-tabs-more__item-icon">
            <component :is="menu.icon" class="fizz-tabs-more__item-icon-svg" />
          </i>
          {{ menu.label }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
