<script setup lang="ts">
import { ref } from 'vue'
import DocCodeBlock from './DocCodeBlock.vue'

defineProps<{
  /** Demo 标题 */
  title?: string
  /** 描述说明 */
  description?: string
  /** 源码字符串（可通过 import xxx from 'xxx?raw' 获取） */
  source?: string
  /** 源码语言 */
  language?: string
}>()

const showSource = ref(false)

function toggleSource() {
  showSource.value = !showSource.value
}
</script>

<template>
  <div class="doc-demo-box">
    <!-- 标题 -->
    <h3 v-if="title" class="doc-demo-box__title">
      {{ title }}
    </h3>
    <p v-if="description" class="doc-demo-box__description">
      {{ description }}
    </p>

    <!-- Demo 渲染区 -->
    <div class="doc-demo-box__preview">
      <slot />
    </div>

    <!-- 操作栏 -->
    <div v-if="source" class="doc-demo-box__actions">
      <el-button text @click="toggleSource">
        {{ showSource ? '隐藏源码' : '查看源码' }}
        <span class="doc-demo-box__arrow" :class="{ 'is-open': showSource }">▼</span>
      </el-button>
    </div>

    <!-- 源码展开区 -->
    <el-collapse-transition>
      <div v-if="source && showSource" class="doc-demo-box__source">
        <DocCodeBlock :code="source" :language="language || 'vue'" />
      </div>
    </el-collapse-transition>
  </div>
</template>

<style lang="scss" scoped>
.doc-demo-box {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  overflow: hidden;

  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    padding: 1rem 1.25rem 0;
    color: var(--el-text-color-primary);
  }

  &__description {
    font-size: 0.8125rem;
    color: var(--el-text-color-secondary);
    padding: 0.375rem 1.25rem 0;
    line-height: 1.5;
  }

  &__preview {
    padding: 1.25rem;
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--el-border-color-lighter);
    padding: 0.375rem;
  }

  &__arrow {
    font-size: 0.625rem;
    transition: transform 0.25s;
    margin-left: 4px;

    &.is-open {
      transform: rotate(180deg);
    }
  }

  &__source {
    border-top: 1px solid var(--el-border-color-lighter);

    :deep(.doc-code-block) {
      border: none;
      border-radius: 0;
    }
  }
}
</style>
