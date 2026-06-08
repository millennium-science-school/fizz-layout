<script setup lang="ts">
import type { MenuItemType } from '@fizz-layout/components'
import type { CSSProperties, Slots } from 'vue'

import { FlCopyright, FlFooter, FlMenu } from '@fizz-layout/components'
import { useLogoClick, useMenuClick } from '@fizz-layout/hooks'
import { ElImage } from 'element-plus'

import { computed, ref, useSlots, watch } from 'vue'

import IconCarbonRightPanelClose from '~icons/carbon/right-panel-close'
import IconCarbonRightPanelOpen from '~icons/carbon/right-panel-open'

import { FlContainer } from './components/container'
import { FlHeader } from './components/header'
import { FlTabs } from './components/tabs'

import { layoutProps } from './layout.ts'
import { usePreferencesStore } from './store/usePreferencesStore'
import { resolveLayoutState } from './utils/resolveLayoutState'
import { getMixedHeaderMenus, getMixedSidebarMenus, resolveMixedRootPath as resolveMixedRootPathFromMenus } from './utils/resolveMixedNav'

defineOptions({ name: 'FizzLayout' })

const props = defineProps(layoutProps)

const emit = defineEmits<{
  /**
   * 头部菜单点击
   */
  'headerMenuSelect': [key: string, menu: MenuItemType | undefined, mode?: string]
  /**
   * 侧边菜单点击
   */
  'sidebarMenuSelect': [key: string, menu: MenuItemType | undefined, mode?: string]
  /**
   * 点击 Logo
   */
  'clickLogo': []
  /**
   * 侧边栏折叠状态变化
   */
  'update:sidebarCollapsed': [value: boolean]
}>()

const preferencesStore = usePreferencesStore()
const {
  preferences,
  header,
  sidebar,
  sidebarCollapsed,
  tabs,
  footer,
  logo,
  breadcrumb,
  navigation,
  copyright,
  isDark,
  layoutMode,
  locale,
  headerTheme,
  sidebarTheme,
  updatePreferences,
  updateLocale,
} = preferencesStore

const slots: Slots = useSlots()

const headerSlotNames = computed<string[]>(() =>
  Object.keys(slots).filter(k =>
    k.startsWith('header-left')
    || k.startsWith('header-right')
    || k === 'user-dropdown'
    || k === 'global-search'
    || k === 'theme-toggle'
    || k === 'fullscreen'
    || k === 'notification',
  ),
)

// ========== 菜单数据 ==========
const headerMenus = computed(() => props.headerMenus ?? props.menus)
const sidebarMenus = computed(() => props.sidebarMenus ?? props.menus)

// ========== 混合导航模式（mixed-nav）菜单联动 ==========
/** 当前激活的一级菜单路径（用于 mixed-nav 模式） */
const activeMixedRootPath = ref<string>('')

/** 获取一级菜单（去掉 children，用于 mixed-nav 模式的 Header） */
const mixedHeaderMenus = computed<MenuItemType[]>(() => {
  if (!layoutMode.value.isMixedNav)
    return headerMenus.value

  return getMixedHeaderMenus(headerMenus.value)
})

/** 获取侧边栏菜单（mixed-nav 模式下显示当前一级菜单的子菜单） */
const mixedSidebarMenus = computed<MenuItemType[]>(() => {
  if (!layoutMode.value.isMixedNav)
    return sidebarMenus.value

  return getMixedSidebarMenus(headerMenus.value, activeMixedRootPath.value)
})

/** mixed-nav 模式下侧边栏是否应该显示（有子菜单时显示） */
const mixedNavSidebarVisible = computed(() => {
  if (!layoutMode.value.isMixedNav) {
    return true
  }
  return mixedSidebarMenus.value.length > 0
})

/** 根据路径解析 mixed-nav 的根菜单，失败则回退 */
function resolveMixedRootPath(path?: string): string {
  return resolveMixedRootPathFromMenus(headerMenus.value, path)
}

// mixed-nav 模式下同步激活的一级菜单（监听路径/菜单/模式）
watch(
  [() => props.currentPath, () => headerMenus.value, () => layoutMode.value.isMixedNav],
  ([path, menus, isMixed]) => {
    if (!isMixed || menus.length === 0)
      return
    activeMixedRootPath.value = resolveMixedRootPath(path)
  },
  { immediate: true },
)

