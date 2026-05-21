import type { Language } from '@fizz-layout/locale'
import type { App, InjectionKey, Ref } from 'vue'
import type { I18n } from 'vue-i18n'
import { enUS } from '@fizz-layout/locale'
import { computed, inject, ref, watch } from 'vue'

// 注入的 key
const LOCALE_INJECTION_KEY: InjectionKey<Ref<Language>> = Symbol('fizz-layout-locale')

// 默认语言包
const defaultLocale = ref<Language>(enUS)

interface I18nAdapter {
  t: (key: string, params?: any) => string
  locale?: Ref<string>
  availableLocales?: string[] | Ref<string[]>
  setLocale?: (locale: string) => void
}

let adapter: I18nAdapter | null = null

/**
 * 获取嵌套对象的值
 * @param obj 对象
 * @param path 路径，如 'fizz.layout.widgets.search.title'
 */
function getNestedValue(obj: any, path: string): string {
  const keys = path.split('.')
  let result = obj
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key]
    }
    else {
      return path // 找不到则返回原始 key
    }
  }
  return typeof result === 'string' ? result : path
}

/**
 * 替换占位符
 * @param template 模板字符串
 * @param params 参数对象
 */
function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params)
    return template
  // eslint-disable-next-line e18e/prefer-static-regex
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return params[key]?.toString() ?? `{${key}}`
  })
}

/**
 * 国际化 composable
 */
function useLocale() {
  // 尝试从注入获取语言包，否则使用默认的
  const injectedLocale = inject(LOCALE_INJECTION_KEY, null)
  const locale = injectedLocale ?? defaultLocale

  const availableLocales = computed(() => {
    if (adapter?.availableLocales) {
      const source = adapter.availableLocales
      return Array.isArray(source) ? source : source.value
    }
    return [
      'en-US',
      'zh-CN',
    ]
  })

  function setLocale(name: string) {
    if (adapter?.setLocale)
      adapter.setLocale(name)
    else if (adapter?.locale)
      adapter.locale.value = name

    if (locale.value.name !== name)
      locale.value.name = name
  }

  /**
   * 翻译函数
   * @param key 翻译 key
   * @param params 插值参数
   */
  function t(key: string, params?: Record<string, string | number>): string {
    if (adapter) {
      return adapter.t(key, params)
    }
    const value = getNestedValue(locale.value, key)
    return interpolate(value, params)
  }

  return {
    locale,
    t,
    availableLocales,
    setLocale,
  }
}

/**
 * 创建国际化适配器（用于集成 vue-i18n）
 */
function createLocaleAdapter(i18n: I18n) {
  return {
    install(app: App) {
      adapter = {
        t: (key: string, params?: any) => (i18n.global as any).t(key, params) as string,
        locale: i18n.global.locale as Ref<string>,
        availableLocales: i18n.global.availableLocales,
        setLocale: (locale: string) => {
          const target = i18n.global.locale as Ref<string>
          if (target.value !== locale)
            target.value = locale
        },
      }

      const currentLocale = i18n.global.locale as Ref<string>
      if (currentLocale?.value)
        defaultLocale.value.name = currentLocale.value

      watch(
        currentLocale,
        (val) => {
          if (val && defaultLocale.value.name !== val)
            defaultLocale.value.name = val
        },
        { immediate: true },
      )

      app.provide(LOCALE_INJECTION_KEY, defaultLocale)
    },
  }
}

/**
 * 提供给不使用 vue-i18n 的用户的轻量级语言配置插件
 */
function setupFizzLocale(customLocale: Language) {
  return {
    install(app: App) {
      defaultLocale.value = customLocale
      app.provide(LOCALE_INJECTION_KEY, defaultLocale)
    },
  }
}

export { createLocaleAdapter, setupFizzLocale, useLocale }
export type { Language, TranslatePair } from '@fizz-layout/locale'
