<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  /** 提示类型 */
  type?: 'tip' | 'warning' | 'danger'
  /** 提示标题 */
  title?: string
}>(), {
  type: 'tip',
})

const alertType = computed(() => {
  const map: Record<string, 'info' | 'warning' | 'error'> = {
    tip: 'info',
    warning: 'warning',
    danger: 'error',
  }
  return map[props.type]
})
</script>

<template>
  <el-alert
    :type="alertType"
    :title="title || ''"
    :closable="false"
    show-icon
  >
    <template #default>
      <slot />
    </template>
  </el-alert>
</template>
