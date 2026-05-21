<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CarbonCarouselHorizontal from '~icons/carbon/carousel-horizontal'
import CarbonCode from '~icons/carbon/code'
import CarbonCopy from '~icons/carbon/copy'
import CarbonCube from '~icons/carbon/cube'
import CarbonPaintBrush from '~icons/carbon/paint-brush'
import CarbonTemplate from '~icons/carbon/template'
import CarbonTranslate from '~icons/carbon/translate'

const router = useRouter()

const features = [
  { icon: CarbonTemplate, title: '三种布局模式', desc: '侧边导航 / 顶部导航 / 混合导航，灵活切换' },
  { icon: CarbonPaintBrush, title: '主题定制', desc: '亮色 / 暗色 / 半深色，CSS 变量全面覆盖' },
  { icon: CarbonCarouselHorizontal, title: '标签页管理', desc: '固定 / 拖拽 / 右键菜单 / KeepAlive 缓存' },
  { icon: CarbonCube, title: '丰富的内置组件', desc: '包含全局搜索、等多种内置组件，支持灵活组合' },
  { icon: CarbonTranslate, title: '国际化', desc: '内置 i18n 支持，轻松扩展多语言' },
  { icon: CarbonCode, title: 'TypeScript 优先', desc: '完整的类型定义，智能提示开箱即用' },
]

const navCards = [
  { title: '📖 指南', desc: '从安装到高级用法，渐进式学习', path: '/guide/introduction', color: 'var(--el-color-primary)' },
  { title: '🧩 组件', desc: '每个组件的 Props、Events、Slots 参考', path: '/components/layout', color: 'var(--el-color-success)' },
  { title: '📚 API 参考', desc: 'Composables、Hooks、工具函数、类型定义', path: '/api/composables', color: 'var(--el-color-warning)' },
  { title: '🎯 示例', desc: '全功能演示、最小接入、自定义主题', path: '/examples/full-demo', color: 'var(--el-color-danger)' },
  { title: '📝 更新日志', desc: '了解版本迭代详情与最新组件特性', path: '/guide/changelog', color: '#20c997' },
  { title: '🌐 GitHub', desc: '欢迎提出 Issue 或参与 PR 共建开源生态', path: 'https://github.com/kanocence/fizz-layout', color: '#f06595' },
]

const installCmd = 'pnpm add @fizz/layout'
const copied = ref(false)

function navigateTo(path: string) {
  if (path.startsWith('http')) {
    window.open(path, '_blank')
  }
  else {
    router.push(path)
  }
}

