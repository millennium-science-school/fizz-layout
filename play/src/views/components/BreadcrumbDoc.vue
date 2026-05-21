<script setup lang="ts">
import { usePreferences } from '@fizz-layout/core'
import { ref } from 'vue'
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocPropsTable from '../../components/DocPropsTable.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

const { breadcrumb, updatePreferences } = usePreferences()

// ========== 交互 Demo ==========
const showHome = ref(breadcrumb.value.showHome)
const showIcon = ref(breadcrumb.value.showIcon)
const hideOnlyOne = ref(breadcrumb.value.hideOnlyOne)
const styleType = ref(breadcrumb.value.styleType)

function toggleShowHome() {
  showHome.value = !showHome.value
  updatePreferences({ breadcrumb: { showHome: showHome.value } })
}
function toggleShowIcon() {
  showIcon.value = !showIcon.value
  updatePreferences({ breadcrumb: { showIcon: showIcon.value } })
}
function toggleHideOnlyOne() {
  hideOnlyOne.value = !hideOnlyOne.value
  updatePreferences({ breadcrumb: { hideOnlyOne: hideOnlyOne.value } })
}
function toggleStyleType() {
  styleType.value = styleType.value === 'normal' ? 'background' : 'normal'
  updatePreferences({ breadcrumb: { styleType: styleType.value } })
}

// ========== 代码示例 ==========
const basicCode = `<script setup lang="ts">
import { FlBreadcrumb } from '@fizz/layout'
<\/script>

<template>
  <!-- 放在 FizzLayout 的 breadcrumb 插槽中 -->
  <FizzLayout ...>
    <template #breadcrumb>
      <FlBreadcrumb
        :show-home="true"
        :show-icon="true"
        :hide-when-only-one="false"
        style-type="normal"
      />
    </template>
  </FizzLayout>
</template>`

const prefsCode = `import { usePreferences } from '@fizz/layout'

const { updatePreferences } = usePreferences()

// 通过偏好系统控制面包屑
updatePreferences({
  breadcrumb: {
    enable: true,
    showHome: true,
    showIcon: true,
    hideOnlyOne: false,
    styleType: 'background',
  },
})`

const routeMetaCode = `// 路由 meta 中与面包屑相关的字段
const routes = [
  {
    path: '/settings',
    meta: {
      title: 'fizz.menu.settings',  // 面包屑标题（支持 i18n key）
      icon: 'carbon:settings',       // 面包屑图标
      hideInBreadcrumb: true,        // 在面包屑中隐藏该层级
      hideChildrenInMenu: true,      // 隐藏子菜单时也影响面包屑
    },
  },
]`

// ========== Props 数据 ==========
const propsData = [
  { name: 'showHome', type: 'boolean', default: 'false', description: '是否在面包屑开头显示首页图标' },
  { name: 'showIcon', type: 'boolean', default: 'true', description: '是否显示各层级的图标' },
  { name: 'hideWhenOnlyOne', type: 'boolean', default: 'false', description: '当只有一个层级时是否隐藏面包屑' },
  { name: 'styleType', type: '\'normal\' | \'background\'', default: '\'normal\'', description: '面包屑样式类型' },
  { name: 't', type: '(key: string) => string', default: 'key => key', description: '国际化翻译函数' },
]
</script>

<template>
  <DocSection title="FlBreadcrumb 面包屑" description="自动根据路由匹配结果生成面包屑导航，支持多种样式和配置">
    <!-- 概览 -->
    <div>
      <h2>概览</h2>
      <p>
        <code>FlBreadcrumb</code> 组件基于 <code>vue-router</code> 的 <code>route.matched</code> 自动生成面包屑导航，
        支持显示首页图标、各层级图标、两种样式类型，并结合路由 <code>meta</code> 字段控制标题和可见性。
      </p>
    </div>

    <!-- 交互 Demo -->
    <div>
      <h2>交互演示</h2>
      <p>点击下方按钮实时切换面包屑的各项配置，观察顶部面包屑的变化：</p>
      <div class="demo-controls">
        <el-button :type="showHome ? 'primary' : 'default'" @click="toggleShowHome">
          showHome: {{ showHome }}
        </el-button>
        <el-button :type="showIcon ? 'primary' : 'default'" @click="toggleShowIcon">
          showIcon: {{ showIcon }}
        </el-button>
        <el-button :type="hideOnlyOne ? 'primary' : 'default'" @click="toggleHideOnlyOne">
          hideOnlyOne: {{ hideOnlyOne }}
        </el-button>
        <el-button :type="styleType === 'background' ? 'primary' : 'default'" @click="toggleStyleType">
          styleType: {{ styleType }}
        </el-button>
      </div>
      <DocTip>
        这些按钮通过 <code>updatePreferences({ breadcrumb: { ... } })</code> 实时修改偏好设置，面包屑会立即响应变化。
      </DocTip>
    </div>

    <!-- 基础用法 -->
    <div>
      <h2>基础用法</h2>
      <p>将 FlBreadcrumb 放在 FizzLayout 的 <code>#breadcrumb</code> 插槽中：</p>
      <DocCodeBlock :code="basicCode" language="vue" />
    </div>

    <!-- 通过偏好系统控制 -->
    <div>
      <h2>通过偏好系统控制</h2>
      <p>除了 Props，也可以通过 <code>usePreferences</code> 的 <code>breadcrumb</code> 模块集中管理：</p>
      <DocCodeBlock :code="prefsCode" language="typescript" />
    </div>

    <!-- 路由 meta -->
    <div>
      <h2>路由 meta 配置</h2>
      <p>面包屑的标题和可见性受路由 <code>meta</code> 字段控制：</p>
      <DocCodeBlock :code="routeMetaCode" language="typescript" />
    </div>

    <!-- Props -->
    <DocPropsTable title="Props" :data="propsData" />

    <DocTip type="tip" title="无独立 Events">
      FlBreadcrumb 的点击行为内部通过 <code>router.push()</code> 处理，无需监听事件。
    </DocTip>
  </DocSection>
</template>

<style scoped>
.demo-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 12px 0;
}
</style>
