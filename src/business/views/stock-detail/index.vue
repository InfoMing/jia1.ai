<template>
  <div class="detail-page">
    <div class="page-inner">
      <!-- 面包屑 -->
      <div class="breadcrumb">
        <router-link to="/b/market/a-share">市场行情</router-link>
        <span class="sep">/</span>
        <span>股票详情</span>
        <span class="sep">/</span>
        <span class="current">{{ stock.name }}（{{ stock.code }}）</span>
      </div>

      <!-- 股票头部信息卡 -->
      <div class="stock-header-card">
        <div class="header-left">
          <h1 class="stock-name">{{ stock.name }}</h1>
          <div class="stock-meta">{{ stock.code }} | {{ stock.market }}</div>
          <div class="price-row">
            <span class="current-price">{{ stock.price }}</span>
            <span class="price-change" :class="stock.changePercent >= 0 ? 'up' : 'down'">
              {{ stock.changeAmount >= 0 ? '+' : '' }}{{ stock.changeAmount }} &nbsp;{{ stock.changePercent >= 0 ? '+' : '' }}{{ stock.changePercent }}%
            </span>
          </div>
          <div class="stock-date">上市日期：{{ stock.listedDate }} | 总股本：{{ stock.shares }}</div>
        </div>
        <div class="header-right">
          <div class="kpi-grid">
            <div class="kpi-item">
              <div class="kpi-label">目标价格</div>
              <div class="kpi-value">{{ stock.targetPrice }}</div>
            </div>
            <div class="kpi-item">
              <div class="kpi-label">穿透回报率</div>
              <div class="kpi-value" style="color:#ff6b6b">{{ stock.returnRate }}</div>
            </div>
            <div class="kpi-item">
              <div class="kpi-label">当前股息率</div>
              <div class="kpi-value">{{ stock.divRate }}</div>
            </div>
            <div class="kpi-item">
              <div class="kpi-label">预计购买</div>
              <div class="kpi-value">{{ stock.estBuy }}</div>
            </div>
            <div class="kpi-item">
              <div class="kpi-label">购入风险评分</div>
              <div class="kpi-value">{{ stock.riskScore }}</div>
            </div>
            <div class="kpi-item">
              <div class="kpi-label">52周最低</div>
              <div class="kpi-value">{{ stock.low52w }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作栏 -->
      <div class="action-bar">
        <el-button class="action-btn" @click="handleAnalysis"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>公司基本面分析</el-button>
        <el-button class="action-btn" @click="handleFinancial"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>财报分析</el-button>
        <el-button class="action-btn" @click="handleRisk"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12" y2="16" /></svg>风险分析</el-button>
        <div class="action-sep" />
        <el-button class="action-btn primary" @click="handleFollow"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>{{ isFollowed ? '已关注' : '+加入关注' }}</el-button>
        <el-button class="action-btn primary" @click="handleSetMonitor"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>设置监控</el-button>
      </div>

      <!-- 主内容双列 -->
      <div class="content-two-col">
        <!-- 左列：K线图 -->
        <div class="left-col">
          <div class="chart-card">
            <div class="chart-header">
              <span class="chart-title">K线图</span>
              <div class="chart-periods">
                <span :class="['period', { active: kPeriod === 'day' }]" @click="kPeriod = 'day'">日K</span>
                <span :class="['period', { active: kPeriod === 'week' }]" @click="kPeriod = 'week'">周K</span>
                <span :class="['period', { active: kPeriod === 'month' }]" @click="kPeriod = 'month'">月K</span>
              </div>
            </div>
            <div class="chart-placeholder">
              <svg viewBox="0 0 760 304" width="760" height="304" class="chart-svg">
                <rect width="760" height="304" fill="#f9fafb" rx="8" />
                <text x="380" y="152" text-anchor="middle" fill="#bbb" font-size="14">K线图加载区域</text>
              </svg>
            </div>
          </div>
        </div>

        <!-- 右列 -->
        <div class="right-col">
          <!-- 核心财务数据 -->
          <div class="finance-card">
            <div class="card-section-title">核心财务数据</div>
            <div class="card-divider" />
            <div class="finance-grid">
              <div class="finance-row" v-for="f in financialData" :key="f.label">
                <span class="finance-label">{{ f.label }}</span>
                <span class="finance-value">{{ f.value }}</span>
              </div>
            </div>
          </div>

          <!-- 盈利预测 -->
          <div class="forecast-card">
            <div class="card-section-title">各价格购买盈利预测</div>
            <div class="forecast-table">
              <div class="forecast-header">
                <span>买入价格</span>
                <span>购买手数</span>
                <span>预计盈利</span>
              </div>
              <div class="forecast-row" v-for="f in forecasts" :key="f.price">
                <span>{{ f.price }}</span>
                <span>{{ f.lots }}</span>
                <span :class="f.profit >= 0 ? 'up' : 'down'">{{ f.profit >= 0 ? '+' : '' }}{{ f.profit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速跳转 -->
      <div class="quick-links">
        <span class="quick-title">更多分析：</span>
        <el-button class="quick-btn" @click="goForecast">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>盈利预测
        </el-button>
        <el-button class="quick-btn" @click="goDividend">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>历年分红记录
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessStockDetail',
  data() {
    return {
      kPeriod: 'day',
      isFollowed: false,
      stock: {
        name: '贵州茅台',
        code: '600519.SH',
        market: '上交所主板',
        price: '1,788.50',
        changeAmount: '+55.60',
        changePercent: 3.21,
        listedDate: '2001-08-27',
        shares: '12.56亿股',
        targetPrice: '1,650.00',
        returnRate: '8.32%',
        divRate: '1.85%',
        estBuy: '5 手',
        riskScore: '6.8 / 10',
        low52w: '1,216.00'
      },
      financialData: [
        { label: '市盈率(PE)', value: '32.4' },
        { label: '市净率(PB)', value: '12.8' },
        { label: '净资产收益率(ROE)', value: '38.5%' },
        { label: '毛利率', value: '91.7%' },
        { label: '净利润增长率', value: '+18.2%' }
      ],
      forecasts: [
        { price: '1,600.00', lots: '5 手', profit: '+18.65%' },
        { price: '1,700.00', lots: '5 手', profit: '+11.35%' }
      ]
    }
  },
  methods: {
    handleAnalysis() { this.$message.info('基本面分析功能开发中') },
    handleFinancial() { this.$message.info('财报分析功能开发中') },
    handleRisk() { this.$message.info('风险分析功能开发中') },
    handleFollow() { this.isFollowed = !this.isFollowed; this.$message.success(this.isFollowed ? '已加入关注' : '已取消关注') },
    handleSetMonitor() { this.$message.info('设置监控功能开发中') },
    goForecast() { this.$message.info('盈利预测详情页开发中') },
    goDividend() { this.$message.info('分红记录详情页开发中') }
  }
}
</script>

<style lang="scss" scoped>
@import '@/business/styles/index.scss';
.detail-page { padding: 16px 0 32px; }
.page-inner { max-width: $content-max-width; margin: 0 auto; padding: 0 24px; }

/* 面包屑 */
.breadcrumb { font-size: 13px; color: $text-muted; margin-bottom: 16px; a { color: $text-muted; text-decoration: none; &:hover { color: $brand-primary; } } .sep { margin: 0 6px; } .current { color: $text-primary; } }

/* 头部信息卡 */
.stock-header-card { display: flex; background: $bg-card; border: 1px solid $border-color; border-radius: 8px; padding: 32px; margin-bottom: 16px; gap: 32px; }
.header-left { width: 340px; flex-shrink: 0; }
.stock-name { font-size: 28px; font-weight: 700; color: $text-primary; margin: 0 0 6px; }
.stock-meta { font-size: 13px; color: $text-muted; margin-bottom: 12px; }
.price-row { margin-bottom: 8px; }
.current-price { font-size: 40px; font-weight: 700; color: $text-primary; margin-right: 16px; }
.price-change { font-size: 16px; font-weight: 600; }
.price-change.up { color: #ff6b6b; }
.price-change.down { color: #51cf66; }
.stock-date { font-size: 13px; color: $text-muted; }
.header-right { flex: 1; }
.kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.kpi-item { }
.kpi-label { font-size: 12px; color: $text-muted; margin-bottom: 2px; }
.kpi-value { font-size: 18px; font-weight: 600; color: $text-primary; }

/* 操作栏 */
.action-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.action-btn { display: inline-flex; align-items: center; gap: 6px; border: 1px solid $border-color !important; border-radius: 20px !important; padding: 9px 18px !important; font-size: 13px !important; color: $text-secondary !important; background: $bg-card !important; &:hover { border-color: $brand-primary !important; color: $brand-primary !important; } }
.action-btn.primary { border-color: $brand-primary !important; color: $brand-primary !important; &:hover { background: rgba(247,151,30,0.08) !important; } }
.action-sep { width: 1px; height: 24px; background: $border-color; }

/* 双列 */
.content-two-col { display: flex; gap: 20px; margin-bottom: 16px; }
.left-col { flex: 1; min-width: 0; }
.right-col { width: 380px; flex-shrink: 0; }

.chart-card { background: $bg-card; border: 1px solid $border-color; border-radius: 8px; padding: 20px; }
.chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.chart-title { font-size: 16px; font-weight: 600; color: $text-primary; }
.chart-periods { display: flex; gap: 2px; background: #f5f5f5; border-radius: 16px; padding: 2px; }
.period { padding: 4px 14px; font-size: 13px; border-radius: 14px; cursor: pointer; color: $text-muted; transition: all 0.2s; &.active { background: $brand-primary; color: #fff; } }
.chart-placeholder { width: 100%; }

.finance-card, .forecast-card { background: $bg-card; border: 1px solid $border-color; border-radius: 8px; padding: 20px; margin-bottom: 16px; }
.card-section-title { font-size: 16px; font-weight: 600; color: $text-primary; }
.card-divider { height: 1px; background: $border-color; margin: 12px 0; }
.finance-grid { }
.finance-row { display: flex; justify-content: space-between; align-items: center; height: 40px; border-bottom: 1px solid #f5f5f5; &:last-child { border-bottom: none; } }
.finance-label { font-size: 14px; color: $text-secondary; }
.finance-value { font-size: 14px; font-weight: 600; color: $text-primary; }

.forecast-table { width: 100%; margin-top: 12px; }
.forecast-header { display: flex; font-size: 12px; color: $text-muted; padding: 8px 0; border-bottom: 1px solid $border-color; span { flex: 1; } }
.forecast-row { display: flex; font-size: 13px; color: $text-primary; padding: 10px 0; border-bottom: 1px solid #f5f5f5; span { flex: 1; } &:last-child { border-bottom: none; } }

/* 快速跳转 */
.quick-links { display: flex; align-items: center; gap: 8px; background: $bg-card; border: 1px solid $border-color; border-radius: 8px; padding: 16px 20px; }
.quick-title { font-size: 14px; color: $text-secondary; flex-shrink: 0; }
.quick-btn { display: inline-flex; align-items: center; gap: 4px; border: 1px solid $border-color !important; border-radius: 18px !important; padding: 7px 16px !important; font-size: 13px !important; color: $text-secondary !important; background: $bg-card !important; &:hover { border-color: $brand-primary !important; color: $brand-primary !important; } }

.up { color: #ff6b6b; } .down { color: #51cf66; }
</style>
