/**
 * Fizz Layout CSS 构建脚本
 *
 * 功能:
 * 1. 编译 theme-chalk/src/index.scss 为 index.css 到 dist/es 目录
 * 2. 复制 theme-chalk 源文件到 dist/theme-chalk 目录
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import * as sass from 'sass-embedded'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, '..')
const DIST_DIR = path.join(ROOT_DIR, 'dist')
const DEST_DIR = path.join(DIST_DIR, 'theme-chalk')
const THEME_CHALK_DIR = path.join(ROOT_DIR, 'packages/theme-chalk')
const THEME_CHALK_SRC = path.join(THEME_CHALK_DIR, 'src')

// === 工具函数 ===

function log(emoji, message) {
  console.log(`${emoji} ${message}`)
}

function emptyDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
  fs.mkdirSync(dir, { recursive: true })
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function copyDirRecursive(src, dest) {
  ensureDir(dest)
  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath)
    }
    else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

// === 主逻辑 ===

function compileSass() {
  log('🎨', 'compiling scss to css...')

  const inputFile = path.join(THEME_CHALK_SRC, 'index.scss')
  const outputDir = path.join(DIST_DIR, 'es')
  const outputFile = path.join(outputDir, 'index.css')

  ensureDir(outputDir)

  // 使用 sass-embedded 编译 scss
  const result = sass.compile(inputFile, {
    style: 'compressed',
    loadPaths: [
      path.join(ROOT_DIR, 'packages'),
      path.join(ROOT_DIR, 'node_modules'),
    ],
    silenceDeprecations: ['legacy-js-api'],
  })

  fs.writeFileSync(outputFile, result.css)

  // 同时生成未压缩版本供调试
  const resultExpanded = sass.compile(inputFile, {
    style: 'expanded',
    loadPaths: [
      path.join(ROOT_DIR, 'packages'),
      path.join(ROOT_DIR, 'node_modules'),
    ],
    silenceDeprecations: ['legacy-js-api'],
  })

  const outputFileExpanded = path.join(outputDir, 'index.expanded.css')
  fs.writeFileSync(outputFileExpanded, resultExpanded.css)
}

function copyThemeChalk() {
  log('📦', 'copying theme-chalk source to dist...')

  // 复制整个 theme-chalk/src 目录
  copyDirRecursive(THEME_CHALK_SRC, DEST_DIR)
}

// === 入口 ===

try {
  log('🧹', 'cleaning dist directory...')
  emptyDir(DEST_DIR)
  log('🚀', 'Building CSS...')
  compileSass()
  copyThemeChalk()
  log('🎉', 'CSS build completed!')
}
catch (err) {
  console.error('\n❌ Failed:', err.message)
  console.error(err.stack)
  process.exit(1)
}
