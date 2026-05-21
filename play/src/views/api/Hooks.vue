<script setup lang="ts">
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocPropsTable from '../../components/DocPropsTable.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

// ========== useLocale ==========
const useLocaleCode = `import { useLocale } from '@fizz/layout/hooks'

const { locale, t, availableLocales, setLocale } = useLocale()

// 获取当前语言代码
console.log(locale.value) // 'zh-CN'

// 翻译
const label = t('menu.dashboard')

// 查看可用语言
console.log(availableLocales.value) // ['zh-CN', 'en-US']

// 切换语言
setLocale('en-US')`

const createLocaleAdapterCode = `import { createLocaleAdapter } from '@fizz/layout/hooks'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'zh-CN',
  messages: { /* ... */ },
})

// 创建适配器桥接 vue-i18n 和 fizz-layout
const localeAdapter = createLocaleAdapter(i18n)

// 安装布局时传入
app.use(FizzLayout, {
  localeAdapter,
})`

const setupFizzLocaleCode = `import { setupFizzLocale } from '@fizz/layout/hooks'

// 轻量级方案 — 不依赖 vue-i18n
// 内置中英文翻译，适用于简单项目
app.use(setupFizzLocale({
  defaultLocale: 'zh-CN',
}))`

const localeReturnProps = [
  { name: 'locale', type: 'ComputedRef<string>', description: '当前语言代码（如 "zh-CN"）' },
  { name: 't', type: '(key: string, ...args: any[]) => string', description: '翻译函数，支持参数插值' },
  { name: 'availableLocales', type: 'ComputedRef<string[]>', description: '所有可用的语言代码列表' },
  { name: 'setLocale', type: '(locale: string) => void', description: '切换当前语言' },
]

// ========== useMenuAdapter ==========
const useMenuAdapterCode = `import { useMenuAdapter } from '@fizz/layout/hooks'
import { useRouter } from 'vue-router'

const router = useRouter()

const {
  menus,               // 响应式菜单树（Ref<MenuItem[]>）
  menusRef,            // 同 menus 的别名
  generateFromRoutes,  // 从路由生成菜单
  setMenus,            // 直接设置菜单数据
  createBinding,       // 创建布局绑定对象
} = useMenuAdapter({
  // 可选配置
  t: undefined,           // 翻译函数
  filter: undefined,      // 菜单过滤器
  transform: undefined,   // 菜单项转换器
})`

const generateMenusCode = `// 从路由自动生成菜单
generateFromRoutes(router.getRoutes())

// 或直接设置后端返回的菜单数据
setMenus([
  {
    title: '仪表盘',
    path: '/dashboard',
    icon: 'carbon:dashboard',
    children: [],
  },
])`

const menuBindingCode = `// createBinding() 返回的绑定对象可以直接传给 FizzLayout
// 它包含 menus 数据和事件处理，无需手动连接
<FizzLayout v-bind="createBinding()" />`

const menuFilterCode = `// 使用 filter 和 transform 自定义菜单处理
const { menus, generateFromRoutes } = useMenuAdapter({
  // 过滤掉隐藏菜单
  filter: (route) => !route.meta?.hidden,

  // 转换菜单项
  transform: (menu, route) => ({
    ...menu,
    icon: route.meta?.icon || 'carbon:folder',
    badge: route.meta?.badge,
  }),
})`

const menuAdapterReturnProps = [
  { name: 'menus', type: 'Ref<MenuItemType[]>', description: '响应式菜单树数据' },
  { name: 'menusRef', type: 'Ref<MenuItemType[]>', description: 'menus 的别名引用' },
  { name: 'generateFromRoutes', type: '(routes: RouteRecordRaw[]) => MenuItemType[]', description: '从 Vue Router 路由配置生成菜单树' },
  { name: 'setMenus', type: '(menus: MenuItemType[]) => void', description: '直接设置菜单数据（用于后端返回菜单）' },
  { name: 'createBinding', type: '(source: ComputedRef<RouteRecordRaw[]> | Ref<RouteRecordRaw[]>) => WatchStopHandle', description: '创建可直接绑定到 FizzLayout 的属性和事件对象' },
]

