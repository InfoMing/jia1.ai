<template>
  <div class="sms-page">
    <div class="page-inner">
      <!-- 标题行 -->
      <div class="page-header">
        <h2 class="page-title">短信记录</h2>
        <div class="sms-balance">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>短信余额：<strong>{{ smsBalance }}</strong> 条</span>
        </div>
        <el-button class="btn-recharge" size="small" @click="handleRecharge">短信充值</el-button>
      </div>

      <!-- Tab 栏 -->
      <div class="tabs">
        <span v-for="tab in timeTabs" :key="tab.key" :class="['tab', { active: activeTab === tab.key }]" @click="activeTab = tab.key">{{ tab.label }}</span>
      </div>

      <!-- 表格 -->
      <div class="sms-table">
        <div class="table-header">
          <span class="col-phone">接收手机号</span>
          <span class="col-content">短信内容</span>
          <span class="col-type">发送类型</span>
          <span class="col-status">发送状态</span>
          <span class="col-time">发送时间</span>
        </div>
        <div class="table-scroll">
          <div v-for="(item, idx) in records" :key="item.id" :class="['table-row', { 'row-alt': idx % 2 === 1 }]">
            <span class="col-phone">{{ item.phone }}</span>
            <div class="col-content">
              <span class="content-text">{{ item.content }}</span>
            </div>
            <span class="col-type">{{ item.type }}</span>
            <span class="col-status">
              <span :class="['status-tag', item.status === '成功' ? 'status-success' : 'status-fail']">{{ item.status }}</span>
            </span>
            <span class="col-time">{{ item.time }}</span>
          </div>
          <div v-if="records.length === 0" class="empty-data"><div class="empty-text">暂无短信记录</div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessSmsRecord',
  data() {
    return {
      smsBalance: '86',
      activeTab: '1y',
      timeTabs: [
        { key: '1y', label: '最近1年' },
        { key: '6m', label: '最近半年' },
        { key: '1m', label: '最近一个月' },
        { key: '1w', label: '最近一周' }
      ],
      records: [
        { id: 1, phone: '138****8888', content: '【合适价投】贵州茅台(600519)已触发买入监控，当前价1,698.30元，请及时关注', type: '监控触发', status: '成功', time: '2026-01-15 10:23:45' },
        { id: 2, phone: '138****8888', content: '【合适价投】宁德时代(300750)已触发卖出监控，当前价282.50元，请及时关注', type: '监控触发', status: '成功', time: '2026-01-10 14:15:30' },
        { id: 3, phone: '138****8888', content: '【合适价投】您的验证码是 123456，5分钟内有效', type: '验证码', status: '成功', time: '2026-01-01 09:00:00' }
      ]
    }
  },
  methods: {
    handleRecharge() { this.$message.info('充值功能开发中') }
  }
}
</script>

<style lang="scss" scoped>
@import '@/business/styles/index.scss';
.sms-page { padding: 24px 0; height: 100%; display: flex; flex-direction: column; overflow: hidden; }
.page-inner { max-width: $content-max-width; margin: 0 auto; padding: 0 24px; width: 100%; flex: 1; display: flex; flex-direction: column; overflow: hidden; }

.page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; flex-shrink: 0; }
.page-title { font-size: 24px; font-weight: 700; color: $text-primary; margin: 0 32px 0 0; }
.sms-balance { display: flex; align-items: center; gap: 6px; font-size: 14px; color: $text-secondary; flex: 1; strong { color: $brand-primary; font-size: 16px; } }
.btn-recharge { margin-left: auto; background: $brand-primary !important; color: #fff !important; border: none !important; border-radius: 4px !important; }

.tabs { display: flex; gap: 8px; margin-bottom: 16px; flex-shrink: 0; }
.tab { padding: 6px 18px; font-size: 13px; color: #666; background: #f5f5f5; border-radius: 6px; font-weight: 500; cursor: pointer; transition: all 0.2s; &:hover { background: #e8e8e8; } &.active { background: rgba(255,107,107,0.15); color: #ff6b6b; &:hover { background: rgba(255,107,107,0.2); } } }

.sms-table { background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); overflow: hidden; display: flex; flex-direction: column; flex: 1; min-height: 0; }
.table-header, .table-row { display: flex; align-items: center; padding: 0 24px; font-size: 13px; }
.table-header { background: #f9fafb; color: #666; font-weight: 500; border-bottom: 1px solid #f0f0f0; flex-shrink: 0; }
.table-scroll { flex: 1; overflow-y: auto; }
.table-row { min-height: 60px; border-bottom: 1px solid #f0f0f0; transition: background 0.15s; &:hover { background: #f8f8f8; } &:last-child { border-bottom: none; } }

.col-phone { width: 160px; color: $text-primary; }
.col-content { width: 380px; }
.content-text { display: block; font-size: 13px; color: $text-primary; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.col-type { width: 120px; color: $text-secondary; }
.col-status { width: 100px; }
.status-tag { display: inline-block; padding: 2px 10px; border-radius: 8px; font-size: 12px; font-weight: 500; }
.status-success { background: rgba(81,207,102,0.15); color: #51cf66; }
.status-fail { background: rgba(255,107,107,0.15); color: #ff6b6b; }
.col-time { flex: 1; color: $text-secondary; }
.empty-data { padding: 48px; text-align: center; .empty-text { font-size: 14px; color: $text-muted; } }
</style>
