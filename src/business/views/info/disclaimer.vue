<template>
  <div class="info-page">
    <div class="info-inner">
      <h1 class="info-title">免责声明</h1>
      <div class="info-content">
        <section>
          <h2>1. 信息准确性</h2>
          <p>本平台所提供的所有数据、信息、分析工具仅供参考，不构成任何投资建议。平台尽力确保数据的准确性和及时性，但不能保证所有信息完全无误。用户应自行核实相关信息并承担投资决策的全部风险。</p>
        </section>
        <section>
          <h2>2. 投资风险</h2>
          <p>股票、基金等金融产品的投资存在风险，过往表现不代表未来收益。本平台的任何内容均不构成买卖任何证券、基金或其他金融产品的要约或推荐。用户应根据自身风险承受能力独立做出投资决策。</p>
        </section>
        <section>
          <h2>3. 服务变更</h2>
          <p>本平台保留随时修改、暂停或终止全部或部分服务的权利，恕不另行通知。因服务变更给用户造成的任何损失，本平台不承担法律责任。</p>
        </section>
        <section>
          <h2>4. 法律管辖</h2>
          <p>本免责声明受中华人民共和国法律管辖。如发生争议，双方应友好协商解决；协商不成的，提交本平台所在地有管辖权的人民法院诉讼解决。</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default { name: 'BusinessDisclaimer' }
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
