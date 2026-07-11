# 刺猬星球 Super-i

## 项目介绍

刺猬星球 Super-i 是一个基于 Vue 3 构建的轻量品牌网站。目前项目只保留品牌首页和 AI 提示词页面，不包含后台管理、登录注册、后端 API、Mock 数据、支付、工单或旧站兼容代码。

项目采用组件化结构组织首页内容，所有图片、视频和图标均由源码目录本地管理，不依赖旧 HTML、jQuery、Swiper、GSAP 或线上静态资源。

## 主要功能

- 品牌首页：视频 Hero、品牌宣传片、适用岗位、职业定位和社群展示。
- AI 提示词：通用、图像、视频、营销四类静态提示词。
- 提示词复制：使用浏览器 Clipboard API，一键复制提示词内容。
- 响应式布局：适配桌面、平板和移动端。
- 极简导航：只保留品牌 Logo 和 AI 提示词入口。
- 原生视频弹层：使用 Vue Teleport 实现，不依赖 UI 组件库。

## 技术栈

| 技术 | 用途 |
| --- | --- |
| Vue 3 | 页面与组件开发 |
| Vue Router 4 | 前端路由和页面标题管理 |
| Vite 6 | 开发服务器与生产构建 |
| SCSS | 组件和公共样式 |
| Vitest | 单元测试 |
| Vue Test Utils | Vue 组件测试 |
| Playwright | 多视口端到端测试 |
| ESLint | 代码规范检查 |

生产环境依赖仅包含 `vue` 和 `vue-router`。

## 页面路由

| 地址 | 路由名称 | 内容 |
| --- | --- | --- |
| `/` | `Home` | 品牌首页 |
| `/ai-prompts` | `AiPrompts` | 静态 AI 提示词列表 |

其他地址会统一重定向到首页。

## 目录结构

```text
.
├── src/                         # 应用源码
│   ├── business/                # 前台业务模块
│   │   ├── assets/              # 本地图片、视频和 SVG 资源
│   │   │   ├── home/            # 首页专用资源
│   │   │   │   ├── icons/       # 岗位卡片图标与装饰 SVG
│   │   │   │   └── media/       # Hero 视频
│   │   │   └── shared/          # Logo、favicon 等公共资源
│   │   ├── composables/         # 可复用 Vue 组合式逻辑
│   │   ├── config/              # 首页静态内容与资源映射
│   │   ├── layout/              # 公共页面布局
│   │   │   └── components/      # 导航栏和页脚
│   │   ├── styles/              # 全局基础样式与 SCSS mixin
│   │   └── views/               # 页面级视图
│   │       ├── home/             # 首页及首页专用组件
│   │       └── ai-prompts/       # AI 提示词页面
│   ├── router/                  # Vue Router 配置
│   ├── App.vue                  # 根组件
│   └── main.js                  # Vue 应用入口
├── tests/                       # 自动化测试
│   ├── unit/                    # Vitest 单元测试
│   └── e2e/                     # Playwright 端到端测试
├── index.html                   # Vite HTML 入口及 favicon 配置
├── vite.config.ts               # Vite 开发与构建配置
├── vitest.config.js             # Vitest 配置
├── playwright.config.js         # Playwright 视口与预览服务配置
├── eslint.config.mjs            # ESLint 配置
├── jsconfig.json                # 编辑器路径别名配置
├── package.json                 # 项目脚本、依赖和 Node 版本要求
├── package-lock.json            # npm 依赖锁文件
├── CNAME                        # 静态站点自定义域名配置
└── 约束.md                      # 项目级编码约束
```

## 各目录说明

### `src/`

项目的全部可维护源码。入口文件 `main.js` 创建 Vue 应用、注册 Router，并挂载根组件；`App.vue` 只负责渲染当前路由页面。

### `src/business/`

前台功能的主体目录，只包含当前网站实际使用的首页、AI 提示词、公共布局、样式和资源。

- `assets/`：源码直接引用的本地资源。
  - `home/`：Hero 视频和封面、品牌展示图、职业定位图、社群二维码及岗位图标。
  - `shared/`：导航 Logo 和网站 favicon。
- `composables/`：弹层打开、关闭、ESC 响应、滚动锁定和焦点恢复逻辑。
- `config/`：统一维护首页数字、岗位配置及资源导入映射。
- `layout/`：所有页面共享的外壳。
  - `components/SiteHeader.vue`：Logo 和 AI 提示词导航。
  - `components/SiteFooter.vue`：版权信息和回到顶部。
- `styles/base/`：页面重置、公共排版和内容容器 mixin。
- `views/home/`：品牌首页。
  - `components/HomeHero.vue`：视频首屏和社群卡片。
  - `components/BrandShowcase.vue`：品牌宣传片入口。
  - `components/AudienceSection.vue`：适用岗位卡片。
  - `components/CareerSection.vue`：职业定位内容。
  - `components/CommunitySection.vue`：社群宣传模块。
  - `components/VideoDialog.vue`：原生 Vue 视频弹层。
- `views/ai-prompts/`：AI 提示词分类、卡片、复制功能和轻量提示消息。

### `src/router/`

- `index.js`：创建 HTML5 History Router，并在路由切换后更新页面标题。
- `business.js`：定义首页、AI 提示词和未知地址回首页规则。

### `tests/`

- `unit/`：验证路由数量、未知地址规则、提示词分类和复制失败提示。
- `e2e/`：验证导航、首页死链、提示词切换与复制、旧地址回首页。

Playwright 默认覆盖以下视口：

- `1440 × 900`
- `1024 × 768`
- `390 × 844`
- `375 × 812`

### `dist/`

执行 `npm run build` 后生成的生产构建目录，不提交源码修改。部署时使用该目录内容。

### `node_modules/`

执行 `npm install` 后生成的依赖目录，由 npm 管理，不提交到 Git。

### `.idea/`

本地 IDE 配置目录，不属于业务代码。

## 环境要求

- Node.js `>= 22.0.0`
- npm `>= 10.0.0`

## 安装与启动

```bash
npm install
npm run dev
```

开发服务器默认地址：`http://localhost:9527`。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run build` | 构建生产版本到 `dist/` |
| `npm run preview` | 本地预览生产构建 |
| `npm run lint` | 检查业务源码、路由和测试代码 |
| `npm run lint:fix` | 自动修复可修复的 ESLint 问题 |
| `npm run test:unit` | 运行 Vitest 单元测试 |
| `npm run test:e2e` | 运行 Playwright 响应式端到端测试 |

## 开发约定

- 使用单引号、无分号和 2 空格缩进。
- 站内导航必须使用 Vue Router 命名路由。
- 页面样式使用 scoped SCSS 和 `si-` 命名空间。
- 页面资源必须放入 `src/business/assets` 并通过模块导入。
- 禁止重新引入 legacy HTML、旧 CSS/JS、账户系统、API 或 Mock 层。
