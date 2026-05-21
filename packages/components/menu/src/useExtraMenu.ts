import type { ComputedRef, Ref } from 'vue'
import type { AnyPreferencesStore, MenuItem } from './menu'

import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useNavigation } from './useNavigation'

interface UseExtraMenuOptions {
  /**
   * 根菜单数据（外部注入，用于混合导航时的头部菜单）
   */
  rootMenus?: ComputedRef<MenuItem[]> | Ref<MenuItem[]>
  /**
   * 所有菜单数据（外部注入）
   */
  menus?: ComputedRef<MenuItem[]> | Ref<MenuItem[]>
  /**
   * 偏好设置 Store
   */
  preferencesStore?: AnyPreferencesStore
  /**
   * 查找根菜单的方法
   */
  findRootMenuByPath?: (menus: MenuItem[], path: string, level?: number) => {
    findMenu?: MenuItem
    rootMenu?: MenuItem
    rootMenuPath?: string
  }
}

interface UseExtraMenuReturn {
  extraActiveMenu: Ref<string>
  extraMenus: Ref<MenuItem[]>
  handleDefaultSelect: (menu: MenuItem, rootMenu?: MenuItem) => Promise<void>
  handleMenuMouseEnter: (menu: MenuItem) => void
  handleMixedMenuSelect: (menu: MenuItem) => Promise<void>
  handleSideMouseLeave: () => void
  sidebarExtraVisible: Ref<boolean>
}

function useExtraMenu(options: UseExtraMenuOptions = {}): UseExtraMenuReturn {
  const { navigation, willOpenedByWindow } = useNavigation()
  const preferencesStore = options.preferencesStore
  const findRootMenuByPath = options.findRootMenuByPath

  const sidebar = preferencesStore?.sidebar ?? ref({ expandOnHover: false, autoActivateChild: false })
  const layout = preferencesStore?.layout ?? ref({})
  const layoutMode = preferencesStore?.layoutMode ?? ref({ isHeaderMixedNav: false })

  const route = useRoute()

  // 使用外部注入的菜单或空数组
  const menus = computed(() => options.menus?.value ?? options.rootMenus?.value ?? [])

  /** 记录当前顶级菜单下哪个子菜单最后激活 */
  const defaultSubMap = new Map<string, string>()
  const extraRootMenus = ref<MenuItem[]>([])
  const extraMenus = ref<MenuItem[]>([])
  const sidebarExtraVisible = ref<boolean>(false)
  const extraActiveMenu = ref('')

  const parentLevel = computed(() =>
    layoutMode.value.isHeaderMixedNav ? 1 : 0,
  )

  /**
   * 选择混合菜单事件
   * @param menu
   */
  const handleMixedMenuSelect = async (menu: MenuItem) => {
    const menuPath = menu.path
    const _extraMenus = menu?.children ?? []
    const hasChildren = _extraMenus.length > 0

    if (!menuPath || !willOpenedByWindow(menuPath)) {
      extraMenus.value = _extraMenus ?? []
      extraActiveMenu.value = menu.parents?.[parentLevel.value] ?? menuPath ?? ''
      sidebarExtraVisible.value = hasChildren
    }

    if (!hasChildren && menuPath) {
      await navigation(menuPath)
    }
    else if (sidebar.value.autoActivateChild) {
      const targetPath = menuPath && defaultSubMap.has(menuPath)
        ? defaultSubMap.get(menuPath)!
        : (menu.children?.find(child => child.path)?.path ?? menuPath)

      if (targetPath)
        await navigation(targetPath)
    }
  }

  /**
   * 选择默认菜单事件
   * @param menu
   * @param rootMenu
   */
  const handleDefaultSelect = async (
    menu: MenuItem,
    rootMenu?: MenuItem,
  ) => {
    extraMenus.value = rootMenu?.children ?? extraRootMenus.value ?? []
    extraActiveMenu.value = menu.parents?.[parentLevel.value] ?? menu.path ?? ''

    if (sidebar.value.expandOnHover) {
      sidebarExtraVisible.value = extraMenus.value.length > 0
    }
  }

  /**
   * 侧边菜单鼠标移出事件
   */
  const handleSideMouseLeave = () => {
    if (sidebar.value.expandOnHover) {
      return
    }

    if (findRootMenuByPath) {
      const { findMenu, rootMenu, rootMenuPath } = findRootMenuByPath(
        menus.value,
        route.path,
      )
      extraActiveMenu.value = rootMenuPath ?? findMenu?.path ?? ''
      extraMenus.value = rootMenu?.children ?? []
    }
  }

  const handleMenuMouseEnter = (menu: MenuItem) => {
    if (!sidebar.value.expandOnHover && findRootMenuByPath) {
      if (!menu.path) {
        extraMenus.value = menu.children ?? []
        extraActiveMenu.value = menu.parents?.[parentLevel.value] ?? ''
        sidebarExtraVisible.value = extraMenus.value.length > 0
        return
      }

      const { findMenu } = findRootMenuByPath(menus.value, menu.path)
      extraMenus.value = findMenu?.children ?? []
      extraActiveMenu.value = menu.parents?.[parentLevel.value] ?? menu.path
      sidebarExtraVisible.value = extraMenus.value.length > 0
    }
  }

  function calcExtraMenus(path: string) {
    if (!findRootMenuByPath)
      return

    const currentPath = (route.meta?.activePath as string) || path
    const { findMenu, rootMenu, rootMenuPath } = findRootMenuByPath(
      menus.value,
      currentPath,
      parentLevel.value,
    )
    extraRootMenus.value = rootMenu?.children ?? []
    if (rootMenuPath)
      defaultSubMap.set(rootMenuPath, currentPath)
    extraActiveMenu.value = rootMenuPath ?? findMenu?.path ?? ''
    extraMenus.value = rootMenu?.children ?? []
    if (sidebar.value.expandOnHover) {
      sidebarExtraVisible.value = extraMenus.value.length > 0
    }
  }

  watch(
    () => [route.path, layout.value],
    ([path]) => {
      calcExtraMenus((path as string) || '')
    },
    { immediate: true },
  )

  return {
    extraActiveMenu,
    extraMenus,
    handleDefaultSelect,
    handleMenuMouseEnter,
    handleMixedMenuSelect,
    handleSideMouseLeave,
    sidebarExtraVisible,
  }
}

export { useExtraMenu }
export type { UseExtraMenuOptions }
