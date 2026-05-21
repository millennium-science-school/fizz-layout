<!-- eslint-disable e18e/prefer-static-regex -->
<script setup lang="ts">
import { codeToHtml } from 'shiki'
import { computed, ref, shallowRef, watch } from 'vue'

const props = withDefaults(defineProps<{
  /** 代码字符串 */
  code: string
  /** 语言 */
  language?: string
}>(), {
  language: 'typescript',
})

const highlightedHtml = shallowRef('')
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null

const trimmedCode = computed(() => props.code.trim())

// 使用 shiki 进行语法高亮
async function highlight() {
  try {
    highlightedHtml.value = await codeToHtml(trimmedCode.value, {
      lang: props.language,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    })
  }
  catch {
    // fallback: 纯文本
    highlightedHtml.value = `<pre><code>${escapeHtml(trimmedCode.value)}</code></pre>`
  }
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(trimmedCode.value)
    copied.value = true
    if (copyTimer)
      clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = false
    }, 2000)
  }
  catch {
    // fallback
  }
}

watch(() => [props.code, props.language], highlight, { immediate: true })
</script>

<template>
  <div class="doc-code-block">
    <div class="doc-code-block__header">
      <span class="doc-code-block__lang">{{ language }}</span>
      <el-button text @click="copyCode">
        {{ copied ? '✓ 已复制' : '复制' }}
      </el-button>
    </div>
    <div class="doc-code-block__body" v-html="highlightedHtml" />
  </div>
</template>

<style lang="scss" scoped>
.doc-code-block {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  overflow: hidden;
  font-size: 0.875rem;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    background-color: var(--el-fill-color-lighter);
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  &__lang {
    font-size: 0.75rem;
    color: var(--el-text-color-secondary);
    font-family: 'Fira Code', 'Cascadia Code', Consolas, monospace;
    text-transform: uppercase;
  }

  &__body {
    overflow-x: auto;

    :deep(pre) {
      margin: 0;
      padding: 1rem;
      overflow-x: auto;
      font-family: 'Fira Code', 'Cascadia Code', Consolas, monospace;
      font-size: 0.8125rem;
      line-height: 1.7;
    }

    // defaultColor: false 使 shiki 只输出 CSS 变量，需要手动指定使用哪组
    :deep(.shiki),
    :deep(.shiki span) {
      color: var(--shiki-light);
      background-color: var(--shiki-light-bg);
    }
  }
}

// 暗色模式切换到 dark 变量
html.dark .doc-code-block {
  &__body {
    :deep(.shiki),
    :deep(.shiki span) {
      color: var(--shiki-dark) !important;
      background-color: var(--shiki-dark-bg) !important;
    }
  }
}
</style>
