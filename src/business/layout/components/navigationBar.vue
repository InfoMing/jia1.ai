<template>
  <header ref="navShell" class="ji-header ji-nav-shell">
    <div class="ji-nav-shell__inner">
      <routerLink class="ji-brand" :to="{ name: 'home' }" aria-label="返回首页">
        <img v-media-placeholder :src="logoMark" alt="" />
        <span class="ji-brand__copy">
          <strong>Jia1.ai</strong>
          <small><i />一个聚焦AI创意者的乌托邦</small>
        </span>
      </routerLink>

      <button
        class="ji-nav-toggle"
        :class="{ 'is-open': menuOpen }"
        type="button"
        aria-label="切换导航菜单"
        :aria-expanded="menuOpen"
        aria-controls="main-navigation"
        @click="menuOpen = !menuOpen"
      >
        <i></i><i></i><i></i>
      </button>

      <nav id="main-navigation" :class="{ 'is-open': menuOpen }" aria-label="主导航">
        <routerLink class="ji-prompt-link" :to="{ name: 'aiPrompts' }" active-class="is-active" @click="closeMenu">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.7 15.6a6 6 0 1 1 6.6 0A3 3 0 0 0 14 18h-4a3 3 0 0 0-1.3-2.4Z" />
            <path d="M9.5 18h5M10.5 21h3" />
          </svg>
          <span>AI提示词</span>
        </routerLink>
        <a class="ji-prompt-link" :href="aiNewsUrl" target="_blank" rel="noopener noreferrer" @click="closeMenu">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 10.2v3.6a2 2 0 0 0 2 2h2.2l6.8 3.1V5.1L8.2 8.2H6a2 2 0 0 0-2 2Z" />
            <path d="M8.2 15.8 9.5 20h3M18 8.5c1.2.8 2 2.1 2 3.5s-.8 2.7-2 3.5" />
          </svg>
          <span>最新AI资讯</span>
        </a>
        <a class="ji-prompt-link" :href="codingProjectUrl" target="_blank" rel="noopener noreferrer" @click="closeMenu">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3.5 7.5h6l1.7 2h9.3v8.8a2.2 2.2 0 0 1-2.2 2.2H5.7a2.2 2.2 0 0 1-2.2-2.2Z" />
            <path d="M3.5 8V5.8a2.2 2.2 0 0 1 2.2-2.2h3.1l1.7 2h7.8a2.2 2.2 0 0 1 2.2 2.2v1.7" />
          </svg>
          <span>我的coding项目</span>
        </a>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink as routerLink } from 'vue-router'
import logoMark from '@/business/assets/shared/logoMark.png'
import { vMediaPlaceholder } from '@/business/directives/mediaPlaceholder'

// 后续替换为个人 GitHub 仓库地址时只需修改此处。
const codingProjectUrl = 'https://github.com/'
const aiNewsUrl = 'https://maomu.com/news'
const menuOpen = ref(false)
const navShell = ref(null)

const closeMenu = () => { menuOpen.value = false }

