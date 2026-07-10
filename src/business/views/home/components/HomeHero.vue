<template>
  <section ref="heroRef" class="si-hero">
    <div class="si-hero__sticky">
      <div class="si-hero__glow si-hero__glow--left" />
      <div class="si-hero__glow si-hero__glow--right" />
      <div class="si-hero__media" :style="mediaStyle">
        <video ref="videoRef" :src="assets.heroVideo" :poster="assets.heroPoster" muted playsinline preload="metadata" />
      </div>

      <div class="si-hero__intro" :style="introStyle">
        <h1>刺猬星球 <em>super-i</em></h1>
        <p>一个聚集AI创意者的学习与接单平台</p>
        <div class="si-community-card">
          <img :src="assets.communityQr" alt="刺猬星球社群" />
          <div><strong>刺猬星球社群</strong><span>已有 <b>{{ content.community.total.toLocaleString() }}</b> 人加入社群</span><small>昨日新增 <i>{{ content.community.yesterday }}</i> 人</small><small>海量免费高质量进阶分享<br />欢迎加入</small></div>
        </div>
      </div>

      <div class="si-triangle" :style="triangleStyle">
        <svg viewBox="0 0 1000 640" aria-hidden="true">
          <path d="M500 96 160 496h680L500 96Z" fill="none" stroke="rgba(0,0,0,.22)" stroke-width="2" stroke-dasharray="8 6" />
        </svg>
        <RouterLink :to="{ name: 'Tutorials' }" class="si-triangle__node is-top" :class="{ active: mobileNode === 'learn' }" @click="selectMobileNode($event, 'learn')">AI学习<span>系统学习AI商业应用，从零到精通</span></RouterLink>
        <button class="si-triangle__node is-left" :class="{ active: mobileNode === 'empower' }" type="button" @click="selectMobileNode($event, 'empower')">工具赋能<span>掌握AI渲染核心技能，提升创作效率</span></button>
        <RouterLink :to="{ name: 'MarketplaceDemands' }" class="si-triangle__node is-right" :class="{ active: mobileNode === 'convert' }" @click="selectMobileNode($event, 'convert')">商业转化<span>对接真实商业需求，实现技能变现</span></RouterLink>
        <h2>打造超级个体全流程商业闭环</h2>
      </div>

      <div class="si-hero__mobile-panel">
        <strong>{{ mobileCopy[mobileNode].title }}</strong><span>{{ mobileCopy[mobileNode].description }}</span>
      </div>
      <div class="si-scroll-hint" :style="hintStyle">向下滚动探索<i /></div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { homeAssets as assets, homeContent as content } from '@/business/config/home-content'

