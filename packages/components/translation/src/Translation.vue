<script lang="ts" setup>
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon } from 'element-plus'
import IconTranslate from '~icons/carbon/translate'
import { flTranslationProps } from './translation'

defineOptions({
  name: 'FlTranslation',
})

const props = defineProps(flTranslationProps)

const emit = defineEmits<{
  change: [locale: string]
}>()

// 获取当前语言的 label
function getCurrentLabel() {
  const current = props.languages.find(l => l.value === props.locale)
  return current?.label || props.locale
}

function handleSelect(locale: string) {
  emit('change', locale)
}
</script>

<template>
  <div class="fizz-translation">
    <ElDropdown trigger="click" @command="handleSelect">
      <div class="fizz-translation-trigger">
        <ElIcon class="fizz-translation-trigger__icon">
          <IconTranslate />
        </ElIcon>
        <span class="fizz-translation-trigger__text">{{ getCurrentLabel() }}</span>
      </div>
      <template #dropdown>
        <ElDropdownMenu class="fizz-translation-menu">
          <ElDropdownItem
            v-for="lang in languages"
            :key="lang.value"
            :command="lang.value"
            :class="{ 'is-active': locale === lang.value }"
          >
            {{ lang.label }}
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </div>
</template>
