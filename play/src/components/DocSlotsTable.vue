<script setup lang="ts">
export interface SlotItem {
  /** 插槽名 */
  name: string
  /** 参数说明 */
  params?: string
  /** 说明 */
  description: string
}

defineProps<{
  /** 表格标题 */
  title?: string
  /** Slots 数据 */
  data: SlotItem[]
}>()
</script>

<template>
  <div class="doc-slots-table">
    <h3 v-if="title" class="doc-slots-table__title">
      {{ title || 'Slots' }}
    </h3>
    <el-table
      :data="data"
      stripe
      border
    >
      <el-table-column label="插槽名" width="200">
        <template #default="{ row }">
          <code>{{ row.name }}</code>
        </template>
      </el-table-column>
      <el-table-column label="参数" min-width="200">
        <template #default="{ row }">
          <code v-if="row.params">{{ row.params }}</code>
          <span v-else class="doc-slots-table__empty">—</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="说明" min-width="200" />
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.doc-slots-table {
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
    border-radius: 4px;
    background-color: var(--el-fill-color-light);
    font-size: 0.8125rem;
  }
}
</style>
