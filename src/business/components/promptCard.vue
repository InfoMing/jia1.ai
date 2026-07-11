<template>
  <article class="ji-prompt-card">
    <component
      :is="route ? routerLink : 'a'"
      class="ji-prompt-card__link"
      :to="route"
      :href="route ? undefined : prompt.url"
      :target="route ? undefined : '_blank'"
      :rel="route ? undefined : 'noopener noreferrer'"
      :aria-label="`查看${prompt.title}`"
    >
      <div class="ji-prompt-card__cover">
        <div class="ji-prompt-card__placeholder" :class="placeholderClass" aria-hidden="true">
          <strong>{{ prompt.title }}</strong>
          <i></i>
          <span>JIA1.AI</span>
        </div>
        <img
          v-if="image && !imageFailed"
          :class="{ 'is-loaded': imageLoaded }"
          :src="image"
          :alt="prompt.imageAlt || prompt.title"
          @load="imageLoaded = true"
          @error="imageFailed = true"
        />
        <span v-if="showHot" class="ji-prompt-card__hot">HOT</span>
      </div>

      <div class="ji-prompt-card__info">
        <h2>{{ prompt.title }}</h2>
        <div class="ji-prompt-card__summary">
          <img v-media-placeholder :src="summaryIcon" alt="" />
          <div>
            <p>{{ prompt.tags.join(',') }}</p>
            <span>{{ prompt.imageSubtitle }}</span>
          </div>
          <i aria-hidden="true"></i>
        </div>
        <div v-if="prompt.platforms.length" class="ji-prompt-card__platforms" aria-label="适用平台">
          <img
            v-for="platform in prompt.platforms"
            :key="platform"
            v-media-placeholder
            :src="platformOptions[platform]?.icon"
            :alt="platformOptions[platform]?.label || platform"
            :title="platformOptions[platform]?.label || platform"
          />
        </div>
      </div>
    </component>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink as routerLink } from 'vue-router'
import { platformOptions, promptSummaryIcon as summaryIcon } from '@/business/config/promptContent'
import { vMediaPlaceholder } from '@/business/directives/mediaPlaceholder'

const props = defineProps({
  prompt: { type: Object, required: true },
  image: { type: String, required: true },
  route: { type: Object, default: undefined },
  showHot: { type: Boolean, default: false }
})

// 图片加载前展示主题占位背景；资源不存在或加载失败时保留占位状态。
const imageLoaded = ref(false)
const imageFailed = ref(false)

// 根据标题稳定分配背景变体，让不同卡片各有变化，同时避免刷新后随机跳动。
const placeholderClass = computed(() => {
  const hash = [...props.prompt.title].reduce((total, character) => total + character.codePointAt(0), 0)
  return `is-style-${hash % 6 + 1}`
})
</script>

