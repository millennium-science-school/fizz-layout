<script setup lang="ts">
import { FlCopyright } from '@fizz-layout/core'
import { ref } from 'vue'
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocPropsTable from '../../components/DocPropsTable.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

// ========== 交互 Demo ==========
const companyName = ref('Fizz Layout')
const date = ref(new Date().getFullYear().toString())
const icp = ref('京ICP备12345678号')

// ========== 代码示例 ==========
const basicCode = `<script setup lang="ts">
import { FlCopyright } from '@fizz/layout'
<\/script>

<template>
  <!-- 放在 FizzLayout 的 footer 插槽中 -->
  <FizzLayout ...>
    <template #footer>
      <FlCopyright
        company-name="My Company"
        company-site-link="https://example.com"
        date="2025"
        icp="京ICP备12345678号"
        icp-link="https://beian.miit.gov.cn/"
      />
    </template>
  </FizzLayout>
</template>`

const prefsCode = `import { usePreferences } from '@fizz/layout'

const { updatePreferences } = usePreferences()

// 通过偏好系统统一管理版权信息
updatePreferences({
  copyright: {
    enable: true,
    companyName: 'My Company',
    companySiteLink: 'https://example.com',
    date: '2025',
    icp: '京ICP备12345678号',
    icpLink: 'https://beian.miit.gov.cn/',
  },
  footer: {
    enable: true,
    fixed: false,
    height: 48,
  },
})`

// ========== Props ==========
const propsData = [
  { name: 'companyName', type: 'string', default: '\'inspur\'', description: '公司名称' },
  { name: 'companySiteLink', type: 'string', default: '\'\'', description: '公司网站链接，为空时不可点击' },
  { name: 'date', type: 'string', default: '当前年份', description: '版权年份' },
  { name: 'icp', type: 'string', default: '\'\'', description: 'ICP 备案号，为空时不显示' },
  { name: 'icpLink', type: 'string', default: '\'\'', description: 'ICP 备案链接，默认指向工信部网站' },
]
</script>

<template>
  <DocSection title="FlCopyright 版权" description="页面底部版权信息展示，支持公司名称、年份和备案号">
    <!-- 概览 -->
    <div>
      <h2>概览</h2>
      <p>
        <code>FlCopyright</code> 在页脚区域展示版权信息，包括版权年份、公司名称（可链接）和 ICP 备案号。
        它通常放在 FizzLayout 的 <code>#footer</code> 插槽中，也可通过偏好系统的 <code>copyright</code> 模块自动渲染。
      </p>
    </div>

    <!-- 交互 Demo -->
    <div>
      <h2>交互演示</h2>
      <p>实时预览不同配置的版权信息：</p>
      <div class="demo-area">
        <div class="demo-controls">
          <label>
            <span>公司名：</span>
            <input v-model="companyName" class="demo-input">
          </label>
          <label>
            <span>年份：</span>
            <input v-model="date" class="demo-input" style="width: 80px">
          </label>
          <label>
            <span>备案号：</span>
            <input v-model="icp" class="demo-input">
          </label>
        </div>
        <div class="demo-preview">
          <FlCopyright
            :company-name="companyName"
            :date="date"
            :icp="icp"
            icp-link="https://beian.miit.gov.cn/"
          />
        </div>
      </div>
    </div>

    <!-- 基础用法 -->
    <div>
      <h2>基础用法</h2>
      <DocCodeBlock :code="basicCode" language="vue" />
    </div>

    <!-- 偏好系统 -->
    <div>
      <h2>通过偏好系统控制</h2>
      <p>
        如果不使用 <code>#footer</code> 插槽，FizzLayout 会根据 <code>copyright</code> 偏好自动渲染 FlCopyright：
      </p>
      <DocCodeBlock :code="prefsCode" language="typescript" />
    </div>

    <!-- Props -->
    <DocPropsTable title="Props" :data="propsData" />

    <DocTip type="tip" title="无 Events / Slots">
      FlCopyright 是纯展示组件，不触发事件也不提供插槽。如需更复杂的页脚内容，
      请使用 FizzLayout 的 <code>#footer</code> 插槽自定义。
    </DocTip>
  </DocSection>
</template>

<style scoped>
.demo-area {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  overflow: hidden;
  margin: 12px 0;
}

.demo-controls {
  display: flex;
  gap: 16px;
  padding: 16px;
  flex-wrap: wrap;
}

.demo-controls label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.demo-input {
  padding: 4px 8px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  font-size: 13px;
  background: var(--el-bg-color);
  color: var(--el-text-color-primary);
  width: 140px;
}

.demo-preview {
  border-top: 1px solid var(--el-border-color-lighter);
  padding: 16px;
  background: var(--el-fill-color-extra-light);
  text-align: center;
}
</style>
