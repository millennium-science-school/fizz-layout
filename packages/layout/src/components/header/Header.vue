<script lang="ts" setup>
import { useLocale } from '@fizz-layout/hooks'
import { Icon } from '@iconify/vue'
import { ElButton, ElIcon, ElTooltip } from 'element-plus'
import { computed, useSlots } from 'vue'
import { useRefresh } from '../../composables/useRefresh'
import { usePreferencesStore } from '../../store/usePreferencesStore'

interface Props {
  /**
   * Logo 主题
   */
  theme?: string
  /**
   * 是否在顶栏显示偏好设置按钮
   */
  showPreferencesButton?: boolean
}

defineOptions({
  name: 'LayoutHeader',
})

withDefaults(defineProps<Props>(), {
  theme: 'light',
  showPreferencesButton: false,
})

const emit = defineEmits<{ clearPreferencesAndLogout: [] }>()

const { t } = useLocale()

const REFERENCE_VALUE = 50

const {
  header,
  widget,
} = usePreferencesStore()
const slots = useSlots()
const { refresh } = useRefresh()

const rightSlots = computed(() => {
  const list = [{ index: REFERENCE_VALUE + 100, name: 'user-dropdown' }]

  if (widget.value.globalSearch) {
    list.push({
      index: REFERENCE_VALUE,
      name: 'global-search',
    })
  }

  // 注：偏好设置按钮的显示由 showPreferencesButton prop 控制
  // 不使用 widget 配置，因为它有自己的位置逻辑

  if (widget.value.themeToggle) {
    list.push({
      index: REFERENCE_VALUE + 20,
      name: 'theme-toggle',
    })
  }

  if (widget.value.languageToggle) {
    list.push({
      index: REFERENCE_VALUE + 30,
      name: 'language-toggle',
    })
  }

  if (widget.value.fullscreen) {
    list.push({
      index: REFERENCE_VALUE + 50,
      name: 'fullscreen',
    })
  }

  if (widget.value.notification) {
    list.push({
      index: REFERENCE_VALUE + 60,
      name: 'notification',
    })
  }

  // 自定义插槽支持
  Object.keys(slots).forEach((key) => {
    const name = key.split('-')
    if (key.startsWith('header-right')) {
      list.push({ index: Number(name[2]), name: key })
    }
  })

  return list.toSorted((a, b) => a.index - b.index)
})

const leftSlots = computed<{ index: number, name: string }[]>(() => {
  const list: Array<{ index: number, name: string }> = []

  if (widget.value.refresh) {
    list.push({
      index: 0,
      name: 'refresh',
    })
  }

  // 自定义插槽支持
  Object.keys(slots).forEach((key) => {
    const name = key.split('-')
    if (key.startsWith('header-left')) {
      list.push({ index: Number(name[2]), name: key })
    }
  })

  return list.toSorted((a, b) => a.index - b.index)
})

function clearPreferencesAndLogout() {
  emit('clearPreferencesAndLogout')
}

// 暴露方法供外部调用
defineExpose({
  clearPreferencesAndLogout,
})
</script>

<template>
  <!-- 左侧区域 - 参考值之前的 slot -->
  <template
    v-for="slot in leftSlots.filter((item) => item.index < REFERENCE_VALUE)"
    :key="slot.name"
  >
    <slot :name="slot.name">
      <template v-if="slot.name === 'refresh'">
        <ElTooltip :content="t('fizz.layout.header.refresh')" placement="bottom">
          <ElButton
            class="fizz-header__refresh-btn"
            circle
            text
            @click="refresh"
          >
            <ElIcon class="fizz-header__refresh-icon">
              <Icon icon="carbon:rotate-360" />
            </ElIcon>
          </ElButton>
        </ElTooltip>
      </template>
    </slot>
  </template>

  <!-- 面包屑区域 -->
  <div class="fizz-header__breadcrumb">
    <slot name="breadcrumb" />
  </div>

  <!-- 左侧区域 - 参考值之后的 slot -->
  <template
    v-for="slot in leftSlots.filter((item) => item.index > REFERENCE_VALUE)"
    :key="slot.name"
  >
    <slot :name="slot.name" />
  </template>

  <!-- 中间菜单区域 -->
  <div
    class="fizz-header__menu"
    :data-align="header.menuAlign"
  >
    <slot name="menu" />
  </div>

  <!-- 右侧区域 -->
  <div class="fizz-header__right">
    <template v-for="slot in rightSlots" :key="slot.name">
      <slot :name="slot.name">
        <!-- 内置组件的默认渲染（通过 slot 可覆盖） -->
        <!-- 全局搜索、主题切换、语言切换、全屏、通知等组件由外部通过 slot 提供 -->
        <!-- 这里只定义插槽位置，实际组件由使用者提供 -->
      </slot>
    </template>
  </div>
</template>
