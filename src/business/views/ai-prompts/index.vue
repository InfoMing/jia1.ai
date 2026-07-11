<template>
  <section class="si-prompts si-page">
    <header class="si-prompts__hero">
      <span>AI PROMPT LIBRARY</span>
      <h1>AI提示词</h1>
      <p>从灵感到成品，选择场景并复制提示词，快速开始你的 AI 创作。</p>
    </header>

    <div class="si-prompts__content">
      <nav class="si-prompts__filters" aria-label="提示词分类">
        <button
          v-for="category in categories"
          :key="category.key"
          :class="{ 'is-active': activeCategory === category.key }"
          type="button"
          @click="activeCategory = category.key"
        >
          {{ category.label }}
        </button>
      </nav>

      <div class="si-prompts__grid">
        <article v-for="prompt in visiblePrompts" :key="prompt.title" class="si-prompt-card">
          <div><span>{{ prompt.categoryLabel }}</span><b>{{ prompt.index }}</b></div>
          <h2>{{ prompt.title }}</h2>
          <p>{{ prompt.content }}</p>
          <button type="button" @click="copyPrompt(prompt.content)">复制提示词 <i>↗</i></button>
        </article>
      </div>
    </div>
    <div v-if="toast" class="si-prompts__toast" role="status" aria-live="polite">{{ toast }}</div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'

const categories = [
  { key: 'general', label: '通用' },
  { key: 'image', label: '图像' },
  { key: 'video', label: '视频' },
  { key: 'marketing', label: '营销' }
]

const prompts = [
  { category: 'general', title: '结构化任务拆解', content: '你是一位资深项目顾问。请先明确目标、受众与限制条件，再将任务拆成可执行步骤，并标注每一步的预期产出、风险和验收标准。' },
  { category: 'general', title: '专业内容润色', content: '请在不改变原意的前提下润色以下内容，使表达清晰、自然、有逻辑。删除重复信息，保留关键事实，并分别给出正式版和简洁版。' },
  { category: 'general', title: '创意方案发散', content: '围绕以下主题提供 10 个差异明显的创意方向。每个方向包含核心概念、适用场景、视觉关键词和一句传播口号，避免同质化表达。' },
  { category: 'image', title: '电影感人物肖像', content: '电影感人物肖像，柔和侧逆光，真实皮肤质感，浅景深，克制的青橙色调，主体居中，85mm 镜头，高级商业摄影，细节清晰。' },
  { category: 'image', title: '极简产品海报', content: '极简产品广告海报，产品悬浮于纯净背景中央，精确轮廓光，柔和投影，大面积留白，现代无衬线排版，高端品牌视觉，4K。' },
  { category: 'image', title: '东方未来场景', content: '东方未来主义城市，传统建筑轮廓与透明科技材质融合，晨雾、体积光、细腻环境细节，广角构图，电影级概念设计。' },
  { category: 'video', title: '品牌开场镜头', content: '5 秒品牌开场，镜头从微距材质细节缓慢拉远至完整产品，光线沿边缘流动，背景极简，运动平稳，最后定格品牌标识。' },
  { category: 'video', title: '产品动态展示', content: '产品在暗色空间中缓慢旋转，镜头环绕推进，局部特写展示材质与结构，灯光随运动渐变，节奏高级克制，无跳切，16:9。' },
  { category: 'video', title: '城市情绪短片', content: '雨后城市清晨，行人从光影中经过，手持跟拍与静态空镜交替，低饱和色彩，自然环境声，真实纪录片质感，情绪温暖。' },
  { category: 'marketing', title: '产品卖点提炼', content: '请基于产品信息提炼 3 个核心卖点。每个卖点包含用户痛点、产品价值、可信依据和一句不超过 18 字的传播文案，避免夸大承诺。' },
  { category: 'marketing', title: '社交媒体文案', content: '为以下主题撰写一篇社交媒体短文：用具体场景开头，正文提供 3 个可执行建议，语气真诚自然，结尾设置一个容易回答的互动问题。' },
  { category: 'marketing', title: '品牌故事框架', content: '请用“用户困境—品牌洞察—解决方式—真实改变—未来愿景”的结构撰写品牌故事，语言简洁有画面感，避免空洞口号。' }
]

