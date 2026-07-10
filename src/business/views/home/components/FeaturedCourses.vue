<template>
  <section class="si-section si-courses">
    <div class="si-section__heading"><h2><i />精选课程</h2><RouterLink :to="{ name: 'Tutorials' }">更多课程 &gt;</RouterLink></div>
    <div class="si-courses__grid">
      <RouterLink v-for="course in courses" :key="course.id" :to="{ name: 'CourseDetail', params: { id: course.id } }" class="si-course">
        <div class="si-course__cover"><img :src="course.image" :alt="course.title" /><b>HOT</b></div>
        <h3>{{ course.title }}</h3>
        <div class="si-course__meta"><span>✦</span><div><p>{{ course.tag }}</p><small>AI · AIGC · Creative workflow</small></div><i>›</i></div>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { RouterLink } from 'vue-router'
import { businessApi } from '@/business/api'

const courses = ref([])
onMounted(async () => {
  try { courses.value = await businessApi.getCourses() } catch (error) { ElMessage.error(error.message) }
})
</script>

<style lang="scss" scoped>
@use '@/business/styles/base/tokens' as *; @use '@/business/styles/base/mixins' as *;
.si-section { @include container; padding: 46px 0 0; }.si-section__heading { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }.si-section__heading h2 { display: flex; align-items: center; font-size: 28px; }.si-section__heading h2 i { width: 4px; height: 24px; margin-right: 12px; background: $mint; border-radius: 4px; }.si-section__heading a { color: $muted; font-size: 14px; }.si-courses__grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }.si-course { min-width: 0; cursor: pointer; }.si-course__cover { position: relative; width: 100%; aspect-ratio: 1.42; overflow: hidden; background: #f0f0ed; border-radius: 13px; }.si-course img { width: 100%; height: 100%; object-fit: cover; transition: transform .45s; }.si-course:hover img { transform: scale(1.045); }.si-course__cover b { position: absolute; top: 10px; right: 10px; padding: 5px 8px; color: #fff; background: #ff4d31; border-radius: 6px; font-size: 10px; }.si-course h3 { margin-top: 14px; min-height: 50px; font-size: 16px; line-height: 1.55; @include clamp(2); }.si-course__meta { margin-top: 10px; display: grid; grid-template-columns: 28px 1fr 18px; align-items: center; color: #777; }.si-course__meta > span { width: 24px; height: 24px; display: grid; place-items: center; background: #efffcf; border-radius: 50%; }.si-course__meta p { color: #333; font-size: 12px; }.si-course__meta small { display: block; margin-top: 2px; font-size: 9px; }.si-course__meta i { font-size: 24px; font-style: normal; }
@media (max-width: 1099px) { .si-courses__grid { grid-template-columns: repeat(2,1fr); } }
@media (max-width: 768px) { .si-section { width: calc(100% - 32px); padding-top: 28px; }.si-section__heading h2 { font-size: 21px; }.si-courses__grid { grid-template-columns: 1fr; gap: 28px; }.si-course h3 { min-height: auto; }.si-course__cover { aspect-ratio: 1.6; } }
</style>

