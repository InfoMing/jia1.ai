<template>
  <div class="si-page">
    <HomeHero />
    <FeaturedCourses />
    <BrandShowcase @video="open('video')" />
    <AudienceSection />
    <CareerSection />
    <CommunitySection />

    <div v-if="!cookieAccepted" class="si-cookie"><span>本网站使用了 cookies</span><button type="button" @click="acceptCookie">同意</button></div>
    <VideoDialog :open="active === 'video'" @close="close" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HomeHero from '@/business/views/home/components/HomeHero.vue'
import FeaturedCourses from '@/business/views/home/components/FeaturedCourses.vue'
import BrandShowcase from '@/business/views/home/components/BrandShowcase.vue'
import AudienceSection from '@/business/views/home/components/AudienceSection.vue'
import CareerSection from '@/business/views/home/components/CareerSection.vue'
import CommunitySection from '@/business/views/home/components/CommunitySection.vue'
import VideoDialog from '@/business/views/home/components/VideoDialog.vue'
import { useOverlayController } from '@/business/composables/useOverlayController'

const COOKIE_KEY = 'superi-demo:cookie-consent'
const cookieAccepted = ref(localStorage.getItem(COOKIE_KEY) === 'accepted')
const { active, open, close } = useOverlayController()
const acceptCookie = () => { cookieAccepted.value = true; localStorage.setItem(COOKIE_KEY, 'accepted') }
</script>

<style lang="scss" scoped>
.si-page { overflow: clip; }
.si-cookie { position: fixed; z-index: 90; left: 50%; bottom: 68px; width: 292px; height: 42px; padding: 0 10px 0 16px; transform: translateX(-50%); display: flex; align-items: center; justify-content: space-between; border: 1px solid rgba(0,0,0,.08); border-radius: 999px; background: rgba(255,255,255,.94); box-shadow: 0 8px 28px rgba(0,0,0,.1); backdrop-filter: blur(10px); color: #888; font-size: 10px; }
.si-cookie button { padding: 6px 17px; border: 0; border-radius: 999px; color: #fff; background: #080808; cursor: pointer; }
@media(max-width:768px){.si-cookie{bottom:18px;width:270px}}
</style>
