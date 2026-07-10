import { createRouter, createWebHistory } from 'vue-router'
import businessRoutes from './business'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: businessRoutes
})

router.afterEach(to => {
  document.title = to.meta.title || '刺猬星球 super-i'
})

export default router
