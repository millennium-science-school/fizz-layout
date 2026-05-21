import type { InjectionKey } from 'vue'
import type { MenuContext } from './menu'

/**
 * Menu 上下文注入 Key
 */
const MENU_CONTEXT_KEY: InjectionKey<MenuContext> = Symbol('fizz-menu-context')

export { MENU_CONTEXT_KEY }
