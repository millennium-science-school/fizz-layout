<script setup lang="ts">
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocPropsTable from '../../components/DocPropsTable.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

// ========== createMenus ==========
const createMenusCode = `import { createMenus } from '@fizz/layout'
import type { RouteRecordRaw } from 'vue-router'

// 后端返回的菜单数据
const backendMenus: MenuStructItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    children: [],
    meta: { title: '仪表盘', icon: 'carbon:dashboard', order: 1 },
  },
  {
    name: 'System',
    path: '/system',
    children: [
      { name: 'User', path: 'user', children: [], meta: { title: '用户管理' } },
      { name: 'Role', path: 'role', children: [], meta: { title: '角色管理' } },
    ],
    meta: { title: '系统管理', icon: 'carbon:settings' },
  },
]

// 前端路由定义
const routes: RouteRecordRaw[] = router.getRoutes()

// 合并生成菜单
const menus = createMenus(backendMenus, routes)

// 支持翻译函数和父路径
const menus = createMenus(backendMenus, routes, t, '/admin')`

const menuStructTypeCode = `// MenuStructItem 类型定义
interface MenuStructItem {
  name: string               // 路由 name（与路由匹配的关键）
  path: string               // 路径
  children: MenuStructItem[] // 子菜单
  meta?: {
    title?: string           // 菜单标题
    icon?: string            // 图标名称
    order?: number           // 排序权重
    hidden?: boolean         // 是否隐藏
    badge?: string | number  // 徽标
    badgeType?: string       // 徽标类型
    target?: string          // 链接打开方式
    [key: string]: any       // 其他自定义字段
  }
}`

const createMenusParamsProps = [
  { name: 'backendMenus', type: 'MenuStructItem[]', description: '后端返回的菜单树结构数据' },
  { name: 'routes', type: 'RouteRecordRaw[]', description: 'Vue Router 路由定义数组' },
  { name: 't', type: '(key: string) => string', description: '可选。翻译函数，用于 meta.title 的国际化' },
  { name: 'parentPath', type: 'string', description: '可选。父路径前缀，用于嵌套路由拼接' },
]

// ========== findMenuByPath ==========
const findMenuCode = `import { findMenuByPath, findRootMenuByPath } from '@fizz/layout'

const menus = [/* 菜单树 */]

// 在菜单树中查找指定路径的菜单项
const menu = findMenuByPath(menus, '/system/user')
// => { path: '/system/user', title: '用户管理', ... }

// 查找路径所属的根级菜单
const root = findRootMenuByPath(menus, '/system/user')
// => { path: '/system', title: '系统管理', ... }`

const findMenuParamsProps = [
  { name: 'menus', type: 'MenuItem[]', description: '菜单树数据' },
  { name: 'path', type: 'string', description: '要查找的路径' },
]

// ========== deepMerge ==========
const deepMergeCode = `import { deepMerge } from '@fizz/layout'

const target = {
  app: { name: 'My App', layout: 'side-nav' },
  sidebar: { collapsed: false, width: 210 },
}

const source = {
  app: { layout: 'header-nav' },  // 仅更新 layout
  sidebar: { width: 240 },        // 仅更新 width
}

const result = deepMerge(target, source)
// => {
//   app: { name: 'My App', layout: 'header-nav' },
//   sidebar: { collapsed: false, width: 240 },
// }
// 注意：这是深度合并，不是浅层 Object.assign`

const deepMergeParamsProps = [
  { name: 'target', type: 'Record<string, any>', description: '目标对象（会被修改并返回）' },
  { name: 'source', type: 'Record<string, any>', description: '源对象，其属性将深度合并到 target 中' },
]

