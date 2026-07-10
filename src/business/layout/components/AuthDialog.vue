<template>
  <el-dialog class="si-dialog si-auth-dialog" :model-value="open" title="登录 / 注册" width="min(92vw, 520px)" append-to-body destroy-on-close @update:model-value="$emit('close')">
    <el-tabs v-model="mode" stretch>
      <el-tab-pane label="手机号" name="phone" />
      <el-tab-pane label="邮箱" name="email" />
      <el-tab-pane label="扫码登录" name="qr" />
    </el-tabs>
    <div v-if="mode === 'qr'" class="si-auth-qr"><img :src="assets.communityQr" alt="登录二维码" /><p>扫码登录</p><el-button type="primary" round @click="quickLogin">✓ 立即登录</el-button></div>
    <el-form v-else label-position="top" @submit.prevent="submit">
      <el-form-item :label="mode === 'phone' ? '手机号' : '邮箱'" :error="error">
        <el-input v-model="identity" size="large" :placeholder="mode === 'phone' ? '138 0000 0000' : 'hello@super-i.cn'" />
      </el-form-item>
      <el-form-item label="验证码">
        <div class="si-code-row"><el-input v-model="code" size="large" maxlength="6" /><el-button size="large" :disabled="countdown > 0" @click="sendCode">{{ countdown ? `${countdown}s` : '获取验证码' }}</el-button></div>
      </el-form-item>
      <el-button class="si-submit" type="primary" size="large" round :loading="loading" native-type="submit">立即登录</el-button>
    </el-form>
  </el-dialog>
</template>
<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElTabPane, ElTabs } from 'element-plus'
import { homeAssets as assets } from '@/business/config/home-content'
import { businessApi } from '@/business/api'
defineProps({ open: Boolean }); const emit = defineEmits(['close', 'success'])
const mode = ref('phone'), identity = ref(''), code = ref(''), error = ref(''), loading = ref(false), countdown = ref(0); let timer
const valid = () => mode.value === 'phone' ? /^1\d{10}$/.test(identity.value.replace(/\s/g, '')) : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity.value)
const sendCode = async () => { if (!valid()) { error.value = mode.value === 'phone' ? '请输入正确的手机号' : '请输入正确的邮箱'; return } error.value = ''; const result = await businessApi.sendCode(identity.value); code.value = result.code; countdown.value = result.expiresIn; clearInterval(timer); timer = setInterval(() => { countdown.value -= 1; if (countdown.value <= 0) clearInterval(timer) }, 1000); ElMessage.success('演示验证码：246810') }
const submit = async () => { if (!valid()) { error.value = '请检查账号格式'; return } if (code.value.length < 4) { ElMessage.warning('请输入验证码'); return } loading.value = true; try { const session = await businessApi.login(mode.value === 'phone' ? { phone: identity.value } : { email: identity.value }); emit('success', session) } catch (requestError) { ElMessage.error(requestError.message) } finally { loading.value = false } }
const quickLogin = async () => { const session = await businessApi.login({ email: 'qr-user@super-i.demo' }); emit('success', session) }
onBeforeUnmount(() => clearInterval(timer))
</script>
<style lang="scss" scoped>
.si-code-row { width: 100%; display: grid; grid-template-columns: 1fr 130px; gap: 10px; }.si-submit { width: 100%; margin-top: 8px; }.si-auth-qr { display: grid; justify-items: center; gap: 16px; padding: 18px 0 25px; }.si-auth-qr img { width: 180px; height: 180px; border-radius: 12px; }
:global(.si-auth-dialog.el-dialog) { border-radius: 22px; padding: 24px; }:global(.si-auth-dialog .el-button--primary) { --el-button-bg-color:#070707; --el-button-border-color:#070707; --el-button-hover-bg-color:#333; --el-button-hover-border-color:#333; }
</style>
