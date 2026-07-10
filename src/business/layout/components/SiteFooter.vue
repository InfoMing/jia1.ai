<template>
  <footer class="si-footer">
    <div class="si-footer__actions">
      <button type="button" @click="backTop">↑ 回到顶部</button>
      <button type="button" :class="{ liked }" @click="handleLike">♡ 点赞 <b>{{ count }}</b></button>
    </div>
    <div class="si-footer__meta">
      <p>Copyright©2014-2026 超级个体 All Rights Reserved.</p>
      <nav><RouterLink :to="{ name: 'Privacy' }">隐私政策</RouterLink><RouterLink :to="{ name: 'Statement' }">法律声明</RouterLink></nav>
    </div>
  </footer>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { RouterLink } from 'vue-router'
import { businessApi } from '@/business/api'

const count = ref(4957)
const liked = ref(false)
const backTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

onMounted(async () => {
  const state = await businessApi.getLikeState()
  count.value = state.count
  liked.value = state.liked
})

const handleLike = async () => {
  try {
    const result = await businessApi.like()
    count.value = result.count
    liked.value = true
    if (result.duplicated) ElMessage.info('您已经点过赞了')
  } catch (error) {
    ElMessage.error(error.message)
  }
}
</script>

<style lang="scss" scoped>
.si-footer { margin-top: 100px; padding: 0 clamp(24px,5vw,70px) 35px; background: #080808; color: #fff; }
.si-footer__actions { height: 85px; display: flex; gap: 28px; align-items: center; border-bottom: 1px solid rgba(255,255,255,.14); }
.si-footer__actions button { border: 0; color: #fff; background: none; cursor: pointer; }
.si-footer__actions button.liked { color: #aaff00; }
.si-footer__actions b { margin-left: 6px; }
.si-footer__meta { min-height: 110px; display: flex; align-items: center; justify-content: space-between; color: #aaa; font-size: 12px; }
.si-footer__meta nav { display: flex; gap: 24px; }
@media (max-width: 768px) { .si-footer { margin-top: 70px; padding-inline: 22px; }.si-footer__meta { padding-top: 25px; align-items: flex-start; flex-direction: column; gap: 20px; } }
</style>

