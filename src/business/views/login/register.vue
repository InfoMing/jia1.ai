<template>
  <business-placeholder title="注册" description="请前往登录页面使用「注册」标签进行注册" />
</template>

<script>
export default {
  name: 'BusinessRegister',
  created() {
    this.$router.replace('/b/login')
  }
}
</script>