async function copyInstall() {
  try {
    await navigator.clipboard.writeText(installCmd)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
  catch {
    /* fallback: ignore */
  }
}
</script>

<template>
  <el-scrollbar class="tech-scrollbar">
    <div class="home-page">
      <div class="home-page__bg-grid" />
      <div class="home-page__bg-glow" />

      <div class="home-page__content">
        <section class="home-page__hero">
          <span class="home-page__hero-badge">
            <span class="pulse-dot" />
            🚀 Vue 3 · TypeScript · Element Plus
          </span>
          <h1 class="home-page__hero-title">
            Fizz Layout
          </h1>
          <p class="home-page__hero-tagline">
            灵活、可配置的 Vue 3 后台管理布局组件库
          </p>
          <div class="home-page__hero-install" @click="copyInstall">
            <span class="cmd-prompt">$</span>
            <code class="cmd-text">{{ installCmd }}</code>
            <component :is="CarbonCopy" class="home-page__hero-copy-icon" />
            <span v-if="copied" class="home-page__hero-copied">✓ 已复制</span>
          </div>
          <div class="home-page__hero-actions">
            <el-button
              type="primary"
              size="large"
              class="tech-btn primary"
              @click="navigateTo('/guide/quick-start')"
            >
              快速开始
            </el-button>
            <el-button size="large" class="tech-btn plain" @click="navigateTo('/examples/full-demo')">
              查看示例
            </el-button>
          </div>
        </section>

        <section class="home-page__features">
          <h2 class="home-page__section-title">
            <span class="text-glow">核心特性</span>
          </h2>
          <div class="home-page__feature-grid">
            <div v-for="feature in features" :key="feature.title" class="home-page__feature-card tech-card">
              <div class="home-page__feature-icon">
                <component :is="feature.icon" />
              </div>
              <h3 class="home-page__feature-title">
                {{ feature.title }}
              </h3>
              <p class="home-page__feature-desc">
                {{ feature.desc }}
              </p>
            </div>
          </div>
        </section>

        <section class="home-page__nav">
          <h2 class="home-page__section-title">
            <span class="text-glow">开始探索</span>
          </h2>
          <div class="home-page__nav-grid">
            <div
              v-for="card in navCards"
              :key="card.path"
              class="home-page__nav-card"
              :style="{ '--card-hover-color': card.color } as any"
              @click="navigateTo(card.path)"
            >
              <div class="nav-card-bg-icon">
                {{ card.title.split(' ')[0] }}
              </div>
              <div class="nav-card-content">
                <h3 class="home-page__nav-card-title">
                  {{ card.title.split(' ')[1] }}
                </h3>
                <p class="home-page__nav-card-desc">
                  {{ card.desc }}
                </p>
              </div>
              <div class="nav-card-action">
                <span>前往探索 &rarr;</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
/* 局部变量，适配 Element Plus 明暗主题 */
.home-page {
  --tech-bg: transparent;
  --tech-primary: var(--el-color-primary);
  --tech-cyan: var(--el-color-primary-light-3);
  --tech-card-bg: var(--el-bg-color-overlay);
  --tech-card-border: var(--el-border-color-lighter);
  --tech-text-main: var(--el-text-color-primary);
  --tech-text-sub: var(--el-text-color-regular);

  position: relative;
  min-height: 100vh;
  background-color: var(--tech-bg);
  overflow: hidden;
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;

  /* 背景网格动画 */
  &__bg-grid {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      linear-gradient(var(--el-border-color-extra-light) 1px, transparent 1px),
      linear-gradient(90deg, var(--el-border-color-extra-light) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: 1;
    transform: perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px);
    animation: gridMove 20s linear infinite;
    pointer-events: none;
  }

  /* 顶部环境光晕 */
  &__bg-glow {
    position: absolute;
    top: -200px;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 500px;
    background: radial-gradient(ellipse at center, rgba(64, 158, 255, 0.15) 0%, transparent 70%);
    z-index: 1;
    pointer-events: none;
  }

  &__content {
    position: relative;
    z-index: 10;
    padding: 2rem;
    max-width: 1000px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  &__hero {
    text-align: center;
    padding: 4rem 0 3.5rem;
    animation: fadeInUp 0.8s ease-out;
  }

  &__hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 1rem;
    border-radius: 999px;
    font-size: 0.8125rem;
    background: var(--el-color-primary-light-9);
    border: 1px solid var(--el-color-primary-light-7);
    color: var(--el-color-primary);
    margin-bottom: 1.5rem;
    font-weight: 500;
    box-shadow: 0 0 15px var(--el-color-primary-light-8);

    .pulse-dot {
      width: 6px;
      height: 6px;
      background-color: var(--el-color-primary);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--el-color-primary);
      animation: pulse 2s infinite;
    }
  }

  &__hero-title {
    font-size: 3.5rem;
    font-weight: 900;
    letter-spacing: -1px;
    background: linear-gradient(135deg, var(--el-text-color-primary) 0%, var(--el-color-primary-light-3) 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1rem;
    filter: drop-shadow(0 0 20px rgba(0, 242, 254, 0.2));
  }

  &__hero-tagline {
    font-size: 1.25rem;
    color: var(--tech-text-sub);
    margin-bottom: 2rem;
    font-weight: 300;
  }

  /* 炫酷的安装命令框 */
  &__hero-install {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    background: var(--el-fill-color-light);
    border: 1px solid var(--el-border-color);
    backdrop-filter: blur(10px);
    font-family: 'Fira Code', Consolas, monospace;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 2rem;
    position: relative;
    box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.02);

    &:hover {
      border-color: rgba(64, 158, 255, 0.5);
      box-shadow:
        0 0 20px rgba(64, 158, 255, 0.15),
        inset 0 0 20px rgba(64, 158, 255, 0.05);
      transform: translateY(-2px);

      .home-page__hero-copy-icon {
        color: var(--tech-cyan);
      }
    }

    .cmd-prompt {
      color: #eb68cf;
      font-weight: bold;
    }

    .cmd-text {
      color: var(--tech-text-main);
    }
  }

  &__hero-copy-icon {
    font-size: 1rem;
    color: var(--tech-text-sub);
    transition: color 0.3s;
  }

  &__hero-copied {
    position: absolute;
    right: -5rem;
    font-size: 0.85rem;
    color: #67c23a;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(103, 194, 58, 0.4);
    animation: fadeIn 0.3s;
  }

  &__hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;

    /* 覆盖 Element Button 样式以适应科技风 */
    :deep(.el-button) {
      border-radius: 8px;
      font-weight: 600;
      letter-spacing: 0.5px;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

      &.el-button--primary {
        background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
        border: none;
        box-shadow: 0 4px 15px var(--el-color-primary-light-5);

        &:hover {
          box-shadow: 0 6px 25px var(--el-color-primary-light-3);
          transform: translateY(-2px);
        }
      }

      &:not(.el-button--primary) {
        background: var(--el-bg-color-overlay);
        border: 1px solid var(--el-border-color);
        color: var(--el-text-color-primary);
        backdrop-filter: blur(5px);

        &:hover {
          background: var(--el-fill-color-light);
          border-color: var(--el-border-color-hover);
          transform: translateY(-2px);
        }
      }
    }
  }

  .home-page__features,
  .home-page__nav {
    padding: 2rem 0;
    animation: fadeInUp 1s ease-out 0.2s both;

    .home-page__section-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 2rem;
      text-align: center;

      .text-glow {
        color: var(--el-text-color-primary);
        position: relative;
        display: inline-block;

        &::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 3px;
          background: var(--el-color-primary);
          border-radius: 2px;
          box-shadow: 0 0 10px var(--el-color-primary-light-5);
        }
      }
    }
  }

  .tech-card {
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color-lighter);
    box-shadow: var(--el-box-shadow-light);
    backdrop-filter: blur(12px);
    border-radius: 16px;
    padding: 1.5rem;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: linear-gradient(90deg, transparent, var(--el-color-info-light-9), transparent);
      transform: skewX(-20deg);
      transition: left 0.7s ease;
    }

    &:hover {
      transform: translateY(-8px);
      border-color: var(--el-color-primary-light-5);
      box-shadow: 0 10px 30px -10px var(--el-color-primary-light-5);
    }
  }

  &__feature-icon {
    display: flex;
    align-items: center;
    transition: all 0.3s;
  }

  &__feature-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--el-text-color-primary);
  }

  &__feature-desc {
    font-size: 0.875rem;
    color: var(--el-text-color-regular);
    line-height: 1.6;
  }

  &__feature-grid {
    display: grid;
    // 使用 auto-fit 保证自动填充但不多余出现空列，280px 一般在大屏显示 3 列，由于正好 6 个特性（3x2）非常完美
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  &__nav-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
  }

  &__nav-card {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    text-align: left;
    padding: 2rem 1.5rem;
    border: 1px solid var(--el-border-color-lighter);
    background: var(--el-bg-color-overlay);
    border-radius: 16px;
    box-shadow: var(--el-box-shadow-light);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    overflow: hidden;

    .nav-card-bg-icon {
      position: absolute;
      top: -10px;
      right: -10px;
      font-size: 6rem;
      opacity: 0.04;
      transition: all 0.4s ease;
      filter: grayscale(1);
      pointer-events: none;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background-color: var(--card-hover-color);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      border-color: var(--card-hover-color);
      transform: translateY(-8px);
      box-shadow: 0 10px 30px -10px var(--card-hover-color);

      &::before {
        opacity: 1;
      }

      .nav-card-bg-icon {
        transform: scale(1.1) rotate(-10deg);
        opacity: 0.15;
        filter: grayscale(0);
      }

      .nav-card-action span {
        color: var(--card-hover-color);
        transform: translateX(5px);
        letter-spacing: 1px;
      }
    }

    .nav-card-content {
      flex-grow: 1;
      position: relative;
      z-index: 1;
    }

    .nav-card-action {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-top: 1px dashed var(--el-border-color-lighter);
      padding-top: 1rem;
      position: relative;
      z-index: 1;

      span {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--el-text-color-regular);
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
      }
    }

    &-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      color: var(--el-text-color-primary);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    &-desc {
      font-size: 0.9rem;
      color: var(--el-text-color-regular);
      line-height: 1.6;
    }
  }

  // no extra brace here
  /* 关键帧动画 */
  @keyframes gridMove {
    0% {
      background-position: 0 0;
    }

    100% {
      background-position: 0 40px;
    }
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 var(--el-color-primary-light-3);
    }

    70% {
      box-shadow: 0 0 0 6px transparent;
    }

    100% {
      box-shadow: 0 0 0 0 transparent;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
}
</style>
