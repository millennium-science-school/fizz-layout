<script setup lang="ts">
import { useLocale, usePreferences } from '@fizz-layout/core'
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

const { locale } = usePreferences()
const { t } = useLocale()

const setupCode = `// main.ts — 完整的国际化配置
import { createLocaleAdapter } from '@fizz/layout'
import { zhCN, enUS } from '@fizz-layout/locale'
import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': {
      ...zhCN,                  // Fizz Layout 内置中文
      app: { title: '我的应用' }, // 你的应用文案
    },
    'en-US': {
      ...enUS,                  // Fizz Layout 内置英文
      app: { title: 'My App' },
    },
  },
})

const app = createApp(App)
app.use(i18n)
app.use(createLocaleAdapter(i18n)) // ⬅️ 关键：桥接 vue-i18n 和 FizzLayout
app.mount('#app')`

const localeStructCode = `// @fizz/layout/locale 内置语言包结构
export default {
  name: 'zh-CN',
  fizz: {
    layout: {
      header: { refresh: '刷新' },
      widgets: {
        globalSearch: { title: '全局搜索', placeholder: '搜索菜单...', noResults: '无匹配结果' },
        fullscreen: { enter: '全屏', exit: '退出全屏' },
        appearance: { switchToLight: '切换到浅色模式', switchToDark: '切换到深色模式', ... },
        translation: { title: '切换语言' },
        notification: { title: '通知', notifications: '通知', messages: '消息', todos: '待办', ... },
        ...
      },
      tabs: {
        contextMenu: { close: '关闭', closeAll: '关闭全部', closeOther: '关闭其他', pin: '固定', ... },
      },
      breadcrumb: { home: '首页' },
      copyright: { text: '版权所有' },
    },
  },
}`

const useLocaleCode = `import { useLocale } from '@fizz/layout'

const { locale, t, availableLocales, setLocale } = useLocale()

// 翻译（自动使用 vue-i18n 适配器）
const label = t('fizz.layout.widgets.globalSearch.title') // '全局搜索'

// 获取当前语言
console.log(locale.value.name) // 'zh-CN'

// 切换语言
setLocale('en-US')

// 可用语言列表
console.log(availableLocales.value) // ['zh-CN', 'en-US']`

const withoutI18nCode = `// 不使用 vue-i18n 的轻量级方案
import { setupFizzLocale } from '@fizz/layout'
import { zhCN } from '@fizz/layout/locale'

const app = createApp(App)
app.use(setupFizzLocale(zhCN)) // 直接使用内置语言包`

const adapterCode = `// createLocaleAdapter 的作用
// 1. 将 vue-i18n 的 t() 函数注入到 FizzLayout 组件内部
// 2. 同步 vue-i18n 的 locale 变化到 FizzLayout
// 3. 使 FizzLayout 内置组件（面包屑、通知、搜索等）自动使用 vue-i18n 翻译

// 如果不调用 createLocaleAdapter：
// - FizzLayout 组件会 fallback 到内置英文语言包
// - 语言切换不会影响 FizzLayout 内部组件`

const menuI18nCode = `// 菜单名称国际化
// 在语言包中定义菜单翻译
const messages = {
  'zh-CN': {
    ...zhCN,
    app: {
      router: {
        home: '首页',
        users: '用户管理',
        settings: '系统设置',
      },
    },
  },
  'en-US': {
    ...enUS,
    app: {
      router: {
        home: 'Home',
        users: 'User Management',
        settings: 'Settings',
      },
    },
  },
}

// 使用 t() 翻译菜单名称
const menus = computed(() => [
  { name: t('app.router.home'), path: '/', icon: 'carbon:home' },
  { name: t('app.router.users'), path: '/users', icon: 'carbon:user' },
])`
</script>

