<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form"
      autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">合适价投</h3>
      </div>

      <el-form-item prop="loginMode">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-select v-model="loginForm.loginMode" placeholder="选择登录方式"
          @change="onLoginModeChange" style="flex:1">
          <el-option v-for="item in loginModeOptions" :key="item.value"
            :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item prop="account">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="account" v-model="loginForm.account" :placeholder="accountPlaceholder" name="account"
          type="text" tabindex="1" autocomplete="on" />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input :key="passwordType" ref="password" v-model="loginForm.password"
            :type="passwordType" placeholder="密码" name="password" tabindex="2" autocomplete="on"
            @keyup.native="checkCapslock" @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin">
        登录
      </el-button>

      <div style="display:flex;justify-content:space-between;margin-top:10px">
        <el-link v-if="registerEnabled" type="primary" @click="$router.push('/register')">
          没有账号？去注册
        </el-link>
        <el-link v-if="forgotPasswordEnabled" type="primary" @click="$router.push('/forgot-password')">
          忘记密码
        </el-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import { login } from "@/common/utils/user";
import $code from "@/common/utils/code";

const LOGIN_MODE_MAP = {
  1: { value: 1, label: '账号登录', placeholder: '请输入账号' },
  2: { value: 2, label: '手机号登录', placeholder: '请输入手机号' },
  3: { value: 3, label: '邮箱登录', placeholder: '请输入邮箱' },
  4: { value: 4, label: '身份证登录', placeholder: '请输入身份证号' },
  5: { value: 5, label: '微信登录', placeholder: '' }
};

export default {
  name: "Login",
  data() {
    const validateAccount = (rule, value, callback) => {
      if (!value) {
        callback(new Error("账号不能为空"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        account: "admin",
        password: "123456",
        loginMode: 1
      },
      loginRules: {
        account: [
          { required: true, trigger: "blur", validator: validateAccount },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
        loginMode: [
          { required: true, trigger: "change", message: "请选择登录方式" }
        ]
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {},
      loginModeOptions: [],
      accountPlaceholder: "请输入账号",
      registerEnabled: false,
      forgotPasswordEnabled: false
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  created() {
    this.loadLoginConfig();
  },
  mounted() {
    if (this.loginForm.account === "") {
      this.$refs.account.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  methods: {
    loadLoginConfig() {
      $code.update().then(() => {
        let loginTypeStr = $code.get("base_login_config", "login_type");
        if (loginTypeStr) {
          try {
            let loginTypes = JSON.parse(loginTypeStr);
            this.loginModeOptions = loginTypes
              .map(v => LOGIN_MODE_MAP[v])
              .filter(v => v);
          } catch (e) {
            this.loginModeOptions = [LOGIN_MODE_MAP[1], LOGIN_MODE_MAP[2], LOGIN_MODE_MAP[3], LOGIN_MODE_MAP[4]];
          }
        } else {
          this.loginModeOptions = [LOGIN_MODE_MAP[1], LOGIN_MODE_MAP[2], LOGIN_MODE_MAP[3], LOGIN_MODE_MAP[4]];
        }

        let defaultMode = $code.get("base_login_config", "default_login_mode");
        if (defaultMode) {
          this.loginForm.loginMode = parseInt(defaultMode);
          this.onLoginModeChange(this.loginForm.loginMode);
        }
        // 触发 el-select 校验，清除"请选择登录方式"的验证提示
        this.$refs.loginForm.clearValidate("loginMode");

        this.registerEnabled = $code.get("base_login_config", "register_enabled") === "1";
        this.forgotPasswordEnabled = $code.get("base_login_config", "forgot_password_enabled") === "1";
      }).catch(() => {
        this.loginModeOptions = [LOGIN_MODE_MAP[1], LOGIN_MODE_MAP[2], LOGIN_MODE_MAP[3], LOGIN_MODE_MAP[4]];
      });
    },
    onLoginModeChange(value) {
      let mode = LOGIN_MODE_MAP[value];
      if (mode) {
        this.accountPlaceholder = mode.placeholder;
      }
    },
    // 登录前清除可能存在的过期 token，避免与后端新 ID 类型冲突
    clearStaleToken() {
      sessionStorage.clear();
    },
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.clearStaleToken();
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const para = {
            account: this.loginForm.account,
            password: this.loginForm.password,
            loginMode: this.loginForm.loginMode
          };
          const success = (res) => {
            this.loading = false;
            if (!res.success) return;
            this.$router.push({
              path: this.redirect || "/",
              query: this.otherQuery,
            });
          };
          const error = (e) => {
            this.loading = false;
          };
          login(para, success, error);
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
  },
};
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-select {
    display: inline-block;
    height: 47px;
    width: 85%;

    .el-input__inner {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
    }

    .el-input__suffix {
      right: 0;
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
