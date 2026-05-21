<script setup lang="ts">
import { FlFullscreen } from '@fizz-layout/core'
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

// ========== 代码示例 ==========
const basicCode = `<script setup lang="ts">
import { FlFullscreen } from '@fizz/layout'
<\/script>

<template>
  <FizzLayout ...>
    <template #fullscreen>
      <FlFullscreen />
    </template>
  </FizzLayout>
</template>`

const manualCode = `<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'

const { isFullscreen, toggle } = useFullscreen()
<\/script>

<template>
  <button @click="toggle">
    {{ isFullscreen ? '退出全屏' : '进入全屏' }}
  </button>
</template>`

const widgetCode = `import { usePreferences } from '@fizz/layout'

const { updatePreferences } = usePreferences()

// 通过偏好控制全屏按钮是否显示
updatePreferences({
  widget: {
    fullscreen: true, // 在 header 区域显示全屏按钮
  },
})`
</script>

<template>
  <DocSection title="FlFullscreen 全屏" description="一键切换浏览器全屏模式">
    <!-- 概览 -->
    <div>
      <h2>概览</h2>
      <p>
        <code>FlFullscreen</code> 组件基于 <code>@vueuse/core</code> 的 <code>useFullscreen</code> 实现，
        提供一个带 Tooltip 的圆形按钮，点击即可在全屏和窗口模式之间切换。
        全屏和非全屏状态使用不同的图标。
      </p>
    </div>

    <!-- 交互 Demo -->
    <div>
      <h2>交互演示</h2>
      <p>点击下方按钮进入/退出全屏：</p>
      <div class="demo-area">
        <FlFullscreen />
        <span class="demo-hint">← 点击切换全屏</span>
      </div>
    </div>

    <!-- 基础用法 -->
    <div>
      <h2>在 FizzLayout 中使用</h2>
      <DocCodeBlock :code="basicCode" language="vue" />
    </div>

    <!-- 手动实现 -->
    <div>
      <h2>手动实现</h2>
      <p>如果你不使用 FlFullscreen 组件，也可以直接使用 <code>@vueuse/core</code>：</p>
      <DocCodeBlock :code="manualCode" language="vue" />
    </div>

    <!-- 偏好控制 -->
    <div>
      <h2>偏好控制</h2>
      <p>通过 <code>widget.fullscreen</code> 控制全屏按钮在 header 区域的显示：</p>
      <DocCodeBlock :code="widgetCode" language="typescript" />
    </div>

    <DocTip type="tip" title="无 Props / Events">
      FlFullscreen 不接收 Props，也不触发事件。它完全自包含，内部管理全屏状态。
      Tooltip 文案通过内置的 <code>useLocale</code> 自动国际化。
    </DocTip>
  </DocSection>
</template>

<style scoped>
.demo-area {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  margin: 12px 0;
}

.demo-hint {
  font-size: 13px;
  color: var(--el-text-color-placeholder);
}
</style>
