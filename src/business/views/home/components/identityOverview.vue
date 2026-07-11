<template>
  <div class="ji-identity-overview">
    <section class="ji-role-section" aria-labelledby="role-section-title">
      <div class="ji-role-section__wrap">
        <header class="ji-identity-heading">
          <h2 id="role-section-title">我是谁？</h2>
          <p>无论您在哪个岗位，AIGC能力都将成为您职业发展的加速器</p>
        </header>

        <div class="ji-role-section__grid">
          <article v-for="item in audiences" :key="item.key" class="ji-role-card">
            <header>
              <span><img v-media-placeholder :src="item.icon" alt="" /></span>
              <h3>{{ item.title }}</h3>
            </header>
            <div class="ji-role-card__tags">
              <span v-for="tag in item.tags" :key="tag">{{ tag }}</span>
            </div>
            <ul>
              <li v-for="point in item.points" :key="point">
                <img v-media-placeholder :src="audienceCheck" alt="" />
                <p>{{ point }}</p>
              </li>
            </ul>
            <img v-media-placeholder class="ji-role-card__direction" :src="item.decor" alt="" />
          </article>
        </div>
      </div>
    </section>

    <section class="ji-capability-section" aria-labelledby="capability-section-title">
      <div class="ji-capability-section__wrap">
        <header class="ji-identity-heading">
          <h2 id="capability-section-title">我能为你提供什么？</h2>
          <p>首创 AI视觉规划师，通过专业培养路径，实现职业身份的华丽蜕变</p>
        </header>

        <div class="ji-capability-card">
          <h3>策略+视觉+营销三位一体的新一代品牌建设者</h3>
          <div class="ji-capability-card__body">
            <img v-media-placeholder class="ji-capability-card__visual" :src="assets.careerImage" alt="AI视觉规划师能力路径" />
            <div class="ji-capability-card__content">
              <h4>核心能力：</h4>
              <ul>
                <li v-for="point in careerPoints" :key="point">
                  <span class="ji-capability-card__check" aria-hidden="true"></span>
                  <p>{{ point }}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { homeAssets as assets, homeContent as content } from '@/business/config/homeContent'
import audienceCheck from '@/business/assets/home/icons/audienceCheck.svg'
import { vMediaPlaceholder } from '@/business/directives/mediaPlaceholder'

// 岗位文案与配置中的本地资源使用相同 key 合并，保持展示数据集中可维护。
const audienceCopy = {
  skill: { title: '技能岗（AI转型）', tags: ['平面设计', 'UI设计', '视觉设计', '创意设计'], points: ['熟悉AIGC运作模式，向上谋求新机会', '提升自身不可替代性', '实现收入水平的显著提升'] },
  creative: { title: '创意策划岗（横向探索）', tags: ['创意总监', '品牌策划', '内容策划', '营销专家'], points: ['熟悉AIGC运作模式，横向发展探索', '拓展创意策划的能力世界', '将AIGC融入创意工作流程'] },
  manager: { title: '管理岗（向下兼容）', tags: ['产品经理', '品牌主管', '店铺主管', '团队领导'], points: ['熟悉AIGC运作模式，向下兼容探索', '掌握AI设计落地可行性评估方案', '领导团队升级AIGC视觉产出效率'] }
}
const audiences = content.audiences.map(item => ({ ...item, ...audienceCopy[item.key] }))

// 第二部分沿用目标能力卡的五项内容顺序，便于与视觉路径图对应。
const careerPoints = ['用策略性思维，构建底层视觉路径', '通过AI工具打破平面/建模/视频的界限', '理解信息传播的本质，用营销思维反馈视觉迭代', '更强的学习力和适应性', '更开阔的创意思路，敢于打破常规']
</script>

