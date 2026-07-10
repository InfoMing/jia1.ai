/**
 * Pinia Store — user（用户信息）
 *
 * 最简单的 Pinia store 示例：
 *   state 定义数据
 *   actions 定义修改数据的方法
 *   使用时 import { useUserStore } from '@/admin/store/user'
 */
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),

  actions: {
    setUser(user) {
      this.user = user
    }
  }
})
