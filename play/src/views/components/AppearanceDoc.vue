<script setup lang="ts">
import { FlAppearance, usePreferences } from '@fizz-layout/core'
import { ref } from 'vue'
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocEventsTable from '../../components/DocEventsTable.vue'
import DocPropsTable from '../../components/DocPropsTable.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

const { theme, updatePreferences } = usePreferences()

// ========== 交互 Demo ==========
const demoMode = ref(theme.value)

function handleChange(mode: 'light' | 'dark' | 'auto') {
  demoMode.value = mode
  updatePreferences({ theme: { mode: mode as any } })
}

// ========== 代码示例 ==========
const basicCode = `<script setup lang="ts">
import { FlAppearance, usePreferences } from '@fizz/layout'

const { theme } = usePreferences()
<\/script>

<template>
  <!-- 点击切换模式（light ↔ dark） -->
  <FlAppearance
    :mode="theme.mode"
    @change="mode => updatePreferences({ theme: { mode } })"
  />
</template>`

const hoverCode = `<!-- 鼠标悬停展开下拉菜单，可选择三种模式 -->
<FlAppearance
  :mode="theme.mode"
  :should-on-hover="true"
  @change="mode => updatePreferences({ theme: { mode } })"
/>`

const slotCode = `<!-- 在 FizzLayout 的 theme-toggle 插槽中使用 -->
<FizzLayout ...>
  <template #theme-toggle>
    <FlAppearance
      :mode="theme.mode"
      @change="mode => updatePreferences({ theme: { mode } })"
    />
  </template>
</FizzLayout>`

// ========== Props / Events ==========
const propsData = [
  { name: 'mode', type: '\'light\' | \'dark\' | \'auto\'', default: '\'auto\'', description: '当前主题模式' },
  { name: 'shouldOnHover', type: 'boolean', default: 'false', description: '是否使用 hover 下拉菜单模式（否则为点击切换）' },
]

const eventsData = [
  { name: 'change', params: '(mode: ThemeModeType)', description: '主题模式变化时触发，返回新模式' },
]
</script>

<template>
  <DocSection title="FlAppearance 外观切换" description="在亮色、暗色和跟随系统之间切换主题模式">
    <!-- 概览 -->
    <div>
      <h2>概览</h2>
      <p>
        <code>FlAppearance</code> 组件提供主题模式的可视化切换。支持两种交互模式：
      </p>
      <ul>
        <li><strong>点击切换</strong>（默认）：点击按钮在 light 和 dark 之间切换</li>
        <li><strong>Hover 下拉</strong>（shouldOnHover）：悬停展开下拉菜单，可选择 light / dark / auto</li>
      </ul>
    </div>

    <!-- 交互 Demo -->
    <div>
      <h2>交互演示</h2>
      <p>两种模式对比：</p>
      <div class="demo-area">
        <div class="demo-item">
          <span class="demo-label">点击切换：</span>
          <FlAppearance :mode="demoMode" @change="handleChange" />
        </div>
        <div class="demo-item">
          <span class="demo-label">Hover 下拉：</span>
          <FlAppearance :mode="demoMode" :should-on-hover="true" @change="handleChange" />
        </div>
        <span class="demo-status">当前模式：<code>{{ demoMode }}</code></span>
      </div>
    </div>

    <!-- 基础用法 -->
    <div>
      <h2>基础用法（点击切换）</h2>
      <DocCodeBlock :code="basicCode" language="vue" />
    </div>

    <!-- Hover 模式 -->
    <div>
      <h2>Hover 下拉模式</h2>
      <p>设置 <code>shouldOnHover</code> 为 <code>true</code>，悬停时展开三个选项的下拉菜单：</p>
      <DocCodeBlock :code="hoverCode" language="vue" />
    </div>

    <!-- 在 FizzLayout 中使用 -->
    <div>
      <h2>在 FizzLayout 中使用</h2>
      <DocCodeBlock :code="slotCode" language="vue" />
    </div>

    <!-- Props -->
    <DocPropsTable title="Props" :data="propsData" />

    <!-- Events -->
    <DocEventsTable title="Events" :data="eventsData" />

    <DocTip type="tip">
      <code>auto</code> 模式会跟随操作系统的深色/浅色设置自动切换，通过 <code>prefers-color-scheme</code> 媒体查询实现。
    </DocTip>
  </DocSection>
</template>

<style scoped>
.demo-area {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  margin: 12px 0;
  flex-wrap: wrap;
}

.demo-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.demo-label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.demo-status {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.demo-status code {
  font-family: 'Fira Code', Consolas, monospace;
  padding: 2px 6px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
}
</style>
