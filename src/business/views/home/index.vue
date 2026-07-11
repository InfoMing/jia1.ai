<template>
  <div class="ji-page">
    <homeHero />
    <featuredPrompts />
    <brandShowcase @video="open('video')" />
    <identityOverview />
    <communitySection />

    <videoDialog :open="active === 'video'" @close="close" />
  </div>
</template>

<script setup>
import homeHero from '@/business/views/home/components/heroSection.vue'
import featuredPrompts from '@/business/views/home/components/promptShowcase.vue'
import brandShowcase from '@/business/views/home/components/brandSection.vue'
import identityOverview from '@/business/views/home/components/identityOverview.vue'
import communitySection from '@/business/views/home/components/communityBanner.vue'
import videoDialog from '@/business/views/home/components/mediaDialog.vue'
import { useOverlayController } from '@/business/composables/useOverlayController'

// 首页弹层统一由公共控制器管理互斥状态、ESC、滚动锁和焦点恢复。
const { active, open, close } = useOverlayController()
</script>

<style lang="scss" scoped>
.ji-page { overflow: clip; }
</style>
