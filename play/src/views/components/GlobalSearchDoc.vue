<script setup lang="ts">
import { FlGlobalSearch } from '@fizz-layout/core'
import { ref } from 'vue'
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocEventsTable from '../../components/DocEventsTable.vue'
import DocPropsTable from '../../components/DocPropsTable.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

// ========== 交互 Demo ==========
const demoMenus = [
  { name: '首页', path: '/home', icon: 'carbon:home' },
  { name: '用户管理', path: '/system/users', icon: 'carbon:user' },
  { name: '角色管理', path: '/system/roles', icon: 'carbon:user-role' },
  { name: '系统设置', path: '/system/settings', icon: 'carbon:settings' },
  { name: '数据分析', path: '/data/analysis', icon: 'carbon:analytics' },
  { name: '报表中心', path: '/data/reports', icon: 'carbon:report' },
]

const lastSelected = ref('')

function handleSelect(item: any) {
  lastSelected.value = `${item.name} → ${item.path}`
}

// ========== 代码示例 ==========
const basicCode = `<script setup lang="ts">
import { FlGlobalSearch } from '@fizz/layout'
import { useRouter } from 'vue-router'

const router = useRouter()

function handleSelect(item) {
  router.push(item.path)
}
<\/script>

<template>
  <FizzLayout ...>
    <template #global-search>
      <FlGlobalSearch
        :menus="menus"
        :enable-shortcut-key="true"
        shortcut-key-hint="Ctrl+K"
        :menu-translate="t"
        @select="handleSelect"
      />
    </template>
  </FizzLayout>
</template>`

const exposeCode = `<script setup lang="ts">
import { ref } from 'vue'
import { FlGlobalSearch } from '@fizz/layout'

const searchRef = ref()

// 通过 ref 编程式打开搜索
function openSearch() {
  searchRef.value?.open()
}
<\/script>

<template>
  <FlGlobalSearch ref="searchRef" :menus="menus" @select="handleSelect" />
  <button @click="openSearch">打开搜索</button>
</template>`

const typeCode = `interface SearchMenuItem {
  /** 菜单名称 */
  name?: string
  /** 菜单路径 */
  path?: string
  /** 图标（字符串或组件） */
  icon?: string | Component
  /** 子菜单 */
  children?: SearchMenuItem[]
}`

// ========== Props / Events ==========
const propsData = [
  { name: 'menus', type: 'SearchMenuItem[]', default: '[]', description: '菜单数据，组件会自动扁平化嵌套结构用于搜索', required: true },
  { name: 'enableShortcutKey', type: 'boolean', default: 'true', description: '是否启用键盘快捷键（Ctrl+K / ⌘+K）' },
  { name: 'shortcutKeyHint', type: 'string', default: '\'Ctrl+K\'', description: '搜索按钮上显示的快捷键提示文本' },
  { name: 'menuTranslate', type: '(key: string) => string', default: 'key => key', description: '菜单名称的翻译函数，支持 i18n' },
]

const eventsData = [
  { name: 'select', params: '(item: SearchMenuItem)', description: '用户选中某个搜索结果时触发' },
]

const exposeItems = [
  { name: 'open', params: '()', description: '编程式打开搜索对话框' },
  { name: 'close', params: '()', description: '编程式关闭搜索对话框' },
]
</script>

<template>
  <DocSection title="FlGlobalSearch 全局搜索" description="提供菜单项的快速搜索和跳转功能，支持键盘快捷键">
    <!-- 概览 -->
    <div>
      <h2>概览</h2>
      <p>
        <code>FlGlobalSearch</code> 提供一个椭圆形搜索触发按钮和弹窗式搜索面板。
        它自动将嵌套菜单数据扁平化，根据关键词匹配菜单名称和路径。
        支持 <kbd>Ctrl+K</kbd> 快捷键打开，也可通过 <code>ref</code> 编程式控制。
      </p>
    </div>

    <!-- 交互 Demo -->
    <div>
      <h2>交互演示</h2>
      <p>点击下方的搜索按钮或按 <kbd>Ctrl+K</kbd> 打开搜索面板：</p>
      <div class="demo-area">
        <FlGlobalSearch
          :menus="demoMenus"
          @select="handleSelect"
        />
        <span v-if="lastSelected" class="demo-action">选中：{{ lastSelected }}</span>
      </div>
    </div>

    <!-- 基础用法 -->
    <div>
      <h2>基础用法</h2>
      <DocCodeBlock :code="basicCode" language="vue" />
    </div>

    <!-- 编程式控制 -->
    <div>
      <h2>编程式控制</h2>
      <p>通过 <code>ref</code> 获取组件实例，调用 <code>open()</code> / <code>close()</code> 方法：</p>
      <DocCodeBlock :code="exposeCode" language="vue" />
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

    <!-- Expose -->
    <DocEventsTable title="Expose Methods" :data="exposeItems" />

    <DocTip type="tip" title="搜索逻辑">
      搜索时会同时匹配菜单的 <code>name</code>（经 menuTranslate 翻译后）和 <code>path</code>，不区分大小写。
      最多显示 20 条结果，无关键词时显示前 10 条。
    </DocTip>
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

.demo-action {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  font-family: 'Fira Code', Consolas, monospace;
}
</style>
