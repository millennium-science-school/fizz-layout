<script setup lang="ts">
import { FlIcon } from '@fizz-layout/core'
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocPropsTable from '../../components/DocPropsTable.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

// ========== 演示图标列表 ==========
const demoIcons = [
  'home',
  'settings',
  'user',
  'search',
  'notification',
  'document',
  'folder',
  'star',
  'edit',
  'trash-can',
  'add',
  'close',
  'checkmark',
  'warning',
  'information',
]

// ========== 代码示例 ==========
const basicCode = `<script setup lang="ts">
import { FlIcon } from '@fizz/layout'
<\/script>

<template>
  <!-- 短格式：自动添加 carbon: 前缀 -->
  <FlIcon icon="home" />
  <FlIcon icon="settings" />

  <!-- 完整格式：指定图标集 -->
  <FlIcon icon="carbon:user" />
  <FlIcon icon="mdi:account" />
</template>`

const sizeColorCode = `<!-- 自定义大小和颜色 -->
<FlIcon icon="home" :size="24" color="#409eff" />
<FlIcon icon="settings" size="2em" color="var(--el-color-success)" />
<FlIcon icon="warning" :size="32" color="var(--el-color-danger)" />`

const componentCode = `<script setup lang="ts">
import { FlIcon } from '@fizz/layout'
import IconCustom from '~icons/carbon/analytics'
<\/script>

<template>
  <!-- 直接传入 Vue 组件 -->
  <FlIcon :icon="IconCustom" :size="20" />
</template>`

// ========== Props ==========
const propsData = [
  { name: 'icon', type: 'string | Component', default: 'undefined', description: '图标名称或 Vue 组件。字符串支持短格式（如 home）和完整格式（如 carbon:home）' },
  { name: 'size', type: 'number | string', default: 'undefined', description: '图标大小，数字时单位为 px，也可传 CSS 字符串（如 2em）' },
  { name: 'color', type: 'string', default: 'undefined', description: '图标颜色，支持 CSS 颜色值和变量' },
]
</script>

<template>
  <DocSection title="FlIcon 图标" description="基于 Iconify 的图标渲染组件，支持字符串名称和 Vue 组件两种方式">
    <!-- 概览 -->
    <div>
      <h2>概览</h2>
      <p>
        <code>FlIcon</code> 组件封装了 <code>@iconify/vue</code>，提供统一的图标渲染接口。
        默认使用 <a href="https://icon-sets.iconify.design/carbon/" target="_blank">Carbon 图标集</a>，
        也支持传入其他图标集名称或直接传入 Vue 组件。
      </p>
    </div>

    <!-- 图标展示 -->
    <div>
      <h2>图标展示</h2>
      <p>常用 Carbon 图标预览（短格式名称）：</p>
      <div class="icon-grid">
        <div v-for="name in demoIcons" :key="name" class="icon-item">
          <FlIcon :icon="name" :size="24" />
          <span class="icon-name">{{ name }}</span>
        </div>
      </div>
    </div>

    <!-- 基础用法 -->
    <div>
      <h2>基础用法</h2>
      <DocCodeBlock :code="basicCode" language="vue" />
    </div>

    <!-- 大小和颜色 -->
    <div>
      <h2>大小和颜色</h2>
      <div class="demo-area">
        <FlIcon icon="home" :size="16" color="var(--el-text-color-secondary)" />
        <FlIcon icon="home" :size="24" color="var(--el-color-primary)" />
        <FlIcon icon="home" :size="32" color="var(--el-color-success)" />
        <FlIcon icon="home" :size="40" color="var(--el-color-danger)" />
      </div>
      <DocCodeBlock :code="sizeColorCode" language="vue" />
    </div>

    <!-- 组件模式 -->
    <div>
      <h2>传入 Vue 组件</h2>
      <p>除了字符串名称，也可以直接传入通过 <code>unplugin-icons</code> 导入的图标组件：</p>
      <DocCodeBlock :code="componentCode" language="vue" />
    </div>

    <!-- Props -->
    <DocPropsTable title="Props" :data="propsData" />

    <DocTip type="tip" title="图标名称解析">
      传入字符串时，如果不包含冒号（<code>:</code>），会自动添加 <code>carbon:</code> 前缀。
      你也可以使用任意 Iconify 图标集，如 <code>mdi:account</code>、<code>fa:home</code>。
    </DocTip>
  </DocSection>
</template>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  margin: 12px 0;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 8px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  cursor: default;
  transition: all 0.2s;
}

.icon-item:hover {
  border-color: var(--el-color-primary);
  background: var(--el-fill-color-extra-light);
}

.icon-name {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  font-family: 'Fira Code', Consolas, monospace;
  text-align: center;
  word-break: break-all;
}

.demo-area {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  margin: 12px 0;
}
</style>
