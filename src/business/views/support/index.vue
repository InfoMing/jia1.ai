<template>
  <section class="si-support-page">
    <div class="si-support-page__panel">
      <header><span>SUPPORT</span><h1>提交工单</h1><p>请详细描述问题，我们会尽快处理。</p></header>
      <el-form label-position="top">
        <el-form-item label="问题类型"><el-select v-model="form.type" style="width:100%"><el-option label="页面问题" value="page" /><el-option label="账号与会员" value="account" /><el-option label="建议反馈" value="feedback" /></el-select></el-form-item>
        <el-form-item label="问题描述"><el-input v-model="form.detail" type="textarea" :rows="6" placeholder="请描述您遇到的问题" /></el-form-item>
        <el-form-item label="附件"><input type="file" accept="image/*" @change="selectFile" /><small v-if="form.fileName">{{ form.fileName }}</small></el-form-item>
        <el-button type="primary" size="large" round :loading="loading" @click="submit">提交工单</el-button>
      </el-form>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElButton, ElForm, ElFormItem, ElInput, ElMessage, ElOption, ElSelect } from 'element-plus'
import { businessApi } from '@/business/api'

const form = reactive({ type: 'page', detail: '', fileName: '' })
const loading = ref(false)
const selectFile = event => { form.fileName = event.target.files?.[0]?.name || '' }
const submit = async () => {
  loading.value = true
  try {
    const ticket = await businessApi.submitTicket({ ...form })
    ElMessage.success(`工单 ${ticket.id} 提交成功`)
    form.detail = ''; form.fileName = ''
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.si-support-page { min-height: 70vh; padding: clamp(32px,6vw,90px); background:#f4f5f0}.si-support-page__panel{width:min(760px,100%);margin:0 auto;padding:clamp(28px,5vw,65px);border-radius:28px;background:#fff;box-shadow:0 18px 55px rgba(0,0,0,.07)}.si-support-page header{margin-bottom:35px}.si-support-page header span{color:#6a9700;font-weight:800;letter-spacing:2px}.si-support-page h1{margin:10px 0;font-size:46px}.si-support-page p{color:#777}.si-support-page :deep(.el-button--primary){--el-button-bg-color:#080808;--el-button-border-color:#080808;width:100%}.si-support-page small{display:block;margin-top:8px;color:#777}
@media(max-width:768px){.si-support-page{padding:20px 16px}.si-support-page h1{font-size:36px}}
</style>

