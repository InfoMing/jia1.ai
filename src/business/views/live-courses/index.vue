<template>
  <section class="si-view-page">
    <div v-if="course" class="si-live-page">
      <div>
        <span>{{ course.teacher }}</span>
        <h1>{{ course.title }}</h1>
        <ul><li v-for="feature in course.features" :key="feature">✓ {{ feature }}</li></ul>
        <strong>¥{{ course.price }} · {{ course.discount }}</strong>
        <el-button type="primary" size="large" round :loading="paying" @click="pay">模拟报名</el-button>
      </div>
      <div class="si-live-page__visual">LIVE<br /><b>AI</b></div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { businessApi } from '@/business/api'

const course = ref(null)
const paying = ref(false)

onMounted(async () => {
  try { course.value = await businessApi.getLiveCourse() } catch (error) { ElMessage.error(error.message) }
})

const pay = async () => {
  paying.value = true
  try {
    await businessApi.createPayment('live-course')
    ElMessage.success('报名成功，会员与课程权益已模拟开通')
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    paying.value = false
  }
}
</script>

<style lang="scss" scoped>
.si-view-page { min-height: 70vh; padding: clamp(32px,6vw,90px); background: #f5f7f1; }
.si-live-page { width: min(1080px,100%); min-height: 520px; margin: 0 auto; padding: clamp(28px,5vw,70px); display: grid; grid-template-columns: 1.25fr .75fr; gap: 50px; align-items: center; border-radius: 30px; color: #fff; background: radial-gradient(circle at 80% 10%,#315d40,#07100b 58%); }
.si-live-page span { color: #aaff00; }.si-live-page h1 { margin: 18px 0 28px; font-size: clamp(36px,5vw,66px); line-height: 1.1; }.si-live-page ul { display: grid; gap: 15px; }.si-live-page strong { display: block; margin: 34px 0 22px; font-size: 25px; }.si-live-page__visual { aspect-ratio: 1; display: grid; place-items: center; border: 1px solid rgba(170,255,0,.45); border-radius: 50%; text-align: center; font-size: 54px; }.si-live-page__visual b { font-size: 32px; }
@media(max-width:768px){.si-view-page{padding:20px 16px}.si-live-page{grid-template-columns:1fr;min-height:auto}.si-live-page__visual{display:none}}
</style>

