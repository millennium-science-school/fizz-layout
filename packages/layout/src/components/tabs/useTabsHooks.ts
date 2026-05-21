import type { ComputedRef, Ref } from 'vue'
import type { RouteLocationNormalizedGeneric } from 'vue-router'
import type { IContextMenuItem, TabDefinition } from '../../types'
import { useLocale } from '@fizz-layout/hooks'
import { useFullscreen } from '@vueuse/core'
import { computed, onMounted, ref, toValue, watch } from 'vue'
import { useRouter } from 'vue-router'

import IconCenterToFit from '~icons/carbon/center-to-fit'
import IconClean from '~icons/carbon/clean'
import IconClose from '~icons/carbon/close'
import IconDocumentImport from '~icons/carbon/document-import'
import IconFitToScreen from '~icons/carbon/fit-to-screen'
import IconPin from '~icons/carbon/pin'
import IconPinFilled from '~icons/carbon/pin-filled'
import IconRotate360 from '~icons/carbon/rotate-360'
import IconShare from '~icons/carbon/share'

import { useTabs } from '../../composables/useTabs'
import { getTabKey, useTabsStore } from '../../store/useTabsStore'
import { filterTree } from '../../utils'

interface UseTabsHooks {
  currentActive: ComputedRef<string>
  currentTabs: Ref<RouteLocationNormalizedGeneric[]>
  handleClick: (key: string) => void
  handleClose: (key: string) => Promise<void>
  createContextMenus: (tab: TabDefinition) => IContextMenuItem[]
}

function useTabsHooks(): UseTabsHooks {
  const router = useRouter()
  const { t, locale } = useLocale()
  const tabsStore = useTabsStore()
  const { isFullscreen, toggle } = useFullscreen()
  const {
    closeAllTabs,
    closeCurrentTab,
    closeOtherTabs,
    closeTabByKey,
    getTabDisableState,
    openTabInNewWindow,
    refreshTab,
    toggleTabPin,
  } = useTabs()

  /**
   * 当前路径对应的tab的key
   */
  const currentActive = computed(() => {
    return getTabKey(router.currentRoute.value)
  })

  const currentTabs = ref<RouteLocationNormalizedGeneric[]>([])
  watch(
    [
      tabsStore.getTabs,
      tabsStore.updateTime,
      () => locale.value.name,
    ],
    ([tabs]) => {
      currentTabs.value = tabs.map(item => wrapperTabLocale(item))
    },
    { immediate: true },
  )

  /**
   * 初始化固定标签页
   */
  const initAffixTabs = () => {
    const affixTabs = filterTree(router.getRoutes(), (route) => {
      return !!route.meta?.affixTab
    })
    tabsStore.setAffixTabs(affixTabs)
  }

  // 点击tab,跳转路由
  const handleClick = (key: string) => {
    const { fullPath, path } = tabsStore.getTabByKey(key)!
    router.push(fullPath || path)
  }

  // 关闭tab
  const handleClose = async (key: string) => {
    await closeTabByKey(key)
  }

  function wrapperTabLocale(tab: RouteLocationNormalizedGeneric) {
    const metaTitle = tab?.meta?.title as string

    // 如果有自定义标题，优先使用
    if (tab?.meta?.newTabTitle) {
      return {
        ...tab,
        meta: {
          ...tab?.meta,
          title: toValue(tab.meta.newTabTitle),
        },
      }
    }

    // 尝试翻译，如果无 title 则使用路由名称
    const translatedTitle = metaTitle ? t(metaTitle) : (tab.name as string) || ''

    return {
      ...tab,
      meta: {
        ...tab?.meta,
        title: translatedTitle,
      },
    }
  }

  onMounted(() => {
    initAffixTabs()
    // 触发一次更新，确保标签文本正确显示
    tabsStore.setUpdateTime()
  })

  const createContextMenus = (tab: TabDefinition) => {
    const {
      disabledCloseAll,
      disabledCloseCurrent,
      disabledCloseOther,
      disabledRefresh,
    } = getTabDisableState(tab)

    const affixTab = tab?.meta?.affixTab ?? false

    const menus: IContextMenuItem[] = [
      {
        disabled: disabledCloseCurrent,
        handler: async () => {
          await closeCurrentTab(tab)
        },
        icon: IconClose,
        key: 'close',
        text: t('fizz.layout.tabs.contextMenu.close'),
      },
      {
        handler: async () => {
          await toggleTabPin(tab)
        },
        icon: affixTab ? IconPinFilled : IconPin,
        key: 'affix',
        text: affixTab
          ? t('fizz.layout.tabs.contextMenu.unpin')
          : t('fizz.layout.tabs.contextMenu.pin'),
      },
      {
        handler: async () => {
          toggle()
        },
        icon: isFullscreen.value ? IconFitToScreen : IconCenterToFit,
        key: isFullscreen.value ? 'restore-maximize' : 'maximize',
        text: isFullscreen.value
          ? t('fizz.layout.tabs.contextMenu.restoreMaximize')
          : t('fizz.layout.tabs.contextMenu.maximize'),
      },
      {
        disabled: disabledRefresh,
        handler: () => refreshTab(),
        icon: IconRotate360,
        key: 'reload',
        text: t('fizz.layout.tabs.contextMenu.reload'),
      },
      {
        handler: async () => {
          await openTabInNewWindow(tab)
        },
        icon: IconShare,
        key: 'open-in-new-window',
        separator: true,
        text: t('fizz.layout.tabs.contextMenu.openInNewWindow'),
      },

      {
        disabled: disabledCloseOther,
        handler: async () => {
          await closeOtherTabs(tab)
        },
        icon: IconDocumentImport,
        key: 'close-other',
        text: t('fizz.layout.tabs.contextMenu.closeOther'),
      },
      {
        disabled: disabledCloseAll,
        handler: closeAllTabs,
        icon: IconClean,
        key: 'close-all',
        text: t('fizz.layout.tabs.contextMenu.closeAll'),
      },
    ]

    return menus.filter(item => tabsStore.menuList.value.includes(item.key))
  }

  return {
    createContextMenus,
    currentActive,
    currentTabs,
    handleClick,
    handleClose,
  }
}

export { useTabsHooks }
