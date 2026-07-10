/**
 * 路由配置入口
 *
 * 定义方式：
 *   createRouter() 创建路由实例
 *   createWebHistory() 使用 HTML5 History 模式（URL 中不带 #）
 *
 * 路由结构：
 *   后台路由（/admin/*）→ admin.js
 *   前台路由（/b/*）    → business.js
 *   404 兜底           → 根据路径前缀跳转对应的 404 页面
 */
import { createRouter, createWebHistory } from 'vue-router'

// ===== 后台路由（统一 /admin 前缀） =====
import adminRoutes from './admin'
// ===== 前台路由（统一 /b 前缀） =====
import businessRoutes from './business'

const createRouterInstance = () => createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({
    top: 0
  }),
  routes: [
    ...adminRoutes,
    ...businessRoutes,
    // 404 兜底路由（必须放在最后）
    // /:pathMatch(.*)* 匹配所有未定义的路径
    // 根据路径前缀分发到前台或后台的 404 页面
    { path: '/:pathMatch(.*)*', redirect: to => {
      return to.path.startsWith('/b/')
        ? '/b/404'
        : '/admin/404'
    }}
  ]
})

const router = createRouterInstance()

// 重置路由实例（用于权限变更后清除已添加的动态路由）
export function resetRouter() {
  const newRouter = createRouterInstance()
  router.matcher = newRouter.matcher
}

export default router