<template>
  <DocSection title="国际化" description="内置语言包与 vue-i18n 的桥接机制">
    <div>
      <h2>概览</h2>
      <p>
        Fizz Layout 通过 <code>createLocaleAdapter</code> 与 <code>vue-i18n</code> 桥接，
        实现组件库内置文案的多语言切换。内置中文（zh-CN）和英文（en-US）两套语言包，
        涵盖搜索、通知、标签页右键菜单、面包屑等所有内部文案。
      </p>
    </div>

    <div>
      <h2>基础配置</h2>
      <p>在 <code>main.ts</code> 中配置 vue-i18n 并通过 <code>createLocaleAdapter</code> 桥接：</p>
      <DocCodeBlock :code="setupCode" language="typescript" />
    </div>

    <DocTip>
      <code>createLocaleAdapter(i18n)</code> 是关键步骤！它将 vue-i18n 的翻译能力注入到 FizzLayout 的所有内部组件中。
      不调用此方法，FizzLayout 组件将 fallback 到内置英文。
    </DocTip>

    <div>
      <h2>内置语言包结构</h2>
      <p>
        <code>@fizz/layout/locale</code> 导出 <code>zhCN</code> 和 <code>enUS</code>，
        包含所有 FizzLayout 内部组件的翻译文案：
      </p>
      <DocCodeBlock :code="localeStructCode" language="typescript" />
    </div>

    <div>
      <h2>useLocale Hook</h2>
      <p>在组件内使用 <code>useLocale()</code> 访问国际化能力：</p>
      <DocCodeBlock :code="useLocaleCode" language="typescript" />
    </div>

    <!-- Interactive Demo -->
    <div>
      <h2>交互演示</h2>
      <p>当前语言：<code>{{ locale.name }}</code></p>
      <p>翻译示例：</p>
      <div class="i18n-demo">
        <div class="i18n-demo__row">
          <span class="i18n-demo__key">fizz.layout.header.refresh</span>
          <span class="i18n-demo__arrow">→</span>
          <span class="i18n-demo__value">{{ t('fizz.layout.header.refresh') }}</span>
        </div>
        <div class="i18n-demo__row">
          <span class="i18n-demo__key">fizz.layout.widgets.globalSearch.title</span>
          <span class="i18n-demo__arrow">→</span>
          <span class="i18n-demo__value">{{ t('fizz.layout.widgets.globalSearch.title') }}</span>
        </div>
        <div class="i18n-demo__row">
          <span class="i18n-demo__key">fizz.layout.tabs.contextMenu.close</span>
          <span class="i18n-demo__arrow">→</span>
          <span class="i18n-demo__value">{{ t('fizz.layout.tabs.contextMenu.close') }}</span>
        </div>
        <div class="i18n-demo__row">
          <span class="i18n-demo__key">fizz.layout.widgets.notification.title</span>
          <span class="i18n-demo__arrow">→</span>
          <span class="i18n-demo__value">{{ t('fizz.layout.widgets.notification.title') }}</span>
        </div>
        <div class="i18n-demo__row">
          <span class="i18n-demo__key">fizz.layout.breadcrumb.home</span>
          <span class="i18n-demo__arrow">→</span>
          <span class="i18n-demo__value">{{ t('fizz.layout.breadcrumb.home') }}</span>
        </div>
      </div>
      <DocTip>
        💡 点击顶栏右侧的语言切换按钮（English / 中文），观察上方翻译结果的实时变化。
      </DocTip>
    </div>

    <div>
      <h2>菜单名称国际化</h2>
      <p>菜单的 <code>name</code> 字段支持使用 <code>t()</code> 翻译，实现菜单名称多语言：</p>
      <DocCodeBlock :code="menuI18nCode" language="typescript" />
    </div>

    <div>
      <h2>不使用 vue-i18n</h2>
      <p>如果你的项目不需要多语言，可以使用轻量级方案直接设置语言包：</p>
      <DocCodeBlock :code="withoutI18nCode" language="typescript" />
    </div>

    <div>
      <h2>createLocaleAdapter 原理</h2>
      <DocCodeBlock :code="adapterCode" language="typescript" />
    </div>
  </DocSection>
</template>

<style scoped>
.i18n-demo {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.i18n-demo__row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  border-bottom: 1px solid var(--el-border-color-extra-light);
  font-size: 0.875rem;
}

.i18n-demo__row:last-child {
  border-bottom: none;
}

.i18n-demo__key {
  font-family: 'Fira Code', Consolas, monospace;
  font-size: 0.8125rem;
  color: var(--el-text-color-secondary);
}

.i18n-demo__arrow {
  color: var(--el-text-color-placeholder);
}

.i18n-demo__value {
  font-weight: 600;
  color: var(--el-color-primary);
  min-width: 80px;
}
</style>
