<template>
  <div class="biz-404-page">
    <div class="biz-404-content">
      <div class="biz-404-code">4<span class="biz-404-zero">0</span>4</div>
      <div class="biz-404-title">页面不存在</div>
      <div class="biz-404-desc">抱歉，您访问的页面未找到，请检查链接是否正确</div>
      <div class="biz-404-actions">
        <button class="biz-404-btn" @click="goHome">返回首页</button>
        <button class="biz-404-btn outline" @click="goBack">返回上一页</button>
      </div>
    </div>
    <div class="biz-404-bg">
      <div class="biz-404-circle c1"></div>
      <div class="biz-404-circle c2"></div>
      <div class="biz-404-circle c3"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Business404',
  methods: {
    goHome() {
      this.$router.push('/b/home')
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.biz-404-page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  position: relative;
  overflow: hidden;
}
.biz-404-content {
  text-align: center;
  z-index: 2;
  position: relative;
}
.biz-404-code {
  font-size: 120px;
  font-weight: 800;
  color: #C62F2E;
  line-height: 1;
  margin-bottom: 16px;
  letter-spacing: 8px;
}
.biz-404-zero {
  display: inline-block;
  background: linear-gradient(135deg, #C62F2E 0%, #E42313 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 140px;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}
.biz-404-title {
  font-size: 28px;
  font-weight: 700;
  color: #1A0808;
  margin-bottom: 12px;
}
.biz-404-desc {
  font-size: 15px;
  color: #999;
  margin-bottom: 32px;
  line-height: 1.6;
}
.biz-404-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.biz-404-btn {
  padding: 10px 32px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background: #C62F2E;
  color: #fff;
  &:hover {
    background: #A82828;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(198,47,46,0.3);
  }
  &.outline {
    background: #fff;
    color: #C62F2E;
    border: 1px solid #C62F2E;
    &:hover {
      background: rgba(198,47,46,0.05);
      box-shadow: none;
    }
  }
}
.biz-404-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.biz-404-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.04;
}
.c1 {
  width: 400px;
  height: 400px;
  background: #C62F2E;
  top: -80px;
  left: -120px;
}
.c2 {
  width: 300px;
  height: 300px;
  background: #E42313;
  bottom: -60px;
  right: -80px;
}
.c3 {
  width: 180px;
  height: 180px;
  background: #C62F2E;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
