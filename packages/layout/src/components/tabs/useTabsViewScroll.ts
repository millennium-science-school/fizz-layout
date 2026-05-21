import type { Ref } from 'vue'
import type { TabsProps } from '../../types'

import { useMutationObserver, useResizeObserver } from '@vueuse/core'
import { nextTick, onMounted, ref, watch } from 'vue'

function useTabsViewScroll(
  props: TabsProps,
  scrollContainerRef: Ref<HTMLElement | null>,
) {
  const tabItemCount = ref(0)

  const showScrollButton = ref(false)
  const scrollIsAtLeft = ref(true)
  const scrollIsAtRight = ref(false)

  function updateEdgeState() {
    const el = scrollContainerRef.value
    if (!el)
      return

    const maxScrollLeft = el.scrollWidth - el.clientWidth
    scrollIsAtLeft.value = el.scrollLeft <= 0
    scrollIsAtRight.value = el.scrollLeft >= maxScrollLeft - 1
  }

  function scrollDirection(
    direction: 'left' | 'right',
    distance: number = 150,
  ) {
    const el = scrollContainerRef.value
    if (!el)
      return

    el.scrollBy({
      behavior: 'smooth',
      left: direction === 'left' ? -distance : distance,
    })
    requestAnimationFrame(updateEdgeState)
  }

  async function scrollToActiveIntoView() {
    const viewportEl = scrollContainerRef.value
    if (!viewportEl)
      return

    await nextTick()
    if (viewportEl.clientWidth >= viewportEl.scrollWidth)
      return

    requestAnimationFrame(() => {
      const activeItem = viewportEl.querySelector('.is-active') as
        | HTMLElement
        | null
      activeItem?.scrollIntoView({ behavior: 'smooth', inline: 'start' })
      updateEdgeState()
    })
  }

  function calcShowScrollbarButton() {
    const viewportEl = scrollContainerRef.value
    if (!viewportEl)
      return

    showScrollButton.value = viewportEl.scrollWidth > viewportEl.clientWidth
    updateEdgeState()
  }

  function handleScroll() {
    updateEdgeState()
  }

  function handleWheel({ deltaY }: WheelEvent) {
    scrollContainerRef.value?.scrollBy({
      left: deltaY * 3,
    })
    updateEdgeState()
  }

  async function recalculate() {
    await nextTick()
    tabItemCount.value = props.tabs?.length || 0
    calcShowScrollbarButton()
    await nextTick()
    scrollToActiveIntoView()
    updateEdgeState()
  }

  // Auto-managed observers (cleanup on unmount or when ref changes)
  useResizeObserver(scrollContainerRef, () => {
    calcShowScrollbarButton()
    scrollToActiveIntoView()
  })

  useMutationObserver(
    scrollContainerRef,
    () => {
      const viewportEl = scrollContainerRef.value
      if (!viewportEl)
        return

      const count = viewportEl.querySelectorAll('[data-tab-item="true"]').length

      if (count > tabItemCount.value) {
        scrollToActiveIntoView()
      }

      if (count !== tabItemCount.value) {
        tabItemCount.value = count
        calcShowScrollbarButton()
      }
    },
    { attributes: false, childList: true, subtree: true },
  )

  watch(
    () => props.active,
    () => {
      scrollToActiveIntoView()
    },
    {
      flush: 'post',
    },
  )

  watch(
    () => props.tabs?.length,
    () => {
      nextTick().then(() => calcShowScrollbarButton())
    },
    { flush: 'post' },
  )

  watch(
    () => props.styleType,
    () => {
      recalculate()
    },
  )

  onMounted(recalculate)

  return {
    handleScroll,
    handleWheel,
    scrollDirection,
    scrollIsAtLeft,
    scrollIsAtRight,
    showScrollButton,
  }
}

export { useTabsViewScroll }
