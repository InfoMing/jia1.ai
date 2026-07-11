<template>
  <section class="ji-home-prompts" aria-labelledby="home-prompts-title">
    <div class="ji-home-prompts__wrap">
      <header class="ji-home-prompts__head">
        <h2 id="home-prompts-title"><i></i>AI提示词</h2>
        <routerLink :to="{ name: 'aiPrompts' }">更多提示词 &gt;</routerLink>
      </header>

      <div class="ji-home-prompts__list">
        <promptCard
          v-for="prompt in prompts"
          :key="prompt.title"
          :prompt="prompt"
          :image="resolvePromptImage(prompt.image)"
          :route="{ name: 'aiPrompts' }"
          show-hot
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink as routerLink } from 'vue-router'
import promptCard from '@/business/components/promptCard.vue'
import { promptItems, resolvePromptImage } from '@/business/config/promptContent'

// 首页与完整列表共用 Markdown 数据，仅截取前四条代表性内容。
const prompts = promptItems.slice(0, 4)
</script>

<style lang="scss" scoped>
@use '@/business/styles/base/mixins' as *;
.ji-home-prompts { padding: 2.083vw 0 0; background: #fff; }
.ji-home-prompts__wrap { @include container; }
.ji-home-prompts__head { margin-bottom: 1.25vw; display: flex; align-items: center; justify-content: space-between; }
.ji-home-prompts__head h2 { margin: 0; display: flex; align-items: center; color: #070707; font-size: 1.667vw; font-weight: 700; }
.ji-home-prompts__head h2 i { width: 4px; height: 1.25vw; margin-right: 12px; border-radius: 2px; background: #c9ff85; }
.ji-home-prompts__head a { color: #52613e; font-size: .833vw; text-decoration: none; transition: color .2s; }
.ji-home-prompts__head a:hover { color: #070707; }
.ji-home-prompts__list { width: 100%; display: grid; grid-template-columns: repeat(4,1fr); align-items: stretch; gap: 2.083vw; }
@media (max-width: 768px) {
  .ji-home-prompts { padding-top: 24px; }
  .ji-home-prompts__head { margin-bottom: 14px; }
  .ji-home-prompts__head h2 { font-size: 20px; }
  .ji-home-prompts__head h2 i { height: 16px; margin-right: 8px; }
  .ji-home-prompts__head a { font-size: 13px; }
  .ji-home-prompts__list { grid-template-columns: 1fr; gap: 20px; }
}
</style>
