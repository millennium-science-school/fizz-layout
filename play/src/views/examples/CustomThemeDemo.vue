<script setup lang="ts">
import { usePreferences } from '@fizz-layout/core'
import { ref, watch } from 'vue'
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocDemoBox from '../../components/DocDemoBox.vue'
import DocPropsTable from '../../components/DocPropsTable.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

const { updatePreferences, preferences } = usePreferences()

// 实时主题色选择
const presetColors = [
  { name: '默认蓝', value: '#409eff' },
  { name: '品牌紫', value: '#722ed1' },
  { name: '极光绿', value: '#13c2c2' },
  { name: '日落橙', value: '#fa8c16' },
  { name: '玫瑰红', value: '#eb2f96' },
  { name: '极客绿', value: '#52c41a' },
  { name: '火山红', value: '#f5222d' },
  { name: '金盏花', value: '#faad14' },
]

const customColor = ref(preferences.value.theme.colorPrimary || '#409eff')

function applyColor(color: string) {
  customColor.value = color
  updatePreferences({ theme: { colorPrimary: color } })
}

watch(customColor, (val) => {
  updatePreferences({ theme: { colorPrimary: val } })
})

// 圆角选择
const radiusOptions = ['0', '0.25rem', '0.375rem', '0.5rem', '0.75rem', '1rem']

function applyRadius(radius: string) {
  updatePreferences({ theme: { radius } })
}

// ========== 代码示例 ==========
const cssVarsCode = `/* 方式一：在全局样式中覆盖 CSS 变量 */
:root {
  /* 主色调 */
  --fizz-color-primary: #722ed1;
  --fizz-color-primary-light: rgba(114, 46, 209, 0.15);

  /* 背景色 */
  --fizz-bg-color: #ffffff;
  --fizz-bg-color-page: #f5f7fa;
  --fizz-bg-color-overlay: #ffffff;

  /* 文字颜色 */
  --fizz-text-color-primary: #303133;
  --fizz-text-color-regular: #606266;
  --fizz-text-color-secondary: #909399;

  /* 边框 */
  --fizz-border-color: #dcdfe6;
  --fizz-border-color-light: #e4e7ed;

  /* 菜单 */
  --fizz-menu-bg: #ffffff;
  --fizz-menu-hover-bg: #f5f7fa;
  --fizz-menu-active-color: #722ed1;

  /* 标签栏 */
  --fizz-tabs-height: 40px;
  --fizz-tabs-bg-color: #ffffff;
}

/* 暗色模式覆盖 */
.dark, [data-theme='dark'] {
  --fizz-color-primary: #9254de;
  --fizz-bg-color: #141414;
  --fizz-bg-color-page: #0a0a0a;
  --fizz-text-color-primary: #e5eaf3;
  --fizz-menu-bg: #1d1d1d;
}`

const scssVarsCode = `// 方式二：覆盖 SCSS 变量（编译时生效）
// 在引入 @fizz/layout/theme-chalk 之前定义

// 文件: styles/variables.scss
$color-primary: #722ed1;
$color-primary-light: rgba(114, 46, 209, 0.15);
$color-success: #52c41a;
$color-warning: #faad14;
$color-danger: #f5222d;

$text-color-primary: #1f1f1f;
$bg-color: #ffffff;
$bg-color-page: #fafafa;

$menu-font-size: 14px;
$menu-item-height: 44px;
$tabs-height: 38px;

$radius-sm: 4px;
$radius-base: 6px;
$radius-md: 8px;

// 在 main.ts 或 vite.config.ts 中配置预处理器选项
// vite.config.ts:
// css: {
//   preprocessorOptions: {
//     scss: {
//       additionalData: \`@use "./styles/variables" as *;\`
//     }
//   }
// }`

const jsThemeCode = `// 方式三：通过 usePreferences 动态修改（运行时）
import { usePreferences } from '@fizz/layout'

const { updatePreferences } = usePreferences()

// 切换主色调
updatePreferences({
  theme: {
    colorPrimary: '#722ed1',
    mode: 'light',           // 'auto' | 'light' | 'dark'
    radius: '0.5rem',
  },
})

// 切换暗色模式
updatePreferences({
  theme: { mode: 'dark' },
})`

const semiDarkCode = `// 半深色模式 — 单独为 Header 或 Sidebar 启用暗色
updatePreferences({
  theme: {
    semiDarkHeader: true,   // 顶栏使用深色背景
    semiDarkSidebar: false, // 侧边栏保持浅色
  },
})

// 也可以同时启用
updatePreferences({
  theme: {
    semiDarkHeader: true,
    semiDarkSidebar: true,
  },
})`

