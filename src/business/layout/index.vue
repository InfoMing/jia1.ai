<template>
  <div class="ji-site-layout">
    <navComponent />
    <main class="ji-site-layout__content"><routerView /></main>
    <siteFooter />
  </div>
</template>

<script setup>
import { RouterView as routerView } from 'vue-router'
// 基础样式只在公共布局加载一次，避免页面组件重复引入。
import '@/business/styles/base/index.scss'
import navComponent from '@/business/layout/components/navigationBar.vue'
import siteFooter from '@/business/layout/components/pageFooter.vue'
</script>

<style lang="scss" scoped>
.ji-site-layout { min-height: 100vh; padding-top: clamp(70px, 5.208vw, 100px); overflow: clip; background: #fff; }
.ji-site-layout__content { min-height: calc(100vh - clamp(70px, 5.208vw, 100px)); }
@media (max-width: 768px) {
  .ji-site-layout { padding-top: 70px; }
  .ji-site-layout__content { min-height: calc(100vh - 70px); }
}
</style>
