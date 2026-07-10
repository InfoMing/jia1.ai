/**
 * Pinia 状态管理入口
 *
 * Pinia 是 Vue 3 的官方状态管理库，替代 Vuex。
 * 每个 store 通过 defineStore(id, options) 定义，组件中通过 useXxxStore() 调用。
 *
 * 使用方式：
 *   import { useAppStore } from '@/store'
 *   const appStore = useAppStore()
 *   appStore.sidebar          // 读取状态
 *   appStore.toggleSideBar()  // 调用方法（直接调用，不需要 dispatch）
 *
 * 本文件集中导出所有 store 给外部使用
 */
import { createPinia } from 'pinia'
import { useAppStore } from '@/admin/store/app'
import { useBaseStore } from '@/admin/store/base'
import { useErrorLogStore } from '@/admin/store/errorLog'
import { usePermissionStore } from '@/admin/store/permission'
import { useSettingsStore } from '@/admin/store/settings'
import { useTagsViewStore } from '@/admin/store/tagsView'
import { useUserStore } from '@/admin/store/user'

const pinia = createPinia()

export {
  pinia,
  useAppStore,
  useBaseStore,
  useErrorLogStore,
  usePermissionStore,
  useSettingsStore,
  useTagsViewStore,
  useUserStore
}

export default pinia
