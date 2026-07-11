<template>
  <section class="si-hero">
    <div class="si-hero__glow si-hero__glow--left" />
    <div class="si-hero__glow si-hero__glow--right" />
    <div class="si-hero__media">
      <video :src="assets.heroVideo" :poster="assets.heroPoster" autoplay muted loop playsinline preload="metadata" />
    </div>

    <div class="si-hero__intro">
      <h1>刺猬星球 <em>super-i</em></h1>
      <p>一个聚集AI创意者的学习与灵感平台</p>
      <div class="si-community-card">
        <img :src="assets.communityQr" alt="刺猬星球社群" />
        <div>
          <strong>刺猬星球社群</strong>
          <span>已有 <b>{{ content.community.total.toLocaleString() }}</b> 人加入社群</span>
          <small>昨日新增 <i>{{ content.community.yesterday }}</i> 人</small>
          <small>海量免费高质量进阶分享<br />欢迎加入</small>
        </div>
      </div>
    </div>

    <div class="si-scroll-hint">向下滚动探索<i /></div>
  </section>
</template>

<script setup>
import { homeAssets as assets, homeContent as content } from '@/business/config/home-content'
</script>

<style lang="scss" scoped>
.si-hero { position: relative; height: calc(100svh - clamp(70px,5.208vw,100px)); min-height: 650px; overflow: hidden; display: grid; place-items: center; background: #fff; }
.si-hero__media { position: absolute; top: 50%; left: 50%; width: 100vw; z-index: 2; transform: translate(-50%,-50%) scale(1.06); pointer-events: none; }
.si-hero__media::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg,#fff,transparent 12%,transparent 88%,#fff),linear-gradient(180deg,transparent 75%,#fff); }
.si-hero__media video { width: 100%; display: block; mix-blend-mode: multiply; }
.si-hero__glow { position: absolute; z-index: 3; bottom: -90px; width: 58%; height: 350px; filter: blur(48px); border-radius: 50%; pointer-events: none; }
.si-hero__glow--left { left: -7%; background: radial-gradient(ellipse,rgba(170,255,0,.45),rgba(0,229,204,.1) 65%,transparent); }
.si-hero__glow--right { right: -8%; background: radial-gradient(ellipse,rgba(170,255,0,.35),transparent 70%); }
.si-hero__intro { position: relative; z-index: 10; width: 100%; text-align: center; }
.si-hero__intro h1 { font-size: clamp(62px,6.77vw,105px); line-height: 1; letter-spacing: -4px; }
.si-hero__intro h1 em { font-size: .72em; font-weight: 800; }
.si-hero__intro > p { margin-top: 22px; font-size: 14px; }
.si-community-card { width: 246px; margin: 28px auto 0; padding: 12px; display: flex; gap: 12px; text-align: left; border: 1px solid rgba(0,0,0,.06); border-radius: 16px; background: rgba(255,255,255,.82); box-shadow: 0 6px 24px rgba(0,0,0,.06); backdrop-filter: blur(8px); }
.si-community-card img { width: 76px; height: 76px; object-fit: cover; }
.si-community-card div { display: flex; flex-direction: column; gap: 3px; }
.si-community-card strong { font-size: 12px; }.si-community-card span,.si-community-card small { font-size: 9px; color: #555; }.si-community-card b,.si-community-card i { color: #07c160; font-style: normal; }
.si-scroll-hint { position: absolute; z-index: 20; left: 50%; bottom: 28px; transform: translateX(-50%); color: #888; font-size: 12px; }
.si-scroll-hint i { display: block; width: 1px; height: 30px; margin: 8px auto -30px; background: linear-gradient(#aaa,transparent); animation: si-hint 1.4s infinite; }
@keyframes si-hint { 50% { transform: translateY(7px); } }
@media (max-width: 768px) {
  .si-hero { height: calc(100svh - 70px); min-height: 620px; }
  .si-hero__media { width: 165vw; }
  .si-hero__intro h1 { font-size: 43px; letter-spacing: -2px; white-space: nowrap; }
  .si-hero__intro h1 em { font-size: 32px; }
  .si-hero__intro > p { margin-top: 12px; padding: 0 18px; font-size: 13px; }
  .si-community-card { width: 252px; margin-top: 28px; }
  .si-scroll-hint { bottom: 18px; }
}
</style>
