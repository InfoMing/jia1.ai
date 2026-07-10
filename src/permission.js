/**
 * 路由守卫（权限控制）
 *
 * router.beforeEach — 每次路由跳转前执行，判断是否允许访问：
 *   - 已登录用户：放行，但后台管理页需要先加载动态菜单
 *   - 未登录用户：跳转到对应的登录页
 *
 * 动态菜单流程：
 *   进入后台页面时，检查 Pinia 中是否已有动态路由。
 *   如果没有，调用 getMenu() 获取菜单数据，用 router.addRoute() 逐个添加。
 */
import router from './router'
import { usePermissionStore } from '@/admin/store/permission'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/common/utils/user'
import { getMenu } from '@/common/utils/menu'

NProgress.configure({
  showSpinner: false
})

// ===== 前台 (Front-facing /b/*) 配置 =====
// 无需登录即可访问的前台白名单路由
const businessWhiteList = [
  '/b/home',
  '/b/login',
  '/b/register',
  '/b/forgot-password',
  '/b/about',
  '/b/help',
  '/b/disclaimer',
  '/b/agreement',
  '/b/404',
  '/b/500'
]
const businessAuthPrefix = '/b/'

// ===== 后台 (Admin /admin/*) 配置 =====
const adminWhiteList = ['/admin/login', '/admin/auth-redirect', '/admin/404', '/admin/500', '/admin/401']
const adminAuthPrefixes = ['/admin/system', '/admin', '/admin/resource', '/admin/platform', '/admin/stock']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = to.meta.title || ''

  const hasToken = getToken()

  if (hasToken) {
    // ====== 已登录 ======

    // 已登录用户访问后台登录页 → 重定向到前台市场
    if (to.path === '/admin/login') {
      next({ path: '/b/market' })
      NProgress.done()
      return
    }

    // 进入后台管理页面 → 检查动态菜单是否已加载
    if (adminAuthPrefixes.some(prefix => to.path.startsWith(prefix))) {
      const permissionStore = usePermissionStore()
      // 只在首次访问后台时加载一次动态菜单
      if (permissionStore.asyncRoutes.length === 0) {
        try {
          let menus = await getMenu()
          await permissionStore.generateRoutes(menus)
          const asyncRoutes = permissionStore.asyncRoutes
          asyncRoutes.forEach(route => {
            router.addRoute(route)
          })
        } catch (e) {
          // 菜单加载失败不阻塞导航，仅静默降级（侧边栏只显示常量路由）
        }
      }
    }

    // 其他路由直接放行（含前台业务路由）
    next()
  } else {
    // ====== 未登录 ======

    // 白名单路由直接放行
    if (adminWhiteList.includes(to.path) || businessWhiteList.includes(to.path)) {
      next()
    } else if (to.path.startsWith(businessAuthPrefix)) {
      // 前台业务路由 → 跳转到前台登录页
      next(`/b/login?redirect=${to.path}`)
      NProgress.done()
    } else {
      // 其他路由（含后台管理页）→ 跳转到后台登录页
      next(`/admin/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
