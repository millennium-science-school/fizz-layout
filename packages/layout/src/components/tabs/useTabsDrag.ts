import type Sortable from 'sortablejs'
import type { TabsEmits, TabsProps } from '../../types'

import SortableJs from 'sortablejs'
import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue'

function isTouchDevice() {
  return (
    typeof window !== 'undefined'
    && ('ontouchstart' in window
      || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches))
  )
}

type EmitFn = (event: keyof TabsEmits, ...args: any[]) => void

function useTabsDrag(
  props: TabsProps,
  emit: EmitFn,
  getContainer?: () => HTMLElement | null,
) {
  if (isTouchDevice())
    return

  let sortableInstance: Sortable | null = null

  function resolveContainer(): HTMLElement | null {
    return (
      getContainer?.()
      ?? (document.querySelector(`.${props.contentClass}`) as HTMLElement | null)
    )
  }

  function initSortable() {
    destroy()
    const el = resolveContainer()
    if (!el)
      return

    sortableInstance = SortableJs.create(el, {
      animation: 150,
      draggable: '[data-tab-item="true"]:not(.affix-tab)',
      filter: '.affix-tab',
      chosenClass: 'dragging',
      disabled: !props.draggable,
      onMove(e: Sortable.MoveEvent) {
        // Prevent mixing affix and non-affix tabs
        const isCurrentAffix = e.dragged.classList.contains('affix-tab')
        const isRelatedAffix = e.related.classList.contains('affix-tab')
        if (isCurrentAffix !== isRelatedAffix)
          return false
      },
      onEnd(e: Sortable.SortableEvent) {
        const { from, oldIndex, newIndex } = e
        if (oldIndex == null || newIndex == null || oldIndex === newIndex)
          return

        // Revert SortableJS DOM manipulation, let Vue handle re-rendering
        const movedEl = from.children[newIndex]
        if (movedEl) {
          from.removeChild(movedEl)
          const refNode = from.children[oldIndex] || null
          from.insertBefore(movedEl, refNode)
        }

        emit('sortTabs', oldIndex, newIndex)
      },
    })
  }

  function destroy() {
    if (sortableInstance) {
      sortableInstance.destroy()
      sortableInstance = null
    }
  }

  onMounted(() => {
    nextTick(() => {
      initSortable()
    })
  })

  onBeforeUnmount(() => {
    destroy()
  })

  // Re-init when styleType changes (container element may change)
  watch(() => props.styleType, () => {
    nextTick(() => {
      initSortable()
    })
  })

  watch(() => props.draggable, (draggable) => {
    if (sortableInstance) {
      sortableInstance.option('disabled', !draggable)
    }
  })
}

export { useTabsDrag }
