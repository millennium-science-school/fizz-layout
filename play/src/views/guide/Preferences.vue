<script setup lang="ts">
import { usePreferences } from '@fizz-layout/core'
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

const {
  preferences,
  isDark,
  sidebarCollapsed,
  updatePreferences,
  toggleSidebarCollapse,
  resetPreferences,
} = usePreferences()

function toggleHeader() {
  updatePreferences({ header: { enable: !preferences.value.header.enable } })
}
function toggleTabs() {
  updatePreferences({ tabs: { enable: !preferences.value.tabs.enable } })
}
function toggleFooter() {
  updatePreferences({ footer: { enable: !preferences.value.footer.enable } })
}
function toggleSemiDarkHeader() {
  updatePreferences({ theme: { semiDarkHeader: !preferences.value.theme.semiDarkHeader } })
}
function toggleSemiDarkSidebar() {
  updatePreferences({ theme: { semiDarkSidebar: !preferences.value.theme.semiDarkSidebar } })
}

const basicUsageCode = `import { usePreferences } from '@fizz/layout'

const {
  preferences,       // Readonly<Ref<LayoutPreferences>> 完整偏好对象
  isDark,            // ComputedRef<boolean> 是否暗色模式
  sidebarCollapsed,  // Ref<boolean> 侧边栏折叠状态
  layout,            // ComputedRef<string> 当前布局模式
  layoutMode,        // ComputedRef 布局模式判断 { isSideNav, isHeaderNav, isMixedNav }
  updatePreferences, // (updates: DeepPartial<LayoutPreferences>) => void
  resetPreferences,  // () => void 重置为默认值
  toggleSidebarCollapse, // () => void 切换侧边栏折叠
} = usePreferences()`

const updateCode = `// updatePreferences 执行深度合并，只需传入要修改的字段
updatePreferences({
  header: { enable: false },        // 隐藏顶栏
  sidebar: { width: 260 },          // 加宽侧边栏
  tabs: { keepAlive: false },       // 关闭标签页缓存
  theme: { semiDarkSidebar: true }, // 开启半深色侧边栏
})

// 切换布局模式
updatePreferences({ app: { layout: 'mixed-nav' } })

// 修改面包屑样式
updatePreferences({ breadcrumb: { styleType: 'background' } })`

const defaultPrefsCode = `// DEFAULT_PREFERENCES 定义了所有偏好的默认值
import { DEFAULT_PREFERENCES } from '@fizz/layout'

console.log(DEFAULT_PREFERENCES.app.layout)      // 'header-nav'
console.log(DEFAULT_PREFERENCES.sidebar.width)    // 224
console.log(DEFAULT_PREFERENCES.tabs.keepAlive)   // true
console.log(DEFAULT_PREFERENCES.theme.mode)       // 'auto'`

const moduleOverview = [
  { module: 'app', fields: 'layout, name, contentCompact, zIndex, locale', desc: '应用全局配置' },
  { module: 'header', fields: 'enable, height, hidden, menuAlign, mode', desc: '顶栏配置' },
  { module: 'sidebar', fields: 'collapsed, width, collapseWidth, expandOnHover, collapsedShowTitle', desc: '侧边栏配置' },
  { module: 'tabs', fields: 'enable, keepAlive, draggable, persist, styleType, showIcon', desc: '标签页配置' },
  { module: 'theme', fields: 'mode, semiDarkHeader, semiDarkSidebar', desc: '主题配置' },
  { module: 'breadcrumb', fields: 'enable, showHome, showIcon, hideOnlyOne, styleType', desc: '面包屑配置' },
  { module: 'footer', fields: 'enable, fixed, height', desc: '底栏配置' },
  { module: 'logo', fields: 'enable, source, sourceDark, fit', desc: 'Logo 配置' },
  { module: 'navigation', fields: 'accordion, split, styleType', desc: '导航菜单配置' },
  { module: 'copyright', fields: 'enable, companyName, date, icp, icpLink', desc: '版权信息' },
  { module: 'transition', fields: 'enable, name, loading, progress', desc: '页面过渡动画' },
  { module: 'widget', fields: 'themeToggle, languageToggle, fullscreen, notification, globalSearch', desc: '工具栏开关' },
]
</script>

