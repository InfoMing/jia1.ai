<template>
  <section class="ji-brand-section" aria-labelledby="brand-film-title">
    <div class="ji-brand-section__wrap">
      <div class="ji-brand-section__main">
        <div class="ji-brand-section__background">
          <img v-media-placeholder :src="assets.showcase" alt="" />
        </div>

        <div class="ji-brand-section__content">
          <div class="ji-brand-section__copy">
            <div class="ji-brand-section__mark">Jia1.ai</div>
            <h2 id="brand-film-title">我们追寻的光</h2>
            <p>和佳一AI一起，解锁新时代AI创作潜力</p>

            <div class="ji-brand-section__actions">
              <button class="is-primary" type="button" @pointermove="handleMagneticMove" @pointerleave="resetMagnetic" @click="emit('video', 'brand')">
                <span class="ji-brand-section__button-content">品牌宣传片
                  <svg viewBox="0 0 18 18" aria-hidden="true">
                    <path d="M13.8359 2.99219a.629.629 0 1 0 1.2578 0 .629.629 0 0 0-1.2578 0Z" />
                    <path d="M6.865 12.02c.116 0 .225-.032.317-.088l4.513-2.63a.63.63 0 0 0 .362-.57.628.628 0 0 0-.313-.543l-4.412-2.57a.618.618 0 0 0-1.088.414l.004 5.293a.616.616 0 0 0-.004.067c0 .345.28.627.621.627Z" />
                    <path d="M16.514 4.729a.633.633 0 0 0-.565-.348.628.628 0 0 0-.54.95 7.45 7.45 0 0 1 .821 3.413 7.486 7.486 0 1 1-4.095-6.672.631.631 0 0 0 .562-1.129A8.744 8.744 0 1 0 17.488 8.744a8.7 8.7 0 0 0-.974-4.015Z" />
                  </svg>
                </span>
              </button>
              <button type="button" @pointermove="handleMagneticMove" @pointerleave="resetMagnetic" @click="emit('video', 'platform')">
                <span class="ji-brand-section__button-content">平台介绍
                  <svg viewBox="0 0 18 18" aria-hidden="true">
                    <path d="M13.8359 2.99219a.629.629 0 1 0 1.2578 0 .629.629 0 0 0-1.2578 0Z" />
                    <path d="M6.865 12.02c.116 0 .225-.032.317-.088l4.513-2.63a.63.63 0 0 0 .362-.57.628.628 0 0 0-.313-.543l-4.412-2.57a.618.618 0 0 0-1.088.414l.004 5.293a.616.616 0 0 0-.004.067c0 .345.28.627.621.627Z" />
                    <path d="M16.514 4.729a.633.633 0 0 0-.565-.348.628.628 0 0 0-.54.95 7.45 7.45 0 0 1 .821 3.413 7.486 7.486 0 1 1-4.095-6.672.631.631 0 0 0 .562-1.129A8.744 8.744 0 1 0 17.488 8.744a8.7 8.7 0 0 0-.974-4.015Z" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { homeAssets as assets } from '@/business/config/homeContent'
import { vMediaPlaceholder } from '@/business/directives/mediaPlaceholder'

// 两个入口暂时共用首页媒体视频，由父页面统一打开公共视频弹层。
const emit = defineEmits(['video'])

// 复刻目标按钮的磁吸交互：按钮与内部文字使用不同强度跟随指针。
function handleMagneticMove(event) {
  if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const button = event.currentTarget
  const rect = button.getBoundingClientRect()
  const horizontalRatio = (event.clientX - rect.left) / rect.width - .5
  const verticalRatio = (event.clientY - rect.top) / rect.height - .5
  button.style.setProperty('--button-x', `${horizontalRatio * 25}px`)
  button.style.setProperty('--button-y', `${verticalRatio * 25}px`)
  button.style.setProperty('--content-x', `${horizontalRatio * 15}px`)
  button.style.setProperty('--content-y', `${verticalRatio * 15}px`)
}

// 指针离开后清空偏移量，按钮和文字平滑回到原位。
function resetMagnetic(event) {
  const button = event.currentTarget
  button.style.setProperty('--button-x', '0px')
  button.style.setProperty('--button-y', '0px')
  button.style.setProperty('--content-x', '0px')
  button.style.setProperty('--content-y', '0px')
}
</script>

<style lang="scss" scoped>
@use '@/business/styles/base/mixins' as *;
.ji-brand-section { padding: 6.25vw 0; }
.ji-brand-section__wrap { @include container; }
.ji-brand-section__main { position: relative; overflow: hidden; border-radius: 10px; }
.ji-brand-section__background { width: 100%; aspect-ratio: 1720 / 840; }
.ji-brand-section__background img { width: 100%; height: 100%; display: block; object-fit: cover; }
.ji-brand-section__content { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #fff; text-align: center; }
.ji-brand-section__copy { width: 100%; }
.ji-brand-section__mark { width: 12.083vw; height: 2.395vw; margin: 0 auto 3.125vw; display: inline-flex; align-items: center; justify-content: center; border-radius: 96px; color: #fff; background: rgba(255,255,255,.2); font-family: Poppins,Inter,sans-serif; font-size: 1.5vw; font-weight: 600; letter-spacing: .16em; }
.ji-brand-section h2 { margin: 0; font-size: 4.687vw; font-weight: 400; line-height: 1.15; }
.ji-brand-section p { margin: .833vw 0 3.125vw; font-size: 1.875vw; line-height: 1.35; }
.ji-brand-section__actions { display: flex; align-items: center; justify-content: center; }
.ji-brand-section button { --button-x: 0px; --button-y: 0px; --content-x: 0px; --content-y: 0px; min-width: 12.291vw; margin: 0 .416vw; padding: .833vw 2.604vw; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #000; border-radius: 120px; color: #000; background: rgba(255,255,255,.3); font-size: 1.042vw; cursor: pointer; transform: translate3d(var(--button-x),var(--button-y),0); transition: transform .28s cubic-bezier(.22,.8,.24,1); will-change: transform; }
.ji-brand-section button.is-primary { border-color: var(--ji-theme-accent); background: var(--ji-theme-accent); }
.ji-brand-section__button-content { position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 6px; transform: translate3d(var(--content-x),var(--content-y),0); transition: transform .22s cubic-bezier(.22,.8,.24,1); will-change: transform; }
.ji-brand-section button svg { width: 1.146vw; height: 1.146vw; flex: 0 0 auto; fill: currentColor; }
.ji-brand-section button:active { transform: translate3d(var(--button-x),var(--button-y),0) scale(.98); }
@media (max-width: 768px) {
  .ji-brand-section { padding: 60px 0; }
  .ji-brand-section__main { border-radius: 10px; }
  .ji-brand-section__background,.ji-brand-section__background img { height: 400px; }
  .ji-brand-section__background img { object-fit: cover; }
  .ji-brand-section__mark { width: 116px; height: 23px; margin-bottom: 30px; border-radius: 48px; font-size: 10px; }
  .ji-brand-section h2 { font-size: 38px; }
  .ji-brand-section p { margin: 8px 5% 30px; font-size: 18px; }
  .ji-brand-section button { min-width: 118px; margin: 0 4px; padding: 8px 25px; border-radius: 60px; font-size: 16px; }
  .ji-brand-section button svg { width: 16px; height: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .ji-brand-section button,.ji-brand-section__button-content { transition: none; transform: none; }
}
</style>
