// @vitest-environment node

import { describe, expect, it, vi } from 'vitest'

describe('usePreferencesStore SSR compatibility', () => {
  it('can initialize without browser storage globals', async () => {
    vi.resetModules()
    const { usePreferencesStore } = await import('./usePreferencesStore')

    expect(() => usePreferencesStore()).not.toThrow()
  })
})
