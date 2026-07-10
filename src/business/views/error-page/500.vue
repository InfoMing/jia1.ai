<template>
  <div class="biz-error-page">
    <div class="biz-error-content">
      <div class="biz-error-code">5<span class="biz-error-zero">0</span>0</div>
      <div class="biz-error-title">服务器开小差了</div>
      <div class="biz-error-desc">
        抱歉，后端服务暂时无法访问，请稍后重试<br>
        如果问题持续存在，请联系管理员
      </div>
      <div class="biz-error-actions">
        <button class="biz-error-btn" @click="goHome">返回首页</button>
        <button class="biz-error-btn outline" @click="retry">重试一次</button>
      </div>
    </div>
    <div class="biz-error-bg">
      <div class="biz-error-circle c1"></div>
      <div class="biz-error-circle c2"></div>
      <div class="biz-error-circle c3"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Business500',
  methods: {
    goHome() {
      this.$router.push('/b/home')
    },
    retry() {
      this.$router.go(0)
    }
  }
}
</script>

<style lang="scss" scoped>
.biz-error-page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  position: relative;
  overflow: hidden;
}
.biz-error-content {
  text-align: center;
  z-index: 2;
  position: relative;
}
.biz-error-code {
  font-size: 120px;
  font-weight: 800;
  color: #C62F2E;
  line-height: 1;
  margin-bottom: 16px;
  letter-spacing: 8px;
}
.biz-error-zero {
  display: inline-block;
  background: linear-gradient(135deg, #E8961E 0%, #F5A623 100%);
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
.biz-error-title {
  font-size: 28px;
  font-weight: 700;
  color: #1A0808;
  margin-bottom: 12px;
}
.biz-error-desc {
  font-size: 15px;
  color: #999;
  margin-bottom: 32px;
  line-height: 1.8;
}
.biz-error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.biz-error-btn {
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
.biz-error-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.biz-error-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.04;
}
.c1 {
  width: 400px;
  height: 400px;
  background: #E8961E;
  top: -80px;
  left: -120px;
}
.c2 {
  width: 300px;
  height: 300px;
  background: #F5A623;
  bottom: -60px;
  right: -80px;
}
.c3 {
  width: 180px;
  height: 180px;
  background: #E8961E;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
