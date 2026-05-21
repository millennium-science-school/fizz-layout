<script setup lang="ts">
defineProps<{
  /** 章节标题 */
  title: string
  /** 章节描述 */
  description?: string
}>()
</script>

<template>
  <el-scrollbar>
    <section class="doc-section">
      <h1 v-if="title" class="doc-section__title">
        {{ title }}
      </h1>
      <p v-if="description" class="doc-section__description">
        {{ description }}
      </p>
      <div class="doc-section__content">
        <slot />
      </div>
    </section>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
.doc-section {
  padding: 2rem;
  max-width: 960px;
  margin: 0 auto;
  box-sizing: border-box;

  &__title {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--el-text-color-primary);
    border-bottom: 1px solid var(--el-border-color-lighter);
    padding-bottom: 0.75rem;
  }

  &__description {
    font-size: 0.9375rem;
    color: var(--el-text-color-secondary);
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    // 统一文档排版规范
    :deep(h2) {
      font-size: 1.375rem;
      font-weight: 600;
      margin: 0.25rem 0 0.625rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--el-border-color-extra-light);
      color: var(--el-text-color-primary);
    }

    :deep(h3) {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0.25rem 0 0.5rem;
      color: var(--el-text-color-primary);
    }

    :deep(p) {
      margin: 0.375rem 0;
      line-height: 1.75;
      color: var(--el-text-color-regular);
      font-size: 0.9375rem;
    }

    :deep(ul),
    :deep(ol) {
      padding-left: 1.5rem;
      margin: 0.375rem 0;
    }

    :deep(li) {
      line-height: 1.85;
      color: var(--el-text-color-regular);
      font-size: 0.9375rem;
    }

    :deep(code) {
      font-family: 'Fira Code', 'Cascadia Code', Consolas, monospace;
      border-radius: 4px;
      background-color: var(--el-fill-color-light);
      font-size: 0.8125rem;
      color: var(--el-color-primary);
    }

    :deep(strong) {
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    :deep(a) {
      color: var(--el-color-primary);
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
