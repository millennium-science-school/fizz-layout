<script lang="ts" setup>
import { flFooterProps } from './footer'

defineOptions({
  name: 'FlFooter',
})

defineProps(flFooterProps)
</script>

<template>
  <div
    class="fizz-footer"
    :class="{ 'fizz-footer--fixed': fixed }"
  >
    <slot />
  </div>
</template>