const menuAdapterOptionsProps = [
  { name: 't', type: '(key: string) => string', description: '可选。翻译函数，用于菜单标题国际化' },
  { name: 'filter', type: '(route: RouteRecordRaw) => boolean', description: '可选。路由过滤器，返回 false 的路由不会生成菜单项' },
  { name: 'transform', type: '(menu: MenuItem, route: RouteRecordRaw) => MenuItem', description: '可选。菜单项转换器，可用于添加 badge、图标等自定义属性' },
]

// ========== useMenuClick ==========
const useMenuClickCode = `import { useMenuClick } from '@fizz/layout/hooks'

const {
  onMenuClick,       // 注册菜单点击处理器
  offMenuClick,      // 移除处理器
  triggerMenuClick,  // 手动触发
  clearAllHandlers,  // 清除所有处理器
  getHandlerCount,   // 获取处理器数量
  handlerCount,      // 处理器数量（ComputedRef）
} = useMenuClick()`

const menuClickUsageCode = `import { useMenuClick } from '@fizz/layout/hooks'

const { onMenuClick, offMenuClick } = useMenuClick()

// 注册处理器（默认在组件卸载时自动清理）
onMenuClick((menu) => {
  console.log('菜单被点击:', menu.path)
  // 可以执行自定义导航逻辑
})

// 禁用自动清理
const handler = (menu) => { /* ... */ }
onMenuClick(handler, { autoCleanup: false })

// 手动移除
offMenuClick(handler)`

const menuClickInterceptorCode = `import { useMenuClick } from '@fizz/layout/hooks'
import { useRouter } from 'vue-router'

const router = useRouter()
const { onMenuClick } = useMenuClick()

// 实现拦截器模式 — 外链菜单自动打开新窗口
onMenuClick((menu) => {
  if (menu.path.startsWith('http')) {
    window.open(menu.path, '_blank')
    return // 不执行默认导航
  }
  router.push(menu.path)
})`

const menuClickReturnProps = [
  { name: 'onMenuClick', type: '(handler: MenuClickHandler, options?: { autoCleanup?: boolean }) => void', description: '注册菜单点击处理器，autoCleanup 默认 true' },
  { name: 'offMenuClick', type: '(handler: MenuClickHandler) => void', description: '移除指定处理器' },
  { name: 'triggerMenuClick', type: '(menu: MenuItem) => void', description: '手动触发所有处理器' },
  { name: 'clearAllHandlers', type: '() => void', description: '清除所有已注册的处理器' },
  { name: 'getHandlerCount', type: '() => number', description: '获取当前处理器数量' },
  { name: 'handlerCount', type: 'ComputedRef<number>', description: '处理器数量（响应式）' },
]

// ========== useLogoClick ==========
const useLogoClickCode = `import { useLogoClick } from '@fizz/layout/hooks'

const { onLogoClick, offLogoClick } = useLogoClick()

// 注册 Logo 点击处理器
onLogoClick(() => {
  router.push('/')
})

// 带参数的处理器
onLogoClick((event) => {
  console.log('Logo 被点击', event)
})`

const logoClickReturnProps = [
  { name: 'onLogoClick', type: '(handler: LogoClickHandler, options?: { autoCleanup?: boolean }) => void', description: '注册 Logo 点击处理器' },
  { name: 'offLogoClick', type: '(handler: LogoClickHandler) => void', description: '移除指定处理器' },
  { name: 'triggerLogoClick', type: '(event?: Event) => void', description: '手动触发所有处理器' },
  { name: 'clearAllHandlers', type: '() => void', description: '清除所有已注册的处理器' },
  { name: 'getHandlerCount', type: '() => number', description: '获取当前处理器数量' },
  { name: 'handlerCount', type: 'ComputedRef<number>', description: '处理器数量（响应式）' },
]
</script>

