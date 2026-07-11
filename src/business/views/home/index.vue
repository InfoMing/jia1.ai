<template>
  <div class="si-page">
    <HomeHero />
    <BrandShowcase @video="open('video')" />
    <AudienceSection />
    <CareerSection />
    <CommunitySection />

    <VideoDialog :open="active === 'video'" @close="close" />
  </div>
</template>

<script setup>
import HomeHero from '@/business/views/home/components/HomeHero.vue'
import BrandShowcase from '@/business/views/home/components/BrandShowcase.vue'
import AudienceSection from '@/business/views/home/components/AudienceSection.vue'
import CareerSection from '@/business/views/home/components/CareerSection.vue'
import CommunitySection from '@/business/views/home/components/CommunitySection.vue'
import VideoDialog from '@/business/views/home/components/VideoDialog.vue'
import { useOverlayController } from '@/business/composables/useOverlayController'

const { active, open, close } = useOverlayController()
</script>

<style lang="scss" scoped>
.si-page { overflow: clip; }
</style>
