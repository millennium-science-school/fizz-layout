import { describe, expect, it } from 'vitest'
import { DEFAULT_PREFERENCES } from './defaultPreferences'
import { usePreferencesStore } from './usePreferencesStore'

describe('usePreferencesStore', () => {
  it('exposes only supported desktop layout preference state', () => {
    const store = usePreferencesStore()

    store.resetPreferences()

    expect(DEFAULT_PREFERENCES.app.layout).toBe('header-nav')
    expect(DEFAULT_PREFERENCES.app).not.toHaveProperty('isMobile')
    expect(store.layoutMode.value).toEqual({
      isHeaderNav: true,
      isMixedNav: false,
      isSideNav: false,
    })
  })
})
