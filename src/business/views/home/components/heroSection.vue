<template>
  <section class="ji-hero">
    <div class="ji-hero__glow ji-hero__glow--left" />
    <div class="ji-hero__glow ji-hero__glow--right" />
    <div class="ji-hero__media">
      <img class="ji-hero__poster" :class="{ 'is-hidden': videoReady }" :src="assets.heroPoster" alt="" />
      <video
        :class="{ 'is-ready': videoReady }"
        :src="assets.heroVideo"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
        @loadeddata="videoReady = true"
        @error="videoReady = false"
      />
    </div>

    <div class="ji-hero__intro">
      <h1>佳一AI <em>Jia1.ai</em></h1>
      <p>一个聚集AI创意者的学习与灵感平台</p>
      <div class="ji-community-card">
        <img :src="assets.communityQr" alt="Jia1.ai 社群" />
        <div>
          <strong>jia1.ai 社群</strong>
          <span>已有 <b>{{ content.community.total.toLocaleString() }}</b> 人加入社群</span>
          <small>昨日新增 <i>{{ content.community.yesterday }}</i> 人</small>
          <small>海量免费高质量进阶分享<br />欢迎加入</small>
        </div>
      </div>
    </div>

    <div class="ji-scroll-hint">向下滚动探索<i /></div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { homeAssets as assets, homeContent as content } from '@/business/config/homeContent'

// 视频读取到首帧前始终展示本地封面，加载失败时也不会出现空白背景。
const videoReady = ref(false)
</script>

<style lang="scss" scoped>
.ji-hero { position: relative; height: calc(100svh - 50px); min-height: 650px; overflow: hidden; display: grid; place-items: center; background: #fff; }
.ji-hero__media { position: absolute; top: 50%; left: 50%; width: 100vw; z-index: 2; transform: translate(-50%,-50%) scale(1.06); pointer-events: none; }
.ji-hero__media::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg,#fff,transparent 12%,transparent 88%,#fff),linear-gradient(180deg,transparent 75%,#fff); }
.ji-hero__poster { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 1; mix-blend-mode: multiply; transition: opacity .2s ease,visibility .2s; }
.ji-hero__poster.is-hidden { visibility: hidden; opacity: 0; }
.ji-hero__media video { position: relative; width: 100%; display: block; opacity: 0; mix-blend-mode: multiply; transition: opacity .7s ease; }
.ji-hero__media video.is-ready { opacity: 1; }
.ji-hero__glow { position: absolute; z-index: 3; bottom: -90px; width: 58%; height: 350px; filter: blur(48px); border-radius: 50%; pointer-events: none; }
.ji-hero__glow--left { left: -7%; background: radial-gradient(ellipse,rgba(170,255,0,.45),rgba(0,229,204,.1) 65%,transparent); }
.ji-hero__glow--right { right: -8%; background: radial-gradient(ellipse,rgba(170,255,0,.35),transparent 70%); }
.ji-hero__intro { position: relative; z-index: 10; width: 100%; text-align: center; transform: translateY(-10vh); }
.ji-hero__intro h1 { font-size: clamp(62px,6.77vw,105px); line-height: 1; letter-spacing: -4px; }
.ji-hero__intro h1 em { margin-left: .14em; color: #000; font-family: Poppins,Inter,sans-serif; font-size: .5em; font-style: normal; font-weight: 560; letter-spacing: -.04em; }
.ji-hero__intro > p { margin-top: 22px; color: #000; font-size: 14px; font-weight: 400; }
.ji-community-card { width: 246px; margin: 28px auto 0; padding: 12px; display: flex; gap: 12px; text-align: left; border: 1px solid rgba(0,0,0,.06); border-radius: 16px; background: rgba(255,255,255,.82); box-shadow: 0 6px 24px rgba(0,0,0,.06); backdrop-filter: blur(8px); }
.ji-community-card img { width: 76px; height: 76px; object-fit: cover; }
.ji-community-card div { display: flex; flex-direction: column; gap: 3px; }
.ji-community-card strong { font-size: 12px; }.ji-community-card span,.ji-community-card small { font-size: 9px; color: #555; }.ji-community-card b,.ji-community-card i { color: #07c160; font-style: normal; }
.ji-scroll-hint { position: absolute; z-index: 20; left: 50%; bottom: 28px; transform: translateX(-50%); color: #888; font-size: 12px; }
.ji-scroll-hint i { display: block; width: 1px; height: 30px; margin: 8px auto -30px; background: linear-gradient(#aaa,transparent); animation: ji-hint 1.4s infinite; }
@keyframes ji-hint { 50% { transform: translateY(7px); } }
@media (max-width: 768px) {
  .ji-hero { height: calc(100svh - 50px); min-height: 620px; }
  .ji-hero__media { width: 165vw; }
  .ji-hero__intro { transform: translateY(-8vh); }
  .ji-hero__intro h1 { font-size: 43px; letter-spacing: -2px; white-space: nowrap; }
  .ji-hero__intro h1 em { margin-left: .1em; font-size: .5em; }
  .ji-hero__intro > p { margin-top: 12px; padding: 0 18px; font-size: 13px; }
  .ji-community-card { width: 252px; margin-top: 28px; }
  .ji-scroll-hint { bottom: 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .ji-hero__poster,.ji-hero__media video { transition: none; }
}
</style>
