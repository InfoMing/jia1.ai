import { onBeforeUnmount, ref, watch } from 'vue'

export function useOverlayController() {
  const active = ref('')
  let opener = null

  // 记录触发弹层的元素，关闭后恢复焦点，保证键盘操作连续。
  const open = name => { opener = document.activeElement; active.value = name }
  const close = () => { active.value = ''; window.setTimeout(() => opener?.focus?.(), 0) }

  // 所有弹层共享 ESC 关闭行为，避免每个组件重复监听键盘事件。
  const onKeydown = event => { if (event.key === 'Escape' && active.value) close() }
  window.addEventListener('keydown', onKeydown)

  // 弹层打开期间锁定页面滚动，状态变化时自动同步根节点类名。
  watch(active, value => document.documentElement.classList.toggle('ji-overlay-open', Boolean(value)), { immediate: true })

  // 页面卸载时清理全局监听和滚动锁，防止影响后续路由页面。
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown)
    document.documentElement.classList.remove('ji-overlay-open')
  })
  return { active, open, close }
}
