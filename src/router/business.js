import BusinessLayout from '@/business/layout/index.vue'

const LegacyView = () => import('@/business/views/legacy/index.vue')

/** 创建使用旧静态内容的规范路由，浏览器地址始终不包含 .html。 */
const legacyPage = (path, name, title, source) => ({
  path,
  name,
  meta: { title, legacySource: source },
  component: LegacyView
})

const businessRoutes = [
  {
    path: '/',
    component: BusinessLayout,
    children: [
      { path: '', name: 'Home', meta: { title: '刺猬星球 super-i' }, component: () => import('@/business/views/home/index.vue') },
      { path: 'live-courses', name: 'LiveCourses', meta: { title: '线上/线下直播课' }, component: () => import('@/business/views/live-courses/index.vue') },
      { path: 'newsletter', name: 'Newsletter', meta: { title: '刺猬周报' }, component: () => import('@/business/views/newsletter/index.vue') },
      { path: 'support', name: 'Support', meta: { title: '提交工单' }, component: () => import('@/business/views/support/index.vue') },
      { path: 'courses/:id', name: 'CourseDetail', meta: { title: '课程详情' }, component: () => import('@/business/views/course-detail/index.vue') }
    ]
  },

  legacyPage('/tutorials', 'Tutorials', 'AIGC教程', '/legacy/tool.html'),
  legacyPage('/talent-marketplace', 'TalentMarketplace', '企业/人才大厅', '/legacy/platform-role-select.html'),
  legacyPage('/talent-marketplace/demands', 'MarketplaceDemands', '需求大厅', '/legacy/platform-demands.html'),
  legacyPage('/talent-marketplace/talents', 'MarketplaceTalents', '人才大厅', '/legacy/platform-talents.html'),
  legacyPage('/resources', 'Resources', '精选资源', '/legacy/prototype.html'),
  legacyPage('/enterprise-service', 'EnterpriseService', '大客户服务', '/legacy/designer-join.html'),
  legacyPage('/strategy', 'Strategy', '策略工具', '/legacy/strategy.html'),
  legacyPage('/strategy/advanced', 'StrategyAdvanced', '策略工具', '/legacy/strategy2.html'),
  legacyPage('/strategy/pro', 'StrategyPro', '策略工具', '/legacy/strategy3.html'),
  legacyPage('/privacy', 'Privacy', '隐私政策', '/legacy/privacy.html'),
  legacyPage('/statement', 'Statement', '法律声明', '/legacy/statement.html'),

  // 兼容旧站收藏和外链；进入后立即替换为无 .html 的规范地址。
  { path: '/tool.html', redirect: { name: 'Tutorials' } },
  { path: '/platform-role-select.html', redirect: { name: 'TalentMarketplace' } },
  { path: '/platform-demands.html', redirect: { name: 'MarketplaceDemands' } },
  { path: '/platform-talents.html', redirect: { name: 'MarketplaceTalents' } },
  { path: '/prototype.html', redirect: { name: 'Resources' } },
  { path: '/designer-join.html', redirect: { name: 'EnterpriseService' } },
  { path: '/strategy.html', redirect: { name: 'Strategy' } },
  { path: '/strategy2.html', redirect: { name: 'StrategyAdvanced' } },
  { path: '/strategy3.html', redirect: { name: 'StrategyPro' } },
  { path: '/privacy.html', redirect: { name: 'Privacy' } },
  { path: '/statement.html', redirect: { name: 'Statement' } },
  { path: '/:pathMatch(.*)*', redirect: { name: 'Home' } }
]

export default businessRoutes
