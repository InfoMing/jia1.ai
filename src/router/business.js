import { markRaw } from 'vue'
import BusinessLayout from '@/business/layout/index.vue'

// markRaw 防止 Layout 被 Vue Router 内部转为响应式对象，避免性能警告
const _BusinessLayout = markRaw(BusinessLayout)

/** 业务模块路由（路径统一 /b 前缀） */
const businessRoutes = [
  {
    path: '/b',
    component: _BusinessLayout,
    children: [
      {
        path: 'home',
        name: 'BusinessHome',
        meta: { title: '首页' },
        component: () => import('@/business/views/home/index.vue')
      },
      {
        path: 'login',
        name: 'BusinessLogin',
        meta: { title: '登录' },
        component: () => import('@/business/views/login/index.vue')
      },
      {
        path: 'register',
        name: 'BusinessRegister',
        meta: { title: '注册' },
        component: () => import('@/business/views/login/register.vue')
      },
      {
        path: 'forgot-password',
        name: 'BusinessForgotPassword',
        meta: { title: '找回密码' },
        component: () => import('@/business/views/login/forgot-password.vue')
      },
      // ====== 行情模块 ======
      {
        path: 'market',
        name: 'BusinessMarket',
        meta: { title: '市场总览' },
        component: () => import('@/business/views/market/index.vue'),
        children: [
          {
            path: 'a-share',
            name: 'BusinessAShare',
            meta: { title: 'A股' },
            component: () => import('@/business/views/market/a-share.vue')
          },
          {
            path: 'hk',
            name: 'BusinessHK',
            meta: { title: '港股' },
            component: () => import('@/business/views/market/hk.vue')
          },
          {
            path: 'us',
            name: 'BusinessUS',
            meta: { title: '美股' },
            component: () => import('@/business/views/market/us.vue')
          },
          {
            path: 'gold',
            name: 'BusinessGold',
            meta: { title: '黄金' },
            component: () => import('@/business/views/market/gold.vue')
          },
          {
            path: '',
            name: 'BusinessMarketDefault',
            redirect: { name: 'BusinessAShare' }
          }
        ]
      },
      // ====== 公共信息页 ======
      {
        path: 'about',
        name: 'BusinessAbout',
        meta: { title: '关于我们' },
        component: () => import('@/business/views/info/about.vue')
      },
      {
        path: 'help',
        name: 'BusinessHelp',
        meta: { title: '帮助中心' },
        component: () => import('@/business/views/info/help.vue')
      },
      {
        path: 'disclaimer',
        name: 'BusinessDisclaimer',
        meta: { title: '免责声明' },
        component: () => import('@/business/views/info/disclaimer.vue')
      },
      {
        path: 'agreement',
        name: 'BusinessAgreement',
        meta: { title: '用户协议' },
        component: () => import('@/business/views/info/agreement.vue')
      },
      // ====== 我的关注 ======
      {
        path: 'watchlist',
        name: 'BusinessWatchlist',
        meta: { title: '我的关注' },
        component: () => import('@/business/views/watchlist/index.vue')
      },
      // ====== 我的监控 ======
      {
        path: 'monitor',
        name: 'BusinessMonitor',
        meta: { title: '我的监控' },
        component: () => import('@/business/views/monitor/index.vue')
      },
      // ====== 股票详情 ======
      {
        path: 'stock-detail/:code',
        name: 'BusinessStockDetail',
        meta: { title: '股票详情' },
        component: () => import('@/business/views/stock-detail/index.vue')
      },
      // ====== 监控触发记录 ======
      {
        path: 'trigger-record',
        name: 'BusinessTriggerRecord',
        meta: { title: '触发记录' },
        component: () => import('@/business/views/trigger-record/index.vue')
      },
      // ====== 短信记录 ======
      {
        path: 'sms-record',
        name: 'BusinessSmsRecord',
        meta: { title: '短信记录' },
        component: () => import('@/business/views/sms-record/index.vue')
      },
      // ====== 设置 ======
      {
        path: 'settings',
        name: 'BusinessSettings',
        meta: { title: '设置' },
        component: () => import('@/business/views/settings/index.vue')
      },
      // ====== 错误页 ======
      {
        path: '404',
        name: 'Business404',
        meta: { title: '页面不存在' },
        component: () => import('@/business/views/error-page/404.vue')
      },
      {
        path: '500',
        name: 'Business500',
        meta: { title: '服务器异常' },
        component: () => import('@/business/views/error-page/500.vue')
      }
    ]
  }
]

export default businessRoutes
