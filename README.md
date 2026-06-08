# Fizz Layout

Fizz Layout is a desktop Vue 3 admin layout component library. It provides layout modes, navigation, tabs, breadcrumb, theme controls, notifications, global search, i18n integration, and theme-chalk styles for management applications.

## Features

- Desktop admin layout shell for Vue 3.
- Three layout modes: `sidebar-nav`, `header-nav`, and `mixed-nav`.
- Router-friendly menus, breadcrumbs, tabs, and preferences.
- Built-in components for search, theme mode, fullscreen, notifications, language switching, and user menus.
- Theme styles through `@fizz/layout/index.css` and `@fizz/layout/theme-chalk`.

## Install

```bash
pnpm add @fizz/layout vue vue-router element-plus @vueuse/core @iconify/vue
```

## Usage

```ts
import { FizzLayout } from '@fizz/layout'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@fizz/layout/index.css'
```

## Public Imports

```ts
import { FizzLayout, usePreferences } from '@fizz/layout'
import { zhCN, enUS } from '@fizz/layout/locale'
import { useLocale } from '@fizz/layout/hooks'
import type { MenuItemType } from '@fizz/layout/components'
import '@fizz/layout/theme-chalk'
```

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm -C play run build
```