// ========== createLocaleAdapter ==========
const createLocaleAdapterDetailCode = `import { createLocaleAdapter, setupFizzLocale } from '@fizz/layout/hooks'

// ========== 方案一：桥接 vue-i18n ==========
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages: {
    'zh-CN': { /* ... */ },
    'en-US': { /* ... */ },
  },
})

const adapter = createLocaleAdapter(i18n)
// 返回一个 Vue 插件，安装后会自动同步：
// - i18n.locale <-> fizz-layout 内部 locale
// - 统一 t() 函数

app.use(adapter)

// ========== 方案二：轻量级方案 ==========
// 不依赖 vue-i18n，使用内置翻译
const plugin = setupFizzLocale({
  defaultLocale: 'zh-CN',
  // 可选：自定义翻译
  // messages: { 'zh-CN': { ... } },
})

app.use(plugin)`

const localeAdapterParamsProps = [
  { name: 'i18n', type: 'I18n', description: 'vue-i18n 实例，由 createI18n() 创建' },
]

const setupFizzLocaleParamsProps = [
  { name: 'customLocale', type: '{ defaultLocale?: string; messages?: Record<string, any> }', description: '可选配置对象，设置默认语言和自定义翻译' },
]
</script>

<template>
  <DocSection title="工具函数" description="createMenus / findMenuByPath / deepMerge / createLocaleAdapter / setupFizzLocale 工具函数参考">
    <!-- createMenus -->
    <div>
      <h2>createMenus</h2>
      <p>
        将后端返回的菜单结构与前端路由定义合并，生成完整的菜单树。
        通过路由 <code>name</code> 匹配后端菜单项，自动合并路由的 <code>meta</code> 信息。
      </p>
    </div>

    <div>
      <h3>基础用法</h3>
      <DocCodeBlock :code="createMenusCode" language="typescript" />
    </div>

    <div>
      <h3>MenuStructItem 类型</h3>
      <DocCodeBlock :code="menuStructTypeCode" language="typescript" />
    </div>

    <DocPropsTable title="参数" :data="createMenusParamsProps" />

    <DocTip type="tip">
      <code>createMenus</code> 与 <code>useMenuAdapter</code> 的区别：前者是纯函数，后者是响应式 Hook。
      大多数场景推荐使用 <code>useMenuAdapter</code>，它内部调用了 <code>createMenus</code>。
    </DocTip>

    <!-- findMenuByPath -->
    <div>
      <h2>findMenuByPath / findRootMenuByPath</h2>
      <p>在菜单树中根据路径查找菜单项。<code>findMenuByPath</code> 查找精确匹配，<code>findRootMenuByPath</code> 查找所属的根级菜单。</p>
    </div>

    <DocCodeBlock :code="findMenuCode" language="typescript" />
    <DocPropsTable title="参数" :data="findMenuParamsProps" />

    <!-- deepMerge -->
    <div>
      <h2>deepMerge</h2>
      <p>
        深度合并两个对象。与 <code>Object.assign</code> 不同，它会递归合并嵌套对象而不是直接覆盖。
        主要用于偏好更新场景。
      </p>
    </div>

    <DocCodeBlock :code="deepMergeCode" language="typescript" />
    <DocPropsTable title="参数" :data="deepMergeParamsProps" />

    <DocTip type="warning">
      <code>deepMerge</code> 会直接修改 <code>target</code> 对象。如需不可变操作，请先克隆：
      <code>deepMerge({ ...target }, source)</code>
    </DocTip>

    <!-- createLocaleAdapter / setupFizzLocale -->
    <div>
      <h2>createLocaleAdapter / setupFizzLocale</h2>
      <p>
        国际化设置工具函数。<code>createLocaleAdapter</code> 用于桥接 <code>vue-i18n</code>；
        <code>setupFizzLocale</code> 是不依赖外部 i18n 库的轻量级方案。
      </p>
    </div>

    <DocCodeBlock :code="createLocaleAdapterDetailCode" language="typescript" />
    <DocPropsTable title="createLocaleAdapter 参数" :data="localeAdapterParamsProps" />
    <DocPropsTable title="setupFizzLocale 参数" :data="setupFizzLocaleParamsProps" />
  </DocSection>
</template>
