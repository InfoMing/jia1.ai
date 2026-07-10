/**
 * 应用入口文件
 *
 * 执行流程：
 * 1. createApp(App) — 创建 Vue 应用实例
 * 2. app.use(pinia) — 注册状态管理（Pinia）
 * 3. app.use(router) — 注册路由
 * 4. app.use(ElementPlus) — 注册 UI 组件库
 * 5. app.component() — 全局注册业务组件
 * 6. app.config.globalProperties — 挂载全局属性和方法
 * 7. app.mount('#app') — 挂载到 DOM
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'normalize.css/normalize.css'
import '@/admin/styles/index.scss'
import Cookies from 'js-cookie'
import Code from '@/common/utils/code'
import customInstruction from '@/common/utils/customInstruction'
import * as filters from './common/filters'
import SvgIcon from '@/admin/components/SvgIcon/index.vue'
import BaseTable from '@/admin/components/BaseTable/index.vue'
import BaseDescription from '@/admin/components/Opertate/BaseDescription/index.vue'
import LeftRightLayout from '@/admin/components/LeftRightLayout/index.vue'
import BizTable from '@/business/components/BizTable/index.vue'
import './permission'

// vite-plugin-svg-icons 自动注册 SVG 图标
import 'virtual:svg-icons-register'

// 创建 Vue 应用实例
const app = createApp(App)

// 状态管理（Pinia）
const pinia = createPinia()
app.use(pinia)

// 路由
app.use(router)

// Element Plus UI 组件库
app.use(ElementPlus, {
  size: Cookies.get('size') || 'default'
})

// 全局注册组件，可在任何页面直接用 <svg-icon>、<base-table> 等标签
app.component('svg-icon', SvgIcon)
app.component('base-table', BaseTable)
app.component('base-description', BaseDescription)
app.component('left-right-layout', LeftRightLayout)
app.component('biz-table', BizTable)

// 全局挂载属性，组件内通过 this.$cookie、this.$code 访问
app.config.globalProperties.$cookie = Cookies
app.config.globalProperties.$code = Code

// 全局过滤器挂载到 $filters 对象上，组件内通过 this.$filters.xxx() 调用
// Vue 3 不支持模板中的 | 管道语法，改为方法调用
app.config.globalProperties.$filters = {}
Object.keys(filters).forEach(key => {
  app.config.globalProperties.$filters[key] = filters[key]
})

// 注册自定义指令（v-myshow、v-myfocus）
customInstruction(app)

// 挂载应用到 #app DOM 节点
app.mount('#app')
