<template>
  <div class="home-page">
    <!-- Hero 区 -->
    <section class="nh-hero">
      <div class="nh-hero-inner">
        <h1 class="nh-hero-title">合适价投</h1>
        <p class="nh-hero-subtitle">用合适的价格，买入合适的股票，为价值付费，为价值投资</p>
        <div class="nh-feature-card">
          <div class="nh-feature-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div>
            <div class="nh-feature-title">智能价格监控</div>
            <div class="nh-feature-desc">不用盯盘，设置股价监控规则，达到条件时自动通过短信或邮件通知您，让您不错过每一次买入或卖出良机，真正做到价值投资、省心投资。</div>
          </div>
        </div>
        <div class="nh-stats">
          <div class="nh-stat-item">
            <div class="nh-stat-value">12,847</div>
            <div class="nh-stat-label">监控中</div>
          </div>
          <div class="nh-stat-item">
            <div class="nh-stat-value">38,291</div>
            <div class="nh-stat-label">已触发</div>
          </div>
          <div class="nh-stat-item">
            <div class="nh-stat-value">1,203</div>
            <div class="nh-stat-label">今日触发</div>
          </div>
        </div>
        <div class="nh-index-box">
          <div class="nh-index-list">
            <div class="nh-index-item" v-for="item in marketIndexes" :key="item.name">
              <div class="nh-index-name">{{ item.name }}</div>
              <div class="nh-index-price" :class="item.change >= 0 ? 'up' : 'down'">{{ item.price }}</div>
              <div class="nh-index-change" :class="item.change >= 0 ? 'up' : 'down'">
                {{ item.change >= 0 ? '+' : '' }}{{ item.change }}%
              </div>
            </div>
          </div>
        </div>
        <div class="nh-cta-wrap">
          <button class="nh-cta-btn" @click="handleCTA">
            立即使用
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'BusinessHome',
  data() {
    return {
      isLoggedIn: false,
      marketIndexes: [
        { name: '上证指数', price: '3,251.34', change: 0.82 },
        { name: '深证成指', price: '10,498.20', change: 1.15 },
        { name: '恒生指数', price: '19,342.88', change: -0.43 },
        { name: '纳斯达克', price: '16,742.39', change: 2.31 }
      ]
    }
  },
  created() {
    const user = sessionStorage.getItem('LOCAL_CACHE_USER_INFO_KEY')
    this.isLoggedIn = !!user
  },
  methods: {
    handleCTA() {
      if (this.isLoggedIn) {
        this.$router.push('/b/market/a-share')
      } else {
        this.$router.push('/b/login')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home-page {
  width: 100vw;
}

.nh-hero {
  height: calc(100vh - 140px);
  background: linear-gradient(135deg, #1A0808 0%, #2D0F0F 60%, #3A1515 100%);
  color: #fff;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
}
.nh-hero-inner {
  margin: 0 auto;
  width: 100%;
}

.nh-hero-title {
  font-size: 44px;
  font-weight: 800;
  margin: 0 0 8px;
  letter-spacing: 2px;
  color: #fff;
}

.nh-hero-subtitle {
  font-size: 15px;
  color: rgba(255,255,255,0.7);
  margin: 20px 0;
  line-height: 1.5;
}

.nh-feature-card {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 800px;
  margin: 0 auto 14px;
  text-align: left;
  padding: 20px 18px;
  background: rgba(255,255,255,0.06);
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.10);
}
.nh-feature-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(228, 35, 19, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #E42313;
}
.nh-feature-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 2px;
}
.nh-feature-desc {
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  line-height: 1.5;
}

.nh-stats {
  display: flex;
  justify-content: center;
  gap: 44px;
  margin-bottom: 14px;
}
.nh-stat-item { text-align: center; }
.nh-stat-value {
  font-size: 26px;
  font-weight: 700;
  color: #E42313;
}
.nh-stat-label {
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  margin-top: 4px;
}

.nh-index-box {
  display: block;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 10px 22px;
  margin: 0 auto 14px;
  width: fit-content;
}
.nh-index-list {
  display: flex;
  flex-direction: row;
  gap: 24px;
}
.nh-index-item {
  display: flex;
  flex-direction: row;
  gap: 8px;
  text-align: left;
  align-items: baseline;
}
.nh-index-name { color: rgba(255,255,255,0.5); font-size: 13px; }
.nh-index-price { font-weight: 700; font-size: 16px; }
.nh-index-price.up { color: #E42313; }
.nh-index-price.down { color: #00AA55; }
.nh-index-change { font-weight: 600; font-size: 13px; }
.nh-index-change.up { color: #E42313; }
.nh-index-change.down { color: #00AA55; }

.nh-cta-wrap {
  display: block;
  text-align: center;
  margin-top: 20px;
}
.nh-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 15px 50px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: #E42313;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  &:hover {
    background: #C61A0A;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(228, 35, 19, 0.35);
  }
}
</style>
