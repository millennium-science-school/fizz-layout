// Layout 主组件
import FizzLayout from './Layout.vue'

type FizzLayoutInstance = InstanceType<typeof FizzLayout>

// 内部组件导出
export { FlContainer } from './components/container'
export { FlHeader } from './components/header'
export { FlTabs } from './components/tabs'

// Composables
export * from './composables'

export type { FizzLayoutProps } from './layout'

// Store
export { setFizzStorageConfig } from './store'
export type { FizzStorageOptions } from './store'
export { DEFAULT_PREFERENCES } from './store/defaultPreferences'

// Types
export * from './types'

export { FizzLayout }
export type { FizzLayoutInstance }

// Utils
export { createMenus } from './utils'

// 从 @fizz-layout/components 重新导出组件和类型
export * from '@fizz-layout/components'

// 导出 @fizz-layout/hooks
export * from '@fizz-layout/hooks'
