<template>
  <aside class="ji-community-entry" aria-label="加入佳一AI社群">
    <div class="ji-community-entry__left">
      <div class="ji-community-entry__title">加入 <strong>佳一AI</strong> 社群</div>
      <div class="ji-community-entry__subtitle">获取最新资讯、优质资源、专属福利</div>
      <div class="ji-community-entry__features">
        <div v-for="feature in features" :key="feature.label">
          <span v-html="feature.icon"></span>
          <small>{{ feature.label }}</small>
        </div>
      </div>
    </div>

    <div class="ji-community-entry__right">
      <div class="ji-community-entry__qr"><img v-media-placeholder :src="communityQr" alt="Jia1.ai 社群二维码" /></div>
      <span>微信扫码加入</span>
    </div>
  </aside>
</template>

<script setup>
import communityQr from '@/business/assets/home/communityPanel.png'
import { vMediaPlaceholder } from '@/business/directives/mediaPlaceholder'

// 四项权益与目标卡片保持相同顺序，图标使用本地内联 SVG，避免外部资源依赖。
const features = [
  { label: '交流答疑', icon: '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="15"/><path d="M9 11h14v8H15l-4 3v-3H9z"/></svg>' },
  { label: '资源分享', icon: '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="15"/><path d="M10 13h5l2-2h5v11H10z"/></svg>' },
  { label: '活动福利', icon: '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="15"/><path d="M10 15h12v8H10zM9 12h14v3H9zM16 12v11M13 9c2 0 3 3 3 3s-5 0-5-2c0-1 .8-1 2-1Zm6 0c-2 0-3 3-3 3s5 0 5-2c0-1-.8-1-2-1Z"/></svg>' },
  { label: '共创成长', icon: '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="15"/><path d="M9 21c3-5 5-3 7-7 2 4 4 2 7-4M18 10h5v5"/></svg>' }
]
</script>

<style lang="scss" scoped>
.ji-community-entry { width: 27vw; flex-shrink: 0; padding: 1vw 1.4vw; display: flex; align-items: stretch; gap: 2vw; border: 1px solid rgb(var(--ji-theme-accent-rgb) / .5); border-radius: 1.5625vw; background: linear-gradient(182deg,rgb(var(--ji-theme-accent-rgb) / .1) 1.45%,rgba(255,255,255,0) 98.76%); }
.ji-community-entry__left { min-width: 0; flex: 1; display: flex; flex-direction: column; }
.ji-community-entry__title { color: #1a1a1a; font-size: 1.0417vw; font-weight: 700; line-height: 1.3; }
.ji-community-entry__title strong { color: var(--ji-theme-deep); font-family: Poppins,'PingFang SC','Microsoft YaHei',sans-serif; font-size: 1.25vw; line-height: 1.6667vw; }
.ji-community-entry__subtitle { margin-top: .3vw; color: #45513b; font-size: .73vw; }
.ji-community-entry__features { margin-top: auto; display: flex; justify-content: space-between; gap: 1vw; }
.ji-community-entry__features > div { display: inline-flex; flex-direction: column; align-items: center; gap: .2vw; flex-shrink: 0; }
.ji-community-entry__features span { width: 1.8vw; height: 1.8vw; display: inline-flex; }
.ji-community-entry__features :deep(svg) { width: 100%; height: 100%; fill: var(--ji-theme-soft); stroke: var(--ji-theme-deep); stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.5; }
.ji-community-entry__features small { color: #000; font-size: .7vw; line-height: 1; white-space: nowrap; }
.ji-community-entry__right { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; }
.ji-community-entry__qr { width: 7.8vw; height: 7.8vw; padding: .2vw; overflow: hidden; border-radius: .42vw; background: #fff; box-shadow: 0 .1vw .42vw rgba(0,0,0,.08); }
.ji-community-entry__qr img { width: 100%; height: 100%; display: block; object-fit: contain; }
.ji-community-entry__right > span { margin-top: .2vw; color: #000; font-size: .8vw; white-space: nowrap; }

@media (max-width: 1280px) {
  .ji-community-entry { width: min(100%,520px); padding: 16px 20px; gap: 24px; border-radius: 20px; }
  .ji-community-entry__title { font-size: 16px; }
  .ji-community-entry__title strong { font-size: 19px; line-height: 1.3; }
  .ji-community-entry__subtitle { margin-top: 4px; font-size: 12px; }
  .ji-community-entry__features { gap: 12px; }
  .ji-community-entry__features span { width: 32px; height: 32px; }
  .ji-community-entry__features small { font-size: 12px; }
  .ji-community-entry__qr { width: 110px; height: 110px; padding: 4px; border-radius: 6px; }
  .ji-community-entry__right > span { margin-top: 4px; font-size: 11px; }
}

@media (max-width: 600px) {
  .ji-community-entry { padding: 14px; gap: 14px; border-radius: 16px; }
  .ji-community-entry__features { margin-top: 14px; gap: 8px; }
  .ji-community-entry__features span { width: 26px; height: 26px; }
  .ji-community-entry__features small { font-size: 10px; }
  .ji-community-entry__qr { width: 94px; height: 94px; }
}
</style>
