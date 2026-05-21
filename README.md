# Fizz Layout

[![code style](https://antfu.me/badge-code-style.svg)](https://github.com/antfu/eslint-config)

一个灵活的 Vue 3 布局组件库，面向后台管理场景，内置导航、标签页、面包屑、主题切换、通知、全局搜索等常用能力。

## ✨ Features

- 三种布局模式：`sidebar-nav` / `header-nav` / `mixed-nav`
- 菜单联动、标签页与偏好设置（可持久化）
- 组件齐全：全局搜索、主题切换、全屏、通知、语言切换、用户下拉等
- i18n 友好：内置中英文 locale，可与 `vue-i18n` 直接合并
- 主题与样式：提供可配置的 `theme-chalk` SCSS

## 🚀 Dev

```bash
pnpm install
pnpm dev
```

## 📦 Build & Publish

1. edit version in `/scripts/package.release.json`
2. run build command

```bash
pnpm build
```

3. run publish command

```bash
cd dist && pnpm publish
```
