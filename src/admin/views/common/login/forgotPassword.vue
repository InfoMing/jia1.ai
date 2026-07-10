<template>
  <div class="login-container">
    <el-form ref="forgotForm" :model="forgotForm" :rules="forgotRules" class="login-form"
      autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">忘记密码</h3>
      </div>

      <el-form-item prop="account">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="account" v-model="forgotForm.account" placeholder="请输入账号" name="account"
          type="text" tabindex="1" autocomplete="on" />
      </el-form-item>

      <el-form-item prop="oldPassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input v-model="forgotForm.oldPassword" type="password" placeholder="请输入原密码"
          name="oldPassword" tabindex="2" autocomplete="on" />
      </el-form-item>

      <el-form-item prop="newPassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input v-model="forgotForm.newPassword" type="password" placeholder="请输入新密码"
          name="newPassword" tabindex="3" autocomplete="on" />
      </el-form-item>

      <el-form-item prop="confirmPassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input v-model="forgotForm.confirmPassword" type="password" placeholder="确认新密码"
          name="confirmPassword" tabindex="4" autocomplete="on" />
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleReset">
        重置密码
      </el-button>

      <div style="text-align:center">
        <el-link type="primary" @click="$router.push('/admin/login')">
          想起密码了？去登录
        </el-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import request from '@/common/utils/request'

export default {
  name: "ForgotPassword",
  data() {
    const validateAccount = (rule, value, callback) => {
      if (!value) {
        callback(new Error("账号不能为空"));
      } else {
        callback();
      }
    };
    const validateOldPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("原密码不能为空"));
      } else {
        callback();
      }
    };
    const validateNewPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("新密码不能为空"));
      } else if (value.length < 6) {
        callback(new Error("密码长度不能少于6位"));
      } else {
        callback();
      }
    };
    const validateConfirmPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请确认新密码"));
      } else if (value !== this.forgotForm.newPassword) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      forgotForm: {
        account: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      },
      forgotRules: {
        account: [
          { required: true, trigger: "blur", validator: validateAccount }
        ],
        oldPassword: [
          { required: true, trigger: "blur", validator: validateOldPassword }
        ],
        newPassword: [
          { required: true, trigger: "blur", validator: validateNewPassword }
        ],
        confirmPassword: [
          { required: true, trigger: "blur", validator: validateConfirmPassword }
        ]
      },
      loading: false
    };
  },
  methods: {
    handleReset() {
      this.$refs.forgotForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          request({
            url: '/userapi/user/reset-password',
            method: 'post',
            data: {
              account: this.forgotForm.account,
              oldPassword: this.forgotForm.oldPassword,
              newPassword: this.forgotForm.newPassword
            }
          }).then(res => {
            this.loading = false;
            if (res.success) {
              this.$message.success("密码重置成功");
              this.$router.push('/admin/login');
            }
          }).catch(() => {
            this.loading = false;
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./login-common.scss";
</style>
