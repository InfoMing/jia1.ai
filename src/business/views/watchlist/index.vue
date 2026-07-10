<template>
  <div class="watchlist-page">
    <div class="page-inner">
      <!-- 页面标题行 -->
      <div class="page-header">
        <h2 class="page-title">我的关注</h2>
        <el-button class="btn-add" size="small" @click="handleNewGroup">+ 新建分组</el-button>
      </div>

      <!-- Tab 栏 -->
      <div class="watchlist-tabs">
        <span
          v-for="tab in groups"
          :key="tab.key"
          :class="['watchlist-tab', { 'tab-active': activeGroup === tab.key }]"
          @click="activeGroup = tab.key"
        >{{ tab.label }}</span>
      </div>

      <!-- 搜索筛选行 -->
      <div class="toolbar">
        <div class="search-input">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input v-model="keyword" placeholder="搜索已关注股票" />
        </div>
        <el-button class="btn-add" size="small" @click="handleAddStock">+ 添加股票</el-button>
      </div>

      <!-- 表格 -->
      <div class="stock-table">
        <div class="table-header">
          <span class="col-name">股票名称</span>
          <span class="col-price">最新价</span>
          <span class="col-change">涨跌幅</span>
          <span class="col-target">目标价</span>
          <span class="col-return">穿透回报率</span>
          <span class="col-div">当前股息率</span>
          <span class="col-action">操作</span>
        </div>
        <div class="table-scroll">
          <div v-for="(item, idx) in filteredList" :key="item.code" :class="['table-row', { 'row-alt': idx % 2 === 1 }]">
            <div class="col-name">
              <div class="stock-info">
                <span class="stock-name">{{ item.name }}</span>
                <span class="stock-code">{{ item.code }}</span>
              </div>
            </div>
            <span class="col-price num-price">{{ item.price }}</span>
            <span class="col-change" :class="item.changePercent >= 0 ? 'up' : 'down'">
              <span class="change-badge" :class="item.changePercent >= 0 ? 'bg-up' : 'bg-down'">{{ item.changePercent >= 0 ? '+' : '' }}{{ item.changePercent }}%</span>
            </span>
            <span class="col-target">{{ item.targetPrice }}</span>
            <span class="col-return up">{{ item.returnRate }}</span>
            <span class="col-div">{{ item.divRate }}</span>
            <span class="col-action">
              <el-link type="primary" :underline="'never'" size="small" @click="handleMonitor(item)">设监控</el-link>
              <el-link type="primary" :underline="'never'" size="small" @click="goDetail(item)">详情</el-link>
              <el-link type="danger" :underline="'never'" size="small" @click="handleRemove(item)">移除</el-link>
            </span>
          </div>
          <div v-if="filteredList.length === 0" class="empty-data">
            <div class="empty-text">暂无关注股票</div>
            <el-button class="btn-add" @click="handleAddStock">添加股票</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessWatchlist',
  data() {
    return {
      keyword: '',
      activeGroup: 'all',
      groups: [
        { key: 'all', label: '全部自选' },
        { key: 'a', label: 'A股精选' },
        { key: 'hk', label: '港股关注' },
        { key: 'value', label: '价值投资组' }
      ],
      stockList: [
        { code: '600519.SH', name: '贵州茅台', price: '1,788.50', changePercent: 3.21, targetPrice: '1,650.00', returnRate: '8.32%', divRate: '1.85%', group: 'all' },
        { code: '600036.SH', name: '招商银行', price: '42.18', changePercent: -1.05, targetPrice: '45.00', returnRate: '6.68%', divRate: '4.22%', group: 'all' },
        { code: '300750.SZ', name: '宁德时代', price: '248.30', changePercent: 2.15, targetPrice: '260.00', returnRate: '4.71%', divRate: '0.52%', group: 'all' },
        { code: '00700.HK', name: '腾讯控股', price: '428.60', changePercent: 1.85, targetPrice: '480.00', returnRate: '11.99%', divRate: '0.85%', group: 'hk' }
      ]
    }
  },
  computed: {
    filteredList() {
      let list = this.stockList
      if (this.activeGroup !== 'all') {
        list = list.filter(s => s.group === this.activeGroup)
      }
      if (this.keyword.trim()) {
        const kw = this.keyword.trim().toLowerCase()
        list = list.filter(s => s.name.includes(kw) || s.code.toLowerCase().includes(kw))
      }
      return list
    }
  },
  methods: {
    handleNewGroup() { this.$prompt('请输入分组名称', '新建分组').then(({ value }) => { this.groups.push({ key: value, label: value }); this.$message.success('创建成功') }).catch(() => {}) },
    handleAddStock() { this.$message.info('请前往行情页面添加股票') },
    handleMonitor(item) { this.$router.push(`/b/stock-detail/${item.code}?tab=monitor`) },
    goDetail(item) { this.$router.push(`/b/stock-detail/${item.code}`) },
    handleRemove(item) {
      this.$confirm(`确定移除 ${item.name} 吗？`, '提示', { type: 'warning' }).then(() => {
        this.stockList = this.stockList.filter(s => s.code !== item.code)
        this.$message.success('已移除')
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/business/styles/index.scss';
.watchlist-page { padding: 24px 0; height: 100%; display: flex; flex-direction: column; overflow: hidden; }
.page-inner { max-width: $content-max-width; margin: 0 auto; padding: 0 24px; width: 100%; flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-shrink: 0; }
.page-title { font-size: 24px; font-weight: 700; color: $text-primary; margin: 0; }

.watchlist-tabs { display: flex; gap: 8px; margin-bottom: 16px; flex-shrink: 0; }
.watchlist-tab { padding: 6px 18px; font-size: 13px; color: #666; background: #f5f5f5; border-radius: 6px; font-weight: 500; cursor: pointer; transition: all 0.2s; &:hover { background: #e8e8e8; } }
.tab-active { background: rgba(255,107,107,0.15); color: #ff6b6b; &:hover { background: rgba(255,107,107,0.2); } }

.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-shrink: 0; }
.search-input { display: flex; align-items: center; gap: 6px; width: 280px; height: 38px; border: 1px solid $border-color; border-radius: 6px; padding: 0 12px; &:focus-within { border-color: $brand-primary; } svg { color: $text-muted; flex-shrink: 0; } input { flex: 1; border: none; outline: none; font-size: 13px; color: $text-primary; &::placeholder { color: $text-muted; } } }
.btn-add { background: $brand-primary !important; color: #fff !important; border: none !important; }

.stock-table { background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); overflow: hidden; display: flex; flex-direction: column; flex: 1; min-height: 0; }
.table-header, .table-row { display: flex; align-items: center; padding: 0 24px; font-size: 13px; }
.table-header { background: #f9fafb; color: #666; font-weight: 500; border-bottom: 1px solid #f0f0f0; flex-shrink: 0; }
.table-scroll { flex: 1; overflow-y: auto; }
.table-row { height: 60px; border-bottom: 1px solid #f0f0f0; transition: background 0.15s; &:hover { background: #f8f8f8; } &:last-child { border-bottom: none; } }
.col-name { width: 200px; }
.stock-info { .stock-name { font-size: 14px; font-weight: 500; color: $text-primary; display: block; } .stock-code { font-size: 12px; color: $text-muted; } }
.col-price { width: 100px; text-align: right; }
.col-change { width: 100px; text-align: right; }
.change-badge { display: inline-block; padding: 2px 10px; border-radius: 8px; font-size: 13px; font-weight: 500; }
.bg-up { background: rgba(255,107,107,0.15); color: #ff6b6b; } .bg-down { background: rgba(81,207,102,0.15); color: #51cf66; }
.col-target { width: 100px; text-align: right; color: $text-secondary; }
.col-return { width: 110px; text-align: right; font-weight: 500; }
.col-div { width: 110px; text-align: right; color: $text-secondary; }
.col-action { flex: 1; text-align: right; }
.col-action .el-button--text { padding: 0 6px; }
.num-price { font-weight: 600; color: $text-primary; }
.up { color: #ff6b6b; } .down { color: #51cf66; }
.empty-data { padding: 48px; text-align: center; .empty-text { font-size: 14px; color: $text-muted; margin-bottom: 16px; } }
</style>
