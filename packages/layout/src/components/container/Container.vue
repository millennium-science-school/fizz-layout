<script lang="ts" setup>
import type { VNode } from 'vue'
import type {
  RouteLocationNormalizedLoaded,
  RouteLocationNormalizedLoadedGeneric,
} from 'vue-router'
import { computed, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { usePreferencesStore } from '../../store/usePreferencesStore'
import { getTabKey, useTabsStore } from '../../store/useTabsStore'

defineOptions({ name: 'LayoutContent' })

const preferences = usePreferencesStore()
const route = useRoute()

const tabsStore = useTabsStore()

const keepAlive = computed(
  () => preferences.tabs.value.enable && preferences.tabs.value.keepAlive,
)

const { getCachedTabs, getExcludeCachedTabs, renderRouteView, addTab } = tabsStore

/**
 * 监听路由变化，自动添加到 tabs
 * 这确保了标签页和 KeepAlive 的 include 列表能正确更新
 */
watch(
  // 同时监听 fullPath 和 matched，确保路由完全解析后触发
  () => [route.fullPath, route.matched] as const,
  ([, matched]) => {
    // 确保路由已完全解析（matched 有内容）
    if (!matched || matched.length === 0) {
      return
    }
    // 只要启用了 tabs 就添加
    if (preferences.tabs.value.enable) {
      const meta = matched.at(-1)?.meta
      addTab({
        ...route,
        meta: meta || route.meta,
      })
    }
  },
  { immediate: true },
)

/**
 * 是否使用动画
 */
const getEnabledTransition = computed(() => {
  const { transition } = preferences
  const transitionName = transition.value.name
  return transitionName && transition.value.enable
})

// 页面切换动画
function getTransitionName(_route: RouteLocationNormalizedLoaded) {
  // 如果偏好设置未设置，则不使用动画
  const { tabs, transition } = preferences
  const transitionName = transition.value.name
  if (!transitionName || !transition.value.enable) {
    return
  }

  // 标签页未启用或者未开启缓存，则使用全局配置动画
  if (!tabs.value.enable || !keepAlive.value) {
    return transitionName
  }

  // 如果页面已经加载过，则不使用动画
  // if (route.meta.loaded) {
  //   return;
  // }
  // 已经打开且已经加载过的页面不使用动画
  // const inTabs = getCachedTabs.value.includes(route.name as string);

  // return inTabs && route.meta.loaded ? undefined : transitionName;
  return transitionName
}

/**
 * 转换组件，自动添加 name
 * @param component
 */
function transformComponent(
  component: VNode,
  route: RouteLocationNormalizedLoadedGeneric,
) {
  // 组件视图未找到，如果有设置后备视图，则返回后备视图，如果没有，则抛出错误
  if (!component) {
    if (route.path !== '/')
      console.warn('Component view not found, please check the route configuration: ', route.path)
    return undefined
  }

  const routeName = route.name as string
  // 如果组件没有 name，则直接返回
  if (!routeName) {
    return component
  }
  const componentName = (component?.type as any)?.name

  // 已经设置过 name，则直接返回
  if (componentName) {
    return component
  }

  // componentName 与 routeName 一致，则直接返回
  if (componentName === routeName) {
    return component
  }

  // 设置 name
  component.type ||= {};
  (component.type as any).name = routeName

  return component
}
</script>

<template>
  <div class="fizz-container">
    <RouterView v-slot="{ Component, route: currentRoute }">
      <Transition
        v-if="getEnabledTransition"
        :name="getTransitionName(currentRoute)"
        appear
        mode="out-in"
      >
        <KeepAlive
          v-if="keepAlive"
          :exclude="getExcludeCachedTabs"
          :include="getCachedTabs"
        >
          <component
            :is="transformComponent(Component, currentRoute)"
            v-if="renderRouteView"
            v-show="!currentRoute.meta.iframeSrc"
            :key="getTabKey(currentRoute)"
          />
        </KeepAlive>
        <component
          :is="Component"
          v-else-if="renderRouteView"
          :key="getTabKey(currentRoute)"
        />
      </Transition>

      <template v-else>
        <KeepAlive
          v-if="keepAlive"
          :exclude="getExcludeCachedTabs"
          :include="getCachedTabs"
        >
          <component
            :is="transformComponent(Component, currentRoute)"
            v-if="renderRouteView"
            v-show="!currentRoute.meta.iframeSrc"
            :key="getTabKey(currentRoute)"
          />
        </KeepAlive>
        <component
          :is="Component"
          v-else-if="renderRouteView"
          :key="getTabKey(currentRoute)"
        />
      </template>
    </RouterView>
  </div>
</template>
