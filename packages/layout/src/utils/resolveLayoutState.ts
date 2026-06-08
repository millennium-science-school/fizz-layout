interface ResolveLayoutStateInput {
  layoutMode: {
    isHeaderNav: boolean
    isMixedNav: boolean
    isSideNav: boolean
  }
  sidebar: {
    enable: boolean
    hidden: boolean
    width: number
    collapseWidth: number
    collapsedShowTitle: boolean
  }
  logo: {
    enable: boolean
  }
  navigation: {
    styleType: string
  }
  sidebarCollapsed: boolean
  mixedNavSidebarVisible: boolean
}

function resolveLayoutState(input: ResolveLayoutStateInput) {
  const { layoutMode, sidebar, logo, navigation, sidebarCollapsed, mixedNavSidebarVisible } = input
  const { isHeaderNav, isMixedNav, isSideNav } = layoutMode

  const showHeaderNav = isHeaderNav || isMixedNav
  const baseSidebarVisible = !isHeaderNav && sidebar.enable && !sidebar.hidden
  const sidebarVisible = baseSidebarVisible && (isMixedNav ? mixedNavSidebarVisible : true)
  const showSidebarLogo = logo.enable && isSideNav && sidebarVisible
  const showHeaderLogo = logo.enable && !isSideNav
  const isMenuRounded = navigation.styleType === 'rounded'
  const logoCollapsed = sidebarCollapsed && !isHeaderNav && !isMixedNav
  const logoWidth = logoCollapsed ? sidebar.collapseWidth : sidebar.width
  const logoClass = sidebar.collapsedShowTitle && sidebarCollapsed && !isMixedNav
    ? 'fizz-layout-sidebar-logo--centered'
    : ''

  return {
    showHeaderNav,
    showHeaderLogo,
    sidebarVisible,
    showSidebarLogo,
    isMenuRounded,
    logoCollapsed,
    logoWidth,
    logoClass,
  }
}

export { resolveLayoutState }
export type { ResolveLayoutStateInput }
