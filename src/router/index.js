import { createRouter, createWebHistory } from 'vue-router'
import businessRoutes from './business'

const router = createRouter({
  history: createWebHistory(),
  // 页面切换后统一回到顶部，避免继承上一个页面的滚动位置。
  scrollBehavior: () => ({ top: 0 }),
  routes: businessRoutes
})

// 页面标题以路由元信息为准，未配置时回退到站点名称。
router.afterEach(to => {
  document.title = to.meta.title || 'Jia1.ai'
})

export default router