<template>
  <DocSection title="偏好系统" description="使用 usePreferences 管理布局的所有可配置项">
    <div>
      <h2>概览</h2>
      <p>
        偏好系统是 Fizz Layout 的核心功能之一。它通过 <code>usePreferences()</code> composable 暴露
        <strong>12 个配置模块</strong>，涵盖布局、主题、导航、标签页等方方面面。
        所有偏好修改会自动持久化到 <code>localStorage</code>，刷新后自动恢复。
      </p>
    </div>

    <div>
      <h2>基本用法</h2>
      <DocCodeBlock :code="basicUsageCode" language="typescript" />
    </div>

    <DocTip>
      <code>updatePreferences</code> 执行<strong>深度合并</strong>（Deep Merge），只需传入要修改的字段，其余字段保持不变。
    </DocTip>

    <div>
      <h2>配置模块一览</h2>
      <el-table :data="moduleOverview" stripe border>
        <el-table-column prop="module" label="模块" width="130">
          <template #default="{ row }">
            <code>{{ row.module }}</code>
          </template>
        </el-table-column>
        <el-table-column label="主要字段" min-width="280">
          <template #default="{ row }">
            <span style="font-size: 0.75rem; color: var(--el-text-color-secondary)">{{ row.fields }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="说明" min-width="160" />
      </el-table>
    </div>

    <div>
      <h2>更新偏好</h2>
      <DocCodeBlock :code="updateCode" language="typescript" />
    </div>

    <!-- Interactive Demo (migrated from Home.vue) -->
    <div>
      <h2>交互演示</h2>
      <p>点击按钮实时修改偏好，立即看到布局变化：</p>

      <div class="pref-demo">
        <div class="pref-demo__section">
          <h3>布局区域控制</h3>
          <div class="pref-demo__buttons">
            <el-button @click="toggleSidebarCollapse">
              {{ sidebarCollapsed ? '展开' : '折叠' }}侧边栏
            </el-button>
            <el-button @click="toggleHeader">
              {{ preferences.header.enable ? '隐藏' : '显示' }}头部
            </el-button>
            <el-button @click="toggleTabs">
              {{ preferences.tabs.enable ? '隐藏' : '显示' }}标签页
            </el-button>
            <el-button @click="toggleFooter">
              {{ preferences.footer.enable ? '隐藏' : '显示' }}底栏
            </el-button>
          </div>
        </div>

        <div class="pref-demo__section">
          <h3>半深色模式</h3>
          <div class="pref-demo__buttons">
            <el-button :type="preferences.theme.semiDarkHeader ? 'primary' : 'default'" @click="toggleSemiDarkHeader">
              {{ preferences.theme.semiDarkHeader ? '关闭' : '开启' }}半深色头部
            </el-button>
            <el-button :type="preferences.theme.semiDarkSidebar ? 'primary' : 'default'" @click="toggleSemiDarkSidebar">
              {{ preferences.theme.semiDarkSidebar ? '关闭' : '开启' }}半深色侧栏
            </el-button>
          </div>
        </div>

        <div class="pref-demo__section">
          <h3>当前偏好状态</h3>
          <div class="pref-demo__grid">
            <div class="pref-card">
              <div class="pref-card__title">
                应用配置
              </div>
              <div class="pref-card__body">
                <div>布局: {{ preferences.app.layout }}</div>
                <div>名称: {{ preferences.app.name }}</div>
              </div>
            </div>
            <div class="pref-card">
              <div class="pref-card__title">
                主题配置
              </div>
              <div class="pref-card__body">
                <div>模式: {{ preferences.theme.mode }}</div>
                <div>暗色: {{ isDark }}</div>
                <div>半深色头部: {{ preferences.theme.semiDarkHeader }}</div>
                <div>半深色侧栏: {{ preferences.theme.semiDarkSidebar }}</div>
              </div>
            </div>
            <div class="pref-card">
              <div class="pref-card__title">
                侧边栏
              </div>
              <div class="pref-card__body">
                <div>折叠: {{ preferences.sidebar.collapsed }}</div>
                <div>宽度: {{ preferences.sidebar.width }}px</div>
              </div>
            </div>
            <div class="pref-card">
              <div class="pref-card__title">
                标签页
              </div>
              <div class="pref-card__body">
                <div>启用: {{ preferences.tabs.enable }}</div>
                <div>KeepAlive: {{ preferences.tabs.keepAlive }}</div>
              </div>
            </div>
            <div class="pref-card">
              <div class="pref-card__title">
                顶栏
              </div>
              <div class="pref-card__body">
                <div>启用: {{ preferences.header.enable }}</div>
                <div>高度: {{ preferences.header.height }}px</div>
              </div>
            </div>
            <div class="pref-card">
              <div class="pref-card__title">
                底栏
              </div>
              <div class="pref-card__body">
                <div>启用: {{ preferences.footer.enable }}</div>
                <div>固定: {{ preferences.footer.fixed }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="pref-demo__section">
          <el-button type="danger" @click="resetPreferences">
            🔄 重置所有偏好为默认值
          </el-button>
        </div>
      </div>
    </div>

    <div>
      <h2>默认值参考</h2>
      <p>所有偏好都有内置默认值，定义在 <code>DEFAULT_PREFERENCES</code> 中：</p>
      <DocCodeBlock :code="defaultPrefsCode" language="typescript" />
    </div>

    <div>
      <h2>持久化机制</h2>
      <p>
        偏好数据自动保存到 <code>localStorage</code>，key 为 <code>fizz-layout-preferences</code>。
        页面刷新后自动恢复。调用 <code>resetPreferences()</code> 会重置为默认值并清除持久化数据。
      </p>
    </div>

    <DocTip type="warning">
      偏好类型定义为 <code>LayoutPreferences</code>，<code>updatePreferences</code> 接受
      <code>DeepPartial&lt;LayoutPreferences&gt;</code>。
      完整类型定义详见 <router-link to="/api/types">
        类型速查
      </router-link>。
    </DocTip>
  </DocSection>
</template>

<style scoped>
.pref-demo {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  overflow: hidden;
}

.pref-demo__section {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--el-border-color-extra-light);
}

.pref-demo__section:last-child {
  border-bottom: none;
}

.pref-demo__section h3 {
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--el-text-color-primary);
}

.pref-demo__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pref-demo__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.pref-card {
  padding: 0.75rem;
  border: 1px solid var(--el-border-color-extra-light);
  border-radius: 6px;
  background: var(--el-fill-color-extra-light);
}

.pref-card__title {
  font-weight: 600;
  font-size: 0.8125rem;
  margin-bottom: 0.375rem;
  color: var(--el-text-color-primary);
}

.pref-card__body {
  font-size: 0.8125rem;
  color: var(--el-text-color-secondary);
  line-height: 1.7;
}
</style>
