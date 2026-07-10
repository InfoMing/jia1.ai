<template>
  <div class="market-list">
    <biz-table
      :columns="columns"
      :data="stockList"
      :total="total"
      :current-page.sync="page"
      :page-size.sync="pageSize"
      :search-text.sync="keyword"
      show-search
      show-action
      show-pagination
      search-placeholder="搜索股票名称/代码，按回车搜索"
      @search="handleSearch"
      @page-change="page = $event; loadData()"
    >
      <template #buttons>
        <el-button class="btn-add" size="small" @click="handleAddWatch">+ 添加自选</el-button>
      </template>

      <template #cell-name="{ row }">
        <div class="stock-info">
          <span class="stock-name">{{ row.name }}</span>
          <span class="stock-code">{{ row.code }}</span>
        </div>
      </template>

      <template #cell-changePercent="{ row }">
        <span :class="row.changePercent >= 0 ? 'up' : 'down'">
          <span class="change-badge" :class="row.changePercent >= 0 ? 'bg-up' : 'bg-down'">
            {{ row.changePercent >= 0 ? '+' : '' }}{{ row.changePercent }}%
          </span>
        </span>
      </template>

      <template #cell-changeAmount="{ row }">
        <span :class="row.changeAmount >= 0 ? 'up' : 'down'">
          {{ row.changeAmount >= 0 ? '+' : '' }}{{ row.changeAmount }}
        </span>
      </template>

      <template #cell-marketValue="{ row }">
        <span class="text-secondary">{{ row.marketValue }}</span>
      </template>

      <template #actions="{ row }">
        <el-link type="primary" :underline="'never'" size="small" @click="goDetail(row)">详情</el-link>
      </template>
    </biz-table>

    <!-- 股票详情弹窗 -->
    <el-dialog
      :visible.sync="detailVisible"
      :title="detailStock ? detailStock.name : ''"
      width="500px"
      :close-on-click-modal="true"
      class="stock-detail-dialog"
    >
      <div v-if="detailStock" class="detail-body">
        <div class="detail-header">
          <div class="detail-code">{{ detailStock.code }}</div>
          <div class="detail-name">{{ detailStock.name }}</div>
        </div>
        <div class="detail-info">
          <p>市场: {{ detailStock.market }}</p>
          <p>类型: {{ detailStock.type }}</p>
          <p>上市日期: {{ detailStock.listedDate || '--' }}</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import gpApi from '@/business/api/gp'
export default {
  name: 'BusinessUS',
  data() {
    return {
      keyword: '',
      page: 1,
      pageSize: 10,
      total: 0,
      detailVisible: false,
      detailStock: null,
      stockList: []
    }
  },
  computed: {
    columns() {
      return [
        { prop: 'name', label: '股票名称', width: '200px' },
        { prop: 'code', label: '代码', width: '140px' },
        { prop: 'price', label: '最新价', width: '100px', align: 'right' },
        { prop: 'changePercent', label: '涨跌幅', width: '100px', align: 'right' },
        { prop: 'changeAmount', label: '涨跌额', width: '100px', align: 'right' },
        { prop: 'marketValue', label: '市值', width: '120px', align: 'right' },
        { prop: 'type', label: '类型', width: '80px' },
        { prop: 'listedDate', label: '上市日期', width: '120px' }
      ]
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      const params = {
        pageParameter: { pageNum: String(this.page), pageSize: String(this.pageSize) },
        market: 'US'
      }
      if (this.keyword.trim()) {
        params.match = [
          { key: 'name', value: this.keyword.trim() },
          { key: 'code', value: this.keyword.trim() }
        ]
        params.conditionalRelation = 'or'
      }
      gpApi.list(params).then(res => {
        const data = res.data || res
        this.stockList = data.list || data.records || []
        this.total = data.total || 0
      }).catch(() => {
        this.stockList = []
        this.total = 0
      })
    },
    handleSearch() {
      this.page = 1
      this.loadData()
    },
    goDetail(item) {
      this.detailStock = item
      this.detailVisible = true
    },
    handleAddWatch() { this.$message.info('请搜索股票后点击关注') }
  }
}
</script>

<style lang="scss" scoped>
@import '@/business/styles/index.scss';
.market-list { min-height: 200px; height: calc(100vh - 77px); }
.btn-add { background: $brand-primary !important; color: #fff !important; border: none !important; }
.stock-info {
  .stock-name { font-size: 14px; font-weight: 500; color: $text-primary; display: block; }
  .stock-code { font-size: 12px; color: $text-muted; }
}
.num-price { font-weight: 600; color: $text-primary; }
.up { color: #ff6b6b; } .down { color: #51cf66; }
.change-badge { display: inline-block; padding: 2px 10px; border-radius: 8px; font-size: 13px; font-weight: 500; }
.bg-up { background: rgba(255,107,107,0.15); color: #ff6b6b; } .bg-down { background: rgba(81,207,102,0.15); color: #51cf66; }
.text-secondary { color: $text-secondary; }

/* 详情弹窗 */
.stock-detail-dialog :deep(.el-dialog__header) {
  border-bottom: 1px solid #f3f4f6; padding: 16px 24px;
}
.stock-detail-dialog :deep(.el-dialog__title) {
  font-size: 18px; font-weight: 700; color: #1A0808;
}
.stock-detail-dialog :deep(.el-dialog__body) { padding: 24px; }
.detail-header { margin-bottom: 12px; }
.detail-code { font-size: 13px; color: #999; margin-bottom: 4px; }
.detail-name { font-size: 18px; font-weight: 700; color: #1A0808; }
.detail-info p { font-size: 14px; color: #666; margin: 6px 0; }
</style>
