<template>
  <div class="market-page">
    <div class="page-inner">
      <!-- 子路由内容 -->
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessMarket'
}
</script>

<style lang="scss" scoped>
@import '@/business/styles/index.scss';
.market-page { padding: 10px 0; height: 100%; display: flex; flex-direction: column; }
.page-inner {
  padding: 0 24px;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
