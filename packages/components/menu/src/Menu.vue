<script lang="ts" setup>
import type { MenuContext, MenuItem } from './menu'

import { ElMenu } from 'element-plus'
import { computed, nextTick, onMounted, provide, ref, useTemplateRef, watch } from 'vue'

import { MENU_CONTEXT_KEY } from './constants'
import { flMenuProps } from './menu'
import MenuItemComp from './MenuItem.vue'
import SubMenu from './SubMenu.vue'

defineOptions({ name: 'FizzMenu' })

const props = defineProps(flMenuProps)

const emit = defineEmits<{
  /** 菜单项选中事件 */
  select: [path: string, mode?: string]
  /** 子菜单展开事件 */
  open: [path: string, openedPaths: string[]]
  /** 子菜单关闭事件 */
  close: [path: string, openedPaths: string[]]
}>()

const menuRef = useTemplateRef('menuRef')

/** 当前激活的菜单路径 */
const activePath = ref(props.defaultActive || '')

/** 当前展开的子菜单路径数组 */
const openedMenus = ref<string[]>(props.defaultOpeneds || [])

/** 是否为弹出模式（水平菜单或折叠的垂直菜单） */
const isPopup = computed(() => {
  return props.mode === 'horizontal' || (props.mode === 'vertical' && props.collapse)
})

/** 菜单容器类名 */
const menuClass = computed(() => {
  const classes = ['fizz-menu']
  classes.push(`fizz-menu--${props.mode}`)
  if (props.rounded)
    classes.push('fizz-menu--rounded')
  if (props.collapse)
    classes.push('fizz-menu--collapse')
  if (props.collapseShowTitle)
    classes.push('fizz-menu--collapse-show-title')
  return classes
})

/** 监听 defaultActive 变化 */
watch(
  () => props.defaultActive,
  (val) => {
    if (val) {
      activePath.value = val
      expandActiveParents(val)
    }
  },
  { immediate: true },
)

/** 监听折叠状态 */
watch(
  () => props.collapse,
  (collapsed) => {
    if (collapsed) {
      openedMenus.value = []
    }
  },
)

/** 展开激活菜单的父级 */
function expandActiveParents(path: string) {
  const parents = findParentPaths(props.menus || [], path)
  if (parents.length > 0) {
    openedMenus.value = [...new Set([...openedMenus.value, ...parents])]
  }
}

/** 查找菜单项的所有父级路径 */
function findParentPaths(menus: MenuItem[], targetPath: string, parents: string[] = []): string[] {
  for (const menu of menus) {
    if (menu.path === targetPath) {
      return parents
    }
    if (menu.children?.length) {
      const found = findParentPaths(menu.children, targetPath, [...parents, menu.path])
      if (found.length > 0)
        return found
    }
  }
  return []
}

/** 处理菜单选中 */
function handleSelect(path: string) {
  activePath.value = path
  emit('select', path, props.mode)
}

/** 处理子菜单展开 */
function handleOpen(path: string) {
  if (!openedMenus.value.includes(path)) {
    if (props.accordion) {
      const parents = findParentPaths(props.menus || [], path)
      openedMenus.value = [...parents, path]
    }
    else {
      openedMenus.value.push(path)
    }
  }
  emit('open', path, openedMenus.value)
}

/** 处理子菜单关闭 */
function handleClose(path: string) {
  const index = openedMenus.value.indexOf(path)
  if (index > -1) {
    openedMenus.value.splice(index, 1)
  }
  emit('close', path, openedMenus.value)
}

/** 滚动到激活项 */
function scrollToActiveItem() {
  if (!props.scrollToActive || props.mode !== 'vertical' || props.collapse)
    return

  nextTick(() => {
    const activeEl = menuRef.value?.$el.querySelector('.is-active') as HTMLElement | null
    activeEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}

onMounted(() => {
  scrollToActiveItem()
})

watch(activePath, () => {
  scrollToActiveItem()
})

// 提供上下文给子组件（使用 ref/computed 保持响应性）
provide<MenuContext>(MENU_CONTEXT_KEY, {
  props,
  activePath,
  openedMenus,
  isPopup,
  openMenu: handleOpen,
  closeMenu: handleClose,
  handleSelect,
})
</script>

<template>
  <ElMenu
    ref="menuRef"
    :class="menuClass"
    :mode="mode"
    :collapse="collapse"
    :default-active="activePath"
    :default-openeds="openedMenus"
    :unique-opened="accordion"
    :collapse-transition="false"
    popper-class="fizz-menu-popper"
    @select="handleSelect"
    @open="handleOpen"
    @close="handleClose"
  >
    <template v-for="item in menus" :key="item.path">
      <template v-if="item.show !== false">
        <SubMenu v-if="item.children?.length" :key="`${item.path}_sub`" :item="item" />
        <MenuItemComp v-else :key="item.path" :item="item" />
      </template>
    </template>
  </ElMenu>
</template>