<template>
  <DocSection title="Hooks" description="useLocale / useMenuAdapter / useMenuClick / useLogoClick — 业务 Hooks API 参考">
    <!-- useLocale -->
    <div>
      <h2>useLocale</h2>
      <p>国际化适配 Hook，提供统一的翻译和语言切换接口。可桥接 <code>vue-i18n</code> 或使用内置的轻量级方案。</p>
    </div>

    <div>
      <h3>基础用法</h3>
      <DocCodeBlock :code="useLocaleCode" language="typescript" />
    </div>

    <DocPropsTable title="返回值" :data="localeReturnProps" />

    <div>
      <h3>createLocaleAdapter — 桥接 vue-i18n</h3>
      <p>如果项目使用 <code>vue-i18n</code>，通过此函数创建适配器即可自动同步语言状态。</p>
      <DocCodeBlock :code="createLocaleAdapterCode" language="typescript" />
    </div>

    <div>
      <h3>setupFizzLocale — 轻量级方案</h3>
      <p>不依赖 <code>vue-i18n</code> 的简单场景可使用此 API，内置中英文翻译。</p>
      <DocCodeBlock :code="setupFizzLocaleCode" language="typescript" />
    </div>

    <!-- useMenuAdapter -->
    <div>
      <h2>useMenuAdapter</h2>
      <p>
        路由到菜单的自动转换 Hook。从 Vue Router 路由定义自动生成菜单树，
        支持自定义过滤器和转换器。也支持直接设置后端返回的菜单数据。
      </p>
    </div>

    <div>
      <h3>基础用法</h3>
      <DocCodeBlock :code="useMenuAdapterCode" language="typescript" />
    </div>

    <div>
      <h3>从路由生成 / 直接设置</h3>
      <DocCodeBlock :code="generateMenusCode" language="typescript" />
    </div>

    <div>
      <h3>创建布局绑定</h3>
      <DocCodeBlock :code="menuBindingCode" language="vue" />
    </div>

    <div>
      <h3>自定义过滤与转换</h3>
      <DocCodeBlock :code="menuFilterCode" language="typescript" />
    </div>

    <DocPropsTable title="返回值" :data="menuAdapterReturnProps" />
    <DocPropsTable title="MenuAdapterOptions 参数" :data="menuAdapterOptionsProps" />

    <!-- useMenuClick -->
    <div>
      <h2>useMenuClick</h2>
      <p>
        菜单点击事件处理 Hook，采用发布-订阅模式。可注册多个处理器，
        默认在组件卸载时自动清理。适用于拦截菜单导航或添加自定义行为。
      </p>
    </div>

    <div>
      <h3>基础用法</h3>
      <DocCodeBlock :code="useMenuClickCode" language="typescript" />
    </div>

    <div>
      <h3>注册与移除处理器</h3>
      <DocCodeBlock :code="menuClickUsageCode" language="typescript" />
    </div>

    <div>
      <h3>拦截器模式</h3>
      <DocCodeBlock :code="menuClickInterceptorCode" language="typescript" />
    </div>

    <DocPropsTable title="返回值" :data="menuClickReturnProps" />

    <DocTip type="tip">
      <code>autoCleanup: true</code>（默认）会在调用组件的 <code>onUnmounted</code> 时自动移除处理器，
      避免内存泄漏。如果在全局（非组件上下文）注册，请设置 <code>autoCleanup: false</code> 并手动管理生命周期。
    </DocTip>

    <!-- useLogoClick -->
    <div>
      <h2>useLogoClick</h2>
      <p>Logo 点击事件处理 Hook，API 与 <code>useMenuClick</code> 完全一致，仅事件类型不同。</p>
    </div>

    <div>
      <h3>基础用法</h3>
      <DocCodeBlock :code="useLogoClickCode" language="typescript" />
    </div>

    <DocPropsTable title="返回值" :data="logoClickReturnProps" />
  </DocSection>
</template>
