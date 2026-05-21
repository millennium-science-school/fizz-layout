import { createLocaleAdapter } from '@fizz-layout/core'
import { enUS, zhCN } from '@fizz-layout/locale'
import carbonIcons from '@iconify-json/carbon/icons.json'
import { addCollection } from '@iconify/vue'
import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import appEnUS from './locales/en-US'
import appZhCN from './locales/zh-CN'
import { router } from './router/index'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@fizz-layout/theme-chalk/src/index.scss'

addCollection(carbonIcons)

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': { ...enUS, ...appEnUS },
    'zh-CN': { ...zhCN, ...appZhCN },
  },
})

createApp(App)
  .use(router)
  .use(ElementPlus)
  .use(i18n)
  .use(createLocaleAdapter(i18n))
  .mount('#app')
