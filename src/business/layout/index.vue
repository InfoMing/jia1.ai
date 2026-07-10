<template>
  <div class="business-theme business-layout">
    <business-navbar />
    <div class="business-content">
      <router-view />
    </div>
    <business-footer />
  </div>
</template>

<script>
import BusinessNavbar from './Navbar.vue'
import BusinessFooter from './Footer.vue'

export default {
  name: 'BusinessLayout',
  components: { BusinessNavbar, BusinessFooter }
}
</script>

<style lang="scss" scoped>
.business-theme.business-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fff;
}
.business-content {
  flex: 1;
  background: #f5f6fa;
  display: flex;
  flex-direction: column;
}
/* router-view 渲染的子页面撑满容器 */
.business-content > * {
  flex: 1;
  min-height: 0;
}
</style>

<style lang="scss">
/* 滚动条（非 scoped，确保对所有浏览器生效） */
/* 注：Chrome 121+ 废弃了 html/body 的 ::-webkit-scrollbar，改用标准属性 */
html::-webkit-scrollbar,
body::-webkit-scrollbar,
.business-theme::-webkit-scrollbar,
.business-theme ::-webkit-scrollbar {
  width: 6px; height: 6px;
}
html::-webkit-scrollbar-track,
body::-webkit-scrollbar-track,
.business-theme::-webkit-scrollbar-track,
.business-theme ::-webkit-scrollbar-track {
  background: transparent;
}
html::-webkit-scrollbar-thumb,
body::-webkit-scrollbar-thumb,
.business-theme::-webkit-scrollbar-thumb,
.business-theme ::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.12);
  border-radius: 3px;
}
html::-webkit-scrollbar-thumb:hover,
body::-webkit-scrollbar-thumb:hover,
.business-theme::-webkit-scrollbar-thumb:hover,
.business-theme ::-webkit-scrollbar-thumb:hover {
  background: rgba(0,0,0,0.25);
}
/* 标准属性：对所有浏览器生效（Chrome 121+, Firefox, Edge） */
html, body, .business-theme, .business-theme * {
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.12) transparent;
}
</style>
