<template>
  <main class="ji-prompts">
    <section class="ji-prompts__content" aria-labelledby="prompts-title">
      <header class="ji-prompts__heading">
        <div>
          <h1 id="prompts-title">AI提示词</h1>
          <p>精选 AI 创作提示词与灵感案例，点击卡片即可查看完整内容</p>
        </div>
        <communityEntry />
      </header>
    </section>

    <section class="ji-prompts__toolbar" aria-label="AI 提示词筛选">
      <div class="ji-prompts__mode" aria-label="内容模式">
        <button :class="{ 'is-active': activeMode === 'learning' }" type="button" @click="switchMode('learning')">学习模式</button>
        <i></i>
        <button :class="{ 'is-active': activeMode === 'inspiration' }" type="button" @click="switchMode('inspiration')">灵感模式</button>
      </div>

      <nav class="ji-prompts__filters" aria-label="提示词分类">
        <button
          v-for="category in categories"
          :key="category"
          :class="{ 'is-active': activeCategory === category }"
          type="button"
          @click="activeCategory = category"
        >
          {{ category }}
        </button>
      </nav>

      <label class="ji-prompts__search">
        <input v-model.trim="keyword" type="search" placeholder="搜索提示词" />
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path></svg>
      </label>
    </section>

    <section class="ji-prompts__content">
      <div v-if="visiblePrompts.length" class="ji-prompts__grid">
        <promptCard
          v-for="prompt in visiblePrompts"
          :key="prompt.title"
          :prompt="prompt"
          :image="resolvePromptImage(prompt.image)"
        />
      </div>
      <p v-else class="ji-prompts__empty">没有找到相关提示词</p>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import promptCard from '@/business/components/promptCard.vue'
import communityEntry from '@/business/components/communityEntry.vue'
import { promptItems as prompts, resolvePromptImage } from '@/business/config/promptContent'

const modeCategories = {
  learning: ['通用', '营销'],
  inspiration: ['图像', '视频']
}
const activeMode = ref('learning')
const activeCategory = ref('全部')
const keyword = ref('')
const categories = computed(() => ['全部', ...modeCategories[activeMode.value]])

// 模式切换后回到当前模式的全部内容，避免保留另一个模式下不可用的分类。
const switchMode = mode => {
  activeMode.value = mode
  activeCategory.value = '全部'
}

// 分类与关键词同时生效，Markdown 更新后无需修改页面逻辑。
const visiblePrompts = computed(() => prompts.filter(prompt => {
  const matchesMode = modeCategories[activeMode.value].includes(prompt.category)
  const matchesCategory = activeCategory.value === '全部' || prompt.category === activeCategory.value
  const searchText = [prompt.title, prompt.imageSubtitle, prompt.category, ...(prompt.tags || [])].join(' ').toLowerCase()
  return matchesMode && matchesCategory && searchText.includes(keyword.value.toLowerCase())
}))
</script>

<style lang="scss" scoped>
@use '@/business/styles/base/mixins' as *;

.ji-prompts { min-height: calc(100svh - 50px); padding: 0; background: #fff; }
.ji-prompts__toolbar { @include container; position: relative; min-height: 40px; margin-top: clamp(30px, 3.125vw, 60px); display: flex; align-items: center; justify-content: center; }
.ji-prompts__mode { position: absolute; left: 0; padding: 6px; display: flex; align-items: center; gap: 9px; border-radius: 28px; background: #fff; box-shadow: 0 0 10px rgba(0,0,0,.1); font-size: 14px; }
.ji-prompts__mode button { padding: 3px 8px; border: 0; border-radius: 20px; color: #263119; background: transparent; font: inherit; cursor: pointer; transition: background-color .2s ease,transform .2s ease; }
.ji-prompts__mode button.is-active { color: #070707; background: #c9ff85; }
.ji-prompts__mode button:active { transform: scale(.96); }
.ji-prompts__mode i { width: 1px; height: 15px; background: #dfffb7; }
.ji-prompts__filters { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
.ji-prompts__filters button { height: 40px; padding: 0 23px; border: 1px solid #dfffb7; border-radius: 100px; color: #070707; background: #f7ffec; font-size: 14px; cursor: pointer; transition: background-color .3s ease,transform .3s ease; }
.ji-prompts__filters button:hover,.ji-prompts__filters button.is-active { background: #c9ff85; }
.ji-prompts__filters button:active { transform: scale(.96); }
.ji-prompts__search { position: absolute; right: 0; padding: 12px 18px; display: flex; align-items: center; border-radius: 28px; background: #fff; box-shadow: 0 3px 16px 2px rgba(0,0,0,.05); }
.ji-prompts__search input { width: 180px; border: 0; outline: 0; color: #070707; background: transparent; font-size: 14px; }
.ji-prompts__search svg { width: 20px; fill: none; stroke: #070707; stroke-linecap: round; stroke-width: 1.7; }
.ji-prompts__content { @include container; }
.ji-prompts__heading { display: flex; align-items: center; justify-content: space-between; gap: 32px; }
.ji-prompts__heading h1 { margin: 0; font-size: clamp(28px, 2.08vw, 40px); line-height: 1.2; }
.ji-prompts__heading p { margin: 8px 0 0; color: #374228; font-size: 14px; }
.ji-prompts__grid { margin-top: clamp(30px, 2.383vw, 46px); display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: clamp(20px, 2.083vw, 40px); align-items: stretch; }
.ji-prompts__empty { padding: 100px 0; color: #52613e; text-align: center; }

@media (max-width: 1099px) {
  .ji-prompts__toolbar { padding-top: 62px; }
  .ji-prompts__mode { top: 0; }
  .ji-prompts__search { top: 0; }
  .ji-prompts__grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
}

@media (max-width: 600px) {
  .ji-prompts { padding: 0; }
  .ji-prompts__toolbar { padding-top: 58px; display: block; overflow: hidden; }
  .ji-prompts__mode { top: 0; font-size: 12px; }
  .ji-prompts__search { top: 0; padding: 9px 12px; }
  .ji-prompts__search input { width: 102px; font-size: 12px; }
  .ji-prompts__search svg { width: 16px; }
  .ji-prompts__filters { padding-bottom: 4px; justify-content: flex-start; flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; }
  .ji-prompts__filters::-webkit-scrollbar { display: none; }
  .ji-prompts__filters button { height: 38px; padding: 3px 15px; flex: 0 0 auto; }
  .ji-prompts__heading { display: block; }
  .ji-prompts__heading h1 { font-size: 28px; }
  .ji-prompts__heading p { margin-top: 8px; line-height: 1.6; }
  .ji-prompts__heading :deep(.ji-community-entry) { margin-top: 20px; }
  .ji-prompts__grid { grid-template-columns: 1fr; gap: 20px; }
}
</style>
