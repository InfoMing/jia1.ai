<template>
  <section class="si-community-section">
    <div><h2>加入社群 海量高质量资源定期分享</h2><div class="si-community-section__info"><img :src="assets.communityQr" alt="刺猬星球社群" /><div><p>已有 <b>{{ content.community.total.toLocaleString() }}</b> 人加入社群</p><span>昨日新增 <strong>{{ content.community.yesterday }}</strong> 人</span><small>海量免费高质量进阶分享 · 欢迎加入</small></div></div></div>
    <img class="si-community-section__visual" :src="assets.communityPanel" alt="" />
  </section>
</template>
<script setup>
import { homeAssets as assets, homeContent as content } from '@/business/config/home-content'
</script>
<style lang="scss" scoped>
@use '@/business/styles/base/mixins' as *;
.si-community-section { @include container; margin-top: 112px; min-height: 500px; padding: 65px; display: grid; grid-template-columns: 1.1fr .9fr; align-items: center; overflow: hidden; border-radius: 32px; background: linear-gradient(135deg,#eeffc8,#d8fff5); }.si-community-section h2 { max-width: 550px; font-size: clamp(34px,4vw,58px); line-height: 1.18; }.si-community-section__info { display: flex; gap: 18px; align-items: center; margin-top: 38px; }.si-community-section__info img { width: 108px; height: 108px; border-radius: 10px; }.si-community-section__info div { display: flex; flex-direction: column; gap: 7px; }.si-community-section__info p { font-size: 18px; }.si-community-section__info b,.si-community-section__info strong { color: #07c160; }.si-community-section__info small { color: #666; }.si-community-section__visual { width: 100%; max-height: 400px; object-fit: contain; }
@media (max-width: 768px) { .si-community-section { width: calc(100% - 32px); margin-top: 70px; padding: 38px 24px; grid-template-columns: 1fr; gap: 25px; border-radius: 22px; }.si-community-section h2 { font-size: 33px; }.si-community-section__info img { width: 88px; height: 88px; }.si-community-section__info p { font-size: 14px; }.si-community-section__visual { display: none; } }
</style>
