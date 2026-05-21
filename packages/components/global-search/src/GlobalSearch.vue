<script lang="ts" setup>
import type { SearchMenuItem } from './global-search'
import { useLocale } from '@fizz-layout/hooks'
import { ElDialog, ElEmpty, ElIcon, ElInput, ElScrollbar } from 'element-plus'
import { computed, ref, useTemplateRef, watch } from 'vue'
import IconSearch from '~icons/carbon/search'
import { flGlobalSearchProps } from './global-search'

defineOptions({
  name: 'FlGlobalSearch',
})

const props = defineProps(flGlobalSearchProps)

const emit = defineEmits<{
  select: [item: SearchMenuItem]
}>()

const { t } = useLocale()

const visible = ref(false)
const keyword = ref('')
const searchRef = useTemplateRef<InstanceType<typeof ElInput>>('searchRef')

// 扁平化菜单
function flattenMenus(menus: SearchMenuItem[]): SearchMenuItem[] {
  const result: SearchMenuItem[] = []
  const stack = [...menus]

  while (stack.length > 0) {
    const item = stack.pop()!
    if (item.path) {
      result.push(item)
    }
    if (item.children && item.children.length > 0) {
      stack.push(...item.children)
    }
  }

  return result
}

const flatMenus = computed(() => flattenMenus(props.menus))

const filteredMenus = computed(() => {
  if (!keyword.value) {
    return flatMenus.value.slice(0, 10)
  }

  const lowerKeyword = keyword.value.toLowerCase()
  return flatMenus.value.filter((item) => {
    const title = props.menuTranslate(item.name || '').toLowerCase()
    const path = (item.path || '').toLowerCase()
    return title.includes(lowerKeyword) || path.includes(lowerKeyword)
  }).slice(0, 20)
})

function open() {
  visible.value = true
  keyword.value = ''
}

function close() {
  visible.value = false
}

function handleSelect(item: SearchMenuItem) {
  emit('select', item)
  close()
}

// 快捷键支持
function handleKeydown(e: KeyboardEvent) {
  if (props.enableShortcutKey && (e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    open()
  }
}

// 监听快捷键
watch(() => props.enableShortcutKey, (enabled) => {
  if (enabled) {
    window.addEventListener('keydown', handleKeydown)
  }
  else {
    window.removeEventListener('keydown', handleKeydown)
  }
}, { immediate: true })

defineExpose({
  open,
  close,
})
</script>

<template>
  <div class="fizz-global-search">
    <!-- 椭圆型搜索触发按钮 -->
    <div class="fizz-search-trigger" @click="open">
      <ElIcon class="fizz-search-trigger__icon">
        <IconSearch />
      </ElIcon>
      <span class="fizz-search-trigger__text">{{ t('fizz.layout.widgets.globalSearch.title') }}</span>
      <kbd class="fizz-search-trigger__shortcut">{{ shortcutKeyHint }}</kbd>
    </div>

    <ElDialog
      v-model="visible"
      :show-close="false"
      width="600px"
      top="10vh"
      class="fizz-global-search-dialog"
      @opened="searchRef?.focus()"
    >
      <ElInput
        ref="searchRef"
        v-model="keyword"
        :placeholder="t('fizz.layout.widgets.globalSearch.placeholder')"
        size="large"
        clearable
      >
        <template #prefix>
          <ElIcon>
            <IconSearch />
          </ElIcon>
        </template>
      </ElInput>

      <ElScrollbar height="400px" class="fizz-global-search-results">
        <template v-if="filteredMenus.length > 0">
          <div
            v-for="item in filteredMenus"
            :key="item.path"
            class="fizz-search-item"
            @click="handleSelect(item)"
          >
            <span class="fizz-search-item__title">{{ menuTranslate(item.name || '') }}</span>
            <span class="fizz-search-item__path">{{ item.path }}</span>
          </div>
        </template>
        <ElEmpty v-else :description="t('fizz.layout.widgets.globalSearch.noResults')" :image-size="80" />
      </ElScrollbar>
    </ElDialog>
  </div>
</template>
