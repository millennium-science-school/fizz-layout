import type { Ref } from 'vue'

import { getCurrentInstance, onUnmounted, ref } from 'vue'

type LogoClickHandler = () => void | Promise<void>

// 全局注册的点击处理器
const handlers: Set<LogoClickHandler> = new Set()

// 响应式的处理器数量，用于外部监听
const handlerCount: Ref<number> = ref(0)

/**
 * Logo 点击事件 Hook
 *
 * 提供灵活的 Logo 点击事件监听和注册功能
 *
 * @example
 * ```ts
 * // 在组件中注册点击处理器
 * const { onLogoClick, offLogoClick } = useLogoClick()
 *
 * // 注册处理器
 * onLogoClick(() => {
 *   router.push('/')
 * })
 *
 * // 或者使用自动清理
 * const { onLogoClick } = useLogoClick()
 * onLogoClick(() => {
 *   router.push('/')
 * }, { autoCleanup: true }) // 组件卸载时自动移除
 * ```
 */
function useLogoClick() {
  /**
   * 注册 Logo 点击事件处理器
   */
  function onLogoClick(
    handler: LogoClickHandler,
    options?: { autoCleanup?: boolean },
  ): () => void {
    handlers.add(handler)
    handlerCount.value = handlers.size

    const cleanup = () => {
      handlers.delete(handler)
      handlerCount.value = handlers.size
    }

    // 自动清理：组件卸载时移除
    if (options?.autoCleanup && getCurrentInstance()) {
      onUnmounted(cleanup)
    }

    return cleanup
  }

  /**
   * 移除 Logo 点击事件处理器
   * @param handler 要移除的处理函数
   */
  function offLogoClick(handler: LogoClickHandler): void {
    handlers.delete(handler)
    handlerCount.value = handlers.size
  }

  /**
   * 触发所有已注册的 Logo 点击处理器
   * 通常由 Layout 组件内部调用
   */
  async function triggerLogoClick(): Promise<void> {
    const promises = Array.from(handlers).map(handler => handler())
    await Promise.all(promises)
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
    /** 注册 Logo 点击事件处理器 */
    onLogoClick,
    /** 移除 Logo 点击事件处理器 */
    offLogoClick,
    /** 触发所有已注册的处理器 */
    triggerLogoClick,
    /** 清除所有处理器 */
    clearAllHandlers,
    /** 获取处理器数量 */
    getHandlerCount,
    /** 响应式的处理器数量 */
    handlerCount,
  }
}

export { useLogoClick }
export type { LogoClickHandler }
