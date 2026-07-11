<template>
  <section class="ji-home-prompts" aria-labelledby="home-prompts-title">
    <div class="ji-home-prompts__wrap">
      <header class="ji-home-prompts__head">
        <h2 id="home-prompts-title"><i />AI提示词</h2>
        <routerLink :to="{ name: 'aiPrompts' }">更多提示词 &gt;</routerLink>
      </header>

      <div class="ji-home-prompts__list">
        <article v-for="prompt in prompts" :key="prompt.title" class="ji-home-prompt">
          <routerLink :to="{ name: 'aiPrompts' }" :aria-label="`查看${prompt.title}`">
            <div class="ji-home-prompt__cover">
              <img :src="prompt.cover" :alt="prompt.title" />
              <span>HOT</span>
            </div>
          </routerLink>

          <div class="ji-home-prompt__info">
            <h3>{{ prompt.title }}</h3>
            <div class="ji-home-prompt__summary">
              <img :src="summaryIcon" alt="" />
              <div>
                <p>{{ prompt.keywords }}</p>
                <span>{{ prompt.description }}</span>
              </div>
              <i aria-hidden="true" />
            </div>
            <div class="ji-home-prompt__tools" aria-label="适用工具">
              <img v-for="tool in prompt.tools" :key="tool" :src="tool" alt="" />
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink as routerLink } from 'vue-router'
import promptCover01 from '@/business/assets/aiPrompts/prompt01.webp'
import promptCover02 from '@/business/assets/aiPrompts/prompt02.webp'
import promptCover03 from '@/business/assets/aiPrompts/prompt03.webp'
import promptCover04 from '@/business/assets/aiPrompts/prompt04.webp'
import summaryIcon from '@/business/assets/aiPrompts/summaryIcon.png'
import toolChatGpt from '@/business/assets/aiPrompts/toolChatgpt.png'
import toolJimeng from '@/business/assets/aiPrompts/toolJimeng.png'
import toolFlow from '@/business/assets/aiPrompts/toolFlow.png'

// 首页仅展示四条代表性数据，点击后统一进入完整提示词页面。
const prompts = [
  { title: '结构化任务拆解', keywords: '目标拆解,执行步骤,风险识别,验收标准', description: '复杂任务清晰拆解', cover: promptCover01, tools: [toolChatGpt, toolJimeng, toolFlow] },
  { title: '专业内容润色', keywords: '内容润色,逻辑优化,正式表达,简洁改写', description: '让表达清晰自然', cover: promptCover02, tools: [toolChatGpt] },
  { title: '创意方案发散', keywords: '创意方向,视觉关键词,传播口号,场景构思', description: '打开创意新方向', cover: promptCover03, tools: [toolChatGpt] },
  { title: '电影感人物肖像', keywords: '人物肖像,侧逆光,真实质感,电影色调', description: '电影光影人物质感', cover: promptCover04, tools: [toolChatGpt, toolFlow, toolJimeng] }
]
</script>

