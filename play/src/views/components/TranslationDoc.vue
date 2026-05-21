<script setup lang="ts">
import { FlTranslation } from '@fizz-layout/core'
import { ref } from 'vue'
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocEventsTable from '../../components/DocEventsTable.vue'
import DocPropsTable from '../../components/DocPropsTable.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

// ========== 交互 Demo ==========
const demoLocale = ref('zh-CN')

function handleChange(locale: string) {
  demoLocale.value = locale
}

const languages = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
  { label: '日本語', value: 'ja-JP' },
]

// ========== 代码示例 ==========
const basicCode = `<script setup lang="ts">
import { FlTranslation } from '@fizz/layout'
<\/script>

<template>
  <FizzLayout ...>
    <template #language-toggle="{ locale, toggleLanguage }">
      <FlTranslation
        :locale="locale.name"
        :languages="[
          { label: '简体中文', value: 'zh-CN' },
          { label: 'English', value: 'en-US' },
        ]"
        @change="toggleLanguage"
      />
    </template>
  </FizzLayout>
</template>`

const customCode = `<!-- 扩展更多语言 -->
<FlTranslation
  :locale="currentLocale"
  :languages="[
    { label: '简体中文', value: 'zh-CN' },
    { label: 'English', value: 'en-US' },
    { label: '日本語', value: 'ja-JP' },
    { label: '한국어', value: 'ko-KR' },
  ]"
  @change="handleLocaleChange"
/>`

const typeCode = `interface LanguageItem {
  /** 语言显示名称 */
  label: string
  /** 语言代码 */
  value: string
}`

// ========== Props / Events ==========
const propsData = [
  { name: 'locale', type: 'string', default: '\'en-US\'', description: '当前语言代码' },
  { name: 'languages', type: 'LanguageItem[]', default: '[{ label: \'English\', value: \'en-US\' }]', description: '支持的语言列表' },
]

const eventsData = [
  { name: 'change', params: '(locale: string)', description: '用户选择语言时触发，返回语言代码' },
]
</script>

<template>
  <DocSection title="FlTranslation 语言切换" description="下拉菜单式语言切换组件，配合 vue-i18n 实现多语言">
    <!-- 概览 -->
    <div>
      <h2>概览</h2>
      <p>
        <code>FlTranslation</code> 提供一个点击式下拉菜单，展示支持的语言列表，当前语言会高亮显示。
        通常放在 FizzLayout 的 <code>#language-toggle</code> 插槽中，与 <code>toggleLanguage</code> 配合使用。
      </p>
    </div>

    <!-- 交互 Demo -->
    <div>
      <h2>交互演示</h2>
      <p>点击下方的翻译图标切换语言：</p>
      <div class="demo-area">
        <FlTranslation
          :locale="demoLocale"
          :languages="languages"
          @change="handleChange"
        />
        <span class="demo-status">当前语言：<code>{{ demoLocale }}</code></span>
      </div>
      <DocTip>
        此演示仅改变组件的显示状态，不会切换整个文档站的语言。在 FizzLayout 中使用时，
        通过 <code>toggleLanguage</code> 回调同时更新 vue-i18n 和布局偏好。
      </DocTip>
    </div>

    <!-- 基础用法 -->
    <div>
      <h2>在 FizzLayout 中使用</h2>
      <p>FizzLayout 的 <code>#language-toggle</code> 插槽提供 <code>locale</code> 和 <code>toggleLanguage</code>：</p>
      <DocCodeBlock :code="basicCode" language="vue" />
    </div>

    <!-- 扩展语言 -->
    <div>
      <h2>扩展语言列表</h2>
      <DocCodeBlock :code="customCode" language="vue" />
    </div>

    <!-- 类型定义 -->
    <div>
      <h2>类型定义</h2>
      <DocCodeBlock :code="typeCode" language="typescript" />
    </div>

    <!-- Props -->
    <DocPropsTable title="Props" :data="propsData" />

    <!-- Events -->
    <DocEventsTable title="Events" :data="eventsData" />
  </DocSection>
</template>

<style scoped>
.demo-area {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  margin: 12px 0;
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
