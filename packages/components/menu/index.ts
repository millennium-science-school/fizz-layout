import Menu from './src/Menu.vue'
import MenuItem from './src/MenuItem.vue'
import SubMenu from './src/SubMenu.vue'

export const FlMenu = Menu
export const FlMenuItem = MenuItem
export const FlSubMenu = SubMenu
export default FlMenu

export type { FlMenuInstance } from './src/instance'

export type {
  BadgeType,
  BadgeVariant,
  MenuBadge,
  MenuContext,
  MenuItem as MenuItemType,
  MenuMode,
  MenuStructItem,
} from './src/menu'
