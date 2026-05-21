<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTabs } from '../../composables/useTabs'
import { usePreferencesStore } from '../../store/usePreferencesStore'
import { useTabsStore } from '../../store/useTabsStore'
import TabsMore from './TabsMore.vue'
import TabsScreen from './TabsScreen.vue'
import TabsView from './TabsView.vue'
import { useTabsHooks } from './useTabsHooks'

defineOptions({
  name: 'LayoutTabs',
})

defineProps<{ showIcon?: boolean, theme?: string }>()

const route = useRoute()
const tabsStore = useTabsStore()
const { unpinTab } = useTabs()
const {
  tabs,
} = usePreferencesStore()

const {
  createContextMenus,
  currentActive,
  currentTabs,
  handleClick,
  handleClose,
} = useTabsHooks()

const menus = computed(() => {
  const tab = tabsStore.getTabByKey(currentActive.value)
  const menus = createContextMenus(tab)
  return menus.map((item) => {
    return {
      ...item,
      label: item.text,
      value: item.key,
    }
  })
})

// 刷新后如果不保持tab状态，关闭其他tab
if (!tabs.value.persist) {
  tabsStore.closeOtherTabs(route)
}
</script>

<template>
  <TabsView
    :active="currentActive"
    :class="theme"
    :context-menus="createContextMenus"
    :draggable="tabs.draggable"
    :show-icon="showIcon"
    :style-type="tabs.styleType"
    :tabs="currentTabs"
    :wheelable="tabs.wheelable"
    :middle-click-to-close="tabs.middleClickToClose"
    @close="handleClose"
    @sort-tabs="tabsStore.sortTabs"
    @unpin="unpinTab"
    @update:active="handleClick"
  />

  <div class="fizz-tabs__extra">
    <TabsMore v-if="tabs.showMore" :menus="menus" />
    <TabsScreen v-if="tabs.showMaximize" />
  </div>
</template>
