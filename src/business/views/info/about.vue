<template>
  <div class="info-page">
    <div class="info-inner">
      <h1 class="info-title">关于我们</h1>
      <div class="info-content">
        <section>
          <h2>合适价投 — 让价值投资更简单</h2>
          <p>合适价投是一家专注于为个人投资者提供专业投资决策辅助工具的科技服务平台。我们致力于通过数据驱动的方式，帮助投资者发现价值、跟踪市场、做出更理性的投资决策。</p>
        </section>
        <section>
          <h2>我们的使命</h2>
          <p>让每一位投资者都能享受到专业级的投资分析工具，降低信息不对称，提升投资效率。我们相信，普通投资者同样需要强大的数据支持——正如专业机构所做的那样。</p>
        </section>
        <section>
          <h2>联系我们</h2>
          <p>邮箱：support@heshijiatou.com<br>地址：中国 · 上海</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default { name: 'BusinessAbout' }
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
