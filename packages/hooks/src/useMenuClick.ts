import type { MenuItemType } from '@fizz-layout/components'

import { getCurrentInstance, onUnmounted, ref } from 'vue'

type MenuClickHandler = (
  key: string,
  menu: MenuItemType | undefined,
  mode?: string,
) => boolean | void | Promise<boolean | void>

// 全局注册的点击处理器
const handlers: Set<MenuClickHandler> = new Set()

// 响应式的处理器数量
const handlerCount = ref(0)

/**
 * 菜单点击事件 Hook
 *
 * 提供灵活的菜单点击事件监听和注册功能，支持拦截默认路由跳转
 *
 * @example
 * ```ts
 * // 在组件中注册点击处理器
 * const { onMenuClick } = useMenuClick()
 *
 * // 注册处理器，返回 true 表示阻止默认路由跳转
 * onMenuClick((key, menu, mode) => {
 *   if (key === '/special-page') {
 *     // 自定义处理
 *     openModal()
 *     return true // 阻止默认跳转
 *   }
 *   // 返回 false 或 undefined 继续默认行为
 * }, { autoCleanup: true })
 * ```
 */
function useMenuClick() {
  /**
   * 注册菜单点击事件处理器
   */
  function onMenuClick(
    handler: MenuClickHandler,
    options?: { autoCleanup?: boolean },
  ): () => void {
    handlers.add(handler)
    handlerCount.value = handlers.size

    const cleanup = () => {
      handlers.delete(handler)
      handlerCount.value = handlers.size
    }

    // 自动清理：组件卸载时移除处理器
    if (options?.autoCleanup && getCurrentInstance()) {
      onUnmounted(cleanup)
    }

    return cleanup
  }

  /**
   * 移除菜单点击事件处理器
   */
  function offMenuClick(handler: MenuClickHandler): void {
    handlers.delete(handler)
    handlerCount.value = handlers.size
  }

  /**
   * 触发所有已注册的菜单点击处理器
   * @returns 如果任一处理器返回 true，则返回 true 表示阻止默认行为
   */
  async function triggerMenuClick(
    key: string,
    menu: MenuItemType | undefined,
    mode?: string,
  ): Promise<boolean> {
    for (const handler of handlers) {
      const result = await handler(key, menu, mode)
      if (result === true) {
        return true // 阻止默认行为
      }
    }
    return false
  }

  /**
   * 清除所有已注册的处理器
   */
  function clearAllHandlers(): void {
    handlers.clear()
    handlerCount.value = 0
  }

  /**
   * 获取当前注册的处理器数量
   */
  function getHandlerCount(): number {
    return handlers.size
  }

  return {
    /** 注册菜单点击事件处理器 */
    onMenuClick,
    /** 移除菜单点击事件处理器 */
    offMenuClick,
    /** 触发所有已注册的处理器 */
    triggerMenuClick,
    /** 清除所有处理器 */
    clearAllHandlers,
    /** 获取处理器数量 */
    getHandlerCount,
    /** 响应式的处理器数量 */
    handlerCount,
  }
}

export { useMenuClick }
export type { MenuClickHandler }
