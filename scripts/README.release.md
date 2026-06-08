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
import type { MenuItemType } from '@fizz/layout/components'
import { FizzLayout, usePreferences } from '@fizz/layout'
import { useLocale } from '@fizz/layout/hooks'
import { enUS, zhCN } from '@fizz/layout/locale'
```

## License

MIT