// 点击导航外部或按下 ESC 时关闭折叠菜单，避免菜单遮挡后续内容。
const handleDocumentClick = event => {
  if (menuOpen.value && !navShell.value?.contains(event.target)) closeMenu()
}
const handleEscape = event => {
  if (event.key === 'Escape') closeMenu()
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleEscape)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style lang="scss" scoped>
@use '@/business/styles/base/mixins' as *;
.ji-nav-shell {
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  height: 50px;
  background: rgba(255,255,255,.82);
  box-shadow: 0 6px 16px rgba(146,208,80,.08);
  backdrop-filter: blur(18px) saturate(150%);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
}
.ji-nav-shell__inner { @include container; height: 100%; display: flex; align-items: center; justify-content: space-between; }
.ji-brand { display: flex; align-items: center; color: #070707; text-decoration: none; -webkit-tap-highlight-color: transparent; }
.ji-brand img { width: 44px; height: 44px; margin-right: 10px; object-fit: contain; transition: transform .35s cubic-bezier(.2,.8,.2,1),filter .35s; }
.ji-brand__copy { display: flex; align-items: center; gap: 10px; }
.ji-brand strong { font-family: Poppins,Inter,sans-serif; font-size: 25px; font-weight: 650; line-height: 1; letter-spacing: -1.2px; }
.ji-brand small { display: flex; align-items: center; gap: 6px; color: #777; font-size: 10px; font-weight: 500; line-height: 1; letter-spacing: .08em; }
.ji-brand small i { width: 5px; height: 5px; flex: 0 0 auto; border-radius: 50%; background: #92d050; box-shadow: 0 0 0 3px rgba(146,208,80,.14); }
.ji-nav-shell nav { display: flex; align-items: center; gap: 4px; }
.ji-nav-toggle { width: 38px; height: 38px; padding: 9px; display: none; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border: 0; border-radius: 9px; background: transparent; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.ji-nav-toggle i { width: 19px; height: 1.5px; display: block; border-radius: 2px; background: #171717; transition: transform .22s ease,opacity .18s ease; }
.ji-nav-toggle.is-open i:nth-child(1) { transform: translateY(5.5px) rotate(45deg); }
.ji-nav-toggle.is-open i:nth-child(2) { opacity: 0; }
.ji-nav-toggle.is-open i:nth-child(3) { transform: translateY(-5.5px) rotate(-45deg); }
.ji-brand:hover img { transform: translateY(-2px) rotate(-4deg) scale(1.06); filter: drop-shadow(0 7px 8px rgba(92,137,29,.2)); }
.ji-brand:active img { transform: scale(.94); transition-duration: .1s; }
.ji-prompt-link { position: relative; height: 44px; padding: 0 12px; display: flex; align-items: center; justify-content: center; gap: 2px; border-radius: 10px; color: #171717; background: transparent; text-decoration: none; font-size: 15px; font-weight: 600; transition: color .22s,background-color .22s,transform .18s; -webkit-tap-highlight-color: transparent; }
.ji-prompt-link::after { content: ''; position: absolute; right: 12px; bottom: 4px; left: 12px; height: 2px; border-radius: 2px; background: #92d050; transform: scaleX(0); transform-origin: center; transition: transform .22s ease; }
.ji-prompt-link svg { width: 25px; height: 25px; flex: 0 0 auto; fill: none; stroke: #92d050; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; transition: stroke .22s,transform .28s cubic-bezier(.2,.8,.2,1); }
.ji-prompt-link:hover { color: #659929; background: rgba(146,208,80,.09); transform: translateY(-1px); }
.ji-prompt-link:hover svg { stroke: #72aa32; transform: translateY(-2px) rotate(-5deg) scale(1.06); }
.ji-prompt-link:active { background: rgba(146,208,80,.16); transform: scale(.96); transition-duration: .08s; }
.ji-prompt-link.is-active { color: #659929; }
.ji-prompt-link.is-active::after { transform: scaleX(1); }
.ji-brand:focus-visible { outline: 3px solid rgba(146,208,80,.45); outline-offset: 4px; }
.ji-prompt-link:focus-visible { outline: 3px solid rgba(146,208,80,.4); outline-offset: 3px; }
@media (max-width: 768px) {
  .ji-nav-shell { height: 50px; }
  .ji-brand img { width: 32px; height: 32px; margin-right: 5px; }
  .ji-brand__copy { gap: 5px; }
  .ji-brand strong { font-size: 18px; letter-spacing: -.7px; }
  .ji-brand small { gap: 3px; font-size: 8px; letter-spacing: 0; white-space: nowrap; }
  .ji-brand small i { width: 4px; height: 4px; box-shadow: 0 0 0 2px rgba(146,208,80,.14); }
  .ji-prompt-link { height: 37px; padding: 0 6px; gap: 1.5px; font-size: 13px; }
  .ji-prompt-link::after { right: 6px; left: 6px; }
  .ji-prompt-link svg { width: 20px; height: 20px; }
  .ji-nav-toggle { display: flex; }
  .ji-nav-toggle:hover,.ji-nav-toggle.is-open { background: rgba(146,208,80,.1); }
  .ji-nav-shell nav { position: absolute; top: 56px; right: max(16px,calc((100vw - 100%) / 2)); box-sizing: border-box; width: min(260px,calc(100vw - 32px)); padding: 8px; display: flex; flex-direction: column; align-items: stretch; gap: 4px; border: 1px solid rgba(146,208,80,.18); border-radius: 12px; background: rgba(255,255,255,.96); box-shadow: 0 16px 38px rgba(30,55,12,.12); opacity: 0; visibility: hidden; transform: translateY(-8px) scale(.98); transform-origin: top right; transition: opacity .2s ease,transform .2s ease,visibility .2s; backdrop-filter: blur(18px); }
  .ji-nav-shell nav.is-open { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }
  .ji-nav-shell nav .ji-prompt-link { box-sizing: border-box; width: 100%; height: 44px; padding: 0 12px; justify-content: flex-start; gap: 7px; }
  .ji-nav-shell nav .ji-prompt-link::after { display: none; }
  .ji-nav-shell nav .ji-prompt-link.is-active { color: #4f7e1e; background: rgba(146,208,80,.14); box-shadow: inset 3px 0 0 #92d050; }
}
@media (max-width: 600px) {
  .ji-brand small { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .ji-brand img,.ji-prompt-link,.ji-prompt-link::after,.ji-prompt-link svg { transition: none; }
}
</style>
