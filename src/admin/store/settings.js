/**
 * Pinia Store — settings（页面设置项）
 *
 * 从 constants/settings.js 读取默认配置，并提供 changeSetting 方法在运行时修改。
 * changeSetting 根据传入的 key 动态更新对应的 state 属性。
 */
import { defineStore } from 'pinia'
import defaultSettings from '@/admin/constants/settings'

const {
  showSettings,
  tagsView,
  fixedHeader,
  sidebarLogo
} = defaultSettings

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: '#1890ff',
    showSettings,
    tagsView,
    fixedHeader,
    sidebarLogo
  }),

  actions: {
    changeSetting({ key, value }) {
      if (this.hasOwnProperty(key)) {
        this[key] = value
      }
    }
  }
})
