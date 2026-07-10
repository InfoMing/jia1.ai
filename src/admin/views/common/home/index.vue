<template>
  <div class="dashboard-page">
    <!-- 顶部欢迎 + 统计卡片 -->
    <div class="welcome-section">
      <div class="welcome-text">
        <h2>👋 欢迎回来</h2>
        <p>今天是 {{ today }}，一切运行正常</p>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card" v-for="s in stats" :key="s.label">
        <div class="stat-icon" :style="{ background: s.bg }">
          <svg-icon :icon-class="s.icon" />
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ s.value }}</span>
          <span class="stat-label">{{ s.label }}</span>
        </div>
      </div>
    </div>

    <!-- 快捷操作 + 信息 -->
    <div class="content-grid">
      <div class="card quick-actions">
        <div class="card-header">📌 快捷操作</div>
        <div class="card-body actions">
          <el-button v-for="act in actions" :key="act.label" :type="act.type" plain size="small"
            @click="$router.push(act.path)">
            {{ act.label }}
          </el-button>
        </div>
      </div>

      <div class="card system-info">
        <div class="card-header">ℹ️ 系统信息</div>
        <div class="card-body">
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="前端版本">Vue 3.5 + Element Plus</el-descriptions-item>
            <el-descriptions-item label="后端框架">Spring Boot</el-descriptions-item>
            <el-descriptions-item label="运行状态">✅ 正常运行</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      today: '',
      stats: [
        { icon: 'user', label: '用户总数', value: '—', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { icon: 'role', label: '角色数量', value: '—', bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { icon: 'schedule', label: '定时任务', value: '—', bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
        { icon: 'monitor', label: '监控规则', value: '—', bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
      ],
      actions: [
        { label: '用户管理', path: '/admin/system/user', type: 'primary' },
        { label: '角色管理', path: '/admin/system/role', type: 'success' },
        { label: '定时任务', path: '/admin/system/schedule', type: 'warning' },
        { label: '股票管理', path: '/admin/stock/manage', type: 'danger' },
      ]
    }
  },
  created() {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const weekdays = ['日', '一', '二', '三', '四', '五', '六']
    this.today = `${y}年${m}月${day}日 星期${weekdays[d.getDay()]}`
  }
}
</script>

<style scoped lang="scss">
.dashboard-page {
  padding: 24px;
  height: 100%;
  overflow-y: auto;
  background: #f0f2f5;
}

.welcome-section {
  margin-bottom: 24px;
  .welcome-text {
    h2 { margin: 0 0 8px; font-size: 24px; color: #1a1a2e; }
    p { margin: 0; font-size: 14px; color: #666; }
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  .stat-card {
    display: flex;
    align-items: center;
    gap: 16px;
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      :deep(.svg-icon) { width: 24px; height: 24px; color: #fff; }
    }

    .stat-info {
      display: flex;
      flex-direction: column;
      .stat-value { font-size: 24px; font-weight: 700; color: #1a1a2e; }
      .stat-label { font-size: 13px; color: #999; margin-top: 2px; }
    }
  }
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);

  .card-header {
    padding: 16px 20px;
    font-size: 15px;
    font-weight: 600;
    color: #1a1a2e;
    border-bottom: 1px solid #f0f0f0;
  }

  .card-body { padding: 20px; }

  &.quick-actions .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>
