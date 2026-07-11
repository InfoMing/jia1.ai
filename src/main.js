import { createApp } from 'vue'
import appRoot from './appRoot.vue'
import router from './router'

// 应用入口只负责创建实例、注册全局路由并挂载根节点。
const app = createApp(appRoot)

app.use(router)
app.mount('#app')
