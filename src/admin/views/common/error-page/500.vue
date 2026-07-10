<template>
  <div class="admin-500-container">
    <div class="admin-500">
      <div class="pic-500">
        <svg viewBox="0 0 600 400" width="600" height="400" xmlns="http://www.w3.org/2000/svg">
          <!-- 背景圆 -->
          <circle cx="300" cy="200" r="160" fill="#f0f7ff" />
          <circle cx="300" cy="200" r="120" fill="#e0f0ff" />
          <!-- 服务器图标 -->
          <rect x="230" y="100" width="140" height="100" rx="8" fill="#1482f0" opacity="0.15" />
          <rect x="245" y="120" width="110" height="8" rx="4" fill="#1482f0" opacity="0.4" />
          <rect x="245" y="138" width="110" height="8" rx="4" fill="#1482f0" opacity="0.3" />
          <rect x="245" y="156" width="70" height="8" rx="4" fill="#1482f0" opacity="0.2" />
          <!-- 感叹号 -->
          <circle cx="300" cy="200" r="50" fill="#1482f0" opacity="0.1" />
          <text x="300" y="215" text-anchor="middle" font-size="60" font-weight="bold" fill="#1482f0">!</text>
          <!-- 波纹 -->
          <circle cx="300" cy="200" r="70" fill="none" stroke="#1482f0" stroke-width="2" opacity="0.15">
            <animate attributeName="r" from="70" to="180" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.15" to="0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="300" cy="200" r="70" fill="none" stroke="#1482f0" stroke-width="2" opacity="0.1">
            <animate attributeName="r" from="70" to="180" dur="2s" begin="0.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.1" to="0" dur="2s" begin="0.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
      <div class="message">
        <div class="headline">服务器异常</div>
        <div class="info">后端服务暂时无法连接，请稍后重试。<br>若问题持续请联系系统管理员。</div>
        <div class="actions">
          <el-button type="primary" round @click="goHome">返回首页</el-button>
          <el-button round @click="retry">重试</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page500',
  methods: {
    goHome() {
      this.$router.push('/admin/home')
    },
    retry() {
      this.$router.go(0)
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-500-container {
  transform: translate(-50%, -50%);
  position: absolute;
  top: 40%;
  left: 50%;
}
.admin-500 {
  overflow: hidden;
  position: relative;
  width: 700px;
  padding: 0 49px;
  margin-top: 50px;
  .pic-500 {
    position: relative;
    float: left;
    width: 600px;
    overflow: hidden;
  }
  .message {
    position: relative;
    float: left;
    width: 300px;
    padding: 30px 0;
    overflow: hidden;
    .headline {
      font-size: 20px;
      line-height: 24px;
      color: #222;
      font-weight: bold;
      opacity: 0;
      margin-bottom: 10px;
      animation: slideUp 0.5s 0.1s forwards;
    }
    .info {
      font-size: 13px;
      line-height: 21px;
      color: grey;
      opacity: 0;
      margin-bottom: 30px;
      animation: slideUp 0.5s 0.2s forwards;
    }
    .actions {
      opacity: 0;
      animation: slideUp 0.5s 0.3s forwards;
      display: flex;
      gap: 10px;
    }
  }
}
@keyframes slideUp {
  0% { transform: translateY(60px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
</style>
