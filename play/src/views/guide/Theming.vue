<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { usePreferences } from '@fizz-layout/core'
import { ref } from 'vue'
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

const { preferences, isDark, updatePreferences } = usePreferences()

const primaryColor = ref('')

function applyCustomColor() {
  if (primaryColor.value) {
    document.documentElement.style.setProperty('--el-color-primary', primaryColor.value)
  }
}
function resetCustomColor() {
  document.documentElement.style.removeProperty('--el-color-primary')
  primaryColor.value = ''
}

function toggleSemiDarkHeader() {
  updatePreferences({ theme: { semiDarkHeader: !preferences.value.theme.semiDarkHeader } })
}
function toggleSemiDarkSidebar() {
  updatePreferences({ theme: { semiDarkSidebar: !preferences.value.theme.semiDarkSidebar } })
}

const themeModeCode = `import { usePreferences } from '@fizz/layout'

const { updatePreferences, isDark } = usePreferences()

// 主题模式：'auto' | 'light' | 'dark'
updatePreferences({ theme: { mode: 'dark' } })    // 强制暗色
updatePreferences({ theme: { mode: 'light' } })   // 强制亮色
updatePreferences({ theme: { mode: 'auto' } })    // 跟随系统

// isDark 是计算属性，自动响应模式变化
console.log(isDark.value) // true | false`

const semiDarkCode = `// 半深色模式：独立控制头部和侧边栏
updatePreferences({
  theme: {
    semiDarkHeader: true,   // 头部使用深色背景
    semiDarkSidebar: true,  // 侧边栏使用深色背景
  },
})

// 注意：半深色模式仅在亮色主题下有效
// 暗色主题下所有区域本身就是深色`

const cssVarCode = `/* 在你的样式文件中覆盖 CSS 变量 */

/* Element Plus 主题色 */
:root {
  --el-color-primary: #409eff;
  --el-color-success: #67c23a;
  --el-color-warning: #e6a23c;
  --el-color-danger: #f56c6c;
}

/* Fizz Layout 布局变量 */
:root {
  --fizz-border-color-light: #e4e7ed;
  --fizz-bg-color: #fff;
  --fizz-text-color-primary: #303133;
}

/* 暗色模式下的变量 */
html.dark {
  --fizz-border-color-light: #414243;
  --fizz-bg-color: #141414;
  --fizz-text-color-primary: #e5eaf3;
}`

const scssVarCode = `// 在引入 theme-chalk 之前覆盖 SCSS 变量
// 文件: styles/fizz-overrides.scss

// 覆盖主色调
$color-primary: #6366f1;
$color-success: #22c55e;

// 覆盖布局尺寸
$header-height: 56px;
$sidebar-width: 240px;

// 然后引入 theme-chalk
@import '@fizz/layout/theme-chalk/src/index.scss';`

const cssVarsTable = [
  { name: '--el-color-primary', desc: '主色调', default: '#409eff' },
  { name: '--el-color-success', desc: '成功色', default: '#67c23a' },
  { name: '--el-color-warning', desc: '警告色', default: '#e6a23c' },
  { name: '--el-color-danger', desc: '危险色', default: '#f56c6c' },
  { name: '--el-bg-color', desc: '背景色', default: '#ffffff' },
  { name: '--el-text-color-primary', desc: '主文字色', default: '#303133' },
  { name: '--el-border-color', desc: '边框色', default: '#dcdfe6' },
  { name: '--el-fill-color-lighter', desc: '填充色（浅）', default: '#fafafa' },
  { name: '--fizz-border-color-light', desc: '布局边框色', default: '#e4e7ed' },
]

const themeModeData = [
  { mode: 'auto', desc: '跟随系统偏好，自动在亮色/暗色之间切换（默认值）' },
  { mode: 'light', desc: '强制亮色模式' },
  { mode: 'dark', desc: '强制暗色模式，通过在 <html> 添加 class="dark" 实现' },
]
</script>

