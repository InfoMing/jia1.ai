<template>
  <section class="si-content-section">
    <h2>适合谁？</h2><p class="si-content-section__lead">无论您在哪个岗位，AIGC能力都将成为您职业发展的加速器</p>
    <div class="si-audience-grid">
      <article v-for="item in audiences" :key="item.key" class="si-audience-card">
        <header><img :src="item.icon" alt="" /><h3>{{ item.title }}</h3></header>
        <div class="si-audience-card__tags"><span v-for="tag in item.tags" :key="tag">{{ tag }}</span></div>
        <ul><li v-for="point in item.points" :key="point"><b>✓</b>{{ point }}</li></ul>
        <img class="si-audience-card__decor" :src="item.decor" alt="" />
      </article>
    </div>
  </section>
</template>
<script setup>
import { homeContent as content } from '@/business/config/home-content'
const copy = {
  skill: { title: '技能岗（AI转型）', tags: ['平面设计', 'UI设计', '视觉设计', '创意设计'], points: ['熟悉AIGC运作模式，向上谋求新机会', '提升自身不可替代性', '实现收入水平的显著提升'] },
  creative: { title: '创意策划岗（横向探索）', tags: ['创意总监', '品牌策划', '内容策划', '营销专家'], points: ['熟悉AIGC运作模式，横向发展探索', '拓宽创意策划的能力边界', '将AIGC融入创意工作流程'] },
  manager: { title: '管理岗（向下兼容）', tags: ['产品经理', '品牌主管', '店铺主管', '团队领导'], points: ['熟悉AIGC运作模式，向下兼容探索', '掌握AI设计落地可行性评估方案', '领导团队升级AIGC视觉产出效率'] }
}
const audiences = content.audiences.map(item => ({ ...item, ...copy[item.key] }))
</script>
<style lang="scss" scoped>
@use '@/business/styles/base/mixins' as *;
.si-content-section { @include container; padding-top: 112px; }.si-content-section > h2 { font-size: 34px; }.si-content-section__lead { margin-top: 12px; color: #747474; font-size: 15px; }
.si-audience-grid { margin-top: 34px; display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }.si-audience-card { position: relative; min-height: 355px; padding: 30px; overflow: hidden; border: 1px solid rgba(0,0,0,.08); border-radius: 22px; background: #fafafa; }.si-audience-card header { display: flex; gap: 12px; align-items: center; }.si-audience-card header img { width: 32px; height: 32px; }.si-audience-card h3 { font-size: 19px; }
.si-audience-card__tags { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 25px; }.si-audience-card__tags span { padding: 7px 10px; border-radius: 8px; background: #eaffbc; font-size: 12px; }
.si-audience-card ul { margin-top: 25px; display: grid; gap: 15px; }.si-audience-card li { display: flex; gap: 9px; font-size: 13px; line-height: 1.5; }.si-audience-card li b { color: #77b800; }.si-audience-card__decor { position: absolute; width: 86px; right: -12px; bottom: -12px; opacity: .8; }
@media (max-width: 900px) { .si-audience-grid { grid-template-columns: 1fr; }.si-audience-card { min-height: 300px; } }
@media (max-width: 768px) { .si-content-section { width: calc(100% - 32px); padding-top: 70px; }.si-content-section > h2 { font-size: 28px; }.si-audience-card { padding: 24px; } }
</style>
