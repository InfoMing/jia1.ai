import BusinessLayout from '@/business/layout/index.vue'

/** 前台仅保留首页和 AI 提示词页面，未知地址统一返回首页。 */
const businessRoutes = [
  {
    path: '/',
    component: BusinessLayout,
    children: [
      { path: '', name: 'Home', meta: { title: '刺猬星球 super-i' }, component: () => import('@/business/views/home/index.vue') },
      { path: 'ai-prompts', name: 'AiPrompts', meta: { title: 'AI提示词 - 刺猬星球' }, component: () => import('@/business/views/ai-prompts/index.vue') }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: { name: 'Home' } }
]

export default businessRoutes
