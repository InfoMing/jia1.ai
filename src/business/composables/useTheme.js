import { ref } from 'vue'
import { themeConfig, themeOptions } from '@/business/config/themeConfig'

const storageKey = 'jia1:theme'
const activeTheme = ref(themeConfig.defaultTheme)
let initialized = false

const applyThemeVariables = themeKey => {
  const theme = themeOptions[themeKey] || themeOptions[themeConfig.defaultTheme]
  const root = document.documentElement
  root.dataset.theme = themeKey
  root.style.setProperty('--ji-theme-primary', theme.primary)
  root.style.setProperty('--ji-theme-accent', theme.accent)
  root.style.setProperty('--ji-theme-soft', theme.soft)
  root.style.setProperty('--ji-theme-deep', theme.deep)
  root.style.setProperty('--ji-theme-rgb', theme.rgb)
  root.style.setProperty('--ji-theme-accent-rgb', theme.accentRgb)
  root.style.setProperty('--ji-theme-image-filter', theme.imageFilter)
}

const readStoredTheme = () => {
  if (!themeConfig.allowUserCustomization) return themeConfig.defaultTheme
  try {
    const storedTheme = window.localStorage.getItem(storageKey)
    return themeOptions[storedTheme] ? storedTheme : themeConfig.defaultTheme
  } catch {
    return themeConfig.defaultTheme
  }
}

/** 初始化并管理全站主题与用户缓存。 */
export const useTheme = () => {
  if (!initialized) {
    activeTheme.value = readStoredTheme()
    applyThemeVariables(activeTheme.value)
    initialized = true
  }

  const setTheme = themeKey => {
    if (!themeConfig.allowUserCustomization || !themeOptions[themeKey]) return
    activeTheme.value = themeKey
    applyThemeVariables(themeKey)
    try { window.localStorage.setItem(storageKey, themeKey) } catch { /* 禁用缓存时仍保持本次会话主题 */ }
  }

  const clearTheme = () => {
    try { window.localStorage.removeItem(storageKey) } catch { /* localStorage 不可用时忽略 */ }
    activeTheme.value = themeConfig.defaultTheme
    applyThemeVariables(themeConfig.defaultTheme)
  }

  return { activeTheme, clearTheme, setTheme, themeOptions }
}
