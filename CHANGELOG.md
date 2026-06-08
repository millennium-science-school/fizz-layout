# Changelog

## Unreleased

### Breaking Changes

- Fizz Layout is now documented and typed as a desktop-only admin layout package.
- Removed the `full-content` layout mode from `LayoutType`.
- Removed the stale `side-nav` documentation alias; use `sidebar-nav`.
- Removed `app.isMobile` from layout preferences and defaults.
- Removed `layoutMode.isFullContent` from the preferences composable derived state.
- Removed mobile/desktop visibility utility classes from theme-chalk.
- Removed responsive SCSS mixins from theme-chalk.
- Existing persisted preferences may contain removed fields or layout values; clear local Fizz Layout cache after upgrading.
