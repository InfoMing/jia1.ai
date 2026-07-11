<template>
  <header class="ji-header ji-nav-shell">
    <div class="ji-nav-shell__inner">
      <routerLink class="ji-brand" :to="{ name: 'home' }" aria-label="返回首页">
        <img :src="logoMark" alt="" />
        <span class="ji-brand__copy">
          <strong>Jia1.ai</strong>
          <small><i />一个聚焦AI创意者的乌托邦</small>
        </span>
      </routerLink>

      <nav aria-label="主导航">
        <routerLink class="ji-prompt-link" :to="{ name: 'aiPrompts' }" active-class="is-active">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.7 15.6a6 6 0 1 1 6.6 0A3 3 0 0 0 14 18h-4a3 3 0 0 0-1.3-2.4Z" />
            <path d="M9.5 18h5M10.5 21h3" />
          </svg>
          <span>AI提示词</span>
        </routerLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { RouterLink as routerLink } from 'vue-router'
import logoMark from '@/business/assets/shared/logoMark.png'
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
}
@media (prefers-reduced-motion: reduce) {
  .ji-brand img,.ji-prompt-link,.ji-prompt-link::after,.ji-prompt-link svg { transition: none; }
}
</style>
