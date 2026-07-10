<template>
  <div class="monitor-page">
    <div class="page-inner">
      <!-- 页面标题行 -->
      <div class="page-header">
        <h2 class="page-title">我的监控</h2>
        <el-button class="btn-add" size="small" @click="handleNewRule">+ 新建监控规则</el-button>
      </div>

      <!-- Tab 栏 -->
      <div class="monitor-tabs">
        <span v-for="tab in ruleTabs" :key="tab.key" :class="['monitor-tab', { 'tab-active': activeTab === tab.key }]" @click="activeTab = tab.key">{{ tab.label }}</span>
      </div>

      <!-- 表格 -->
      <div class="rule-table">
        <div class="table-header">
          <span class="col-security">股票/规则名称</span>
          <span class="col-type">规则类型</span>
          <span class="col-condition">触发条件</span>
          <span class="col-notify">通知方式</span>
          <span class="col-status">状态</span>
          <span class="col-action">操作</span>
        </div>
        <div class="table-scroll">
          <div v-for="(item, idx) in pagedRules" :key="item.id" :class="['table-row']">
            <div class="col-security">
              <div class="stock-info">
                <span class="stock-name">{{ item.name }}</span>
                <span class="stock-code">{{ item.code }}</span>
              </div>
            </div>
            <span class="col-type">{{ item.ruleType }}</span>
            <span class="col-condition">{{ item.condition }}</span>
            <span class="col-notify">{{ item.notify }}</span>
            <span class="col-status">
              <span :class="['status-tag', item.status === 1 ? 'status-on' : 'status-off']">{{ item.status === 1 ? '监控中' : '已暂停' }}</span>
            </span>
            <span class="col-action">
              <el-link type="primary" :underline="'never'" size="small" @click="handleEdit(item)">编辑</el-link>
              <el-link type="primary" :underline="'never'" size="small" @click="handleToggle(item)">{{ item.status === 1 ? '暂停' : '启用' }}</el-link>
              <el-link type="danger" :underline="'never'" size="small" @click="handleDelete(item)">删除</el-link>
            </span>
          </div>
          <div v-if="filteredRules.length === 0" class="empty-data">
            <div class="empty-text">暂无监控规则</div>
            <el-button class="btn-add" @click="handleNewRule">新建规则</el-button>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-bar">
        <span class="total-info">共 {{ totalCount }} 条数据</span>
        <div class="pagination">
          <button class="page-btn" :disabled="page === 1" @click="page--">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <span v-for="p in pageCount" :key="p" :class="['page-num', { active: p === page }]" @click="page = p">{{ p }}</span>
          <button class="page-btn" :disabled="page === pageCount" @click="page++">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessMonitor',
  data() {
    return {
      activeTab: 'system',
      page: 1,
      pageSize: 4,
      totalCount: 48,
      ruleTabs: [
        { key: 'system', label: '系统规则' },
        { key: 'self', label: '自建规则' },
        { key: 'div', label: '分红规则' },
        { key: 'buy', label: '购买规则' }
      ],
      rules: [
        { id: 1, name: '贵州茅台', code: '600519.SH', ruleType: '价格低于', condition: '股价 ≤ 1,600.00 元', notify: '短信+邮件', status: 1, tab: 'system' },
        { id: 2, name: '招商银行', code: '600036.SH', ruleType: '价格低于', condition: '股价 ≤ 38.00 元', notify: '短信', status: 1, tab: 'system' },
        { id: 3, name: '宁德时代', code: '300750.SZ', ruleType: '价格高于', condition: '股价 ≥ 300.00 元', notify: '邮件', status: 0, tab: 'system' },
        { id: 4, name: '腾讯控股', code: '00700.HK', ruleType: '价格低于', condition: '股价 ≤ 400.00 元', notify: '短信+邮件', status: 1, tab: 'system' },
        { id: 5, name: '五粮液', code: '000858.SZ', ruleType: '价格低于', condition: '股价 ≤ 140.00 元', notify: '短信', status: 1, tab: 'system' },
        { id: 6, name: '美的集团', code: '000333.SZ', ruleType: '价格高于', condition: '股价 ≥ 75.00 元', notify: '邮件', status: 0, tab: 'system' },
        { id: 7, name: '中国平安', code: '601318.SH', ruleType: '价格低于', condition: '股价 ≤ 48.00 元', notify: '短信+邮件', status: 1, tab: 'self' },
        { id: 8, name: '比亚迪', code: '002594.SZ', ruleType: '价格高于', condition: '股价 ≥ 320.00 元', notify: '短信', status: 1, tab: 'self' },
        { id: 9, name: '长江电力', code: '600900.SH', ruleType: '价格低于', condition: '股价 ≤ 22.00 元', notify: '邮件', status: 0, tab: 'self' },
        { id: 10, name: '兴业银行', code: '601166.SH', ruleType: '价格低于', condition: '股价 ≤ 16.00 元', notify: '短信', status: 1, tab: 'div' },
        { id: 11, name: '海康威视', code: '002415.SZ', ruleType: '股息高于', condition: '股息率 ≥ 4.0%', notify: '短信+邮件', status: 1, tab: 'div' },
        { id: 12, name: '伊利股份', code: '600887.SH', ruleType: '价格低于', condition: '股价 ≤ 26.00 元', notify: '邮件', status: 1, tab: 'buy' }
      ]
    }
  },
  computed: {
    filteredRules() {
      return this.rules.filter(r => r.tab === this.activeTab || (this.activeTab === 'system' && r.tab === 'system') || (this.activeTab === 'self' && r.tab === 'self'))
    },
    pagedRules() {
      const start = (this.page - 1) * this.pageSize
      return this.filteredRules.slice(start, start + this.pageSize)
    },
    pageCount() {
      return Math.max(1, Math.ceil(this.filteredRules.length / this.pageSize))
    }
  },
  watch: {
    activeTab() { this.page = 1 }
  },
  methods: {
    handleNewRule() { this.$message.info('新建监控规则功能开发中') },
    handleEdit(item) { this.$message.info(`编辑 ${item.name} 的监控规则`) },
    handleToggle(item) {
      item.status = item.status === 1 ? 0 : 1
      this.$message.success(item.status === 1 ? '已启用' : '已暂停')
    },
    handleDelete(item) {
      this.$confirm(`确定删除 ${item.name} 的监控规则吗？`, '提示', { type: 'warning' }).then(() => {
        this.rules = this.rules.filter(r => r.id !== item.id)
        this.$message.success('已删除')
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/business/styles/index.scss';
.monitor-page { padding: 24px 0; height: 100%; display: flex; flex-direction: column; overflow: hidden; }
.page-inner { max-width: $content-max-width; margin: 0 auto; padding: 0 24px; width: 100%; flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-shrink: 0; }
.page-title { font-size: 24px; font-weight: 700; color: $text-primary; margin: 0; }
.btn-add { background: $brand-primary !important; color: #fff !important; border: none !important; }

.monitor-tabs { display: flex; gap: 8px; margin-bottom: 16px; flex-shrink: 0; }
.monitor-tab { padding: 6px 18px; font-size: 13px; color: #666; background: #f5f5f5; border-radius: 6px; font-weight: 500; cursor: pointer; transition: all 0.2s; &:hover { background: #e8e8e8; } }
.tab-active { background: rgba(255,107,107,0.15); color: #ff6b6b; &:hover { background: rgba(255,107,107,0.2); } }

.rule-table { background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); overflow: hidden; display: flex; flex-direction: column; flex: 1; min-height: 0; }
.table-header, .table-row { display: flex; align-items: center; padding: 0 24px; font-size: 13px; }
.table-header { height: 48px; background: #f9fafb; color: #666; font-weight: 500; border-bottom: 1px solid #f3f4f6; flex-shrink: 0; }
.table-scroll { flex: 1; overflow-y: auto; }
.table-row { height: 60px; border-bottom: 1px solid #f3f4f6; transition: background 0.15s; &:hover { background: #f8f8f8; } &:last-child { border-bottom: none; } }
.col-security { width: 200px; }
.stock-info { .stock-name { font-size: 14px; font-weight: 500; color: $text-primary; display: block; } .stock-code { font-size: 12px; color: $text-muted; } }
.col-type { width: 120px; color: $text-secondary; }
.col-condition { width: 220px; color: $text-primary; }
.col-notify { width: 100px; color: $text-secondary; }
.col-status { width: 80px; }
.status-tag { display: inline-block; padding: 2px 10px; border-radius: 9999px; font-size: 12px; font-weight: 500; }
.status-on { background: rgba(81,207,102,0.15); color: #51cf66; }
.status-off { background: rgba(255,107,107,0.15); color: #ff6b6b; }
.col-action { flex: 1; text-align: right; }
.empty-data { padding: 48px; text-align: center; .empty-text { font-size: 14px; color: $text-muted; margin-bottom: 16px; } }

.pagination-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  padding: 0 24px;
  background: #fff;
  border-top: 1px solid #f3f4f6;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  border-radius: 0 0 8px 8px;
  flex-shrink: 0;
}
.total-info { font-size: 13px; color: #999; }
.pagination { display: flex; align-items: center; gap: 4px; }
.page-btn {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid #e5e7eb; border-radius: 4px;
  background: #fff; cursor: pointer;
  color: #666; font-size: 14px;
  transition: all 0.15s;
  &:disabled { opacity: 0.4; cursor: default; }
  &:hover:not(:disabled) { background: #f5f5f5; }
}
.page-num {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid #e5e7eb; border-radius: 4px;
  font-size: 14px; color: #444; cursor: pointer;
  transition: all 0.15s;
  &.active { background: #ff6b6b; color: #fff; border-color: #ff6b6b; }
  &:hover:not(.active) { background: #f5f5f5; }
}
</style>