// ========== 布局计算（合并相关逻辑，提高可读性） ==========
const layoutComputed = computed(() => {
  const state = resolveLayoutState({
    layoutMode: layoutMode.value,
    sidebar: sidebar.value,
    logo: logo.value,
    navigation: navigation.value,
    sidebarCollapsed: sidebarCollapsed.value,
    mixedNavSidebarVisible: mixedNavSidebarVisible.value,
  })

  return {
    ...state,
    headerLogoStyle: {
      minWidth: `${state.logoWidth}px`,
      width: `${state.logoWidth}px`,
      borderRight: (state.sidebarVisible && !layoutMode.value.isSideNav)
        ? '1px solid var(--fizz-border-color-light)'
        : undefined,
    },
  }
})

// ========== 样式计算（合并为一个对象） ==========
const styles = computed(() => {
  const { sidebarVisible } = layoutComputed.value
  return {
    sidebar: sidebarVisible
      ? { width: `${sidebarCollapsed.value ? sidebar.value.collapseWidth : sidebar.value.width}px` }
      : {},
    logo: { height: `${header.value.height - 1}px` },
    tabs: { height: `${tabs.value.height}px` },
    footer: { height: `${footer.value.height}px` },
    header: {
      height: `${header.value.height}px`,
      zIndex: preferences.value.app.zIndex + 1,
    },
  } as Record<string, CSSProperties>
})

// 菜单点击处理
const { triggerMenuClick } = useMenuClick()

// 根据 key 查找菜单项
function findMenuByKey(key: string, menus: MenuItemType[]): MenuItemType | undefined {
  for (const menu of menus) {
    if (menu.path === key)
      return menu
    if (menu.children) {
      const found = findMenuByKey(key, menu.children)
      if (found)
        return found
    }
  }
  return undefined
}

async function handleHeaderMenuSelect(key: string, mode?: string) {
  const menu = findMenuByKey(key, headerMenus.value)

  // mixed-nav 模式下点击一级菜单的特殊处理
  if (layoutMode.value.isMixedNav) {
    // 更新激活的一级菜单
    activeMixedRootPath.value = resolveMixedRootPath(key)

    // 查找该一级菜单
    const rootMenu = headerMenus.value.find(m => m.path === key)
    const children = rootMenu?.children ?? []

    // 如果有子菜单，则不导航到该菜单，只切换侧边栏内容
    // 如果配置了 autoActivateChild 且有子菜单，则导航到第一个子菜单
    if (children.length > 0) {
      if (sidebar.value.autoActivateChild && children[0]) {
        // 自动激活第一个子菜单
        const firstChild = children[0]
        if (!firstChild.path)
          return

        const prevented = await triggerMenuClick(firstChild.path, firstChild, mode)
        if (!prevented) {
          emit('headerMenuSelect', firstChild.path, firstChild, mode)
        }
      }
      // 不触发导航事件，仅切换侧边栏
      return
    }
  }

  const prevented = await triggerMenuClick(key, menu, mode)
  if (!prevented) {
    emit('headerMenuSelect', key, menu, mode)
  }
}

async function handleSidebarMenuSelect(key: string, mode?: string) {
  const menu = findMenuByKey(key, sidebarMenus.value)
  const prevented = await triggerMenuClick(key, menu, mode)
  if (!prevented) {
    emit('sidebarMenuSelect', key, menu, mode)
  }
}

// Logo 点击处理
const { triggerLogoClick } = useLogoClick()

async function handleClickLogo() {
  // 触发所有已注册的处理器
  await triggerLogoClick()
  // 同时触发组件事件
  emit('clickLogo')
}

function handleSidebarCollapse(value: boolean) {
  updatePreferences({ sidebar: { collapsed: value } })
  emit('update:sidebarCollapsed', value)
}

function toggleSidebar() {
  updatePreferences({
    sidebar: {
      hidden: !sidebar.value.hidden,
    },
  })
}

defineExpose({
  toggleSidebar,
})
</script>

