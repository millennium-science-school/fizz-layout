import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  base: './',
  build: {
    outDir: '../../dist/locale',
    emptyOutDir: true,
    lib: {
      formats: ['es'],
      entry: resolve(__dirname, 'index.ts'),
      fileName: 'index',
    },
  },
  plugins: [
    dts({
      tsconfigPath: '../../tsconfig.web.json',
      /**
       * 用于手动设置入口文件的根路径
       * 设置为 packages 目录，这样所有子包都会相对于此目录输出
       */
      entryRoot: './',
      /**
       * 手动设置包含路径的 glob
       */
      include: ['./'],
      /**
       * 手动设置排除路径的 glob
       */
      exclude: ['./vite.config.ts'],
      /**
       * 类型输出目录
       * 结构: types/layout, types/components, types/hooks, types/locale
       */
      outDir: '../../dist/locale',
    }),
  ],
})
