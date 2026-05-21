<script setup lang="ts">
export interface PropItem {
  /** 属性名 */
  name: string
  /** 类型 */
  type: string
  /** 默认值 */
  default?: string
  /** 说明 */
  description: string
  /** 是否必填 */
  required?: boolean
}

defineProps<{
  /** 表格标题 */
  title?: string
  /** Props 数据 */
  data: PropItem[]
}>()
</script>

<template>
  <div class="doc-props-table">
    <h3 v-if="title" class="doc-props-table__title">
      {{ title || 'Props' }}
    </h3>
    <el-table :data="data" stripe border>
      <el-table-column label="属性名" width="180">
        <template #default="{ row }">
          <code>{{ row.name }}</code>
          <el-tag v-if="row.required" type="danger" style="margin-left: 6px">
            必填
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="200">
        <template #default="{ row }">
          <el-tag>
            {{ row.type }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="默认值" width="150">
        <template #default="{ row }">
          <code v-if="row.default !== undefined">{{ row.default }}</code>
          <span v-else class="doc-props-table__empty">—</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="说明" min-width="200" />
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.doc-props-table {
  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: var(--el-text-color-primary);
  }

  &__empty {
    color: var(--el-text-color-placeholder);
  }

  code {
    font-family: 'Fira Code', 'Cascadia Code', Consolas, monospace;
    padding: 2px 6px;
  }
}
</style>