<template>
  <div class="fizz-layout" :class="[`fizz-layout--${preferences.app.layout}`]">
    <!-- sidebar-nav 模式：左右布局，Sidebar 包含 Logo -->
    <template v-if="layoutMode.isSideNav">
      <!-- Sidebar (包含 Logo) -->
      <aside
        v-if="layoutComputed.sidebarVisible"
        class="fizz-layout-sidebar fizz-layout-sidebar--full-height"
        :class="sidebarTheme ? [`sidebar-${sidebarTheme}`] : []"
        :style="styles.sidebar"
      >
        <!-- Logo -->
        <div
          v-if="layoutComputed.showSidebarLogo"
          class="fizz-layout-sidebar-logo"
          :class="layoutComputed.logoClass"
          :style="styles.logo"
          @click="handleClickLogo"
        >
          <slot name="logo">
            <ElImage
              :src="isDark && logo.sourceDark ? logo.sourceDark : logo.source"
              :style="{ objectFit: logo.fit }"
              class="fizz-layout-sidebar-logo__img"
              alt="Logo"
            />
            <span v-if="!layoutComputed.logoCollapsed" class="fizz-layout-sidebar-logo__title">
              {{ preferences.app.name }}
            </span>
          </slot>
        </div>

        <!-- 侧边栏菜单 -->
        <div class="fizz-layout-sidebar-menu">
          <slot name="sidebar">
            <component
              :is="sidebarMenuComponent || FlMenu"
              :menus="sidebarMenus"
              :rounded="layoutComputed.isMenuRounded"
              :accordion="navigation.accordion"
              :collapse="sidebarCollapsed"
              :collapse-show-title="sidebar.collapsedShowTitle"
              :default-active="currentPath"
              mode="vertical"
              scroll-to-active
              @select="handleSidebarMenuSelect"
            />
          </slot>
        </div>

        <!-- 折叠按钮 -->
        <div
          v-if="sidebar.collapsedButton"
          class="fizz-layout-sidebar-collapse"
          @click="handleSidebarCollapse(!sidebarCollapsed)"
        >
          <slot name="sidebar-collapse-button">
            <IconCarbonRightPanelClose v-show="sidebarCollapsed" class="fizz-layout-sidebar-collapse-icon" />
            <IconCarbonRightPanelOpen v-show="!sidebarCollapsed" class="fizz-layout-sidebar-collapse-icon" />
          </slot>
        </div>
      </aside>

      <!-- 右侧区域 -->
      <div class="fizz-layout-right">
        <!-- Header -->
        <header
          v-if="header.enable && !header.hidden"
          class="fizz-layout-header"
          :class="headerTheme ? [`header-${headerTheme}`] : []"
          :style="styles.header"
        >
          <FlHeader>
            <!-- 面包屑 -->
            <template v-if="breadcrumb.enable" #breadcrumb>
              <slot name="breadcrumb" />
            </template>

            <!-- 透传头部插槽 -->
            <template v-for="name in headerSlotNames" :key="name" #[name]>
              <slot :name="name" />
            </template>

            <!-- 语言切换 -->
            <template #language-toggle>
              <slot name="language-toggle" :locale="locale" :toggle-language="updateLocale" />
            </template>
          </FlHeader>
        </header>

        <!-- Main Content -->
        <main class="fizz-layout-main">
          <!-- Tabs -->
          <div v-if="tabs.enable" class="fizz-layout-tabs" :style="styles.tabs">
            <FlTabs :show-icon="tabs.showIcon" />
          </div>

          <!-- Content -->
          <div class="fizz-layout-content">
            <slot>
              <FlContainer />
            </slot>
          </div>

          <!-- Footer -->
          <footer v-if="footer.enable" class="fizz-layout-footer" :style="styles.footer">
            <FlFooter :fixed="footer.fixed">
              <slot name="footer">
                <FlCopyright
                  v-if="copyright.enable"
                  :company-name="copyright.companyName"
                  :company-site-link="copyright.companySiteLink"
                  :date="copyright.date"
                  :icp="copyright.icp"
                  :icp-link="copyright.icpLink"
                />
              </slot>
            </FlFooter>
          </footer>
        </main>
      </div>
    </template>

    <!-- header-nav / mixed-nav 等其他模式：上下布局 -->
    <template v-else>
      <!-- Header -->
      <header
        v-if="header.enable && !header.hidden"
        class="fizz-layout-header"
        :class="headerTheme ? [`header-${headerTheme}`] : []"
        :style="styles.header"
      >
        <!-- Logo (在头部显示) -->
        <div
          v-if="logo.enable && layoutComputed.showHeaderLogo"
          class="fizz-layout-header-logo"
          :class="layoutComputed.logoClass"
          :style="layoutComputed.headerLogoStyle"
          @click="handleClickLogo"
        >
          <slot name="logo">
            <ElImage
              :src="isDark && logo.sourceDark ? logo.sourceDark : logo.source"
              :style="{ objectFit: logo.fit }"
              class="fizz-layout-header-logo__img"
              alt="Logo"
            />
            <span v-if="!layoutComputed.logoCollapsed" class="fizz-layout-header-logo__title">
              {{ preferences.app.name }}
            </span>
          </slot>
        </div>

        <FlHeader>
          <!-- 面包屑（非头部导航模式） -->
          <template v-if="!layoutComputed.showHeaderNav && breadcrumb.enable" #breadcrumb>
            <slot name="breadcrumb" />
          </template>

          <!-- 头部菜单 -->
          <template v-if="layoutComputed.showHeaderNav" #menu>
            <slot name="header-menu">
              <component
                :is="headerMenuComponent || FlMenu"
                :menus="mixedHeaderMenus"
                :rounded="layoutComputed.isMenuRounded"
                :default-active="layoutMode.isMixedNav ? activeMixedRootPath : currentPath"
                mode="horizontal"
                class="fizz-layout-header-menu"
                @select="handleHeaderMenuSelect"
              />
            </slot>
          </template>

          <!-- 透传头部插槽 -->
          <template v-for="name in headerSlotNames" :key="name" #[name]>
            <slot :name="name" />
          </template>

          <!-- 语言切换 -->
          <template #language-toggle>
            <slot name="language-toggle" :locale="locale" :toggle-language="updateLocale" />
          </template>
        </FlHeader>
      </header>

      <div class="fizz-layout-body">
        <!-- Sidebar -->
        <aside
          v-if="layoutComputed.sidebarVisible"
          class="fizz-layout-sidebar"
          :class="sidebarTheme ? [`sidebar-${sidebarTheme}`] : []"
          :style="styles.sidebar"
        >
          <!-- 侧边栏菜单 -->
          <div class="fizz-layout-sidebar-menu">
            <slot name="sidebar">
              <component
                :is="sidebarMenuComponent || FlMenu"
                :menus="layoutMode.isMixedNav ? mixedSidebarMenus : sidebarMenus"
                :rounded="layoutComputed.isMenuRounded"
                :accordion="navigation.accordion"
                :collapse="sidebarCollapsed"
                :collapse-show-title="sidebar.collapsedShowTitle"
                :default-active="currentPath"
                mode="vertical"
                scroll-to-active
                @select="handleSidebarMenuSelect"
              />
            </slot>
          </div>

          <!-- 折叠按钮 -->
          <div
            v-if="sidebar.collapsedButton"
            class="fizz-layout-sidebar-collapse"
            @click="handleSidebarCollapse(!sidebarCollapsed)"
          >
            <slot name="sidebar-collapse-button">
              <IconCarbonRightPanelClose v-show="sidebarCollapsed" class="fizz-layout-sidebar-collapse-icon" />
              <IconCarbonRightPanelOpen v-show="!sidebarCollapsed" class="fizz-layout-sidebar-collapse-icon" />
            </slot>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="fizz-layout-main">
          <!-- Tabs -->
          <div v-if="tabs.enable" class="fizz-layout-tabs" :style="styles.tabs">
            <FlTabs :show-icon="tabs.showIcon" />
          </div>

          <!-- Content -->
          <div class="fizz-layout-content">
            <slot>
              <FlContainer />
            </slot>
          </div>

          <!-- Footer -->
          <footer v-if="footer.enable" class="fizz-layout-footer" :style="styles.footer">
            <FlFooter :fixed="footer.fixed">
              <slot name="footer">
                <FlCopyright
                  v-if="copyright.enable"
                  :company-name="copyright.companyName"
                  :company-site-link="copyright.companySiteLink"
                  :date="copyright.date"
                  :icp="copyright.icp"
                  :icp-link="copyright.icpLink"
                />
              </slot>
            </FlFooter>
          </footer>
        </main>
      </div>
    </template>
  </div>
</template>
