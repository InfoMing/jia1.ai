<template>
  <section class="si-showcase">
    <img class="si-showcase__bg" :src="assets.showcase" alt="" />
    <div class="si-showcase__shade" />
    <div class="si-showcase__content">
      <img :src="assets.showcaseMark" alt="" /><p>我们追寻的光</p><h2>一起成为AI视觉规划师，解锁新时代AI潜力</h2>
      <div><button type="button" @click="$emit('video', 'brand')">品牌宣传片 <span>▶</span></button><button type="button" @click="$emit('video', 'platform')">平台介绍 <span>▶</span></button></div>
    </div>
  </section>
</template>
<script setup>
import { homeAssets as assets } from '@/business/config/home-content'
defineEmits(['video'])
</script>
<style lang="scss" scoped>
@use '@/business/styles/base/mixins' as *;
.si-showcase { @include container; position: relative; min-height: 550px; margin-top: 92px; overflow: hidden; border-radius: 28px; background: #050505; color: #fff; }
.si-showcase__bg,.si-showcase__shade { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }.si-showcase__shade { background: linear-gradient(90deg,rgba(0,0,0,.78),rgba(0,0,0,.2)); }
.si-showcase__content { position: relative; z-index: 1; width: 62%; padding: 95px 70px; }.si-showcase__content > img { width: 56px; }.si-showcase__content p { margin-top: 18px; font-size: 17px; }.si-showcase__content h2 { margin-top: 14px; font-size: clamp(30px,3vw,46px); line-height: 1.25; }
.si-showcase__content > div { display: flex; gap: 14px; margin-top: 42px; }.si-showcase button { padding: 14px 22px; border: 1px solid rgba(255,255,255,.5); border-radius: 999px; color: #fff; background: rgba(0,0,0,.25); cursor: pointer; backdrop-filter: blur(8px); }.si-showcase button:first-child { color: #070707; background: #aaff00; border-color: #aaff00; }
@media (max-width: 768px) { .si-showcase { width: calc(100% - 32px); min-height: 450px; margin-top: 55px; border-radius: 20px; }.si-showcase__content { width: 100%; padding: 70px 24px; }.si-showcase__content h2 { font-size: 29px; }.si-showcase__content > div { flex-direction: column; align-items: flex-start; }.si-showcase button { width: 190px; } }
</style>