<style lang="scss" scoped>
.ji-prompt-card { padding: .833vw; display: flex; flex-direction: column; border: 1px solid #000; border-radius: 20px; background: #fff; }
.ji-prompt-card__link { height: 100%; display: flex; flex-direction: column; gap: .625vw; color: inherit; text-decoration: none; }
.ji-prompt-card__cover { position: relative; width: 100%; height: 11.979vw; overflow: hidden; border-radius: 20px; background: #f5ffe8; }
.ji-prompt-card__placeholder { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; color: #17320c; background: linear-gradient(145deg,#fafff3,#eaffd1); }
.ji-prompt-card__placeholder.is-style-1 { background: radial-gradient(circle at 18% 15%,rgba(201,255,133,.95),transparent 32%),radial-gradient(circle at 86% 82%,rgba(123,221,177,.38),transparent 35%),linear-gradient(145deg,#fafff3,#eaffd1); }
.ji-prompt-card__placeholder.is-style-2 { background: radial-gradient(ellipse at 82% 12%,rgba(157,236,196,.55),transparent 38%),linear-gradient(125deg,#edffd5,#fbfff6 62%,#d8ffc8); }
.ji-prompt-card__placeholder.is-style-3 { background: radial-gradient(circle at 50% 115%,rgba(122,221,174,.55),transparent 48%),linear-gradient(155deg,#fbfff7,#dcffad); }
.ji-prompt-card__placeholder.is-style-4 { background: radial-gradient(circle at 5% 85%,rgba(201,255,133,.9),transparent 36%),radial-gradient(circle at 95% 15%,rgba(181,246,219,.55),transparent 38%),#f8fff0; }
.ji-prompt-card__placeholder.is-style-5 { background: linear-gradient(115deg,rgba(201,255,133,.58),transparent 42%),radial-gradient(ellipse at 75% 72%,rgba(108,211,164,.42),transparent 45%),#fafff6; }
.ji-prompt-card__placeholder.is-style-6 { background: radial-gradient(ellipse at 50% 0,rgba(201,255,133,.82),transparent 44%),linear-gradient(180deg,#fbfff6,#e4ffd8); }
.ji-prompt-card__placeholder::before,.ji-prompt-card__placeholder::after { content: ''; position: absolute; border: 1px solid rgba(61,136,42,.16); border-radius: 50%; }
.ji-prompt-card__placeholder::before { width: 72%; aspect-ratio: 1; top: -48%; right: -22%; }
.ji-prompt-card__placeholder::after { width: 48%; aspect-ratio: 1; bottom: -32%; left: -13%; }
.ji-prompt-card__placeholder span { position: relative; z-index: 1; align-self: center; margin-top: .5vw; color: rgba(23,50,12,.34); font-family: Poppins,Inter,sans-serif; font-size: clamp(9px,.58vw,11px); font-weight: 500; letter-spacing: .18em; text-align: center; }
.ji-prompt-card__placeholder strong { position: relative; z-index: 1; max-width: 82%; margin-top: .45vw; color: #17320c; font-size: clamp(18px,1.25vw,24px); font-weight: 700; line-height: 1.35; letter-spacing: -.03em; text-align: center; }
.ji-prompt-card__placeholder i { position: relative; z-index: 1; width: 2.5vw; height: 3px; margin-top: .8vw; border-radius: 3px; background: #3d882a; }
.ji-prompt-card__cover img { position: relative; z-index: 1; width: 100%; height: 100%; display: block; opacity: 0; object-fit: cover; transition: opacity .25s ease,transform .6s ease; will-change: transform; }
.ji-prompt-card__cover img.is-loaded { opacity: 1; }
.ji-prompt-card:hover .ji-prompt-card__cover img { transform: scale(1.05); }
.ji-prompt-card__hot { position: absolute; z-index: 2; top: .625vw; left: .625vw; padding: .208vw .625vw; border-radius: 500px; color: #070707; background: #c9ff85; font-size: .833vw; font-weight: 700; }
.ji-prompt-card__info { flex: 1; display: flex; flex-direction: column; gap: .625vw; }
.ji-prompt-card h2 { height: 2.8em; margin: 0; display: -webkit-box; overflow: hidden; color: #070707; font-size: 1.042vw; font-weight: 400; line-height: 1.4; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.ji-prompt-card__summary { padding: .416vw 1.354vw .416vw .416vw; display: flex; align-items: center; border-radius: 10px; background: #f5f5f5; }
.ji-prompt-card__summary > img { width: 1.458vw; height: 1.667vw; margin-right: .833vw; object-fit: contain; }
.ji-prompt-card__summary > div { min-width: 0; max-width: 10.416vw; }
.ji-prompt-card__summary p,.ji-prompt-card__summary span { margin: 0; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ji-prompt-card__summary p { color: #070707; font-size: .833vw; }
.ji-prompt-card__summary span { color: #374228; font-size: .729vw; }
.ji-prompt-card__summary > i { width: 1.041vw; height: 1.041vw; margin-left: auto; flex: 0 0 auto; background: no-repeat center/contain url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M5 12H19M19 12L12 5M19 12L12 19' stroke='%23070707' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); transform: rotate(-45deg); transition: transform .3s ease; }
.ji-prompt-card:hover .ji-prompt-card__summary > i { transform: rotate(-45deg) translate(2px,-2px); }
.ji-prompt-card__platforms { min-height: 2.604vw; display: flex; align-items: flex-start; gap: 1.406vw; }
.ji-prompt-card__platforms img { width: 2.604vw; aspect-ratio: 1; display: block; border-radius: 50%; object-fit: cover; }

@media (max-width: 768px) {
  .ji-prompt-card { padding: 8px; border-radius: 10px; }
  .ji-prompt-card__link,.ji-prompt-card__info { gap: 6px; }
  .ji-prompt-card__cover { height: 220px; border-radius: 10px; }
  .ji-prompt-card__placeholder span { margin-top: 8px; font-size: 10px; }
  .ji-prompt-card__placeholder strong { margin-top: 5px; font-size: 28px; }
  .ji-prompt-card__placeholder i { width: 40px; margin-top: 12px; }
  .ji-prompt-card__hot { top: 10px; left: 10px; padding: 4px 12px; font-size: 14px; }
  .ji-prompt-card h2 { font-size: 16px; }
  .ji-prompt-card__summary { padding: 4px 13px 4px 4px; }
  .ji-prompt-card__summary > img { width: 28px; height: 32px; margin-right: 8px; }
  .ji-prompt-card__summary > div { max-width: calc(100% - 58px); }
  .ji-prompt-card__summary p { font-size: 14px; }
  .ji-prompt-card__summary span { font-size: 12px; }
  .ji-prompt-card__summary > i { width: 20px; height: 20px; }
  .ji-prompt-card__platforms { min-height: 40px; gap: 14px; }
  .ji-prompt-card__platforms img { width: 40px; }
}

@media (prefers-reduced-motion: reduce) {
  .ji-prompt-card__cover img,.ji-prompt-card__summary > i { transition: none; }
}
</style>
