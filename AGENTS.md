# Codex 项目执行规范

本文件是仓库级长期约束。所有后续代码修改、重构、测试和文档更新都必须遵守。

## 路由 URL 命名

- 所有页面 URL 路径段必须使用小驼峰命名（lowerCamelCase）。
- 第一个单词全小写，后续单词首字母大写。
- 禁止在 URL 路径段中使用 kebab-case、snake_case、PascalCase 或 `.html`。
- 正确示例：`/aiPrompts`、`/userCenter`、`/projectDetail/:projectId`。
- 错误示例：`/ai-prompts`、`/user_center`、`/ProjectDetail`、`/tool.html`。
- 根路径 `/` 保持不变；动态参数也使用小驼峰，例如 `:projectId`。
- Vue Router 的 `name` 使用小驼峰，例如 `aiPrompts`、`userCenter`。
- 新增或修改路由时，必须同步更新导航链接、测试、README 和部署验证地址。

## 通用要求

- 技术栈固定为 Vue 3、Vue Router、Vite 和 SCSS。
- 项目自有文件名和目录名统一使用小驼峰，例如 `heroSection.vue`、`homeContent.js`、`aiPrompts/`。
- JavaScript 变量、函数、组件本地绑定和 Vue Router 名称统一使用小驼峰，禁止新增 PascalCase、kebab-case 或 snake_case 自有标识。
- npm、Vite、GitHub、Codex 和测试工具强制约定的文件保留标准名称，例如 `package.json`、`package-lock.json`、`index.html`、`vite.config.ts`、`README.md`、`AGENTS.md`、`CNAME`、`.github/` 和 `*.spec.js`。
- 第三方导出的 PascalCase 标识和 JavaScript 内置类型允许使用原名；引入项目后，本地绑定应优先使用小驼峰别名。
- 站内跳转使用 Vue Router 命名路由，不直接拼接 URL。
- 源码使用单引号、无分号和 2 空格缩进。
- 导入优先使用 `@/` 路径别名。
- 页面样式使用 scoped SCSS 和 `ji-` 命名空间。
- 除明确标注的全宽视觉区外，导航、页脚、页面和内容栏目必须使用公共 `container` mixin，禁止在组件内重复定义容器宽度。
- 静态资源必须存放并由 `src/business/assets` 本地引用，
- 关键交互和不易理解的业务逻辑添加中文注释，异常及用户提示使用中文。
- 不重新引入 legacy HTML、账户系统、API、Mock 或未使用依赖。

## 源码结构

- `src/main.js` 只负责创建 Vue 应用、注册 Router 和挂载根组件。
- `src/business` 只包含首页、AI 提示词页、公共布局及其资源。
- 页面组件放入 `src/business/views`，页面专用组件放入对应页面目录。
- 公共导航和页脚放入 `src/business/layout/components`。

## 前台页面与数据

- 前台只保留首页和 `views/aiPrompts` 页面。
- AI 提示词使用纯静态数据，不调用 API 或 Mock，也不写入本地存储。
- AI 提示词相关图片统一存放在 `src/business/assets/aiPrompts`，不得放入首页或其他业务资源目录。
- 公共布局只包含导航、页面出口和页脚，不维护登录、支付、点赞或其他业务状态。
- 导航仅保留首页 Logo 和命名路由 `aiPrompts`，禁止添加普通 HTML 链接。
- 桌面端和移动端导航均保持单行布局，不得产生横向溢出。

## 路由实现

- 路由入口只创建 Vue Router 实例并维护页面标题。
- 业务路由只保留 `home`、`aiPrompts` 和未知路径回首页。
- 页面组件使用懒加载，所有站内跳转使用命名路由。
