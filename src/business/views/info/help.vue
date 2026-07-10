<template>
  <div class="info-page">
    <div class="info-inner">
      <h1 class="info-title">帮助中心</h1>
      <div class="info-content">
        <section>
          <h2>如何搜索股票？</h2>
          <p>在首页顶部搜索框中输入股票代码或名称关键字，点击搜索按钮或按回车键即可查看该股票的详细信息，包括实时行情、历史走势、财务数据等。</p>
        </section>
        <section>
          <h2>如何添加关注？</h2>
          <p>在股票详情页点击「关注」按钮，即可将该股票加入您的关注列表。您可以在「我的关注」页面集中查看所有关注的股票行情变化。</p>
        </section>
        <section>
          <h2>如何设置价格监控？</h2>
          <p>登录后进入「我的监控」页面，点击「新增监控」设置目标股票、监控价格和触发条件。当股价到达设定值时，系统将通过短信或站内通知提醒您。</p>
        </section>
        <section>
          <h2>账号相关</h2>
          <p>如果您遇到登录问题，可以使用「忘记密码」功能重置密码。如有其他疑问，请联系客服邮箱 support@heshijiatou.com。</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default { name: 'BusinessHelp' }
</script>

<style lang="scss" scoped>
.info-page { padding: 32px 24px 64px; background: #f5f6fa; }
.info-inner { max-width: 900px; margin: 0 auto; padding: 0 24px; }
.info-title { font-size: 28px; font-weight: 700; color: #1a1a1a; margin-bottom: 24px; text-align: center; }
.info-content { background: #fff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.info-content section { margin-bottom: 28px; &:last-child { margin-bottom: 0; } }
.info-content h2 { font-size: 18px; font-weight: 600; color: #c62f2e; margin-bottom: 12px; }
.info-content p { font-size: 15px; line-height: 1.8; color: #444; }
</style>
