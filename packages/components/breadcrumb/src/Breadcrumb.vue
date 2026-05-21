<script lang="ts" setup>
import type { BreadcrumbItem } from './breadcrumb'
import { FlIcon } from '@fizz-layout/components'
import { useLocale } from '@fizz-layout/hooks'
import { ElBreadcrumb, ElBreadcrumbItem, ElIcon } from 'element-plus'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import IconHome from '~icons/carbon/home'
import { flBreadcrumbProps } from './breadcrumb'

defineOptions({
  name: 'FlBreadcrumb',
})

const props = defineProps(flBreadcrumbProps)

const route = useRoute()
const router = useRouter()
const { t } = useLocale()

const breadcrumbs = computed((): BreadcrumbItem[] => {
  const matched = route.matched

  const resultBreadcrumb: BreadcrumbItem[] = []

  for (const match of matched) {
    const { meta, path } = match
    const { hideChildrenInMenu, hideInBreadcrumb, icon, title } = meta || {}
    if (hideInBreadcrumb || hideChildrenInMenu || !path) {
      continue
    }

    resultBreadcrumb.push({
      icon,
      path,
      title: title ? t(title) : '',
    })
  }

  if (props.showHome) {
    resultBreadcrumb.unshift({
      icon: 'home',
      isHome: true,
      path: '/',
    })
  }

  if (props.hideWhenOnlyOne && resultBreadcrumb.length === 1) {
    return []
  }

  return resultBreadcrumb
})

function handleClick(path: string) {
  router.push(path)
}
</script>

<template>
  <ElBreadcrumb
    v-if="breadcrumbs.length > 0"
    class="fizz-breadcrumb"
    :class="[
      `fizz-breadcrumb--${styleType}`,
    ]"
    separator="/"
  >
    <ElBreadcrumbItem
      v-for="(item, index) in breadcrumbs"
      :key="item.path"
      class="fizz-breadcrumb__item"
    >
      <span
        class="fizz-breadcrumb__item-content"
        :class="{ 'is-link': index < breadcrumbs.length - 1 }"
        @click="index < breadcrumbs.length - 1 ? handleClick(item.path) : undefined"
      >
        <!-- 首页图标 -->
        <ElIcon v-if="showIcon && item.isHome" class="fizz-breadcrumb__icon">
          <IconHome />
        </ElIcon>

        <!-- 其他菜单图标 -->
        <FlIcon v-else-if="showIcon && item.icon" :icon="item.icon" class="fizz-breadcrumb__icon" />
        <span v-if="!item.isHome">{{ item.title }}</span>
      </span>
    </ElBreadcrumbItem>
  </ElBreadcrumb>
</template>