<style lang="scss" scoped>
@use '@/business/styles/base/mixins' as *;
// 保持一屏展示的目标高度；超宽屏内容变高时允许容器自然撑开，避免覆盖下一栏目。
.ji-identity-overview { min-height: calc(100svh - 50px - 20px); }
.ji-role-section { padding: 2.083vw 0 4.166vw; }
.ji-role-section__wrap,.ji-capability-section__wrap { @include container; }
.ji-identity-heading { display: flex; flex-wrap: wrap; align-items: baseline; gap: .416vw 1.25vw; }
.ji-identity-heading h2 { margin: 0; flex: 0 0 auto; font-size: 1.667vw; font-weight: 700; }
.ji-identity-heading p { min-width: 0; margin: 0; font-size: .833vw; }
.ji-role-section__grid { margin-top: 1.562vw; display: grid; grid-template-columns: repeat(3,1fr); gap: 1.25vw; }
.ji-role-card { position: relative; padding: 1.666vw 1.302vw 2.083vw 1.666vw; overflow: hidden; border: 1px solid #000; border-radius: 20px; box-shadow: 0 0 .26vw rgba(0,0,0,.1); }
.ji-role-card::before { content: ''; position: absolute; top: 0; bottom: 0; left: 0; width: .312vw; background: var(--ji-theme-accent); }
.ji-role-card header { display: flex; align-items: center; }
.ji-role-card header > span { width: 2.187vw; height: 2.187vw; margin-right: .833vw; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: linear-gradient(180deg,rgb(var(--ji-theme-accent-rgb) / .7),var(--ji-theme-soft)); }
.ji-role-card header img { width: 1.354vw; filter: var(--ji-theme-image-filter); }
.ji-role-card h3 { margin: 0; font-size: 1.354vw; font-weight: 500; }
.ji-role-card__tags { margin-top: 1.041vw; display: flex; flex-wrap: wrap; justify-content: space-between; gap: .26vw; font-size: .938vw; }
.ji-role-card__tags span { padding: .468vw 1.041vw; display: block; border: 1px solid #000; border-radius: 60px; background: rgba(255,255,255,.31); text-align: center; }
.ji-role-card ul { margin: 1.822vw 0 0; padding: 0; list-style: none; font-size: clamp(14px,.833vw,16px); line-height: 1.45; }
.ji-role-card li { margin-top: .833vw; display: flex; align-items: center; color: #070707; }
.ji-role-card li img { width: .729vw; margin-right: .364vw; }
.ji-role-card li p { flex: 1; margin: 0; }
.ji-role-card__direction { position: absolute; right: 1.25vw; bottom: 1.562vw; width: 4.895vw; filter: var(--ji-theme-image-filter); }
.ji-capability-section { padding: 0 0 2.083vw; }
.ji-capability-card { margin-top: 1.25vw; padding: 1.25vw 1.5vw 1.5vw; border: 1px solid var(--ji-theme-accent); border-radius: 20px; background: linear-gradient(238deg,#fff -13.13%,var(--ji-theme-soft) 69.63%); }
.ji-capability-card > h3 { margin: 0 0 1.25vw; font-size: 1.042vw; font-weight: 400; }
.ji-capability-card__body { display: flex; flex-wrap: wrap; align-items: center; }
.ji-capability-card__visual { width: 30vw; margin: 0 3vw 0 4vw; filter: var(--ji-theme-image-filter); }
.ji-capability-card__content { flex: 1; padding-bottom: 0; }
.ji-capability-card h4 { margin: 0; font-size: 2vw; font-weight: 700; }
.ji-capability-card ul { margin: 0; padding: 0; list-style: none; font-size: clamp(15px,1vw,19px); line-height: 1.45; }
.ji-capability-card li { margin-top: .9vw; display: flex; align-items: center; color: #070707; }
.ji-capability-card__check { position: relative; width: 1vw; aspect-ratio: 1; margin-right: .52vw; flex: 0 0 auto; border: max(1px,.09vw) solid var(--ji-theme-primary); border-radius: 50%; }
.ji-capability-card__check::after { content: ''; position: absolute; top: 23%; left: 25%; width: 43%; height: 25%; border-bottom: max(1px,.09vw) solid var(--ji-theme-primary); border-left: max(1px,.09vw) solid var(--ji-theme-primary); transform: rotate(-45deg); }
.ji-capability-card li p { flex: 1; margin: 0; }
@media (max-width: 768px) {
  .ji-identity-overview { min-height: 0; }
  .ji-role-section { padding: 20px 0 40px; }
  .ji-capability-section { padding: 0 0 30px; }
  .ji-identity-heading { gap: 6px 14px; }
  .ji-identity-heading h2 { font-size: 20px; }
  .ji-identity-heading p { font-size: 14px; line-height: 1.5; }
  .ji-role-section__grid { margin-top: 15px; grid-template-columns: 1fr; gap: 12px; }
  .ji-role-card { padding: 16px 13px 20px 16px; border-radius: 10px; box-shadow: 0 0 5px rgba(0,0,0,.1); }
  .ji-role-card::before { width: 3px; }
  .ji-role-card header > span { width: 26px; height: 26px; margin-right: 8px; }
  .ji-role-card header img { width: 16px; }
  .ji-role-card h3 { font-size: 16px; }
  .ji-role-card__tags { margin-top: 10px; justify-content: flex-start; gap: 3px; font-size: 14px; }
  .ji-role-card__tags span { padding: 5px 10px; border-radius: 30px; }
  .ji-role-card ul { margin-top: 18px; font-size: 14px; }
  .ji-role-card li { margin-top: 8px; padding-right: 52px; }
  .ji-role-card li img { width: 14px; margin-right: 8px; }
  .ji-role-card__direction { right: 12px; bottom: 15px; width: 47px; }
  .ji-capability-card { margin-top: 14px; padding: 16px 18px 20px; border-radius: 10px; }
  .ji-capability-card > h3 { margin-bottom: 20px; font-size: 15px; }
  .ji-capability-card__body { display: block; }
  .ji-capability-card__visual { width: 75%; margin: 0 auto 16px; display: block; }
  .ji-capability-card__content { padding-bottom: 0; }
  .ji-capability-card h4 { font-size: 22px; }
  .ji-capability-card ul { margin-bottom: 0; font-size: 15px; }
  .ji-capability-card li { margin-top: 12px; }
  .ji-capability-card__check { width: 16px; margin-right: 8px; border-width: 1.5px; }
  .ji-capability-card__check::after { border-width: 0 0 1.5px 1.5px; }
}
</style>
