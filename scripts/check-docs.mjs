import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const templateStringStartRE = /const\s+\w+\s*=\s*`/g

function collectVueFiles(directory) {
  const absoluteDirectory = resolve(root, directory)
  const files = []

  for (const entry of readdirSync(absoluteDirectory)) {
    const absoluteEntry = resolve(absoluteDirectory, entry)
    const relativeEntry = `${directory}/${entry}`
    const stats = statSync(absoluteEntry)

    if (stats.isDirectory()) {
      files.push(...collectVueFiles(relativeEntry))
    }
    else if (entry.endsWith('.vue')) {
      files.push(relativeEntry)
    }
  }

  return files
}

const files = [
  'README.md',
  'scripts/README.release.md',
  'packages/theme-chalk/README.md',
  ...collectVueFiles('play/src/views'),
]

const forbiddenText = [
  { pattern: /\bfull-content\b/g, label: 'removed layout mode full-content' },
  { pattern: /\bside-nav\b/g, label: 'invalid layout mode side-nav; use sidebar-nav' },
  { pattern: /\bisMobile\b/g, label: 'removed mobile preference isMobile' },
  { pattern: /\bfizz-hidden-mobile\b/g, label: 'removed mobile utility class' },
  { pattern: /\bfizz-hidden-desktop\b/g, label: 'removed desktop/mobile utility class' },
  { pattern: /移动端/g, label: 'mobile-facing documentation language' },
  { pattern: /移动适配/g, label: 'mobile adaptation documentation language' },
]

const forbiddenSnippetImports = [
  '@fizz-layout/core',
  '@fizz-layout/components',
  '@fizz-layout/hooks',
  '@fizz-layout/locale',
  '@fizz-layout/theme-chalk',
]

function lineOf(source, index) {
  return source.slice(0, index).split('\n').length
}

function findTemplateStringRanges(source) {
  const ranges = []
  templateStringStartRE.lastIndex = 0
  let match = templateStringStartRE.exec(source)

  while (match) {
    const start = templateStringStartRE.lastIndex
    let cursor = start
    let escaped = false

    while (cursor < source.length) {
      const char = source[cursor]
      if (escaped) {
        escaped = false
      }
      else if (char === '\\') {
        escaped = true
      }
      else if (char === '`') {
        ranges.push([start, cursor])
        templateStringStartRE.lastIndex = cursor + 1
        break
      }
      cursor += 1
    }

    match = templateStringStartRE.exec(source)
  }

  return ranges
}

const failures = []

for (const file of files) {
  const absolute = resolve(root, file)
  const source = readFileSync(absolute, 'utf8')

  for (const rule of forbiddenText) {
    for (const match of source.matchAll(rule.pattern)) {
      failures.push(`${file}:${lineOf(source, match.index)} ${rule.label}`)
    }
  }

  const snippetRanges = file.endsWith('.vue')
    ? findTemplateStringRanges(source)
    : [[0, source.length]]

  for (const [start, end] of snippetRanges) {
    const snippet = source.slice(start, end)
    for (const importPath of forbiddenSnippetImports) {
      const index = snippet.indexOf(importPath)
      if (index !== -1) {
        failures.push(`${file}:${lineOf(source, start + index)} visible snippet uses workspace import ${importPath}`)
      }
    }
  }
}

if (failures.length > 0) {
  console.error('Documentation drift check failed:')
  for (const failure of failures)
    console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Documentation drift check passed for ${files.length} files.`)
