<script setup lang="ts">
import type { ContextMenuItem, TabConfig, TabsProps } from '../../types'
import { Icon as IconifyIcon } from '@iconify/vue'
import { computed, reactive, shallowRef } from 'vue'
import TabContextMenu from './TabContextMenu.vue'

defineOptions({
  name: 'FizzTabItem',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TabsProps>(), {
  contentClass: 'fizz-tabs-content',
  contextMenus: () => [],
  gap: 8,
  tabs: () => [],
})

const emit = defineEmits<{
  close: [string]
  unpin: [TabConfig]
}>()
const active = defineModel<string>('active')

const menuState = reactive({
  visible: false,
  x: 0,
  y: 0,
  items: [] as ContextMenuItem[],
})
const tabPayload = shallowRef<TabConfig | null>(null)

// const prefix = computed(() => {
//   return props.styleType === 'chrome' ? 'fizz-tabs-chrome' : 'fizz-tabs-default'
// })
const prefix = 'fizz-tabs-chrome'

const style = computed(() => {
  const { gap } = props
  return {
    '--gap': `${gap}px`,
  }
})

const tabsView = computed(() => {
  return props.tabs.map((tab) => {
    const { fullPath, meta, name, path, key } = tab || {}
    const { affixTab, icon, newTabTitle, tabClosable, title } = meta || {}
    return {
      affixTab: !!affixTab,
      closable: tabClosable ?? true,
      fullPath,
      icon,
      key,
      meta,
      name,
      path,
      title: newTabTitle || title || name,
    } as TabConfig
  })
})

function onMouseDown(e: MouseEvent, tab: TabConfig) {
  if (
    e.button === 1
    && tab.closable
    && !tab.affixTab
    && tabsView.value.length > 1
    && props.middleClickToClose
  ) {
    e.preventDefault()
    e.stopPropagation()
    emit('close', tab.key)
  }
}

function openContextMenu(event: MouseEvent, tab: TabConfig) {
  if (!props.contextMenus)
    return
  const menus = props.contextMenus(tab) || []
  if (!menus.length)
    return

  event.preventDefault()
  menuState.visible = true
  menuState.x = event.clientX
  menuState.y = event.clientY
  menuState.items = menus
  tabPayload.value = tab
}

function closeContextMenu() {
  menuState.visible = false
}

function handleMenuSelect(item: ContextMenuItem) {
  item.handler?.(tabPayload.value)
}
</script>

<template>
  <div
    :class="[contentClass, prefix]"
    :style="style"
  >
    <TransitionGroup name="slide-left">
      <div
        v-for="(tab, i) in tabsView"
        :key="tab.key"
        :class="[
          `${prefix}__item`,
          {
            'is-active': tab.key === active,
            'draggable': !tab.affixTab,
            'affix-tab': tab.affixTab,
          },
        ]"
        :data-active-tab="active"
        :data-index="i"
        data-tab-item="true"
        :draggable="draggable && !tab.affixTab"
        @click="active = tab.key"
        @contextmenu.prevent="openContextMenu($event, tab)"
        @mousedown="onMouseDown($event, tab)"
      >
        <div :class="`${prefix}__item-inner`">
          <div
            v-if="i !== 0 && tab.key !== active"
            :class="`${prefix}__divider`"
          />
          <div :class="`${prefix}__background`">
            <div :class="`${prefix}__background-content`" />
            <svg
              :class="`${prefix}__background-before`"
              height="8"
              width="8"
            >
              <path d="M 0 8 A 8 8 0 0 0 8 0 L 8 8 Z" />
            </svg>
            <svg
              :class="`${prefix}__background-after`"
              height="8"
              width="8"
            >
              <path d="M 0 0 A 8 8 0 0 0 8 8 L 0 8 Z" />
            </svg>
          </div>

          <div :class="`${prefix}__extra`">
            <IconifyIcon
              v-show="!tab.affixTab && tabsView.length > 1 && tab.closable"
              :class="`${prefix}__close-icon`"
              icon="carbon:close"
              @click.stop="() => emit('close', tab.key)"
            />
            <IconifyIcon
              v-show="tab.affixTab && tabsView.length > 1 && tab.closable"
              :class="`${prefix}__pin-icon`"
              icon="carbon:pin"
              @click.stop="() => emit('unpin', tab)"
            />
          </div>

          <div
            :class="[`${prefix}__item-main`, { 'has-close': tab.closable }]"
          >
            <IconifyIcon
              v-if="showIcon && tab.icon"
              :class="`${prefix}__item-icon`"
              :icon="tab.icon"
            />

            <span :class="`${prefix}__item-title`">
              {{ tab.title }}
            </span>
          </div>
        </div>
      </div>
    </TransitionGroup>

    <TabContextMenu
      :menus="menuState.items"
      :visible="menuState.visible"
      :x="menuState.x"
      :y="menuState.y"
      @close="closeContextMenu"
      @select="handleMenuSelect"
    />
  </div>
</template>