const cssVarsTable = [
  { name: '--fizz-color-primary', type: 'color', description: '主色调，影响按钮、链接、激活菜单等' },
  { name: '--fizz-color-primary-light', type: 'color', description: '主色调浅色变体，用于悬停背景等' },
  { name: '--fizz-bg-color', type: 'color', description: '主内容区背景色' },
  { name: '--fizz-bg-color-page', type: 'color', description: '页面（body）背景色' },
  { name: '--fizz-bg-color-overlay', type: 'color', description: '弹层/下拉面板背景色' },
  { name: '--fizz-text-color-primary', type: 'color', description: '主文字颜色' },
  { name: '--fizz-text-color-regular', type: 'color', description: '常规文字颜色' },
  { name: '--fizz-text-color-secondary', type: 'color', description: '次要文字颜色' },
  { name: '--fizz-border-color', type: 'color', description: '边框颜色' },
  { name: '--fizz-border-color-light', type: 'color', description: '浅边框颜色' },
  { name: '--fizz-menu-bg', type: 'color', description: '菜单背景色' },
  { name: '--fizz-menu-hover-bg', type: 'color', description: '菜单项悬停背景色' },
  { name: '--fizz-menu-active-color', type: 'color', description: '菜单项激活文字颜色' },
  { name: '--fizz-tabs-height', type: 'size', description: '标签栏高度' },
  { name: '--fizz-tabs-bg-color', type: 'color', description: '标签栏背景色' },
  { name: '--fizz-font-sans', type: 'font', description: '正文字体族' },
  { name: '--fizz-font-mono', type: 'font', description: '等宽字体族' },
]
</script>

<template>
  <DocSection title="自定义主题" description="通过 CSS 变量、SCSS 变量或运行时 API 定制 Fizz Layout 的视觉风格">
    <!-- 交互 Demo：主题色实时切换 -->
    <DocDemoBox title="实时主题色切换" description="点击预设色或使用拾色器，效果即时应用到当前文档站">
      <div class="theme-demo">
        <!-- 预设色板 -->
        <div class="theme-demo__section">
          <div class="theme-demo__label">
            预设主题色
          </div>
          <div class="theme-demo__colors">
            <button
              v-for="color in presetColors"
              :key="color.value"
              class="theme-demo__color-btn"
              :class="{ 'is-active': customColor === color.value }"
              :style="{ '--btn-color': color.value }"
              :title="color.name"
              @click="applyColor(color.value)"
            >
              <span class="theme-demo__color-dot" />
              <span class="theme-demo__color-name">{{ color.name }}</span>
            </button>
          </div>
        </div>

        <!-- 自定义拾色器 -->
        <div class="theme-demo__section">
          <div class="theme-demo__label">
            自定义颜色
          </div>
          <div class="theme-demo__picker-row">
            <input
              v-model="customColor"
              type="color"
              class="theme-demo__picker"
            >
            <code class="theme-demo__color-value">{{ customColor }}</code>
          </div>
        </div>

        <!-- 圆角控制 -->
        <div class="theme-demo__section">
          <div class="theme-demo__label">
            圆角大小
          </div>
          <div class="theme-demo__radius-options">
            <button
              v-for="r in radiusOptions"
              :key="r"
              class="theme-demo__radius-btn"
              :class="{ 'is-active': preferences.theme.radius === r }"
              @click="applyRadius(r)"
            >
              {{ r || '0' }}
            </button>
          </div>
        </div>

        <!-- 当前状态 -->
        <div class="theme-demo__current">
          <div class="theme-demo__current-item">
            <span>主色调</span>
            <span class="theme-demo__swatch" :style="{ background: preferences.theme.colorPrimary }" />
            <code>{{ preferences.theme.colorPrimary }}</code>
          </div>
          <div class="theme-demo__current-item">
            <span>色彩模式</span>
            <code>{{ preferences.theme.mode }}</code>
          </div>
          <div class="theme-demo__current-item">
            <span>圆角</span>
            <code>{{ preferences.theme.radius }}</code>
          </div>
        </div>
      </div>
    </DocDemoBox>

    <!-- 三种定制方式 -->
    <div>
      <h2>定制方式</h2>
      <p>Fizz Layout 提供三种主题定制方式，适用于不同场景：</p>
    </div>

    <DocTip type="tip" title="选择指南">
      <ul style="margin: 0; padding-left: 1.2em;">
        <li><strong>CSS 变量</strong> — 最灵活，支持运行时切换，推荐大部分场景使用</li>
        <li><strong>SCSS 变量</strong> — 编译时生效，适用于深度定制和构建优化</li>
        <li><strong>usePreferences</strong> — JS 运行时动态修改，适合用户可配置的场景</li>
      </ul>
    </DocTip>

    <!-- 方式一：CSS 变量 -->
    <div>
      <h3>方式一：CSS 变量覆盖</h3>
      <p>在全局样式文件中覆盖 <code>--fizz-*</code> CSS 自定义属性。支持浅色和暗色模式分别定义。</p>
    </div>
    <DocCodeBlock :code="cssVarsCode" language="css" />

    <!-- 方式二：SCSS 变量 -->
    <div>
      <h3>方式二：SCSS 变量覆盖</h3>
      <p>
        在 <code>@fizz/layout/theme-chalk</code> 的 SCSS 源码被编译之前，
        通过 Vite 的 <code>preprocessorOptions</code> 注入自定义变量。
      </p>
    </div>
    <DocCodeBlock :code="scssVarsCode" language="scss" />

    <!-- 方式三：JS API -->
    <div>
      <h3>方式三：运行时 API</h3>
      <p>通过 <code>usePreferences</code> 在运行时动态修改主题配置。</p>
    </div>
    <DocCodeBlock :code="jsThemeCode" language="typescript" />

    <!-- 半深色模式 -->
    <div>
      <h2>半深色模式</h2>
      <p>
        Fizz Layout 支持为 Header 和 Sidebar 分别设置深色背景，
        在浅色主体中形成视觉层次。常见于企业级后台管理系统。
      </p>
    </div>
    <DocCodeBlock :code="semiDarkCode" language="typescript" />

    <!-- CSS 变量速查表 -->
    <div>
      <h2>CSS 变量速查表</h2>
      <p>以下是最常用的 <code>--fizz-*</code> CSS 变量。完整变量定义请参考 <code>@fizz/layout/theme-chalk/src/config/_css-vars.scss</code>。</p>
    </div>
    <DocPropsTable title="常用 CSS 变量" :data="cssVarsTable" />

    <!-- 变量体系分层 -->
    <div>
      <h2>变量体系架构</h2>
      <p>Fizz Layout 的主题系统分为四层：</p>
    </div>
    <DocCodeBlock
      code="┌─────────────────────────────────────────┐
