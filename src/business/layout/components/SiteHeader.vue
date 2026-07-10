<template>
  <header class="si-header">
    <div class="si-header__row">
      <RouterLink class="si-logo" :to="{ name: 'Home' }" aria-label="返回首页">
        <img :src="assets.mascot" alt="" />
        <strong>Super-i</strong>
        <span>一个聚焦AI创意者的乌托邦</span>
      </RouterLink>

      <nav class="si-nav si-nav--desktop" aria-label="主导航">
        <RouterLink v-for="item in content.nav" :key="item.routeName" :to="{ name: item.routeName }" class="si-nav__link" active-class="is-active">
          {{ item.label }}
        </RouterLink>
      </nav>

      <button v-if="!session" class="si-login-button" type="button" @click="$emit('login')">登录/注册 <span>↗</span></button>
      <button v-else class="si-login-button" type="button" @click="$emit('logout')">{{ session.name }} · 退出</button>
    </div>

    <nav ref="mobileNavRef" class="si-nav si-nav--mobile" aria-label="移动端导航">
      <RouterLink
        v-for="item in content.nav"
        :key="item.routeName"
        :ref="element => registerMobileItem(item.routeName, element)"
        :to="{ name: item.routeName }"
        active-class="is-active"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { homeAssets as assets, homeContent as content } from '@/business/config/home-content'

defineProps({ session: { type: Object, default: null } })
defineEmits(['login', 'logout'])

const route = useRoute()
const mobileNavRef = ref(null)
const mobileItems = new Map()

/** 保存移动导航节点，用于路由切换后自动滚动到当前入口。 */
const registerMobileItem = (routeName, component) => {
  if (component?.$el) mobileItems.set(routeName, component.$el)
}

watch(() => route.name, async routeName => {
  await nextTick()
  mobileItems.get(routeName)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
}, { immediate: true })
</script>

<style lang="scss" scoped>
@use '@/business/styles/base/tokens' as *;

.si-header { position: fixed; inset: 0 0 auto; z-index: 100; background: rgba(255,255,255,.96); backdrop-filter: blur(14px); }
.si-header__row { height: $header-height; padding: 0 clamp(18px, 5.2vw, 70px); display: flex; align-items: center; gap: 20px; }
.si-logo { display: flex; align-items: center; flex: 0 0 auto; white-space: nowrap; }
.si-logo img { width: 24px; height: 34px; margin-right: 7px; object-fit: contain; }
.si-logo strong { font-size: 25px; line-height: 1; letter-spacing: -.5px; }
.si-logo span { margin-left: 7px; font-size: 10px; }
.si-nav--desktop { margin-left: auto; display: flex; align-items: center; gap: clamp(10px, 1.45vw, 24px); white-space: nowrap; }
.si-nav__link { position: relative; padding: 9px 0; font-size: 13px; transition: opacity .2s; }
.si-nav__link:hover { opacity: .55; }
.si-nav__link.is-active::after { content: ''; position: absolute; right: 0; bottom: 2px; left: 0; height: 2px; border-radius: 2px; background: #070707; }
.si-login-button { height: 40px; min-width: 102px; padding: 0 14px; flex: 0 0 auto; border: 1px solid #070707; border-radius: 999px; background: #fff; cursor: pointer; white-space: nowrap; }
.si-nav--mobile { display: none; }

@media (min-width: 1100px) and (max-width: 1279px) {
  .si-header__row { padding-inline: 18px; gap: 12px; }
  .si-logo span { display: none; }
  .si-nav--desktop { gap: 10px; }
  .si-nav__link { font-size: 12px; }
}

@media (max-width: 1099px) {
  .si-header { height: 106px; border-bottom: 1px solid $line; }
  .si-header__row { height: 60px; padding: 0 22px; justify-content: space-between; }
  .si-logo span { display: none; }
  .si-nav--desktop { display: none; }
  .si-login-button { min-width: 126px; height: 38px; }
  .si-nav--mobile { height: 46px; padding: 0 24px 8px; display: flex; align-items: center; gap: 28px; overflow-x: auto; scroll-snap-type: x proximity; scrollbar-width: none; }
  .si-nav--mobile::-webkit-scrollbar { display: none; }
  .si-nav--mobile a { position: relative; padding: 5px 0; flex: 0 0 auto; scroll-snap-align: center; white-space: nowrap; font-size: 15px; }
  .si-nav--mobile a.is-active::after { content: ''; position: absolute; right: 0; bottom: 0; left: 0; height: 2px; background: #070707; }
}

@media (max-width: 768px) {
  .si-logo img { display: none; }
  .si-logo strong { font-size: 27px; }
}
</style>

