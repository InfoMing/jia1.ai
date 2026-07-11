<template>
  <footer class="ji-footer">
    <div class="ji-footer__inner">
      <p>Copyright©2014-2026 超级个体 All Rights Reserved.</p>
      <button type="button" @click="backTop">↑ 回到顶部</button>
    </div>
  </footer>
</template>

<script setup>
// 使用原生平滑滚动，不引入额外状态或第三方依赖。
const backTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>

<style lang="scss" scoped>
@use '@/business/styles/base/mixins' as *;
.ji-footer { margin-top: 0; padding: 25px 0; color: #aaa; border-top: 1px solid rgba(0,0,0,.025); background: #fff; font-size: 11px; }
.ji-footer__inner { @include container; position: relative; min-height: 18px; display: flex; align-items: center; justify-content: center; text-align: center; }
.ji-footer p { margin: 0; line-height: 1.4; }
.ji-footer button { position: absolute; right: 0; padding: 0; border: 0; color: #aaa; background: none; font-size: 12px; cursor: pointer; transition: color .2s ease; }
.ji-footer button:hover { color: #555; }
@media (max-width: 768px) {
  .ji-footer { padding: 22px 0; font-size: 10px; }
  .ji-footer__inner { min-height: 16px; }
  .ji-footer button { font-size: 12px; }
}
</style>
