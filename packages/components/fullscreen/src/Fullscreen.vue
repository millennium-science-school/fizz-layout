<script lang="ts" setup>
import { useLocale } from '@fizz-layout/hooks'
import { useFullscreen } from '@vueuse/core'
import { ElButton, ElIcon, ElTooltip } from 'element-plus'
import IconCenterToFit from '~icons/carbon/center-to-fit'
import IconFitToScreen from '~icons/carbon/fit-to-screen'

defineOptions({
  name: 'FlFullscreen',
})

const { isFullscreen, toggle } = useFullscreen()
const { t } = useLocale()
</script>

<template>
  <ElTooltip :content="isFullscreen ? t('fizz.layout.widgets.fullscreen.exit') : t('fizz.layout.widgets.fullscreen.enter')" placement="bottom">
    <ElButton
      circle
      text
      @click="toggle"
    >
      <ElIcon>
        <IconCenterToFit v-if="isFullscreen" />
        <IconFitToScreen v-else />
      </ElIcon>
    </ElButton>
  </ElTooltip>
</template>
