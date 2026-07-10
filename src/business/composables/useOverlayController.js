import { onBeforeUnmount, ref, watch } from 'vue'

export function useOverlayController() {
  const active = ref('')
  let opener = null
  const open = name => { opener = document.activeElement; active.value = name }
  const close = () => { active.value = ''; window.setTimeout(() => opener?.focus?.(), 0) }
  const onKeydown = event => { if (event.key === 'Escape' && active.value) close() }
  window.addEventListener('keydown', onKeydown)
  watch(active, value => document.documentElement.classList.toggle('si-overlay-open', Boolean(value)), { immediate: true })
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown)
    document.documentElement.classList.remove('si-overlay-open')
  })
  return { active, open, close }
}

