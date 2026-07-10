<template>
  <div class="login-page">
    <div class="login-card">
      <!-- 左侧品牌面板 -->
      <div class="login-brand">
        <div class="brand-content">
          <div class="brand-logo">
            <span class="brand-logo-icon">价</span>
          </div>
          <h2 class="brand-title">合适价投</h2>
          <p class="brand-subtitle">用合适的价格<br/>买入合适的股票</p>
          <p class="brand-desc">为价值付费，为价值投资<br/>智能监控，让投资更省心</p>
          <div class="brand-features">
            <div class="brand-feature-item">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#51cf66" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>股价自动监控，条件触发即时通知</span>
            </div>
            <div class="brand-feature-item">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#51cf66" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>A股/港股/美股/基金全覆盖</span>
            </div>
            <div class="brand-feature-item">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#51cf66" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>短信/邮件双渠道通知</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录面板 -->
      <div class="login-form-panel">
        <!-- 标签切换：登录 / 注册 -->
        <div class="form-tabs">
          <span :class="['form-tab', { active: activeTab === 'login' }]" @click="activeTab = 'login'">登录</span>
          <span :class="['form-tab', { active: activeTab === 'register' }]" @click="activeTab = 'register'">注册</span>
        </div>

        <!-- 子标签：密码登录 / 验证码登录（仅登录时显示）-->
        <div class="sub-tabs" v-if="activeTab === 'login'">
          <span :class="['sub-tab', { active: subTab === 'account' }]" @click="subTab = 'account'">密码登录</span>
          <span class="sub-tab-sep">|</span>
          <span :class="['sub-tab', { active: subTab === 'sms' }]" @click="subTab = 'sms'">验证码登录</span>
        </div>

        <!-- 登录表单：密码登录 -->
        <el-form v-if="activeTab === 'login' && subTab === 'account'" ref="pwdForm" :model="pwdForm" label-width="0" class="login-form">
          <el-form-item prop="account">
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <el-input v-model="pwdForm.account" placeholder="请输入手机号/账号" />
            </div>
          </el-form-item>
          <el-form-item prop="password">
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <el-input v-model="pwdForm.password" type="password" placeholder="请输入密码" show-password />
            </div>
          </el-form-item>
          <div class="remember-row">
            <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
          </div>
          <el-form-item>
            <el-button class="submit-btn" :loading="pwdLoading" @click="handlePwdLogin">立即登录</el-button>
          </el-form-item>
          <div class="form-bottom">
            <router-link to="/b/forgot-password" class="form-link">找回密码</router-link>
            <span class="form-link" @click="activeTab = 'register'">还没有账号？立即注册</span>
          </div>
        </el-form>

        <!-- 登录表单：验证码登录 -->
        <el-form v-if="activeTab === 'login' && subTab === 'sms'" ref="smsForm" :model="smsForm" label-width="0" class="login-form">
          <el-form-item prop="phone">
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12" y2="18" />
              </svg>
              <el-input v-model="smsForm.phone" placeholder="请输入手机号" maxlength="11" />
            </div>
          </el-form-item>
          <el-form-item prop="code">
            <div class="input-wrap code-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <el-input v-model="smsForm.code" placeholder="请输入验证码" maxlength="6" />
              <el-button class="code-btn" :disabled="codeSending || codeCountdown > 0" @click="sendCode">
                {{ codeCountdown > 0 ? codeCountdown + 's' : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button class="submit-btn" :loading="smsLoading" @click="handleSmsLogin">立即登录</el-button>
          </el-form-item>
        </el-form>

        <!-- 注册表单 -->
        <el-form v-if="activeTab === 'register'" ref="regForm" :model="regForm" label-width="0" class="login-form">
          <el-form-item prop="account">
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <el-input v-model="regForm.account" placeholder="账号（选填，数字+字母组合）" />
            </div>
          </el-form-item>
          <el-form-item prop="phone">
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12" y2="18" />
              </svg>
              <el-input v-model="regForm.phone" placeholder="请输入手机号" maxlength="11" />
            </div>
          </el-form-item>
          <el-form-item prop="code">
            <div class="input-wrap code-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <el-input v-model="regForm.code" placeholder="请输入验证码" maxlength="6" />
              <el-button class="code-btn" :disabled="codeSending || codeCountdown > 0" @click="sendCode">
                {{ codeCountdown > 0 ? codeCountdown + 's' : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>
          <el-form-item prop="password">
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <el-input v-model="regForm.password" type="password" placeholder="请设置密码" show-password />
            </div>
          </el-form-item>
          <el-form-item>
            <el-button class="submit-btn" :loading="regLoading" @click="handleRegister">立即注册</el-button>
          </el-form-item>
          <div class="form-bottom">
            <span>已有账号？</span>
            <span class="form-link" @click="activeTab = 'login'">立即登录</span>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import userApi from '@/admin/api/user'

export default {
  name: 'BusinessLogin',
  data() {
    return {
      activeTab: 'login',
      subTab: 'account',
      codeSending: false,
      codeCountdown: 0,
      pwdLoading: false,
      smsLoading: false,
      regLoading: false,
      rememberMe: false,
      smsForm: { phone: '', code: '' },
      pwdForm: { account: 'admin', password: '123456' },
      regForm: { account: '', phone: '', code: '', password: '' }
    }
  },
  created() {
    this.loadRemembered()
  },
  methods: {
    loadRemembered() {
      const saved = localStorage.getItem('REMEMBERED_CREDENTIALS')
      if (saved) {
        try {
          const { account, password } = JSON.parse(saved)
          if (account) this.pwdForm.account = account
          if (password) this.pwdForm.password = password
          this.rememberMe = true
        } catch (e) { /* ignore */ }
      }
    },
    saveRemembered() {
      if (this.rememberMe) {
        localStorage.setItem('REMEMBERED_CREDENTIALS', JSON.stringify({
          account: this.pwdForm.account,
          password: this.pwdForm.password
        }))
      } else {
        localStorage.removeItem('REMEMBERED_CREDENTIALS')
      }
    },
    sendCode() {
      this.codeSending = true
      this.codeCountdown = 60
      this.$message.success('验证码已发送（演示）')
      const timer = setInterval(() => {
        this.codeCountdown--
        if (this.codeCountdown <= 0) { clearInterval(timer); this.codeSending = false }
      }, 1000)
    },
    // 校验并提示
    validateRequired(value, fieldName) {
      if (!value || !value.toString().trim()) {
        this.$message.error('请填写' + fieldName)
        return false
      }
      return true
    },
    handlePwdLogin() {
      if (!this.validateRequired(this.pwdForm.account, '账号/手机号')) return
      if (!this.validateRequired(this.pwdForm.password, '密码')) return
      this.pwdLoading = true
      userApi.login({
        account: this.pwdForm.account,
        password: this.pwdForm.password,
        loginMode: 1
      }).then(res => {
        this.pwdLoading = false
        if (!res.success) return
        this.saveRemembered()
        this.saveLoginState(res.data)
        this.$message.success('登录成功')
        this.$router.push('/b/market')
      }).catch(e => {
        this.pwdLoading = false
        this.$message.error(e.message || '登录失败，请重试')
      })
    },
    handleSmsLogin() {
      if (!this.validateRequired(this.smsForm.phone, '手机号')) return
      if (!this.validateRequired(this.smsForm.code, '验证码')) return
      this.smsLoading = true
      userApi.login({
        account: this.smsForm.phone,
        password: this.smsForm.code,
        loginMode: 2
      }).then(res => {
        this.smsLoading = false
        if (!res.success) return
        this.saveLoginState(res.data)
        this.$message.success('登录成功')
        this.$router.push('/b/market')
      }).catch(e => {
        this.smsLoading = false
        this.$message.error(e.message || '登录失败，请重试')
      })
    },
    handleRegister() {
      if (!this.validateRequired(this.regForm.phone, '手机号')) return
      if (!this.validateRequired(this.regForm.code, '验证码')) return
      if (!this.validateRequired(this.regForm.password, '密码')) return
      this.regLoading = true
      userApi.register({
        account: this.regForm.account || undefined,
        phone: this.regForm.phone,
        code: this.regForm.code,
        password: this.regForm.password
      }).then(res => {
        if (!res.success) {
          this.regLoading = false
          return
        }
        this.$message.success('注册成功，正在自动登录...')
        userApi.login({
          account: this.regForm.phone,
          password: this.regForm.password,
          loginMode: 2
        }).then(loginRes => {
          this.regLoading = false
          if (!loginRes.success) return
          this.saveLoginState(loginRes.data)
          this.$router.push('/b/market')
        }).catch(e => {
          this.regLoading = false
          this.$message.error('注册成功但自动登录失败，请前往登录页手动登录')
          this.activeTab = 'login'
        })
      }).catch(e => {
        this.regLoading = false
        this.$message.error(e.message || '注册失败，请重试')
      })
    },
    saveLoginState(data) {
      // 始终写入 sessionStorage，确保 getToken() 能读取到
      sessionStorage.setItem('LOCAL_CACHE_USER_INFO_KEY', JSON.stringify(data))
      // 勾选记住密码时额外写入 localStorage，持久化保存
      if (this.rememberMe) {
        localStorage.setItem('LOCAL_CACHE_USER_INFO_KEY', JSON.stringify(data))
      } else {
        localStorage.removeItem('LOCAL_CACHE_USER_INFO_KEY')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './_login-common.scss';
</style>
