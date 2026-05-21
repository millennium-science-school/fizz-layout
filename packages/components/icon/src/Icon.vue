<script lang="ts" setup>
import type { Component } from 'vue'
import { Icon as IconifyIcon } from '@iconify/vue'
import { computed, h, isVNode } from 'vue'
import { flIconProps } from './icon'

defineOptions({
  name: 'FlIcon',
})

const props = defineProps(flIconProps)

/**
 * 解析图标名称
 * - 如果是完整格式 (带冒号), 直接返回
 * - 如果是短格式, 默认添加 carbon: 前缀
 */
const resolvedIcon = computed(() => {
  if (!props.icon || typeof props.icon !== 'string') {
    return null
  }
  // 如果已经包含前缀 (如 carbon:home), 直接使用
  if (props.icon.includes(':')) {
    return props.icon
  }
  // 默认使用 carbon 图标集
  return `carbon:${props.icon}`
})

/**
 * 是否为组件类型的图标
 */
const isComponent = computed(() => {
  if (!props.icon)
    return false
  // Vue 组件或 VNode
  return typeof props.icon === 'object' || typeof props.icon === 'function' || isVNode(props.icon)
})

/**
 * 图标样式
 */
const iconStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.size) {
    const sizeValue = typeof props.size === 'number' ? `${props.size}px` : props.size
    style.width = sizeValue
    style.height = sizeValue
    style.fontSize = sizeValue
  }
  if (props.color) {
    style.color = props.color
  }
  return style
})

/**
 * 渲染组件图标
 */
function renderComponentIcon() {
  if (!props.icon || typeof props.icon === 'string')
    return null
  return h(props.icon as Component, { style: iconStyle.value })
}
</script>

<template>
  <div class="fizz-icon" :style="iconStyle">
    <!-- 字符串图标名 - 使用 Iconify -->
    <IconifyIcon
      v-if="resolvedIcon && !isComponent"
      :icon="resolvedIcon"
    />
    <!-- 组件图标 -->
    <component
      :is="renderComponentIcon"
      v-else-if="isComponent"
    />
  </div>
</template>