const activeCategory = ref('general')
const toast = ref('')
let toastTimer
const visiblePrompts = computed(() => prompts
  .filter(prompt => prompt.category === activeCategory.value)
  .map((prompt, index) => ({ ...prompt, index: String(index + 1).padStart(2, '0'), categoryLabel: categories.find(item => item.key === prompt.category)?.label })))

const showToast = message => {
  toast.value = message
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => { toast.value = '' }, 2200)
}

/** 复制只调用浏览器能力，不保存任何用户状态。 */
const copyPrompt = async content => {
  try {
    if (!window.navigator.clipboard?.writeText) throw new Error('clipboard unavailable')
    await window.navigator.clipboard.writeText(content)
    showToast('提示词已复制')
  } catch {
    showToast('复制失败，请手动选择提示词文本')
  }
}

onBeforeUnmount(() => window.clearTimeout(toastTimer))
</script>

<style lang="scss" scoped>
.si-prompts { min-height: 100vh; padding: clamp(54px,6vw,110px) 5vw 80px; background: #f5f6f1; }
.si-prompts__hero { width: min(1180px,100%); margin: 0 auto 55px; text-align: center; }
.si-prompts__hero > span { color: #79ad31; font-size: 12px; font-weight: 800; letter-spacing: .24em; }
.si-prompts__hero h1 { margin: 12px 0 14px; font-size: clamp(54px,7vw,108px); line-height: .95; letter-spacing: -.07em; }
.si-prompts__hero p { color: #777; font-size: 14px; }
.si-prompts__content { width: min(1180px,100%); margin: auto; }
.si-prompts__filters { margin-bottom: 26px; display: flex; justify-content: center; gap: 10px; }
.si-prompts__filters button { min-width: 88px; padding: 10px 18px; border: 1px solid #d9d9d4; border-radius: 999px; color: #777; background: #fff; cursor: pointer; transition: all .2s; }
.si-prompts__filters button:hover,.si-prompts__filters button.is-active { border-color: #070707; color: #fff; background: #070707; }
.si-prompts__grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
.si-prompt-card { min-height: 340px; padding: 26px; display: flex; flex-direction: column; border: 1px solid rgba(0,0,0,.07); border-radius: 22px; background: #fff; box-shadow: 0 12px 34px rgba(0,0,0,.04); }
.si-prompt-card > div { display: flex; align-items: center; justify-content: space-between; color: #83b541; font-size: 11px; letter-spacing: .14em; }.si-prompt-card > div b{color:#bbb;font-size:13px}
.si-prompt-card h2 { margin: 30px 0 16px; font-size: 22px; }
.si-prompt-card p { flex: 1; color: #666; font-size: 14px; line-height: 1.9; }
.si-prompt-card button { margin-top: 25px; padding: 0; display: flex; align-items: center; justify-content: space-between; border: 0; color: #111; background: none; font-weight: 700; cursor: pointer; }.si-prompt-card button i{font-size:20px;font-style:normal}
.si-prompts__toast { position: fixed; z-index: 200; left: 50%; bottom: 32px; padding: 11px 18px; transform: translateX(-50%); border-radius: 999px; color: #fff; background: rgba(7,7,7,.92); box-shadow: 0 10px 30px rgba(0,0,0,.18); font-size: 13px; white-space: nowrap; }
@media(max-width:900px){.si-prompts__grid{grid-template-columns:1fr 1fr}}
@media(max-width:600px){.si-prompts{padding:48px 16px 60px}.si-prompts__hero{margin-bottom:36px}.si-prompts__hero h1{font-size:56px}.si-prompts__hero p{padding:0 18px;line-height:1.7}.si-prompts__filters{justify-content:flex-start;overflow-x:auto}.si-prompts__filters button{flex:0 0 auto}.si-prompts__grid{grid-template-columns:1fr}.si-prompt-card{min-height:300px}}
</style>
