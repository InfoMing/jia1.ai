<template>
  <div class="login-container">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="login-form"
      autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">用户注册</h3>
      </div>

      <el-form-item prop="account">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="account" v-model="registerForm.account" placeholder="请输入账号" name="account"
          type="text" tabindex="1" autocomplete="on" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input v-model="registerForm.password" type="password" placeholder="请输入密码"
          name="password" tabindex="2" autocomplete="on" />
      </el-form-item>

      <el-form-item prop="confirmPassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input v-model="registerForm.confirmPassword" type="password" placeholder="确认密码"
          name="confirmPassword" tabindex="3" autocomplete="on" />
      </el-form-item>

      <el-form-item prop="nickname">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="registerForm.nickname" placeholder="请输入昵称" name="nickname"
          tabindex="4" autocomplete="on" />
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleRegister">
        注册
      </el-button>

      <div style="text-align:center">
        <el-link type="primary" @click="$router.push('/admin/login')">
          已有账号？去登录
        </el-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import request from '@/common/utils/request'

export default {
  name: "Register",
  data() {
    const validateAccount = (rule, value, callback) => {
      if (!value) {
        callback(new Error("账号不能为空"));
      } else if (value.length < 3) {
        callback(new Error("账号长度不能少于3位"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("密码不能为空"));
      } else if (value.length < 6) {
        callback(new Error("密码长度不能少于6位"));
      } else {
        callback();
      }
    };
    const validateConfirmPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请确认密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    const validateNickname = (rule, value, callback) => {
      if (!value) {
        callback(new Error("昵称不能为空"));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        account: "",
        password: "",
        confirmPassword: "",
        nickname: ""
      },
      registerRules: {
        account: [
          { required: true, trigger: "blur", validator: validateAccount }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ],
        confirmPassword: [
          { required: true, trigger: "blur", validator: validateConfirmPassword }
        ],
        nickname: [
          { required: true, trigger: "blur", validator: validateNickname }
        ]
      },
      loading: false
    };
  },
  methods: {
    handleRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          request({
            url: '/userapi/user/register',
            method: 'post',
            data: {
              account: this.registerForm.account,
              password: this.registerForm.password,
              nickname: this.registerForm.nickname
            }
          }).then(res => {
            this.loading = false;
            if (res.success) {
              this.$message.success("注册成功");
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
