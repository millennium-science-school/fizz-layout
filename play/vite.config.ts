import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  base: './',
  define: {
    'process.env': {},
  },
  resolve: {
    alias: {
      '~': resolve(__dirname),
      '@assets': resolve(__dirname, '../packages/assets'),
      '@fizz-layout/core': resolve(__dirname, '../packages/layout/src'),
      '@fizz-layout/components': resolve(__dirname, '../packages/components'),
      '@fizz-layout/hooks': resolve(__dirname, '../packages/hooks/src'),
      '@fizz-layout/locale': resolve(__dirname, '../packages/locale'),
      '@fizz-layout/theme-chalk': resolve(__dirname, '../packages/theme-chalk'),
    },
  },
  css: {
    transformer: 'lightningcss',
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/style.scss" as *;`,
      },
    },
  },
  plugins: [
    vue(),
    vueDevTools(),
    Icons(),
  ],
})
