<template>
  <div class="footer">
    <div class="footer-inner">
      <div class="footer-links">
        <router-link to="/b/about">关于我们</router-link>
        <span class="sep">|</span>
        <router-link to="/b/help">帮助中心</router-link>
        <span class="sep">|</span>
        <router-link to="/b/disclaimer">免责声明</router-link>
        <span class="sep">|</span>
        <router-link to="/b/agreement">用户协议</router-link>
      </div>
      <div class="footer-copyright">
        <span class="copyright-sign" @dblclick="goAdminLogin">&copy;</span> 2026 合适价投. All Rights Reserved.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessFooter',
  methods: {
    goAdminLogin() {
      this.$router.push('/admin/home')
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  flex-shrink: 0;
  background: #f0f2f5;
  color: #888;
  text-align: center;
  padding: 20px 24px;
  font-size: 13px;
  border-top: 1px solid #e6e8eb;
}
.footer-inner {
  max-width: calc(100% - 30px);
  margin: 0 auto;
}
.footer-links {
  margin-bottom: 8px;
  a {
    color: #888;
    text-decoration: none;
    margin: 0 6px;
    font-size: 13px;
    transition: color 0.2s;
    &:hover { color: #c62f2e; }
  }
}
.sep { color: #ccc; margin: 0 4px; }
.footer-copyright {
  color: #aaa;
  font-size: 12px;
}
.copyright-sign {
  cursor: default;
}
</style>
