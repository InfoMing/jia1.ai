/**
 * Pinia Store — permission（权限/动态路由）
 *
 * 管理从后端接口获取的动态路由菜单。
 * routes 存储的是 constantRoutes + 后端动态路由的合并结果，用于侧边栏渲染。
 */
import { constantRoutes } from '@/router/admin'
import { defineStore } from 'pinia'

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    routes: [],
    /** 仅存储后端返回的动态路由，用于 router.addRoute() 注册 */
    asyncRoutes: []
  }),

  actions: {
    generateRoutes(routes) {
      // 保存后端动态路由（后续用于 addRoute）
      this.asyncRoutes = routes
      // 合并常量路由 + 动态路由（供侧边栏使用）
      this.routes = constantRoutes.concat(routes)
      return this.routes
    }
  }
})
