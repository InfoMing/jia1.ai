<template>
  <div class="info-page">
    <div class="info-inner">
      <h1 class="info-title">用户协议</h1>
      <div class="info-content">
        <section>
          <h2>1. 协议的接受</h2>
          <p>在注册或使用本平台服务前，请您仔细阅读本协议的全部内容。您一旦注册、使用本平台服务，即表示您已充分理解并同意接受本协议的全部条款。</p>
        </section>
        <section>
          <h2>2. 用户账号</h2>
          <p>您在注册时应提供真实、准确、完整的个人信息，并妥善保管您的账号和密码。因账号信息不实或密码保管不当导致的损失由用户自行承担。每个账号仅限本人使用，不得出借、转让或用于非法用途。</p>
        </section>
        <section>
          <h2>3. 用户行为规范</h2>
          <p>用户不得利用本平台从事任何违法违规活动，包括但不限于：发布虚假信息、侵犯他人合法权益、干扰平台正常运行等。如发现违规行为，平台有权在不通知的情况下暂停或终止服务。</p>
        </section>
        <section>
          <h2>4. 知识产权</h2>
          <p>本平台的所有内容，包括但不限于文字、图表、标识、数据、软件等，均受知识产权法保护。未经本平台书面许可，任何单位或个人不得以任何方式复制、传播、修改或商业利用。</p>
        </section>
        <section>
          <h2>5. 协议变更</h2>
          <p>本平台有权根据需要不时修改本协议，修改后的协议将在平台公布后生效。如用户不同意修改后的协议，应停止使用本平台服务；继续使用视为接受修改后的协议。</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default { name: 'BusinessAgreement' }
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