<style lang="scss" scoped>
@use '@/business/styles/base/mixins' as *;
.ji-home-prompts { padding: 2.083vw 0 0; background: #fff; }
.ji-home-prompts__wrap { @include container; }
.ji-home-prompts__head { margin-bottom: 1.25vw; display: flex; align-items: center; justify-content: space-between; }
.ji-home-prompts__head h2 { margin: 0; display: flex; align-items: center; color: #070707; font-size: 1.667vw; font-weight: 700; }
.ji-home-prompts__head h2 i { width: 4px; height: 1.25vw; margin-right: 12px; border-radius: 2px; background: #c9ff85; }
.ji-home-prompts__head a { color: #696969; font-size: .833vw; text-decoration: none; transition: color .2s; }
.ji-home-prompts__head a:hover { color: #070707; }
.ji-home-prompts__list { width: 100%; display: grid; grid-template-columns: repeat(4,1fr); align-items: stretch; gap: 2.083vw; }
.ji-home-prompt { padding: .833vw; display: flex; flex-direction: column; gap: .625vw; border: 1px solid #000; border-radius: 20px; background: #fff; }
.ji-home-prompt > a { display: block; color: inherit; text-decoration: none; }
.ji-home-prompt__cover { position: relative; width: 100%; height: 11.979vw; overflow: hidden; border-radius: 22px; }
.ji-home-prompt__cover img { width: 100%; height: 100%; display: block; border-radius: 20px; object-fit: cover; transition: transform .6s ease; will-change: transform; }
.ji-home-prompt:hover .ji-home-prompt__cover img { transform: scale(1.05); }
.ji-home-prompt__cover span { position: absolute; top: .625vw; left: .625vw; padding: .208vw .625vw; border-radius: 500px; color: #070707; background: #c9ff85; font-size: .833vw; font-weight: 700; }
.ji-home-prompt__info { display: flex; flex-direction: column; gap: .625vw; }
.ji-home-prompt__info h3 { height: 2.8em; margin: 0; display: -webkit-box; overflow: hidden; color: #070707; font-size: 1.042vw; font-weight: 400; line-height: 1.4; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.ji-home-prompt__summary { padding: .416vw 1.354vw .416vw .416vw; display: flex; align-items: center; border-radius: 10px; background: #faf9fb; }
.ji-home-prompt__summary > img { width: 1.458vw; height: 1.667vw; margin-right: .833vw; object-fit: contain; }
.ji-home-prompt__summary > div { min-width: 0; max-width: 10.416vw; }
.ji-home-prompt__summary p,.ji-home-prompt__summary span { margin: 0; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ji-home-prompt__summary p { color: #070707; font-size: .833vw; }
.ji-home-prompt__summary span { color: #696969; font-size: .729vw; }
.ji-home-prompt__summary > i { width: 1.041vw; height: 1.041vw; margin-left: auto; flex: 0 0 auto; background: no-repeat center/contain url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M5 12H19M19 12L12 5M19 12L12 19' stroke='%23070707' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); transform: rotate(-45deg); }
.ji-home-prompt__tools { min-height: 2.604vw; display: grid; grid-template-columns: repeat(5,1fr); align-items: start; gap: 1.406vw; }
.ji-home-prompt__tools img { width: 2.604vw; aspect-ratio: 1; display: block; border-radius: 50%; object-fit: cover; }
@media (max-width: 768px) {
  .ji-home-prompts { padding-top: 24px; }
  .ji-home-prompts__head { margin-bottom: 14px; }
  .ji-home-prompts__head h2 { font-size: 20px; }
  .ji-home-prompts__head h2 i { height: 16px; margin-right: 8px; }
  .ji-home-prompts__head a { font-size: 13px; }
  .ji-home-prompts__list { grid-template-columns: 1fr; gap: 20px; }
  .ji-home-prompt { padding: 8px; gap: 6px; border-radius: 10px; }
  .ji-home-prompt__cover { height: 220px; border-radius: 11px; }
  .ji-home-prompt__cover img { border-radius: 10px; }
  .ji-home-prompt__cover span { top: 10px; left: 10px; padding: 4px 12px; font-size: 14px; }
  .ji-home-prompt__info { gap: 6px; }
  .ji-home-prompt__info h3 { font-size: 16px; }
  .ji-home-prompt__summary { padding: 4px 13px 4px 4px; border-radius: 10px; }
  .ji-home-prompt__summary > img { width: 28px; height: 32px; margin-right: 8px; }
  .ji-home-prompt__summary > div { max-width: 100px; }
  .ji-home-prompt__summary p { font-size: 14px; }
  .ji-home-prompt__summary span { font-size: 12px; }
  .ji-home-prompt__summary > i { width: 20px; height: 20px; }
  .ji-home-prompt__tools { min-height: 40px; grid-template-columns: repeat(7,1fr); gap: 14px; }
  .ji-home-prompt__tools img { width: 40px; }
}
@media (prefers-reduced-motion: reduce) {
  .ji-home-prompt__cover img,.ji-home-prompts__head a { transition: none; }
}
</style>
