<script setup lang="ts">
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocPropsTable from '../../components/DocPropsTable.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

const menuItemTypeCode = `interface MenuItem {
  path: string           // 路由路径（唯一标识）
  name: string           // 菜单显示名称
  icon?: string          // 图标（Iconify 格式，如 'carbon:home'）
  activeIcon?: string    // 激活时的图标
  children?: MenuItem[]  // 子菜单
  disabled?: boolean     // 是否禁用
  show?: boolean         // 是否在菜单中显示（默认 true）
  order?: number         // 排序权重
  parent?: string        // 父级路径
  parents?: string[]     // 所有祖先路径
}`

const manualMenuCode = `// 方式一：手动编写菜单数据
const menus = [
  { name: '首页', path: '/', icon: 'carbon:home' },
  {
    name: '系统管理',
    path: '/system',
    icon: 'carbon:settings',
    children: [
      { name: '用户管理', path: '/system/users', icon: 'carbon:user' },
      { name: '角色管理', path: '/system/roles', icon: 'carbon:user-role' },
      { name: '菜单管理', path: '/system/menus', icon: 'carbon:list' },
    ],
  },
  {
    name: '外部链接',
    path: 'https://github.com',
    icon: 'carbon:logo-github',
  },
]`

const adapterCode = `// 方式二：使用 useMenuAdapter 从路由自动生成菜单
import { useMenuAdapter } from '@fizz/layout'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { menus, generateFromRoutes } = useMenuAdapter({
  // 可选：国际化翻译函数
  t: key => t(key),
  // 可选：过滤路由（返回 false 排除）
  filter: route => !route.meta?.hideInMenu,
  // 可选：自定义转换
  transform: (route, menu) => ({
    ...menu,
    badge: route.meta?.badge,
  }),
})

// 从路由表生成菜单
generateFromRoutes(router.getRoutes())`

const createMenusCode = `// 方式三：使用 createMenus 将后端菜单结构 + 前端路由合并
import { createMenus } from '@fizz/layout'

// 后端返回的菜单结构（只有 code 和层级关系）
const backendMenus: MenuStructItem[] = [
  { code: 'Home' },
  {
    code: 'System',
    children: [
      { code: 'Users' },
      { code: 'Roles' },
    ],
  },
]

// createMenus 根据 code 匹配路由 name，合并生成完整菜单
const menus = createMenus(backendMenus, router.getRoutes(), t)`

const menuStructCode = `// 后端菜单结构定义
interface MenuStructItem {
  code: string                    // 对应路由的 name
  children?: MenuStructItem[]     // 子菜单
}`

const routeMetaProps = [
  { name: 'title', type: 'string', description: '菜单显示名称 / 标签页标题（支持 i18n key）' },
  { name: 'icon', type: 'string', description: '菜单图标（Iconify 格式）' },
  { name: 'activeIcon', type: 'string', description: '菜单激活时的图标' },
  { name: 'hideInMenu', type: 'boolean', default: 'false', description: '在菜单中隐藏此路由' },
  { name: 'hideChildrenInMenu', type: 'boolean', default: 'false', description: '在菜单中隐藏子路由' },
  { name: 'hideInBreadcrumb', type: 'boolean', default: 'false', description: '在面包屑中隐藏' },
  { name: 'hideInTab', type: 'boolean', default: 'false', description: '在标签页中隐藏' },
  { name: 'keepAlive', type: 'boolean', description: '是否启用 KeepAlive 缓存' },
  { name: 'affixTab', type: 'boolean', default: 'false', description: '固定在标签页中（不可关闭）' },
  { name: 'affixTabOrder', type: 'number', description: '固定标签的排序权重' },
  { name: 'tabClosable', type: 'boolean', default: 'true', description: '标签页是否可关闭' },
  { name: 'isExternal', type: 'boolean', description: '是否为外部链接' },
  { name: 'iframeSrc', type: 'string', description: '内嵌 iframe 的 URL' },
  { name: 'maxNumOfOpenTab', type: 'number', description: '此路由可同时打开的最大标签数' },
]
</script>

<template>
  <DocSection title="菜单配置" description="使用 createMenus 将后端菜单结构与前端路由合并生成完整菜单">
    <div>
      <h2>概览</h2>
      <p>
        FizzLayout 通过 <code>menus</code> prop 接收菜单数据来渲染导航。
        你有三种方式生成菜单数据：手动编写、从路由自动生成、或后端菜单结构与前端路由合并。
      </p>
    </div>

    <div>
      <h2>MenuItemType 类型定义</h2>
      <p>菜单项的核心类型定义：</p>
      <DocCodeBlock :code="menuItemTypeCode" language="typescript" />
    </div>

    <div>
      <h2>方式一：手动编写菜单</h2>
      <p>最简单的方式，适合菜单项固定、数量较少的场景：</p>
      <DocCodeBlock :code="manualMenuCode" language="typescript" />
    </div>

    <DocTip>
      <code>path</code> 以 <code>http://</code> 或 <code>https://</code> 开头会被识别为外部链接，点击后在新窗口打开。
    </DocTip>

    <div>
      <h2>方式二：路由自动生成（useMenuAdapter）</h2>
      <p>
        使用 <code>useMenuAdapter</code> hook 从 vue-router 路由表自动生成菜单。
        路由的 <code>meta</code> 字段会映射为菜单的图标、名称等属性：
      </p>
      <DocCodeBlock :code="adapterCode" language="typescript" />
    </div>

    <div>
      <h2>方式三：后端菜单 + 前端路由合并（createMenus）</h2>
      <p>
        适用于菜单结构由后端权限系统控制的场景。后端只返回菜单 <code>code</code>（对应路由 <code>name</code>）
        和层级关系，前端通过 <code>createMenus</code> 合并路由信息生成完整菜单：
      </p>
      <DocCodeBlock :code="menuStructCode" language="typescript" />
      <DocCodeBlock :code="createMenusCode" language="typescript" />
    </div>

    <DocTip type="warning">
      <code>createMenus</code> 通过 <code>MenuStructItem.code</code> 匹配路由的 <code>name</code>。
      如果找不到匹配的路由，会在控制台输出警告。
    </DocTip>

    <div>
      <h2>路由 meta 字段参考</h2>
      <p>以下 <code>meta</code> 字段会被 FizzLayout 用于菜单、标签页和面包屑的行为控制：</p>
      <DocPropsTable title="RouteMeta 字段" :data="routeMetaProps" />
    </div>

    <div>
      <h2>三种方式对比</h2>
      <el-table
        :data="[
          { method: '手动编写', scenario: '菜单固定、数量少', pros: '简单直观', cons: '维护成本高' },
          { method: 'useMenuAdapter', scenario: '纯前端权限控制', pros: '自动同步路由', cons: '不支持后端动态菜单' },
          { method: 'createMenus', scenario: '后端权限控制', pros: '灵活、支持动态菜单', cons: '需要后端配合' },
        ]"
        stripe
        border
      >
        <el-table-column prop="method" label="方式" width="150" />
        <el-table-column prop="scenario" label="适用场景" />
        <el-table-column prop="pros" label="优点" />
        <el-table-column prop="cons" label="缺点" />
      </el-table>
    </div>
  </DocSection>
</template>
