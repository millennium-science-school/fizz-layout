<script lang="ts" setup>
import type { ContextMenuItem } from '../../types'

import { computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  visible: boolean
  x: number
  y: number
  menus: ContextMenuItem[]
}>()

const emit = defineEmits<{
  close: []
  select: [ContextMenuItem]
}>()

function onSelect(item: ContextMenuItem) {
  if (item.separator || item.disabled)
    return
  emit('select', item)
  emit('close')
}

function handlePointerDownOutside() {
  if (props.visible) {
    emit('close')
  }
}

const contextMenuStyle = computed(() => {
  return {
    top: `${props.y}px`,
    left: `${props.x}px`,
  }
})

onMounted(() => {
  window.addEventListener('pointerdown', handlePointerDownOutside)
})

onUnmounted(() => {
  window.removeEventListener('pointerdown', handlePointerDownOutside)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      :style="contextMenuStyle"
      class="fizz-context-menu"
      @contextmenu.prevent
      @pointerdown.stop
    >
      <div v-for="item in menus" :key="item.key">
        <div v-if="item.separator" class="fizz-context-menu__separator" />
        <button
          v-else
          class="fizz-context-menu__item"
          :class="{ 'is-disabled': item.disabled }"
          :disabled="item.disabled"
          type="button"
          @click.stop="onSelect(item)"
        >
          <span v-if="item.icon" class="fizz-context-menu__icon">
            <component :is="item.icon" />
          </span>
          <span class="fizz-context-menu__text">{{ item.text }}</span>
          <span v-if="item.shortcut" class="fizz-context-menu__shortcut">{{ item.shortcut }}</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>
