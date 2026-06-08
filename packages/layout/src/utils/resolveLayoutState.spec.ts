import { describe, expect, it } from 'vitest'
import { resolveLayoutState } from './resolveLayoutState'

const baseInput = {
  layoutMode: {
    isHeaderNav: false,
    isMixedNav: false,
    isSideNav: true,
  },
  sidebar: {
    enable: true,
    hidden: false,
    width: 224,
    collapseWidth: 72,
    collapsedShowTitle: false,
  },
  logo: {
    enable: true,
  },
  navigation: {
    styleType: 'rounded',
  },
  sidebarCollapsed: false,
  mixedNavSidebarVisible: true,
}

describe('resolveLayoutState', () => {
  it('shows sidebar and sidebar logo for sidebar-nav', () => {
    expect(resolveLayoutState(baseInput)).toMatchObject({
      showHeaderNav: false,
      sidebarVisible: true,
      showSidebarLogo: true,
      showHeaderLogo: false,
      isMenuRounded: true,
      logoCollapsed: false,
    })
  })

  it('hides sidebar for header-nav', () => {
    expect(resolveLayoutState({
      ...baseInput,
      layoutMode: { isHeaderNav: true, isMixedNav: false, isSideNav: false },
    })).toMatchObject({
      showHeaderNav: true,
      sidebarVisible: false,
      showSidebarLogo: false,
      showHeaderLogo: true,
    })
  })

  it('hides mixed sidebar when active root has no children', () => {
    expect(resolveLayoutState({
      ...baseInput,
      layoutMode: { isHeaderNav: false, isMixedNav: true, isSideNav: false },
      mixedNavSidebarVisible: false,
    })).toMatchObject({
      showHeaderNav: true,
      sidebarVisible: false,
      showSidebarLogo: false,
      showHeaderLogo: true,
    })
  })
})
