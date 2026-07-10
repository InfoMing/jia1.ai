<template>
  <section class="si-career-section">
    <h2>成为谁？</h2><p>首创 AI视觉规划师，通过专业培养路径，实现职业身份的华丽蜕变</p>
    <div class="si-career"><h3>策略+视觉+营销三位一体的新一代品牌建设者</h3><div class="si-career__body"><img :src="assets.careerImage" alt="AI视觉规划师" /><div><h4>核心能力：</h4><ul><li v-for="point in careerPoints" :key="point"><b>✓</b>{{ point }}</li></ul></div></div></div>
  </section>
</template>
<script setup>
import { homeAssets as assets } from '@/business/config/home-content'
const careerPoints = ['用策略性思维，构建底层视觉路径', '通过AI工具打破平面/建模/视频的界限', '理解信息传播的本质，用营销思维反馈视觉迭代', '更强的学习力和适应性', '更开阔的创意思路，敢于打破常规']
</script>
<style lang="scss" scoped>
@use '@/business/styles/base/mixins' as *;
.si-career-section { @include container; padding-top: 112px; }.si-career-section > h2 { font-size: 34px; }.si-career-section > p { margin-top: 12px; color: #747474; font-size: 15px; }.si-career { margin-top: 34px; padding: 48px; border-radius: 28px; background: linear-gradient(135deg,#edffc6,#f9fff0 52%,#dffef9); }.si-career > h3 { font-size: 18px; }.si-career__body { margin-top: 30px; display: grid; grid-template-columns: .85fr 1.15fr; gap: 70px; align-items: center; }.si-career__body > img { width: 100%; max-height: 470px; object-fit: contain; }.si-career h4 { font-size: 38px; }.si-career ul { display: grid; gap: 18px; margin-top: 28px; }.si-career li { display: flex; gap: 12px; font-size: 18px; line-height: 1.5; }.si-career li b { color: #70ad00; }
@media (max-width: 768px) { .si-career-section { width: calc(100% - 32px); padding-top: 70px; }.si-career-section > h2 { font-size: 28px; }.si-career { padding: 26px 20px; }.si-career__body { grid-template-columns: 1fr; gap: 25px; }.si-career__body > img { max-height: 280px; }.si-career h4 { font-size: 28px; }.si-career li { font-size: 14px; } }
</style>
