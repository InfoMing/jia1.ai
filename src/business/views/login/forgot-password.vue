<template>
  <div class="login-page">
    <div class="login-card">
      <div class="forgot-panel">
        <div class="page-title">合适价投</div>
        <div class="page-subtitle">找回密码</div>

        <el-form ref="forgotForm" :model="form" label-width="0" class="login-form">

          <!-- 手机号 / 邮箱 -->
          <el-form-item prop="account">
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <el-input v-model="form.account" placeholder="请输入绑定的手机号或邮箱" />
            </div>
          </el-form-item>

          <!-- 验证码 -->
          <el-form-item prop="code">
            <div class="input-wrap code-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <el-input v-model="form.code" placeholder="输入验证码" maxlength="6" />
              <el-button class="code-btn" :disabled="codeCountdown > 0" @click="sendCode">
                {{ codeCountdown > 0 ? codeCountdown + 's' : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>

          <!-- 新密码 -->
          <el-form-item prop="newPassword">
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <el-input v-model="form.newPassword" type="password" placeholder="设置新密码" show-password />
            </div>
          </el-form-item>

          <!-- 确认新密码 -->
          <el-form-item prop="confirmPassword">
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <el-input v-model="form.confirmPassword" type="password" placeholder="确认新密码" show-password />
            </div>
          </el-form-item>

          <el-form-item>
            <el-button class="submit-btn" :loading="resetLoading" @click="handleReset">重置密码</el-button>
          </el-form-item>
        </el-form>

        <div class="form-bottom" style="justify-content:center">
          <router-link to="/b/login" class="form-link">返回登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userApi from '@/admin/api/user'

export default {
  name: 'BusinessForgotPassword',
  data() {
    return {
      codeCountdown: 0,
      resetLoading: false,
      form: {
        account: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    validateRequired(value, fieldName) {
      if (!value || !value.toString().trim()) {
        this.$message.error('请填写' + fieldName)
        return false
      }
      return true
    },
    sendCode() {
      if (!this.validateRequired(this.form.account, '手机号或邮箱')) return
      this.$message.success('验证码已发送（验证码：8888）')
      this.codeCountdown = 60
      const timer = setInterval(() => {
        this.codeCountdown--
        if (this.codeCountdown <= 0) clearInterval(timer)
      }, 1000)
    },
    handleReset() {
      if (!this.validateRequired(this.form.account, '手机号或邮箱')) return
      if (!this.validateRequired(this.form.code, '验证码')) return
      if (!this.validateRequired(this.form.newPassword, '新密码')) return
      if (!this.form.confirmPassword || !this.form.confirmPassword.trim()) {
        this.$message.error('请填写确认密码')
        return
      }
      if (this.form.newPassword !== this.form.confirmPassword) {
        this.$message.error('两次输入密码不一致')
        return
      }
      if (this.form.code !== '8888') {
        this.$message.error('验证码错误')
        return
      }
      this.resetLoading = true
      userApi.forgotPassword({
        account: this.form.account,
        newPassword: this.form.newPassword
      }).then(res => {
        this.resetLoading = false
        if (!res.success) return
        this.$message.success('密码重置成功，请重新登录')
        this.$router.push('/b/login')
      }).catch(e => {
        this.resetLoading = false
        this.$message.error(e.message || '密码重置失败，请重试')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './_login-common.scss';

.forgot-panel {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
}
</style>
