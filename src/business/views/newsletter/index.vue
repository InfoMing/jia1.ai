<template>
  <section class="si-newsletter-page">
    <div v-if="newsletter" class="si-newsletter-page__card">
      <div><span>SUPER-I WEEKLY</span><h1>{{ newsletter.title }}</h1><p>{{ newsletter.description }}</p><ul><li v-for="issue in newsletter.issues" :key="issue">{{ issue }} <b>↗</b></li></ul></div>
      <img :src="assets.communityQr" alt="刺猬周报二维码" />
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { homeAssets as assets } from '@/business/config/home-content'
import { businessApi } from '@/business/api'

const newsletter = ref(null)
onMounted(async () => {
  try { newsletter.value = await businessApi.getNewsletter() } catch (error) { ElMessage.error(error.message) }
})
</script>

<style lang="scss" scoped>
.si-newsletter-page { min-height: 70vh; padding: clamp(32px,6vw,90px); background: linear-gradient(135deg,#efffc9,#dcfff4); }.si-newsletter-page__card { width: min(980px,100%); margin: 0 auto; padding: clamp(30px,6vw,80px); display: grid; grid-template-columns: 1fr 230px; gap: 60px; align-items: center; border-radius: 30px; background: rgba(255,255,255,.86); box-shadow: 0 20px 60px rgba(55,100,40,.1); }.si-newsletter-page span { color:#5f8d00;font-weight:800;letter-spacing:2px}.si-newsletter-page h1{margin:15px 0;font-size:clamp(44px,6vw,78px)}.si-newsletter-page p{color:#666;line-height:1.8}.si-newsletter-page ul{margin-top:30px;display:grid;gap:12px}.si-newsletter-page li{padding:15px 0;display:flex;justify-content:space-between;border-bottom:1px solid #ddd}.si-newsletter-page img{width:230px;border-radius:18px}
@media(max-width:768px){.si-newsletter-page{padding:20px 16px}.si-newsletter-page__card{grid-template-columns:1fr}.si-newsletter-page img{width:180px}}
</style>

