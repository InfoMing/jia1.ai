<template>
  <div class="si-site-layout">
    <SiteHeader :session="session" @login="openLogin" @logout="logout" />
    <main class="si-site-layout__content"><RouterView /></main>
    <SiteFooter />
    <AuthDialog :open="loginOpen" @close="loginOpen = false" @success="loginSuccess" />
  </div>
</template>

<script setup>
import { onMounted, provide, ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import 'element-plus/dist/index.css'
import '@/business/styles/base/index.scss'
import SiteHeader from '@/business/layout/components/SiteHeader.vue'
import SiteFooter from '@/business/layout/components/SiteFooter.vue'
import AuthDialog from '@/business/layout/components/AuthDialog.vue'
import { businessApi } from '@/business/api'
import { SITE_SHELL_KEY } from '@/business/composables/useSiteShell'

const router = useRouter()
const session = ref(null)
const loginOpen = ref(false)
const pendingRoute = ref(null)

const openLogin = route => { pendingRoute.value = route || null; loginOpen.value = true }
const loginSuccess = user => {
  session.value = user
  loginOpen.value = false
  if (pendingRoute.value) router.push(pendingRoute.value)
  pendingRoute.value = null
}
const logout = async () => { await businessApi.logout(); session.value = null }

// 公共布局向页面提供统一登录入口，避免页面组件直接操作登录弹层。
provide(SITE_SHELL_KEY, { session, openLogin })

onMounted(async () => {
  localStorage.removeItem('superi-demo:locale')
  session.value = await businessApi.getSession()
})
</script>

<style lang="scss" scoped>
.si-site-layout { min-height: 100vh; padding-top: 70px; overflow: clip; background: #fff; }
.si-site-layout__content { min-height: calc(100vh - 70px); }
@media (max-width: 1099px) { .si-site-layout { padding-top: 106px; }.si-site-layout__content { min-height: calc(100vh - 106px); } }
</style>
