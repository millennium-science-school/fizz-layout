import { describe, expect, it, vi } from 'vitest'
import { useTabsStore } from './useTabsStore'

describe('useTabsStore', () => {
  it('opens a tab in a new window using router-resolved href', () => {
    const tabsStore = useTabsStore()
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    const router = {
      resolve: vi.fn(() => ({ href: '/app/settings?from=tab' })),
    }

    tabsStore.openTabInNewWindow({
      path: '/settings',
      fullPath: '/settings?from=tab',
    } as any, router as any)

    expect(router.resolve).toHaveBeenCalledWith({
      path: '/settings',
      query: {},
      params: {},
    })
    expect(open).toHaveBeenCalledWith(
      `${window.location.origin}/app/settings?from=tab`,
      '_blank',
    )

    open.mockRestore()
  })
})
