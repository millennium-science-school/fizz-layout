/**
 * Fizz Layout 发布打包脚本
 *
 * 前置条件: 已在根目录执行 pnpm build
 *
 * 功能: 复制模板文件到 dist 目录
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, '..')
const DIST_DIR = path.join(ROOT_DIR, 'dist')
const SCRIPTS_DIR = __dirname

// === 工具函数 ===

function log(emoji, message) {
  console.log(`${emoji} ${message}`)
}

// === 主逻辑 ===

function checkDist() {
  log('📦', 'checking build directory...')

  const required = ['es', 'types']
  for (const dir of required) {
    const p = path.join(DIST_DIR, dir)
    if (!fs.existsSync(p)) {
      throw new Error(`Missing dist/${dir}, please run pnpm build first`)
    }
  }
}

function copyTemplateFiles() {
  log('📦', 'copying template files...')

  // 复制 package.json
  const pkgTemplate = path.join(SCRIPTS_DIR, 'package.release.json')
  const pkgDest = path.join(DIST_DIR, 'package.json')
  fs.copyFileSync(pkgTemplate, pkgDest)

  // 复制 README.md
  const readmeTemplate = path.join(SCRIPTS_DIR, 'README.release.md')
  const readmeDest = path.join(DIST_DIR, 'README.md')
  fs.copyFileSync(readmeTemplate, readmeDest)
}

// === 入口 ===

try {
  checkDist()
  copyTemplateFiles()
}
catch (err) {
  console.error('\n❌ Failed:', err.message)
  process.exit(1)
}
