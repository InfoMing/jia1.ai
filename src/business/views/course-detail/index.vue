<template>
  <section class="si-course-detail">
    <article v-if="course"><img :src="course.image" :alt="course.title" /><div><span>{{ course.tag }}</span><h1>{{ course.title }}</h1><p>{{ course.summary }}</p><el-button type="primary" round @click="ensureLogin">开始学习</el-button></div></article>
    <el-empty v-else-if="loaded" description="课程不存在" />
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElButton, ElEmpty, ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import { businessApi } from '@/business/api'
import { useSiteShell } from '@/business/composables/useSiteShell'

const route = useRoute()
const siteShell = useSiteShell()
const course = ref(null)
const loaded = ref(false)

onMounted(async () => {
  try { course.value = await businessApi.getCourse(route.params.id) } catch (error) { ElMessage.error(error.message) } finally { loaded.value = true }
})

const ensureLogin = () => {
  if (!siteShell.session.value) siteShell.openLogin(route.fullPath)
  else ElMessage.success('课程学习状态已模拟开启')
}
</script>

<style lang="scss" scoped>
.si-course-detail{min-height:70vh;padding:clamp(32px,6vw,90px);background:#f5f7f1}.si-course-detail article{width:min(1050px,100%);margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:55px;align-items:center}.si-course-detail article>img{width:100%;border-radius:24px}.si-course-detail span{color:#6d9a00;font-weight:700}.si-course-detail h1{margin:18px 0;font-size:clamp(32px,4vw,54px);line-height:1.3}.si-course-detail p{margin-bottom:30px;color:#666;line-height:1.9}.si-course-detail :deep(.el-button--primary){--el-button-bg-color:#080808;--el-button-border-color:#080808}
@media(max-width:768px){.si-course-detail{padding:20px 16px}.si-course-detail article{grid-template-columns:1fr}}
</style>

