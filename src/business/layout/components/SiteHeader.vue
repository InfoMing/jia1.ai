<template>
  <header class="si-header">
    <RouterLink class="si-logo" :to="{ name: 'Home' }" aria-label="返回首页">
      <img :src="logoMark" alt="" />
      <strong>Jia1.ai</strong>
      <span>一个聚焦AI创意者的乌托邦</span>
    </RouterLink>

    <nav aria-label="主导航">
      <RouterLink :to="{ name: 'AiPrompts' }" active-class="is-active">AI提示词</RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import logoMark from '@/business/assets/shared/logo-mark.png'
</script>

<style lang="scss" scoped>
.si-header { position: fixed; inset: 0 0 auto; z-index: 100; height: clamp(70px,5.208vw,100px); padding: 0 5.208vw; display: flex; align-items: center; justify-content: space-between; color: #070707; background: rgba(255,255,255,.9); backdrop-filter: blur(10px); }
.si-logo { display: flex; align-items: center; color: inherit; text-decoration: none; white-space: nowrap; }
.si-logo img { width: 44px; height: 44px; margin-right: 8px; object-fit: contain; }
.si-logo strong { font-family: Poppins,sans-serif; font-size: 25px; font-weight: 500; line-height: 1; letter-spacing: -1px; }
.si-logo span { margin: 4px 0 0 10px; font-size: 14px; }
.si-header nav a { position: relative; padding: 10px 0; color: inherit; text-decoration: none; font-size: 16px; transition: color .25s,transform .25s; }
.si-header nav a:hover,.si-header nav a.is-active { color: #79ad31; transform: translateY(-2px); }
.si-header nav a.is-active { font-weight: 700; }
.si-header nav a.is-active::after { content: ''; position: absolute; right: 0; bottom: 3px; left: 0; height: 2px; background: #92d050; }
@media (max-width: 768px) {
  .si-header { height: 70px; padding: 0 18px; }
  .si-logo img { width: 36px; height: 36px; margin-right: 5px; }
  .si-logo strong { font-size: 22px; }
  .si-logo span { display: none; }
  .si-header nav a { font-size: 15px; }
}
</style>
