/**
 * Pinia 已采用 composable 模式，无需全局 getters。
 * 在各组件/模块中通过以下方式直接访问：
 * 
 * import { useAppStore } from '@/admin/store/app'
 * const appStore = useAppStore()
 * 
 * appStore.sidebar  // 等同于旧版 getters.sidebar
 * 
 * 可通过解构保持响应性：
 * import { storeToRefs } from 'pinia'
 * const { sidebar, device } = storeToRefs(useAppStore())
 */

export {}
