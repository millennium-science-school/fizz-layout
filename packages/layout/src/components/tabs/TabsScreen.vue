<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core'
import IconCenterToFit from '~icons/carbon/center-to-fit'
import IconFitToScreen from '~icons/carbon/fit-to-screen'

const { isFullscreen, toggle } = useFullscreen()
</script>

<template>
  <div
    class="fizz-tabs-screen__btn"
    @click="toggle"
  >
    <IconCenterToFit v-if="isFullscreen" class="fizz-tabs-screen__icon" />
    <IconFitToScreen v-else class="fizz-tabs-screen__icon" />
  </div>
</template>
