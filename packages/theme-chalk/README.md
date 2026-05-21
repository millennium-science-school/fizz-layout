# @fizz-layout/theme-chalk-next

Fizz Layout 组件库样式包

## 目录结构

```
src/
├── index.scss              # 对外唯一入口
│
├── config/                 # 配置层（几乎不产出样式）
│   ├── _vars.scss          # SCSS 变量（仅内部使用）
│   ├── _css-vars.scss      # :root / [data-theme] 变量
│   ├── _namespace.scss     # fizz / el namespace 和 BEM mixins
│   └── _index.scss         # 配置层入口
│
├── theme/                  # 主题层
│   ├── _light.scss         # 浅色主题
│   ├── _dark.scss          # 深色主题
│   └── _index.scss         # 主题层入口
│
├── mixins/                 # 工具层
│   ├── _layout.scss        # 布局相关 mixins
│   ├── _responsive.scss    # 响应式相关 mixins
│   ├── _components.scss    # 组件相关 mixins
│   └── _index.scss         # 工具层入口
│
├── base/                   # 基础样式
│   ├── _reset.scss         # 基础重置
│   ├── _transition.scss    # 过渡动画
│   ├── _utilities.scss     # 工具类
│   └── _index.scss         # 基础样式入口
│
├── components/             # 组件样式
│   ├── _layout.scss        # 布局主组件
│   ├── _header.scss        # 头部组件
│   ├── _sider.scss         # 侧边栏组件
│   ├── _footer.scss        # 页脚组件
│   ├── _container.scss     # 容器组件
│   ├── _menu.scss          # 菜单组件
│   ├── _tabs.scss          # 标签页组件
│   ├── _tab-chrome.scss    # Chrome 风格标签
│   ├── _tab-default.scss   # 默认风格标签
│   ├── _context-menu.scss  # 右键菜单
│   ├── _breadcrumb.scss    # 面包屑
│   ├── _icon.scss          # 图标
│   ├── _appearance.scss    # 外观切换
│   ├── _translation.scss   # 多语言切换
│   ├── _notification.scss  # 通知
│   ├── _global-search.scss # 全局搜索
│   ├── _user-dropdown.scss # 用户下拉菜单
│   ├── _fullscreen.scss    # 全屏切换
│   └── _index.scss         # 组件样式入口
│
└── vendors/                # 第三方覆盖
    ├── _element-plus.scss  # Element Plus 样式覆盖
    └── _index.scss         # 第三方覆盖入口
```

## 设计原则

### 1. 分层架构

- **config**: 配置层，定义变量和命名空间，几乎不产出 CSS
- **theme**: 主题层，定义浅色/深色主题变量
- **mixins**: 工具层，提供可复用的 SCSS mixins
- **base**: 基础层，提供重置样式和通用工具类
- **components**: 组件层，各组件独立的样式文件
- **vendors**: 第三方层，覆盖第三方库的默认样式

### 2. 命名规范

- 使用 BEM 命名规范
- 组件前缀统一为 `fizz-`
- 私有文件使用 `_` 前缀

### 3. 变量管理

- SCSS 变量用于内部计算
- CSS 变量用于运行时主题切换
- 统一使用 `--fizz-` 前缀

### 4. Mixins 复用

- 布局相关: flex-center, text-ellipsis 等
- 响应式: screen-up, screen-down, mobile, desktop 等
- 组件相关: button-base, widget-button, popup 等

## 使用方式

### 全量引入

```scss
@use '@fizz-layout/theme-chalk-next';
```

### 按需引入

```scss
// 只引入配置和 mixins
@use '@fizz-layout/theme-chalk-next/src/config/index' as config;
@use '@fizz-layout/theme-chalk-next/src/mixins/index' as mixins;

// 使用 mixins
.my-component {
  @include mixins.flex-center;
  @include mixins.text-ellipsis;
}
```

## 主题切换

通过 `data-theme` 属性或 `.dark` 类名切换主题：

```html
<!-- 浅色主题（默认） -->
<html>
  <!-- 深色主题 -->
  <html data-theme="dark">
    <!-- 或 -->
    <html class="dark"></html>
  </html>
</html>
```

## 自定义变量

覆盖 CSS 变量即可自定义主题：

```scss
:root {
  --fizz-color-primary: #1890ff;
  --fizz-color-primary-light: #e6f7ff;
}
```
