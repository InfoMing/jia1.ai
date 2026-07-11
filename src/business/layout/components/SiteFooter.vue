<template>
  <footer class="si-footer">
    <div class="si-footer__inner">
      <p>Copyright©2014-2026 超级个体 All Rights Reserved.</p>
      <button type="button" @click="backTop">↑ 回到顶部</button>
    </div>
  </footer>
</template>

<script setup>
const backTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>

<style lang="scss" scoped>
.si-footer { margin-top: 100px; min-height: 150px; padding: 32px 0; display: flex; align-items: center; color: #aaa; background: #080808; font-size: 12px; }
.si-footer__inner { width: min(90.625vw,1160px); margin-inline: auto; display: flex; align-items: center; justify-content: space-between; }
.si-footer button { border: 0; color: #fff; background: none; cursor: pointer; }
@media (max-width: 768px) { .si-footer { margin-top: 70px; }.si-footer__inner { align-items: center; gap: 18px; }.si-footer__inner p { max-width: 220px; line-height: 1.6; } }
</style>
