# Web — 管理系统前端

## 项目简介

web 是管理系统的前端界面，基于 Vue 3 + Element Plus 技术栈构建，提供用户管理、角色权限、菜单配置、系统监控等管理功能的可视化操作界面，原项目基于 https://panjiachen.github.io/vue-element-admin-site 改版。

本仓库为前端项目，需配合后端 `admin/` 项目一起使用。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5.39 | 前端框架 |
| Vite | 6.4.3 | 项目脚手架 / 构建工具 |
| Vue Router | 4.5.2 | 路由管理 |
| Pinia | 3.0.2 | 状态管理 |
| Element Plus | 2.9.6 | UI 组件库 |
| Axios | 1.7.9 | HTTP 请求库 |
| SCSS | — | 样式预处理 |

## 环境要求

### Node.js

- **推荐版本**：v22.23.x (LTS)
- **最低要求**：>= 22.0.0
- **下载地址**：https://nodejs.org/zh-cn/download/
- **验证安装**：
  ```bash
  node -v    # 应显示 v22.x.x
  npm -v     # 应显示 10.x.x
  ```

> 建议使用 [nvm](https://github.com/nvm-sh/nvm) 管理 Node.js 版本，方便切换。

## 快速开始

### 第 1 步：克隆代码

```bash
git clone <仓库地址>
cd <项目目录>/web
```

### 第 2 步：安装依赖

```bash
npm install
```

> 若安装缓慢，可使用淘宝镜像源：
> ```bash
> npm install --registry=https://registry.npmmirror.com
> ```

### 第 3 步：配置后端接口地址

在 `src/admin/constants/settings.js` 中可以配置应用的标题等基本设置，后端 API 地址则在 `.env.*` 文件中配置。

开发环境默认的后端地址为 `http://localhost:8000/api/v1`，如需修改，编辑 `.env.development`：

```
VITE_APP_BASE_API = 'http://localhost:8000/api/v1'
```

### 第 4 步：启动开发服务器

```bash
npm run dev
```

启动后默认访问：**http://localhost:9527**

> 如需修改端口，可通过命令行指定：
> ```bash
> npm run dev -- --port 3000
> ```

### 第 5 步：验证启动

浏览器打开 http://localhost:9527 ，应看到登录页面。

确保后端 `admin` 项目已启动，前端才能正常请求 API 数据。

## 生产构建

```bash
npm run build
```

构建产物输出到 `../web-deploy/dist/docs/` 目录（可在 `vite.config.ts` 中配置）。

其他构建模式：

```bash
npm run build:stage        # 预发布环境构建
```

## 目录结构

```
web/
├── index.html                 # 页面入口
├── package.json               # 项目依赖与脚本
├── vite.config.ts             # Vite 构建配置
├── env.d.ts                   # 环境变量类型声明
├── .env.development           # 开发环境变量
├── .env.production            # 生产环境变量
├── .env.staging               # 预发布环境变量
├── public/                    # 静态资源（不经过构建处理）
│   └── img/                   #   图片资源
└── src/
    ├── main.js                # 应用入口
    ├── App.vue                # 根组件
    ├── permission.js          # 路由守卫（权限控制）
    ├── admin/                 # 后台管理模块
    │   ├── api/               #   API 接口
    │   ├── components/        #   通用组件（BaseTable、BaseTree 等）
    │   ├── constants/         #   常量配置
    │   ├── layout/            #   后台布局（侧边栏 + 顶部导航）
    │   ├── store/             #   Pinia 状态模块
    │   ├── styles/            #   后台样式（SCSS）
    │   └── views/             #   后台页面
    ├── business/              # 前台业务模块
    │   ├── api/               #   API 接口
    │   ├── components/        #   业务组件（BizTable）
    │   ├── layout/            #   前台布局
    │   ├── styles/            #   前台样式
    │   └── views/             #   前台页面
    ├── common/                # 双方共享的工具
    │   ├── filters/           #   过滤器函数
    │   └── utils/             #   工具函数（axios、用户、验证等）
    ├── router/                # 路由配置
    │   ├── index.js           #   路由入口
    │   ├── admin.js           #   后台路由
    │   └── business.js        #   前台路由
    └── store/                 # Pinia 状态管理入口
```

## 环境变量说明

| 文件 | 用途 | 默认 API 地址 |
|------|------|--------------|
| `.env.development` | 本地开发环境 | http://localhost:8000/api/v1 |
| `.env.production` | 生产环境 | http://doudouxz.top:9000/api/v1 |
| `.env.staging` | 预发布环境 | 按需配置 |

> 环境变量命名规则：Vite 要求以 `VITE_` 开头才能在客户端代码中访问（通过 `import.meta.env.VITE_*`）。

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产环境构建 |
| `npm run build:stage` | 预发布环境构建 |
| `npm run preview` | 预览构建产物 |
| `npm run lint` | 代码检查 |
