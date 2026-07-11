<template>
  <section class="ji-community-section" aria-labelledby="community-title">
    <div class="ji-community-section__content">
      <h2 id="community-title">加入社群，持续获取高质量 AI 资源</h2>
      <p class="ji-community-section__description">和 AI 创意者一起交流、学习与分享，让灵感持续发生。</p>

      <div class="ji-community-section__info">
        <span aria-hidden="true"></span>
        <p>扫码加入 · 免费高质量进阶分享</p>
      </div>
    </div>

    <div class="ji-community-section__media">
      <img v-media-placeholder :src="assets.communityPanel" alt="Jia1.ai 社群内容展示" />
    </div>
  </section>
</template>

<script setup>
import { homeAssets as assets } from '@/business/config/homeContent'
import { vMediaPlaceholder } from '@/business/directives/mediaPlaceholder'
</script>

<style lang="scss" scoped>
@use '@/business/styles/base/mixins' as *;

.ji-community-section {
  @include container;
  margin-top: 0;
  padding: clamp(40px, 4.16vw, 80px) 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(340px, .82fr);
  gap: clamp(40px, 5vw, 96px);
  align-items: center;
  background: #fff;
}
.ji-community-section__content { min-width: 0; }
.ji-community-section h2 { max-width: 650px; margin: 0; color: #070707; font-size: clamp(30px, 3.125vw, 50px); font-weight: 600; line-height: 1.2; letter-spacing: -.025em; }
.ji-community-section__description { max-width: 560px; margin: 18px 0 0; color: #666; font-size: clamp(14px, 1vw, 17px); line-height: 1.7; }
.ji-community-section__info { margin-top: clamp(24px, 2.08vw, 40px); display: inline-flex; gap: 10px; align-items: center; }
.ji-community-section__info span { width: 8px; height: 8px; flex: 0 0 auto; border-radius: 50%; background: var(--ji-theme-accent); box-shadow: 0 0 0 4px rgb(var(--ji-theme-accent-rgb) / .2); }
.ji-community-section__info p { margin: 0; color: #555; font-size: 14px; line-height: 1.5; }
.ji-community-section__media { min-width: 0; display: flex; align-items: center; justify-content: flex-end; background: transparent; }
.ji-community-section__media img { width: min(100%, 300px); padding: clamp(14px, 1.25vw, 24px); display: block; border-radius: 10px; background: #fff; box-shadow: 0 2px 8px rgba(15,23,42,.04),0 18px 42px rgba(15,23,42,.08),0 36px 72px rgba(15,23,42,.05); object-fit: contain; }

@media (max-width: 768px) {
  .ji-community-section { padding: 32px 0 40px; grid-template-columns: 1fr; gap: 28px; }
  .ji-community-section h2 { font-size: 30px; }
  .ji-community-section__description { margin-top: 12px; }
  .ji-community-section__info { margin-top: 20px; }
  .ji-community-section__media { width: 100%; justify-content: center; }
  .ji-community-section__media img { width: 100%; padding: 16px; border-radius: 8px; }
}
</style>
