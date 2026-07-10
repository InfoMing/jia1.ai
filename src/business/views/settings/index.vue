<template>
  <div class="settings-page">
    <div class="page-inner">
      <div class="settings-layout">
        <!-- 侧边菜单 -->
        <div class="settings-sidebar">
          <div class="sidebar-title">账户设置</div>
          <div
            v-for="item in menuItems"
            :key="item.key"
            :class="['sidebar-item', { active: activeMenu === item.key }]"
            @click="activeMenu = item.key"
          >
            <span class="sidebar-item-icon" v-html="item.icon" />
            <span>{{ item.label }}</span>
          </div>
        </div>

        <!-- 主设置面板 -->
        <div class="settings-content">

          <!-- 我的账号 -->
          <template v-if="activeMenu === 'account'">
            <div class="settings-card">
              <div class="card-title">我的账号</div>
              <div class="card-divider" />

              <!-- 头像行 -->
              <div class="avatar-row">
                <div class="avatar-section">
                  <div class="avatar-large">{{ avatarChar }}</div>
                  <div class="avatar-info">
                    <div class="avatar-name">{{ username }}</div>
                    <div class="avatar-date">注册时间：{{ registerDate }}</div>
                  </div>
                </div>
                <el-button class="btn-edit" size="small" @click="handleEdit">编辑资料</el-button>
              </div>

              <!-- 信息网格 -->
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">手机号</div>
                  <div class="info-value">138****8888</div>
                </div>
                <div class="info-item">
                  <div class="info-label">邮箱</div>
                  <div class="info-value">zhang****@qq.com</div>
                </div>
              </div>
            </div>

            <!-- 短信余额卡 -->
            <div class="settings-card">
              <div class="card-title">短信余额与充值</div>
              <div class="balance-row">
                <div class="balance-left">
                  <div class="balance-label">当前短信余额</div>
                  <div class="balance-num">{{ smsBalance }} 条</div>
                </div>
                <el-button class="btn-recharge" @click="handleRecharge">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  立即充值
                </el-button>
              </div>
            </div>
          </template>

          <!-- 修改密码 -->
          <template v-if="activeMenu === 'password'">
            <div class="settings-card">
              <div class="card-title">修改密码</div>
              <div class="card-divider" />
              <el-form label-width="100px" class="password-form">
                <el-form-item label="原密码">
                  <el-input type="password" v-model="pwdForm.oldPassword" placeholder="请输入原密码" style="width:300px" />
                </el-form-item>
                <el-form-item label="新密码">
                  <el-input type="password" v-model="pwdForm.newPassword" placeholder="请输入新密码" style="width:300px" />
                </el-form-item>
                <el-form-item label="确认密码">
                  <el-input type="password" v-model="pwdForm.confirmPassword" placeholder="请再次输入新密码" style="width:300px" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleChangePwd">确认修改</el-button>
                </el-form-item>
              </el-form>
            </div>
          </template>

          <!-- 短信余额 -->
          <template v-if="activeMenu === 'balance'">
            <div class="settings-card">
              <div class="card-title">短信余额</div>
              <div class="card-divider" />
              <div class="single-balance">
                <div class="balance-big">{{ smsBalance }}</div>
                <div class="balance-unit">条</div>
                <el-button class="btn-recharge" @click="handleRecharge">立即充值</el-button>
              </div>
            </div>
          </template>

          <!-- 充值记录 -->
          <template v-if="activeMenu === 'recharge'">
            <div class="settings-card">
              <div class="card-title">充值记录</div>
              <div class="card-divider" />
              <div class="recharge-table">
                <div class="r-header"><span>时间</span><span>金额</span><span>数量</span><span>状态</span></div>
                <div class="r-row" v-for="r in rechargeRecords" :key="r.id">
                  <span>{{ r.time }}</span><span>{{ r.amount }}</span><span>{{ r.count }}</span><span class="status-success">{{ r.status }}</span>
                </div>
                <div v-if="rechargeRecords.length === 0" class="empty-text" style="padding: 24px; text-align: center;">暂无充值记录</div>
              </div>
            </div>
          </template>

          <!-- 通知设置 -->
          <template v-if="activeMenu === 'notify'">
            <div class="settings-card">
              <div class="card-title">通知设置</div>
              <div class="card-divider" />
              <el-form label-width="120px">
                <el-form-item label="短信通知">
                  <el-switch v-model="notifySettings.sms" active-color="#f7971e" />
                </el-form-item>
                <el-form-item label="邮件通知">
                  <el-switch v-model="notifySettings.email" active-color="#f7971e" />
                </el-form-item>
                <el-form-item label="通知手机号">
                  <el-input v-model="notifySettings.phone" placeholder="请输入手机号" style="width:300px" />
                </el-form-item>
                <el-form-item label="通知邮箱">
                  <el-input v-model="notifySettings.emailAddr" placeholder="请输入邮箱" style="width:300px" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleSaveNotify">保存设置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </template>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessSettings',
  data() {
    return {
      activeMenu: 'account',
      username: '张先生',
      registerDate: '2024-06-01',
      smsBalance: '86',
      rechargeRecords: [],
      pwdForm: { oldPassword: '', newPassword: '', confirmPassword: '' },
      notifySettings: { sms: true, email: true, phone: '138****8888', emailAddr: 'zhang****@qq.com' },
      menuItems: [
        { key: 'account', label: '我的账号', icon: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
        { key: 'password', label: '修改密码', icon: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' },
        { key: 'balance', label: '短信余额', icon: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
        { key: 'recharge', label: '充值记录', icon: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>' },
        { key: 'notify', label: '通知设置', icon: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' }
      ]
    }
  },
  computed: {
    avatarChar() { return this.username ? this.username.charAt(0) : '张' }
  },
  methods: {
    handleEdit() { this.$message.info('编辑资料功能开发中') },
    handleRecharge() { this.$message.info('充值功能开发中，请联系客服') },
    handleChangePwd() { this.$message.success('密码修改成功（演示）') },
    handleSaveNotify() { this.$message.success('通知设置已保存（演示）') }
  }
}
</script>

<style lang="scss" scoped>
@import '@/business/styles/index.scss';
.settings-page { padding: 24px 0; }
.page-inner { max-width: $content-max-width; margin: 0 auto; padding: 0 24px; }

.settings-layout { display: flex; gap: 24px; min-height: 500px; }

/* 侧边菜单 */
.settings-sidebar { width: 220px; flex-shrink: 0; background: $bg-card; border: 1px solid $border-color; border-radius: 8px; padding: 16px 0; height: fit-content; }
.sidebar-title { padding: 8px 20px; font-size: 14px; font-weight: 600; color: $text-primary; margin-bottom: 4px; }
.sidebar-item { display: flex; align-items: center; gap: 10px; padding: 12px 20px; font-size: 14px; color: $text-secondary; cursor: pointer; transition: all 0.15s; &:hover { color: $brand-primary; background: rgba(247,151,30,0.05); } &.active { color: $brand-primary; background: rgba(247,151,30,0.08); font-weight: 500; } }
.sidebar-item-icon { display: flex; align-items: center; }

/* 内容 */
.settings-content { flex: 1; }
.settings-card { background: $bg-card; border: 1px solid $border-color; border-radius: 8px; padding: 24px; margin-bottom: 16px; }
.card-title { font-size: 18px; font-weight: 600; color: $text-primary; }
.card-divider { height: 1px; background: $border-color; margin: 16px 0; }

.avatar-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.avatar-section { display: flex; align-items: center; gap: 16px; }
.avatar-large { width: 64px; height: 64px; border-radius: 50%; background: $brand-primary; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 600; }
.avatar-info { .avatar-name { font-size: 18px; font-weight: 600; color: $text-primary; } .avatar-date { font-size: 13px; color: $text-muted; margin-top: 4px; } }
.btn-edit { background: $brand-primary !important; color: #fff !important; border: none !important; border-radius: 4px !important; }

.info-grid { display: flex; gap: 24px; }
.info-item { flex: 1; max-width: 300px; }
.info-label { font-size: 13px; color: $text-muted; margin-bottom: 4px; }
.info-value { font-size: 15px; color: $text-primary; }

.balance-row { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; }
.balance-left { text-align: center; }
.balance-label { font-size: 14px; color: $text-muted; margin-bottom: 4px; }
.balance-num { font-size: 28px; font-weight: 700; color: $brand-primary; }
.btn-recharge { display: inline-flex; align-items: center; gap: 6px; background: $brand-primary !important; color: #fff !important; border: none !important; border-radius: 6px !important; padding: 12px 24px !important; font-size: 15px !important; }

.single-balance { display: flex; align-items: baseline; gap: 8px; padding: 24px 0; .balance-big { font-size: 48px; font-weight: 700; color: $brand-primary; } .balance-unit { font-size: 18px; color: $text-secondary; } .btn-recharge { margin-left: 24px; } }

.recharge-table { width: 100%; }
.r-header { display: flex; font-size: 13px; color: $text-muted; padding: 8px 0; border-bottom: 1px solid $border-color; span { flex: 1; } }
.r-row { display: flex; font-size: 14px; color: $text-primary; padding: 12px 0; border-bottom: 1px solid #f5f5f5; span { flex: 1; } &:last-child { border-bottom: none; } }

.status-success { color: #2e7d32; }
.empty-text { font-size: 14px; color: $text-muted; }

.password-form { max-width: 500px; }
</style>
