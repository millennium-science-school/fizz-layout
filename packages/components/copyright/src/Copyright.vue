<script lang="ts" setup>
import { flCopyrightProps } from './copyright'

defineOptions({
  name: 'FlCopyright',
})

const props = defineProps(flCopyrightProps)
</script>

<template>
  <div class="fizz-copyright">
    <!-- Copyright Text -->
    <span>Copyright © {{ props.date }}</span>

    <!-- Company Link -->
    <a
      v-if="props.companyName"
      :href="props.companySiteLink || 'javascript:void(0)'"
      class="fizz-copyright__link"
      target="_blank"
    >
      {{ props.companyName }}
    </a>

    <!-- ICP 备案 -->
    <a
      v-if="props.icp"
      :href="props.icpLink || 'https://beian.miit.gov.cn/'"
      class="fizz-copyright__link"
      target="_blank"
    >
      {{ props.icp }}
    </a>
  </div>
</template>
