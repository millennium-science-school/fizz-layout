<script setup lang="ts">
import type { TabsEmits, TabsProps } from '../../types'
import { computed, ref, useAttrs } from 'vue'
import TabItem from './TabItem.vue'
import { useTabsDrag } from './useTabsDrag'
import { useTabsViewScroll } from './useTabsViewScroll'

defineOptions({
  name: 'TabsView',
})

const props = withDefaults(defineProps<TabsProps>(), {
  contentClass: 'fizz-tabs-content',
  draggable: true,
  styleType: 'chrome',
  wheelable: true,
})

const emit = defineEmits<TabsEmits>()
const attrs = useAttrs()

const scrollContainerRef = ref<HTMLElement | null>(null)

const {
  handleScroll,
  handleWheel,
  scrollDirection,
  scrollIsAtLeft,
  scrollIsAtRight,
  showScrollButton,
} = useTabsViewScroll(props, scrollContainerRef)

const passThroughProps = computed(() => ({
  ...attrs,
  ...props,
}))

function onWheel(e: WheelEvent) {
  if (!props.wheelable)
    return
  handleWheel(e)
  e.stopPropagation()
  e.preventDefault()
}

useTabsDrag(props, emit as any, () => {
  return (
    scrollContainerRef.value?.querySelector(`.${props.contentClass}`)
    || scrollContainerRef.value
  )
})
</script>

<template>
  <div class="fizz-tabs-view">
    <div
      v-show="showScrollButton"
      :class="{
        'is-disabled': scrollIsAtLeft,
      }"
      class="fizz-tabs-view__scroll-btn fizz-tabs-view__scroll-btn--left"
      @click="scrollDirection('left')"
    >
      <svg
        class="fizz-tabs-view__icon"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path d="M15 18 9 12l6-6" />
      </svg>
    </div>

    <div
      :class="{
        'fizz-tabs-view__container--chrome': styleType === 'chrome',
      }"
      class="fizz-tabs-view__container"
    >
      <div
        ref="scrollContainerRef"
        class="fizz-tabs-view__scroll-container"
        @scroll="handleScroll"
        @wheel="onWheel"
      >
        <TabItem
          v-bind="passThroughProps"
          @close="emit('close', $event)"
          @unpin="emit('unpin', $event)"
          @update:active="emit('update:active', $event!)"
        />
      </div>
    </div>

    <div
      v-show="showScrollButton"
      :class="{
        'is-disabled': scrollIsAtRight,
      }"
      class="fizz-tabs-view__scroll-btn fizz-tabs-view__scroll-btn--right"
      @click="scrollDirection('right')"
    >
      <svg
        class="fizz-tabs-view__icon"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </div>
  </div>
</template>
