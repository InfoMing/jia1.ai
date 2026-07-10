<template>
  <div class="placeholder-page">
    <div class="placeholder-card">
      <div class="placeholder-icon">🚧</div>
      <div class="placeholder-title">{{ title }}</div>
      <div class="placeholder-desc">{{ description }}</div>
      <div class="placeholder-actions">
        <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
        <el-button @click="$router.push('/b/dashboard')">去看看监控</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessPlaceholder',
  props: {
    title: { type: String, default: '功能开发中' },
    description: { type: String, default: '此功能预计在下一版本上线，敬请期待' }
  }
}
</script>

<style lang="scss" scoped>
.placeholder-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
}
.placeholder-card {
  text-align: center;
  padding: 64px;
  .placeholder-icon { font-size: 64px; margin-bottom: 24px; }
  .placeholder-title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 12px; }
  .placeholder-desc { font-size: 14px; color: #999; margin-bottom: 32px; }
  .placeholder-actions { display: flex; gap: 12px; justify-content: center; }
}
</style>
