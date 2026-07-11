<template>
  <div class="si-site-layout">
    <SiteHeader />
    <main class="si-site-layout__content"><RouterView /></main>
    <SiteFooter />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import '@/business/styles/base/index.scss'
import SiteHeader from '@/business/layout/components/SiteHeader.vue'
import SiteFooter from '@/business/layout/components/SiteFooter.vue'
</script>

<style lang="scss" scoped>
.si-site-layout { min-height: 100vh; padding-top: clamp(70px, 5.208vw, 100px); overflow: clip; background: #fff; }
.si-site-layout__content { min-height: calc(100vh - clamp(70px, 5.208vw, 100px)); }
@media (max-width: 768px) {
  .si-site-layout { padding-top: 70px; }
  .si-site-layout__content { min-height: calc(100vh - 70px); }
}
</style>
