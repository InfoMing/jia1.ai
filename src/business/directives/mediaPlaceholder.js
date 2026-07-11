const cleanupHandlers = new WeakMap()

const isReady = element => element.tagName === 'IMG'
  ? element.complete && element.naturalWidth > 0
  : element.readyState >= 2

const setLoading = element => {
  element.classList.add('ji-media-placeholder', 'is-loading')
  element.classList.remove('is-loaded', 'is-error')
}

const bindMediaState = element => {
  cleanupHandlers.get(element)?.()
  setLoading(element)

  const loadedEvent = element.tagName === 'VIDEO' ? 'loadeddata' : 'load'
  const handleLoaded = () => {
    element.classList.remove('is-loading', 'is-error')
    element.classList.add('is-loaded')
  }
  const handleError = () => {
    element.classList.remove('is-loading', 'is-loaded')
    element.classList.add('is-error')
    // 删除失效地址，避免浏览器显示默认破图图标，元素自身继续承载 CSS 占位背景。
    element.removeAttribute('src')
  }

  element.addEventListener(loadedEvent, handleLoaded)
  element.addEventListener('error', handleError)
  cleanupHandlers.set(element, () => {
    element.removeEventListener(loadedEvent, handleLoaded)
    element.removeEventListener('error', handleError)
  })

  if (isReady(element)) handleLoaded()
}

/** 图片和视频通用加载状态指令。 */
export const vMediaPlaceholder = {
  mounted: bindMediaState,
  updated(element) {
    if (!element.classList.contains('is-loaded') && !element.classList.contains('is-error')) setLoading(element)
  },
  beforeUnmount(element) {
    cleanupHandlers.get(element)?.()
    cleanupHandlers.delete(element)
  }
}
