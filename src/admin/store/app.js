/**
 * Pinia Store — app（侧边栏 / 设备 / 尺寸 状态）
 *
 * defineStore('app', options) 定义了一个名为 'app' 的 store。
 * 组件中使用方式：
 *   import { useAppStore } from '@/store'
 *   const appStore = useAppStore()
 *   appStore.sidebar          // 读取 state
 *   appStore.toggleSideBar()  // 调用 action
 *
 * Pinia 特性：state 直接在 actions 中用 this.xxx = value 修改，不需要额外提交步骤。
 */
import Cookies from 'js-cookie'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    sidebar: {
      opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
      withoutAnimation: false
    },
    device: 'desktop',
    size: Cookies.get('size') || 'medium'
  }),

  // actions：修改 state 的方法，直接通过 this.xxx = value 赋值
  actions: {
    toggleSideBar() {
      this.sidebar.opened = !this.sidebar.opened
      this.sidebar.withoutAnimation = false
      if (this.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
    },
    closeSideBar(withoutAnimation) {
      Cookies.set('sidebarStatus', 0)
      this.sidebar.opened = false
      this.sidebar.withoutAnimation = withoutAnimation
    },
    toggleDevice(device) {
      this.device = device
    },
    setSize(size) {
      this.size = size
      Cookies.set('size', size)
    }
  }
})
