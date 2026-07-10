<template>
  <div class="nh-navbar">
    <div class="nh-navbar-inner">
      <div class="nh-navbar-left">
        <div class="nh-logo" @click="goHome">
          <img src="/img/logo/logo.svg" alt="合适价投" class="nh-logo-icon" />
          <span class="nh-logo-text">合适价投</span>
        </div>
        <nav class="nh-nav">
          <router-link to="/b/market/a-share" class="nh-nav-item" active-class="nh-nav-active" exact>A股</router-link>
          <router-link to="/b/market/hk" class="nh-nav-item" active-class="nh-nav-active">港股</router-link>
          <router-link to="/b/market/us" class="nh-nav-item" active-class="nh-nav-active">美股</router-link>
          <router-link to="/b/market/gold" class="nh-nav-item" active-class="nh-nav-active">黄金</router-link>
        </nav>
        <!-- 移动端汉堡菜单按钮（放在 logo 后面） -->
        <button class="nh-mobile-toggle" @click="mobileMenuOpen = !mobileMenuOpen" :class="{ open: mobileMenuOpen }">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="nh-navbar-right">
        <div class="nh-search-box" style="display:none">
          <svg class="nh-search-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="keyword"
            class="nh-search-input"
            placeholder="搜索股票/基金代码"
            @keyup.enter="handleSearch"
          />
          <button class="nh-search-btn" @click="handleSearch">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
        <template v-if="isLoggedIn">
          <el-dropdown trigger="click" class="nh-user-dropdown">
            <span class="nh-user-info">
              <span class="nh-user-avatar">{{ avatarChar }}</span>
              <span class="nh-user-name">{{ username || '我的' }}</span>
              <i class="el-icon-caret-bottom" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goMonitor">我的监控</el-dropdown-item>
                <el-dropdown-item @click="goWatchlist">我的关注</el-dropdown-item>
                <el-dropdown-item @click="goTrigger">触发记录</el-dropdown-item>
                <el-dropdown-item @click="goSms">短信记录</el-dropdown-item>
                <el-dropdown-item @click="goSettings">设置</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <button class="nh-btn-login" @click="goLogin">登录</button>
          <button class="nh-btn-register" @click="goRegister">注册</button>
        </template>
      </div>
    </div>
    <!-- 移动端下拉菜单 -->
    <div class="nh-mobile-menu" v-show="mobileMenuOpen">
      <router-link to="/b/market" class="nh-mobile-item" @click="mobileMenuOpen = false">A股</router-link>
      <router-link to="/b/market/hk" class="nh-mobile-item" @click="mobileMenuOpen = false">港股</router-link>
      <router-link to="/b/market/us" class="nh-mobile-item" @click="mobileMenuOpen = false">美股</router-link>
      <router-link to="/b/market/gold" class="nh-mobile-item" @click="mobileMenuOpen = false">黄金</router-link>
      <template v-if="isLoggedIn">
        <div class="nh-mobile-divider"></div>
        <router-link to="/b/monitor" class="nh-mobile-item" @click="mobileMenuOpen = false">我的监控</router-link>
        <router-link to="/b/watchlist" class="nh-mobile-item" @click="mobileMenuOpen = false">我的关注</router-link>
        <router-link to="/b/trigger-record" class="nh-mobile-item" @click="mobileMenuOpen = false">触发记录</router-link>
        <router-link to="/b/sms-record" class="nh-mobile-item" @click="mobileMenuOpen = false">短信记录</router-link>
        <router-link to="/b/settings" class="nh-mobile-item" @click="mobileMenuOpen = false">设置</router-link>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessNavbar',
  data() {
    return {
      keyword: '',
      isLoggedIn: false,
      username: '',
      mobileMenuOpen: false
    }
  },
  computed: {
    avatarChar() {
      return this.username ? this.username.charAt(0) : '张'
    }
  },
  created() {
    this.checkLogin()
  },
  watch: {
    '$route'() {
      this.checkLogin()
    }
  },
  methods: {
    checkLogin() {
      const user = sessionStorage.getItem('LOCAL_CACHE_USER_INFO_KEY')
      if (user) {
        this.isLoggedIn = true
        try {
          const userData = JSON.parse(user)
          this.username = userData.user?.loginCode || '用户'
        } catch (e) {
          this.username = '用户'
        }
      }
    },
    goHome() {
      if (this.isLoggedIn) {
        this.$router.push('/b/market')
      } else {
        this.$router.push('/b/home')
      }
    },
    goLogin() { this.$router.push('/b/login') },
    goRegister() { this.$router.push('/b/register') },
    goMonitor() { this.$router.push('/b/monitor') },
    goWatchlist() { this.$router.push('/b/watchlist') },
    goTrigger() { this.$router.push('/b/trigger-record') },
    goSms() { this.$router.push('/b/sms-record') },
    goSettings() { this.$router.push('/b/settings') },
    handleSearch() {
      if (this.keyword.trim()) {
        this.$router.push(`/b/stock-detail/${this.keyword.trim()}`)
      }
    },
    handleLogout() {
      sessionStorage.clear()
      window.localStorage.clear()
      location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.nh-navbar {
  background: #fff;
  flex-shrink: 0;
  position: relative;
  border-bottom: 1px solid #f0f0f0;
}
.nh-navbar-inner {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: calc(100% - 30px);
  margin: 0 auto;
  padding: 0 24px;
}
.nh-navbar-left { display: flex; align-items: center; }
.nh-logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 36px;
  text-decoration: none;
  gap: 8px;
}
.nh-logo-icon { width: 28px; height: 28px; display: block; }
.nh-logo-text {
  font-size: 22px;
  font-weight: 700;
  color: #C62F2E;
  letter-spacing: 1px;
}
.nh-nav { display: flex; align-items: center; }
.nh-nav-item {
  padding: 0 20px;
  color: #666;
  text-decoration: none;
  font-size: 15px;
  line-height: 53px;
  cursor: pointer;
  transition: color 0.2s;
  &:hover { color: #C62F2E; }
}
.nh-nav-active {
  color: #C62F2E;
  font-weight: 600;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 20px;
    right: 20px;
    height: 3px;
    background: #C62F2E;
  }
}
.nh-nav-link {
  padding: 0 20px;
  color: #666;
  font-size: 15px;
  line-height: 53px;
  cursor: pointer;
  transition: color 0.2s;
  &:hover { color: #C62F2E; }
}
.nh-nav-more { position: relative; &:hover .nh-nav-more-menu { display: block; } }
.nh-nav-more-trigger { display: block; }
.nh-nav-more-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 120px;
  background: #fff;
  border: 1px solid #E4E6EB;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  padding: 4px 0;
  z-index: 200;
}
.nh-more-item {
  display: block;
  padding: 10px 20px;
  font-size: 14px;
  color: #666;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
  &:hover { background: rgba(198,47,46,0.06); color: #C62F2E; }
}
.nh-navbar-right { display: flex; align-items: center; gap: 12px; }
.nh-search-box {
  display: flex;
  align-items: center;
  height: 34px;
  background: #F5F5F5;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  transition: border-color 0.2s;
  padding: 0 0 0 12px;
  &:focus-within { border-color: #C62F2E; }
}
.nh-search-icon { color: #999; flex-shrink: 0; display: none; }
.nh-search-input {
  width: 160px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  color: #333;
  &::placeholder { color: #bbb; }
}
.nh-search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background: #C62F2E;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  color: #fff;
  margin-left: 8px;
  flex-shrink: 0;
  transition: background 0.2s;
  &:hover { background: #A82828; }
}
.nh-btn-login {
  height: 34px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background: #C62F2E;
  border: 1px solid #C62F2E;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
  line-height: 34px;
  &:hover { background: #A82828; border-color: #A82828; }
}
.nh-btn-register {
  height: 34px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 500;
  color: #C62F2E;
  background: #fff;
  border: 1px solid #C62F2E;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  line-height: 34px;
  &:hover { border-color: #A82828; color: #A82828; }
}
.nh-user-dropdown { cursor: pointer; }
.nh-user-info { display: flex; align-items: center; gap: 8px; }
.nh-user-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: #C62F2E; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 600;
}
.nh-user-name { font-size: 14px; color: #333; }
.nh-user-dropdown:hover .nh-user-name { color: #C62F2E; }

/* ===== 汉堡菜单按钮 ===== */
.nh-mobile-toggle {
  display: none;
  width: 20px;
  height: 14px;
  background: none;
  border: none;
  cursor: pointer;
  flex-direction: column;
  justify-content: space-between;
  padding: 0;
  margin-left: 6px;
  flex-shrink: 0;
}
.nh-mobile-toggle span {
  display: block;
  width: 100%;
  height: 2px;
  background: #C62F2E;
  border-radius: 2px;
  transition: all 0.3s ease;
}
.nh-mobile-toggle.open span:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}
.nh-mobile-toggle.open span:nth-child(2) {
  opacity: 0;
}
.nh-mobile-toggle.open span:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

/* ===== 移动端下拉菜单 ===== */
.nh-mobile-menu {
  display: none;
  position: absolute;
  top: 56px;
  left: 0;
  right: 0;
  background: #fff;
  border-bottom: 1px solid #eee;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 8px 0;
  z-index: 200;
  max-height: calc(100vh - 56px);
  overflow-y: auto;
}
.nh-mobile-item {
  display: block;
  padding: 12px 24px;
  font-size: 15px;
  color: #333;
  text-decoration: none;
  transition: background 0.15s;
  &:hover { background: #f5f5f5; color: #C62F2E; }
}
.nh-mobile-divider {
  height: 1px;
  background: #eee;
  margin: 4px 0;
}

/* ===== 响应式 ===== */
@media (max-width: 1100px) {
  .nh-nav-item { padding: 0 12px; font-size: 14px; }
  .nh-nav-link { padding: 0 12px; font-size: 14px; }
  .nh-search-input { width: 120px; }
}
@media (max-width: 900px) {
  .nh-nav-item { padding: 0 8px; font-size: 13px; }
  .nh-nav-link { padding: 0 8px; font-size: 13px; }
  .nh-logo { margin-right: 16px; }
  .nh-logo-text { font-size: 18px; }
  .nh-search-input { width: 90px; font-size: 12px; }
  .nh-btn-login,
  .nh-btn-register { padding: 0 12px; font-size: 13px; }
}
@media (max-width: 768px) {
  .nh-navbar-inner { padding: 0 12px; }
  .nh-nav { display: none; }
  .nh-mobile-toggle { display: flex; }
  .nh-mobile-menu { display: block; }
  .nh-logo-icon { width: 24px; height: 24px; }
  .nh-logo-text { font-size: 16px; }
  .nh-search-input { width: 80px; font-size: 12px; }
  .nh-search-box { height: 30px; }
  .nh-search-btn { width: 30px; height: 30px; }
  .nh-btn-login,
  .nh-btn-register { height: 30px; line-height: 30px; padding: 0 10px; font-size: 12px; }
}
</style>
