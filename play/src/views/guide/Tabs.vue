<script setup lang="ts">
import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import DocCodeBlock from '../../components/DocCodeBlock.vue'
import DocPropsTable from '../../components/DocPropsTable.vue'
import DocSection from '../../components/DocSection.vue'
import DocTip from '../../components/DocTip.vue'

// KeepAlive 演示状态
const counter = ref(0)
const mountCount = ref(0)
const activateCount = ref(0)
const logs = ref<string[]>([])

function addLog(msg: string) {
  const t = new Date().toLocaleTimeString()
  logs.value.unshift(`[${t}] ${msg}`)
  if (logs.value.length > 15)
    logs.value.pop()
}

onMounted(() => {
  mountCount.value++
  addLog(`onMounted (第 ${mountCount.value} 次)`)
})
onUnmounted(() => {
  addLog('onUnmounted')
})
onActivated(() => {
  activateCount.value++
  addLog(`onActivated (第 ${activateCount.value} 次)`)
})
onDeactivated(() => {
  addLog('onDeactivated')
})

const useTabsCode = `import { useTabs } from '@fizz/layout'

const {
  closeAllTabs,       // 关闭所有标签
  closeCurrentTab,    // 关闭当前标签
  closeOtherTabs,     // 关闭其他标签
  closeTabByKey,      // 按 key 关闭标签
  pinTab,             // 固定标签
  unpinTab,           // 取消固定标签
  toggleTabPin,       // 切换固定状态
  refreshTab,         // 刷新标签页
  openTabInNewWindow, // 在新窗口打开
  setTabTitle,        // 动态设置标签标题
  resetTabTitle,      // 重置标签标题
  getTabDisableState, // 获取标签操作禁用状态
} = useTabs()`

const affixTabCode = `// 在路由 meta 中设置固定标签
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/Home.vue'),
    meta: {
      title: '首页',
      icon: 'carbon:home',
      affixTab: true,       // 固定在标签页中（不可关闭）
      affixTabOrder: 0,     // 固定标签排序（越小越靠前）
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('./views/Dashboard.vue'),
    meta: {
      title: '仪表盘',
      affixTab: true,
      affixTabOrder: 1,
      tabClosable: false,   // 也可以单独控制可关闭性
    },
  },
]`

const keepAliveCode = `// 通过偏好控制 KeepAlive
import { usePreferences } from '@fizz/layout'

const { updatePreferences } = usePreferences()

// 全局启用 KeepAlive
updatePreferences({ tabs: { keepAlive: true } })

// 单个路由禁用缓存
const route = {
  meta: { keepAlive: false }, // 此页面不缓存
}`

const dynamicTitleCode = `import { useTabs } from '@fizz/layout'
import { computed } from 'vue'

const { setTabTitle, resetTabTitle } = useTabs()

// 设置动态标题
setTabTitle('订单详情 #12345')

// 使用 computed 响应式标题
const title = computed(() => \`用户 - \${userName.value}\`)
setTabTitle(title)

// 重置为路由 meta.title
resetTabTitle()`

const tabsPrefsProps = [
  { name: 'enable', type: 'boolean', default: 'true', description: '是否启用标签页' },
  { name: 'keepAlive', type: 'boolean', default: 'true', description: '启用 KeepAlive 缓存' },
  { name: 'draggable', type: 'boolean', default: 'true', description: '标签页可拖拽排序' },
  { name: 'persist', type: 'boolean', default: 'false', description: '标签页持久化（刷新后恢复）' },
  { name: 'showIcon', type: 'boolean', default: 'true', description: '显示标签页图标' },
  { name: 'showMore', type: 'boolean', default: 'true', description: '显示"更多"菜单按钮' },
  { name: 'showMaximize', type: 'boolean', default: 'true', description: '显示最大化按钮' },
  { name: 'middleClickToClose', type: 'boolean', default: 'false', description: '鼠标中键关闭标签' },
  { name: 'wheelable', type: 'boolean', default: 'true', description: '鼠标滚轮切换标签' },
  { name: 'maxCount', type: 'number', default: '0', description: '最大标签数（0 为不限制）' },
  { name: 'height', type: 'number', default: '38', description: '标签栏高度（px）' },
  { name: 'styleType', type: '\'chrome\'', default: '\'chrome\'', description: '标签样式类型' },
]
</script>

