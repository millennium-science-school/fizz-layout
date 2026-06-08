# Fizz Layout

Fizz Layout is a desktop Vue 3 admin layout component library built with Element Plus.

## Installation

```bash
pnpm add @fizz/layout vue vue-router element-plus @vueuse/core @iconify/vue
```

## Usage

```vue
<script setup lang="ts">
import { FizzLayout } from '@fizz/layout'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@fizz/layout/index.css'
</script>

<template>
  <FizzLayout />
</template>
```

## Layout Modes

- `sidebar-nav`
- `header-nav`
- `mixed-nav`

## Public Imports

```ts
import { FizzLayout, usePreferences } from '@fizz/layout'
import { zhCN, enUS } from '@fizz/layout/locale'
import { useLocale } from '@fizz/layout/hooks'
import type { MenuItemType } from '@fizz/layout/components'
```

## License

MIT