<template>
  <DocSection title="主题定制" description="通过 CSS 变量和 SCSS 变量定制 Fizz Layout 的视觉风格">
    <div>
      <h2>主题模式</h2>
      <p>
        Fizz Layout 支持三种主题模式，通过 <code>preferences.theme.mode</code> 控制：
      </p>

      <el-table
        :data="themeModeData"
        stripe
        border
      >
        <el-table-column prop="mode" label="模式" width="120">
          <template #default="{ row }">
            <code>{{ row.mode }}</code>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="说明" />
      </el-table>

      <DocCodeBlock :code="themeModeCode" language="typescript" />
    </div>

    <div>
      <h2>半深色模式</h2>
      <p>
        半深色模式允许在亮色主题下，独立将头部或侧边栏设为深色背景。
        常见于企业级后台，使导航区域更加醒目。
      </p>
      <DocCodeBlock :code="semiDarkCode" language="typescript" />

      <div class="semi-dark-demo">
        <p>当前状态：主题 <code>{{ preferences.theme.mode }}</code> | 暗色 <code>{{ isDark }}</code></p>
        <div class="semi-dark-demo__buttons">
          <el-button
            :type="preferences.theme.semiDarkHeader ? 'primary' : 'default'"
            @click="toggleSemiDarkHeader"
          >
            {{ preferences.theme.semiDarkHeader ? '✅' : '⬜' }} 半深色头部
          </el-button>
          <el-button
            :type="preferences.theme.semiDarkSidebar ? 'primary' : 'default'"
            @click="toggleSemiDarkSidebar"
          >
            {{ preferences.theme.semiDarkSidebar ? '✅' : '⬜' }} 半深色侧栏
          </el-button>
        </div>
      </div>
    </div>

    <DocTip type="warning">
      半深色模式仅在亮色主题下有可见效果。暗色主题下所有区域本身就是深色。
    </DocTip>

    <div>
      <h2>CSS 变量覆盖</h2>
      <p>
        Fizz Layout 的所有样式都基于 CSS 变量，你可以在项目的全局样式中覆盖这些变量来定制视觉效果：
      </p>
      <DocCodeBlock :code="cssVarCode" language="scss" />
    </div>

    <div>
      <h2>常用 CSS 变量</h2>
      <el-table
        :data="cssVarsTable"
        stripe
        border
      >
        <el-table-column prop="name" label="变量名" width="260">
          <template #default="{ row }">
            <code>{{ row.name }}</code>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="说明" />
        <el-table-column prop="default" label="默认值" width="180">
          <template #default="{ row }">
            <span class="color-swatch" :style="{ background: row.default } as CSSProperties" />
            <code>{{ row.default }}</code>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Interactive Color Demo -->
    <div>
      <h2>交互演示：主色调修改</h2>
      <p>输入颜色值实时预览效果（仅影响当前会话）：</p>
      <div class="color-demo">
        <div class="color-demo__row">
          <label>主色调：</label>

          <input v-model="primaryColor" type="color" class="color-demo__picker">
          <input
            v-model="primaryColor"
            type="text"
            placeholder="#409eff"
            class="color-demo__input"
          >
          <el-button type="primary" @click="applyCustomColor">
            应用
          </el-button>
          <el-button @click="resetCustomColor">
            重置
          </el-button>
        </div>
      </div>
    </div>

    <div>
      <h2>SCSS 变量覆盖</h2>
      <p>如果你使用 SCSS，可以在引入 theme-chalk 之前覆盖 SCSS 变量：</p>
      <DocCodeBlock :code="scssVarCode" language="scss" />
    </div>

    <DocTip>
      CSS 变量覆盖在运行时生效，适合动态换肤。SCSS 变量覆盖在构建时生效，适合固定品牌色。
      推荐优先使用 CSS 变量方式。
    </DocTip>
  </DocSection>
</template>

<style scoped>
.color-swatch {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 3px;
  border: 1px solid var(--el-border-color-lighter);
  vertical-align: middle;
  margin-right: 4px;
}

.semi-dark-demo {
  padding: 1rem;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  margin-top: 0.75rem;
}

.semi-dark-demo__buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.color-demo {
  padding: 1rem;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
}

.color-demo__row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.color-demo__picker {
  width: 36px;
  height: 36px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.color-demo__input {
  padding: 0.35rem 0.75rem;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  font-size: 0.875rem;
  width: 120px;
  background: var(--el-bg-color);
  color: var(--el-text-color-regular);
}
</style>