│  SCSS 变量 ($color-primary 等)          │  ← 编译时，定义初始值
│  文件: config/_vars.scss                │
├─────────────────────────────────────────┤
│  CSS 变量 (--fizz-*)                    │  ← 运行时，支持主题切换
│  文件: config/_css-vars.scss            │
│  - :root (浅色) / .dark (暗色)          │
├─────────────────────────────────────────┤
│  组件级变量 (--menu-* 等)               │  ← 组件作用域
│  文件: theme/_light.scss, _dark.scss    │
├─────────────────────────────────────────┤
│  半深色覆盖 (--fizz-* + --el-*)         │  ← 局部主题
│  文件: theme/_semi-dark.scss            │
│  应用: _header.scss, _sidebar.scss      │
└─────────────────────────────────────────┘"
      language="text"
    />

    <DocTip type="warning" title="Element Plus 变量">
      Fizz Layout 内部也覆盖了部分 <code>--el-*</code> 变量（Element Plus 的 CSS 变量），
      以确保 Breadcrumb、Button 等 Element Plus 组件与布局风格一致。
      如需修改这些组件样式，建议同时覆盖对应的 <code>--el-*</code> 变量。
    </DocTip>
  </DocSection>
</template>

<style lang="scss" scoped>
.theme-demo {
  &__section {
    margin-bottom: 1rem;
  }

  &__label {
    font-weight: 600;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    color: var(--el-text-color-primary);
  }

  &__colors {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__color-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border: 2px solid var(--el-border-color-lighter);
    border-radius: 8px;
    background: var(--el-bg-color);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.8125rem;
    color: var(--el-text-color-regular);

    &:hover {
      border-color: var(--btn-color);
    }

    &.is-active {
      border-color: var(--btn-color);
      background: color-mix(in srgb, var(--btn-color) 8%, transparent);
    }
  }

  &__color-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--btn-color);
    flex-shrink: 0;
  }

  &__color-name {
    white-space: nowrap;
  }

  &__picker-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__picker {
    width: 40px;
    height: 32px;
    border: 1px solid var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    padding: 2px;
  }

  &__color-value {
    font-size: 0.8125rem;
    padding: 2px 8px;
    background: var(--el-fill-color-light);
    border-radius: 4px;
  }

  &__radius-options {
    display: flex;
    gap: 0.5rem;
  }

  &__radius-btn {
    font-size: 0.8125rem;
    padding: 4px 12px;
    border: 1px solid var(--el-border-color);
    border-radius: 6px;
    background: var(--el-bg-color);
    color: var(--el-text-color-regular);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: var(--el-color-primary);
      color: var(--el-color-primary);
    }

    &.is-active {
      background: var(--el-color-primary);
      color: #fff;
      border-color: var(--el-color-primary);
    }
  }

  &__current {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 0.75rem;
    margin-top: 0.5rem;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;
    background: var(--el-fill-color-lighter);
  }

  &__current-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8125rem;
    color: var(--el-text-color-secondary);

    code {
      font-size: 0.75rem;
      padding: 1px 6px;
      background: var(--el-bg-color);
      border-radius: 4px;
      border: 1px solid var(--el-border-color-lighter);
    }
  }

  &__swatch {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid var(--el-border-color);
  }
}
</style>
