<template>
  <div class="trigger-page">
    <div class="page-inner">
      <h2 class="page-title">监控触发记录</h2>

      <!-- Tab 栏 -->
      <div class="tabs">
        <span v-for="tab in timeTabs" :key="tab.key" :class="['tab', { active: activeTab === tab.key }]" @click="activeTab = tab.key">{{ tab.label }}</span>
      </div>

      <!-- 搜索 -->
      <div class="toolbar">
        <div class="search-input">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input v-model="keyword" placeholder="搜索股票名称/规则名称" />
        </div>
      </div>

      <!-- 表格 -->
      <div class="trigger-table">
        <div class="table-header">
          <span class="col-name">股票名称</span>
          <span class="col-rule">触发规则</span>
          <span class="col-price">触发价格</span>
          <span class="col-notify">通知方式</span>
          <span class="col-time">触发时间</span>
          <span class="col-action">操作</span>
        </div>
        <div class="table-scroll">
          <div v-for="(item, idx) in filteredList" :key="item.id" :class="['table-row', { 'row-alt': idx % 2 === 1 }]">
            <div class="col-name"><div class="stock-info"><span class="stock-name">{{ item.name }}</span><span class="stock-code">{{ item.code }}</span></div></div>
            <span class="col-rule">{{ item.rule }}</span>
            <span class="col-price num-price">{{ item.triggerPrice }}</span>
            <span class="col-notify">{{ item.notify }}</span>
            <span class="col-time">{{ item.time }}</span>
            <span class="col-action">
              <el-link type="primary" :underline="'never'" size="small" @click="handleDetail(item)">查看详情</el-link>
              <el-link type="danger" :underline="'never'" size="small" @click="handleDelete(item)">删除</el-link>
            </span>
          </div>
          <div v-if="filteredList.length === 0" class="empty-data"><div class="empty-text">暂无触发记录</div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessTriggerRecord',
  data() {
    return {
      keyword: '',
      activeTab: '1y',
      timeTabs: [
        { key: '1y', label: '最近1年' },
        { key: '6m', label: '最近半年' },
        { key: '1m', label: '最近一个月' },
        { key: '1w', label: '最近一周' }
      ],
      records: [
        { id: 1, name: '贵州茅台', code: '600519.SH', rule: '股价 ≤ 1,700.00 元', triggerPrice: '1,698.30', notify: '短信', time: '2026-01-15 10:23:45' },
        { id: 2, name: '宁德时代', code: '300750.SZ', rule: '股价 ≥ 280.00 元', triggerPrice: '282.50', notify: '邮件', time: '2026-01-10 14:15:30' },
        { id: 3, name: '腾讯控股', code: '00700.HK', rule: '股价 ≤ 420.00 元', triggerPrice: '418.60', notify: '短信+邮件', time: '2026-01-05 09:31:22' }
      ]
    }
  },
  computed: {
    filteredList() {
      let list = this.records
      if (this.keyword.trim()) {
        const kw = this.keyword.trim().toLowerCase()
        list = list.filter(s => s.name.includes(kw) || s.code.toLowerCase().includes(kw) || s.rule.includes(kw))
      }
      return list
    }
  },
  methods: {
    handleDetail(item) { this.$message.info(`查看 ${item.name} 触发详情`) },
    handleDelete(item) {
      this.$confirm('确定删除该记录吗？', '提示', { type: 'warning' }).then(() => {
        this.records = this.records.filter(r => r.id !== item.id)
        this.$message.success('已删除')
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/business/styles/index.scss';
.trigger-page { padding: 24px 0; height: 100%; display: flex; flex-direction: column; overflow: hidden; }
.page-inner { max-width: $content-max-width; margin: 0 auto; padding: 0 24px; width: 100%; flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.page-title { font-size: 24px; font-weight: 700; color: $text-primary; margin: 0 0 20px; flex-shrink: 0; }
.tabs { display: flex; gap: 8px; margin-bottom: 16px; flex-shrink: 0; }
.tab { padding: 6px 18px; font-size: 13px; color: #666; background: #f5f5f5; border-radius: 6px; font-weight: 500; cursor: pointer; transition: all 0.2s; &:hover { background: #e8e8e8; } &.active { background: rgba(255,107,107,0.15); color: #ff6b6b; &:hover { background: rgba(255,107,107,0.2); } } }
.toolbar { display: flex; margin-bottom: 16px; flex-shrink: 0; }
.search-input { display: flex; align-items: center; gap: 6px; width: 280px; height: 38px; border: 1px solid $border-color; border-radius: 6px; padding: 0 12px; &:focus-within { border-color: $brand-primary; } svg { color: $text-muted; flex-shrink: 0; } input { flex: 1; border: none; outline: none; font-size: 13px; color: $text-primary; &::placeholder { color: $text-muted; } } }
.trigger-table { background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); overflow: hidden; display: flex; flex-direction: column; flex: 1; min-height: 0; }
.table-header, .table-row { display: flex; align-items: center; padding: 0 24px; font-size: 13px; }
.table-header { background: #f9fafb; color: #666; font-weight: 500; border-bottom: 1px solid #f0f0f0; flex-shrink: 0; }
.table-scroll { flex: 1; overflow-y: auto; }
.table-row { height: 60px; border-bottom: 1px solid #f0f0f0; transition: background 0.15s; &:hover { background: #f8f8f8; } &:last-child { border-bottom: none; } }
.col-name { width: 180px; }
.stock-info { .stock-name { font-size: 14px; font-weight: 500; color: $text-primary; display: block; } .stock-code { font-size: 12px; color: $text-muted; } }
.col-rule { width: 220px; color: $text-primary; }
.col-price { width: 120px; text-align: right; font-weight: 600; color: $text-primary; }
.col-notify { width: 120px; color: $text-secondary; }
.col-time { width: 160px; color: $text-secondary; }
.col-action { flex: 1; text-align: right; }
.col-action .el-button--text { padding: 0 6px; }
.empty-data { padding: 48px; text-align: center; .empty-text { font-size: 14px; color: $text-muted; } }
</style>