const heroRef = ref(null)
const videoRef = ref(null)
const progress = ref(0)
const mobileNode = ref('learn')
const mobileCopy = {
  learn: { title: 'AI学习', description: '系统学习AI商业应用，从零到精通' },
  empower: { title: '工具赋能', description: '掌握AI渲染核心技能，提升创作效率' },
  convert: { title: '商业转化', description: '对接真实商业需求，实现技能变现' }
}
let ticking = false
// 根据 Hero 在视口中的滚动进度同步视频帧和三角形动画。
const update = () => {
  const hero = heroRef.value
  if (!hero) return
  const max = Math.max(hero.offsetHeight - window.innerHeight, 1)
  progress.value = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / max))
  if (videoRef.value?.duration) videoRef.value.currentTime = videoRef.value.duration * progress.value
  ticking = false
}
const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
onMounted(() => { window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', update); videoRef.value?.pause(); update() })
onBeforeUnmount(() => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', update) })

const introStyle = computed(() => ({ opacity: Math.max(0, 1 - progress.value * 3.3), transform: `translateY(${-progress.value * 70}px)` }))
const triangleOpacity = computed(() => Math.min(1, Math.max(0, (progress.value - .23) * 4.5)) * Math.min(1, Math.max(0, (1 - progress.value) * 5)))
const triangleStyle = computed(() => ({ opacity: triangleOpacity.value, transform: `translate(-50%, -50%) scale(${.88 + triangleOpacity.value * .12})` }))
const mediaStyle = computed(() => ({ transform: `translate(-50%, -50%) scale(${1.08 - progress.value * .16})`, opacity: Math.max(.32, 1 - progress.value * .3) }))
const hintStyle = computed(() => ({ opacity: Math.max(0, 1 - progress.value * 8) }))
const selectMobileNode = (event, key) => { if (window.innerWidth <= 768 && mobileNode.value !== key) event.preventDefault(); mobileNode.value = key }
</script>

<style lang="scss" scoped>
@use '@/business/styles/base/tokens' as *;
.si-hero { height: calc(300vh - $header-height); background: #fff; }
.si-hero__sticky { position: sticky; top: $header-height; height: calc(100svh - $header-height); overflow: hidden; display: grid; place-items: center; }
.si-hero__media { position: absolute; top: 50%; left: 50%; width: 100vw; z-index: 2; pointer-events: none; transition: opacity .08s linear; }
.si-hero__media::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg,#fff,transparent 12%,transparent 88%,#fff),linear-gradient(180deg,transparent 75%,#fff); }
.si-hero__media video { width: 100%; display: block; mix-blend-mode: multiply; }
.si-hero__glow { position: absolute; z-index: 3; bottom: -90px; width: 58%; height: 350px; filter: blur(48px); border-radius: 50%; pointer-events: none; }
.si-hero__glow--left { left: -7%; background: radial-gradient(ellipse,rgba(170,255,0,.45),rgba(0,229,204,.1) 65%,transparent); }
.si-hero__glow--right { right: -8%; background: radial-gradient(ellipse,rgba(170,255,0,.35),transparent 70%); }
.si-hero__intro { position: relative; z-index: 10; width: 100%; text-align: center; will-change: opacity, transform; }
.si-hero__intro h1 { font-size: clamp(62px,6.77vw,105px); line-height: 1; letter-spacing: -4px; }
.si-hero__intro h1 em { font-size: .72em; font-weight: 800; }
.si-hero__intro > p { margin-top: 22px; font-size: 14px; }
.si-community-card { width: 246px; margin: 28px auto 0; padding: 12px; display: flex; gap: 12px; text-align: left; border: 1px solid rgba(0,0,0,.06); border-radius: 16px; background: rgba(255,255,255,.82); box-shadow: 0 6px 24px rgba(0,0,0,.06); backdrop-filter: blur(8px); }
.si-community-card img { width: 76px; height: 76px; object-fit: cover; }
.si-community-card div { display: flex; flex-direction: column; gap: 3px; }
.si-community-card strong { font-size: 12px; }.si-community-card span,.si-community-card small { font-size: 9px; color: #555; }.si-community-card b,.si-community-card i { color: #07c160; font-style: normal; }
.si-triangle { position: absolute; top: 50%; left: 50%; z-index: 15; width: min(1200px, 96vw); aspect-ratio: 1000/640; pointer-events: none; will-change: opacity, transform; }
.si-triangle svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.si-triangle__node { position: absolute; pointer-events: auto; padding: 14px 28px; border: 1px solid rgba(0,0,0,.08); border-radius: 999px; background: rgba(255,255,255,.92); box-shadow: 0 8px 26px rgba(0,0,0,.08); font-weight: 700; cursor: pointer; }
.si-triangle__node span { position: absolute; top: calc(100% + 10px); left: 50%; width: max-content; max-width: 300px; padding: 10px 15px; transform: translateX(-50%); border-radius: 10px; background: #fff; box-shadow: $shadow; font-size: 12px; font-weight: 400; opacity: 0; transition: opacity .2s, transform .2s; }
.si-triangle__node:hover span { opacity: 1; transform: translate(-50%,-4px); }
.si-triangle__node.is-top { top: 15%; left: 50%; transform: translate(-50%,-50%); background: #aaff00; }
.si-triangle__node.is-left { top: 77.5%; left: 16%; transform: translate(-50%,-50%); }
.si-triangle__node.is-right { top: 77.5%; left: 84%; transform: translate(-50%,-50%); }
.si-triangle h2 { position: absolute; left: 50%; bottom: 4%; transform: translateX(-50%); width: max-content; font-size: clamp(24px,2.7vw,42px); }
.si-hero__mobile-panel { display: none; }
.si-scroll-hint { position: absolute; z-index: 20; left: 50%; bottom: 28px; transform: translateX(-50%); color: #888; font-size: 12px; }
.si-scroll-hint i { display: block; width: 1px; height: 30px; margin: 8px auto -30px; background: linear-gradient(#aaa,transparent); animation: si-hint 1.4s infinite; }
@keyframes si-hint { 50% { transform: translateY(7px); } }
@media (max-width: 1099px) {
  .si-hero { height: calc(300vh - 106px); }
  .si-hero__sticky { top: 106px; height: calc(100svh - 106px); }
}
@media (max-width: 768px) {
  .si-hero { height: calc(260vh - 106px); }
  .si-hero__sticky { top: 106px; height: calc(100svh - 106px); }
  .si-hero__media { width: 160vw; }
  .si-hero__intro { transform-origin: center; }
  .si-hero__intro h1 { font-size: 43px; letter-spacing: -2px; white-space: nowrap; }
  .si-hero__intro h1 em { font-size: 32px; }
  .si-hero__intro > p { margin-top: 12px; font-size: 13px; }
  .si-community-card { margin-top: 28px; width: 252px; }
  .si-triangle { width: 122vw; top: 45%; }
  .si-triangle__node { padding: 9px 14px; font-size: 12px; }
  .si-triangle__node span { display: none; }
  .si-triangle h2 { bottom: 0; font-size: 18px; }
  .si-hero__mobile-panel { display: flex; position: absolute; z-index: 20; bottom: 64px; left: 50%; width: 86%; transform: translateX(-50%); flex-direction: column; text-align: center; gap: 4px; font-size: 12px; }
  .si-hero__mobile-panel strong { font-size: 15px; }
  .si-scroll-hint { bottom: 18px; }
}
</style>
