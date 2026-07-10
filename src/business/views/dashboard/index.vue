<template>
  <div class="dashboard-page">
    <div class="page-inner">
      <!-- 欢迎语 -->
      <div class="welcome-section">
        <div class="welcome-text">您好，{{ username }}</div>
        <div class="welcome-date">{{ currentDate }}</div>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-value">{{ stats.monitoring }}</div>
          <div class="stat-label">监控中</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="color:#E67E22">{{ stats.triggered }}</div>
          <div class="stat-label">已触发</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="color:#E67E22">{{ stats.todayTrigger }}</div>
          <div class="stat-label">今日触发</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="color:#009944">{{ stats.notifySuccess }}</div>
          <div class="stat-label">通知成功</div>
        </div>
      </div>

      <!-- 最近触发（时间线样式） -->
      <div class="section-wrap">
        <div class="section-header">
          <span class="section-title">最近触发</span>
          <router-link to="/b/dashboard" class="section-more">更多 &gt;</router-link>
        </div>
        <div class="timeline" v-if="recentTriggers.length > 0">
          <div class="timeline-item" v-for="item in recentTriggers" :key="item.id">
            <div class="timeline-dot" :class="item.status === 'success' ? 'dot-success' : 'dot-warning'" />
            <div class="timeline-content">
              <div class="timeline-row">
                <span class="timeline-security">{{ item.security }}</span>
                <span class="timeline-condition">{{ item.condition }}</span>
                <span class="timeline-value" :class="item.change >= 0 ? 'up' : 'down'">{{ item.value }}</span>
              </div>
              <div class="timeline-row">
                <span class="timeline-date">{{ item.date }}</span>
                <span class="timeline-status success">已通知</span>
              </div>
            </div>
          </div>
        </div>
        <div class="empty-data" v-else>暂无触发记录</div>
      </div>

      <!-- 监控规则表格 -->
      <div class="section-wrap">
        <div class="section-header">
          <span class="section-title">我的监控规则</span>
          <el-button size="small" class="btn-add" icon="el-icon-plus" @click="handleAddRule">新建规则</el-button>
        </div>
        <el-table :data="ruleList" stripe style="width:100%" v-loading="loading" size="small" header-row-class-name="table-header">
          <el-table-column prop="securityName" label="股票" width="120" />
          <el-table-column prop="conditionType" label="条件" width="120">
            <template slot-scope="{ row }">
              {{ conditionTypeMap[row.conditionType] || row.conditionType }}
            </template>
          </el-table-column>
          <el-table-column prop="currentPrice" label="当前价" width="100">
            <template slot-scope="{ row }">
              <span class="num-price">{{ row.currentPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="thresholdValue" label="阈值" width="100" />
          <el-table-column prop="status" label="状态" width="90">
            <template slot-scope="{ row }">
              <span :class="row.status === 1 ? 'status-on' : 'status-off'">
                {{ row.status === 1 ? '监控中' : '已禁用' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="190">
            <template #default="{ row }">
              <el-link type="primary" :underline="'never'" size="small" @click="handleEdit(row)">编辑</el-link>
              <el-link type="primary" :underline="'never'" size="small" @click="handleToggle(row)">
                {{ row.status === 1 ? '禁用' : '启用' }}
              </el-link>
              <el-link type="danger" :underline="'never'" size="small" style="margin-left:8px" @click="handleDelete(row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrap" v-if="total > 0">
          <el-pagination
            :page-size="pageSize"
            :total="total"
            :current-page.sync="pageNum"
            layout="total, prev, pager, next"
            @current-change="loadRules" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessDashboard',
  data() {
    return {
      username: '用户',
      currentDate: '',
      loading: false,
      stats: { monitoring: 12, triggered: 8, todayTrigger: 3, notifySuccess: 8 },
      recentTriggers: [
        { id: 1, security: '贵州茅台', condition: '跌至5年最低', value: '1502.00', date: '2026-06-28 14:30', change: -2.1, status: 'success' },
        { id: 2, security: '比亚迪', condition: '低于指定价格', value: '271.67', date: '2026-06-27 09:35', change: -1.5, status: 'success' },
        { id: 3, security: '宁德时代', condition: '估值低于50%', value: '211.90', date: '2026-06-26 10:15', change: +0.8, status: 'success' }
      ],
      ruleList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      conditionTypeMap: {
        five_year_low: '5年最低',
        price: '指定价格',
        valuation: '估值',
        dividend: '股息率'
      }
    }
  },
  created() {
    this.initUserInfo()
    this.loadRules()
  },
  methods: {
    initUserInfo() {
      const now = new Date()
      this.currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
      try {
        const user = JSON.parse(sessionStorage.getItem('LOCAL_CACHE_USER_INFO_KEY') || '{}')
        this.username = user.user?.loginCode || '用户'
      } catch (e) {
        this.username = '用户'
      }
    },
    loadRules() {
      this.loading = true
      setTimeout(() => { this.loading = false }, 300)
    },
    handleAddRule() { this.$message.info('新建规则功能开发中') },
    handleEdit(row) { this.$message.info('编辑功能开发中') },
    handleToggle(row) { this.$message.info(row.status === 1 ? '禁用功能开发中' : '启用功能开发中') },
    handleDelete(row) { this.$message.info('删除功能开发中') }
  }
}
</script>

<style lang="scss" scoped>
@import '@/business/styles/index.scss';

.dashboard-page {
  background: $bg-page;
  min-height: calc(100vh - 200px);
}
.page-inner {
  max-width: $content-max-width;
  margin: 0 auto;
  padding: 24px 20px;
}
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  .welcome-text { font-size: 18px; font-weight: 700; color: $text-primary; }
  .welcome-date { font-size: $font-size-small; color: $text-muted; }
}
.stats-section {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  .stat-card {
    flex: 1;
    @include card-base;
    padding: 18px 10px;
    text-align: center;
    @include card-hover;
    .stat-value { font-size: 26px; font-weight: 700; color: $brand-primary; font-family: $font-family-nums; }
    .stat-label { font-size: $font-size-small; color: $text-muted; margin-top: 4px; }
  }
}
.section-wrap {
  @include card-base;
  padding: 16px;
  margin-bottom: 20px;
  border-radius: $card-radius;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid $border-light;
  .section-title { font-size: $font-size-h4; font-weight: 700; color: $text-primary; }
  .section-more { font-size: $font-size-small; color: $text-muted; text-decoration: none; &:hover { color: $brand-primary; } }
}
.btn-add {
  background: $brand-primary !important;
  color: $text-white !important;
  border: none !important;
  font-size: $font-size-small !important;
  &:hover { background: $brand-dark !important; }
}

// 时间线
.timeline {
  .timeline-item {
    display: flex;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid $border-light;
    &:last-child { border-bottom: none; }
  }
  .timeline-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-top: 6px;
    flex-shrink: 0;
    &.dot-success { background: $color-down; }
    &.dot-warning { background: #E67E22; }
  }
  .timeline-content {
    flex: 1;
  }
  .timeline-row {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: $font-size-small;
    margin-bottom: 2px;
  }
  .timeline-security { font-weight: 600; color: $text-primary; }
  .timeline-condition { color: $text-secondary; }
  .timeline-value { font-weight: 600; &.up { color: $color-up; } &.down { color: $color-down; } }
  .timeline-date { color: $text-muted; }
  .timeline-status.success { color: $color-down; }
}
.empty-data { text-align: center; color: $text-muted; padding: 24px; font-size: $font-size-small; }

.status-on { color: $color-down; font-size: $font-size-small; }
.status-off { color: $text-muted; font-size: $font-size-small; }
.pagination-wrap { margin-top: 16px; text-align: right; }
.num-price { font-family: $font-family-nums; font-weight: 600; }
</style>
