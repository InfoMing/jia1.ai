import businessLayout from '@/business/layout/index.vue'

/** 前台仅保留首页和 AI 提示词页面，未知地址统一返回首页。 */
const businessRoutes = [
  {
    path: '/',
    component: businessLayout,
    children: [
      { path: '', name: 'home', meta: { title: '佳一AI - AI创意学习与灵感平台 | Jia1.ai' }, component: () => import('@/business/views/home/index.vue') },
      { path: 'aiPrompts', name: 'aiPrompts', meta: { title: 'AI提示词库 - 精选AI创作提示词 | Jia1.ai' }, component: () => import('@/business/views/aiPrompts/index.vue') }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: { name: 'home' } }
]

export default businessRoutes