<template>
  <DocSection title="标签页" description="使用 useTabs 实现标签页的固定、拖拽、右键菜单和 KeepAlive 缓存">
    <div>
      <h2>概览</h2>
      <p>
        Fizz Layout 内置了强大的标签页管理系统，基于 <code>useTabs()</code> composable 提供完整的
        标签页操作能力。支持固定标签、拖拽排序、右键菜单、KeepAlive 缓存和标签页持久化。
      </p>
    </div>

    <div>
      <h2>useTabs API</h2>
      <DocCodeBlock :code="useTabsCode" language="typescript" />
    </div>

    <div>
      <h2>固定标签 affixTab</h2>
      <p>
        通过路由 <code>meta.affixTab</code> 设置固定标签。固定标签始终显示在标签栏中，不可被关闭。
        使用 <code>affixTabOrder</code> 控制排序：
      </p>
      <DocCodeBlock :code="affixTabCode" language="typescript" />
    </div>

    <div>
      <h2>KeepAlive 缓存</h2>
      <p>
        通过 <code>tabs.keepAlive</code> 偏好全局控制，也可以通过路由 <code>meta.keepAlive</code> 单独控制。
        启用后，切换标签页不会销毁组件，数据状态得以保留。
      </p>
      <DocCodeBlock :code="keepAliveCode" language="typescript" />
    </div>

    <!-- KeepAlive Interactive Demo -->
    <div>
      <h2>KeepAlive 交互演示</h2>
      <p>当前页面的 KeepAlive 状态监控。切换到其他页面再回来，观察计数器值和生命周期：</p>
      <div class="keepalive-demo">
        <div class="keepalive-demo__row">
          <div class="keepalive-demo__card">
            <h3>计数器</h3>
            <p class="keepalive-demo__desc">
              如果启用 KeepAlive，切换页面后回来值会保留
            </p>
            <div class="keepalive-demo__counter">
              <el-button type="primary" @click="counter++">
                +1
              </el-button>
              <span class="keepalive-demo__value">{{ counter }}</span>
              <el-button @click="counter = 0">
                重置
              </el-button>
            </div>
          </div>
          <div class="keepalive-demo__card">
            <h3>生命周期统计</h3>
            <div class="keepalive-demo__stats">
              <div>挂载次数: <strong>{{ mountCount }}</strong></div>
              <div>激活次数: <strong>{{ activateCount }}</strong></div>
            </div>
            <p class="keepalive-demo__hint">
              💡 启用 KeepAlive 时：挂载只有 1 次，激活次数随切换增加
            </p>
          </div>
        </div>
        <div class="keepalive-demo__card">
          <h3>生命周期日志</h3>
          <div class="keepalive-demo__logs">
            <div
              v-for="(log, i) in logs"
              :key="i"
              class="keepalive-demo__log"
              :class="{
                'log--mount': log.includes('onMounted'),
                'log--activate': log.includes('onActivated'),
                'log--deactivate': log.includes('onDeactivated'),
              }"
            >
              {{ log }}
            </div>
            <div v-if="logs.length === 0" class="keepalive-demo__empty">
              暂无日志
            </div>
          </div>
          <el-button style="margin-top: 0.5rem" @click="logs = []">
            清空日志
          </el-button>
        </div>
      </div>
    </div>

    <div>
      <h2>动态标签标题</h2>
      <p>使用 <code>setTabTitle</code> 在运行时动态修改标签标题，支持静态字符串和响应式 <code>computed</code>：</p>
      <DocCodeBlock :code="dynamicTitleCode" language="typescript" />
    </div>

    <div>
      <h2>右键菜单</h2>
      <p>
        标签页内置右键菜单，提供关闭、关闭其他、关闭全部、固定/取消固定、刷新、在新窗口打开等操作。
        菜单项会根据当前标签的状态自动启用/禁用。
      </p>
    </div>

    <div>
      <h2>偏好配置</h2>
      <p>通过 <code>preferences.tabs</code> 模块控制标签页的各种行为：</p>
      <DocPropsTable title="tabs 偏好字段" :data="tabsPrefsProps" />
    </div>

    <DocTip>
      启用 <code>persist: true</code> 后，标签页列表会持久化到 <code>localStorage</code>，
      页面刷新后自动恢复之前打开的标签页。
    </DocTip>
  </DocSection>
</template>

<style scoped>
.keepalive-demo {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  overflow: hidden;
}

.keepalive-demo__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}

@media (max-width: 640px) {
  .keepalive-demo__row {
    grid-template-columns: 1fr;
  }
}

.keepalive-demo__card {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--el-border-color-extra-light);
}

.keepalive-demo__row .keepalive-demo__card:first-child {
  border-right: 1px solid var(--el-border-color-extra-light);
}

.keepalive-demo__card h3 {
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--el-text-color-primary);
}

.keepalive-demo__desc {
  font-size: 0.8125rem;
  color: var(--el-text-color-secondary);
  margin-bottom: 0.75rem;
}

.keepalive-demo__counter {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.keepalive-demo__value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--el-color-primary);
  min-width: 2rem;
  text-align: center;
}

.keepalive-demo__stats {
  font-size: 0.875rem;
  line-height: 1.8;
  color: var(--el-text-color-regular);
}

.keepalive-demo__hint {
  font-size: 0.75rem;
  color: var(--el-text-color-secondary);
  margin-top: 0.5rem;
}

.keepalive-demo__logs {
  max-height: 200px;
  overflow-y: auto;
  font-size: 0.875rem;
  font-family: 'Fira Code', Consolas, monospace;
  background: var(--el-fill-color-extra-light);
  border-radius: 4px;
  padding: 0.5rem;
}

.keepalive-demo__log {
  padding: 0.125rem 0;
  color: var(--el-text-color-secondary);
}

.keepalive-demo__log.log--mount {
  color: var(--el-color-success);
}

.keepalive-demo__log.log--activate {
  color: var(--el-color-primary);
}

.keepalive-demo__log.log--deactivate {
  color: var(--el-color-warning);
}

.keepalive-demo__empty {
  color: var(--el-text-color-placeholder);
}
</style>
