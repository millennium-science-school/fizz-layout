<script lang="ts" setup>
import type { ThemeModeType } from './appearance'
import { useLocale } from '@fizz-layout/hooks'
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon, ElTooltip } from 'element-plus'
import { computed } from 'vue'
import IconMoon from '~icons/carbon/moon'
import IconScreenOff from '~icons/carbon/screen-off'
import IconSun from '~icons/carbon/sun'
import { flAppearanceProps } from './appearance'

defineOptions({
  name: 'FlAppearance',
})

const props = defineProps(flAppearanceProps)

const emit = defineEmits<{
  change: [mode: ThemeModeType]
}>()

const { t } = useLocale()

const themeIcon = computed(() => {
  switch (props.mode) {
    case 'dark':
      return IconMoon
    case 'light':
      return IconSun
    default:
      return IconScreenOff
  }
})

const themeOptions = computed(() => [
  { icon: IconSun, label: t('fizz.layout.widgets.appearance.light'), value: 'light' as ThemeModeType },
  { icon: IconMoon, label: t('fizz.layout.widgets.appearance.dark'), value: 'dark' as ThemeModeType },
  { icon: IconScreenOff, label: t('fizz.layout.widgets.appearance.system'), value: 'auto' as ThemeModeType },
])

function handleToggle() {
  const nextMode: ThemeModeType = props.mode === 'light' ? 'dark' : 'light'
  emit('change', nextMode)
}

function handleSelect(nextMode: ThemeModeType) {
  emit('change', nextMode)
}
</script>

<template>
  <template v-if="shouldOnHover">
    <ElDropdown trigger="hover" @command="handleSelect">
      <ElButton circle text>
        <ElIcon class="fizz-appearance__icon">
          <component :is="themeIcon" />
        </ElIcon>
      </ElButton>

      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem
            v-for="option in themeOptions"
            :key="option.value"
            :command="option.value"
          >
            <ElIcon class="fizz-appearance__menu-icon">
              <component :is="option.icon" />
            </ElIcon>
            {{ option.label }}
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </template>

  <template v-else>
    <ElTooltip
      :content="mode === 'dark' ? t('fizz.layout.widgets.appearance.switchToLight') : t('fizz.layout.widgets.appearance.switchToDark')"
      placement="bottom"
    >
      <ElButton
        circle
        text
        @click="handleToggle"
      >
        <ElIcon class="fizz-appearance__icon">
          <component :is="themeIcon" />
        </ElIcon>
      </ElButton>
    </ElTooltip>
  </template>
</template>
