import type { BuildOptions } from 'vite'
import type { PluginOptions } from 'vite-plugin-dts'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const buildOptions: BuildOptions = {
  outDir: '../../dist/es',
  emptyOutDir: true,
  cssCodeSplit: true,
  sourcemap: true,
  rollupOptions: {
    external: [
      '@iconify/vue',
      '@vueuse/core',
      // '@vueuse/integrations/useSortable',
      'element-plus',
      'sortablejs',
      'vue',
      'vue-i18n',
      'vue-router',
    ],
  },
}

const dtsOptions: PluginOptions = {
  tsconfigPath: '../../tsconfig.web.json',
  /**
   * 用于手动设置入口文件的根路径
   * 设置为 packages 目录，这样所有子包都会相对于此目录输出
   */
  entryRoot: '..',
  /**
   * 手动设置包含路径的 glob
   */
  include: ['../components', '../hooks', '../layout', '../locale/lang', '../locale/index.ts'],
  /**
   * 手动设置排除路径的 glob
   */
  exclude: ['**/vite.config.ts'],
  /**
   * 是否将源码里的 .d.ts 文件复制到 `outDir`
   */
  copyDtsFiles: true,
  /**
   * 允许外部类型输出到outDir
   */
  strictOutput: false,
  /**
   * 类型输出目录
   * 结构: types/layout, types/components, types/hooks, types/locale
   */
  outDir: '../../dist/types',
}

export default defineConfig({
  base: './',
  build: {
    ...buildOptions,
    lib: {
      formats: ['es'],
      entry: [resolve(__dirname, 'src/index.ts')],
      fileName: format => (format === 'es' ? 'index.mjs' : 'index.cjs'),
    },
  },
  plugins: [
    vue(),
    Icons(),
    dts(dtsOptions),
  ],
})
