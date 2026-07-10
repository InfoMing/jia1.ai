/**
 * Axios HTTP 请求封装
 *
 * 环境变量取值方式：
 *   import.meta.env.VITE_APP_BASE_API
 *   （环境变量前缀要求是 VITE_，定义在 .env.development 等文件中）
 *
 * 错误提示使用 Element Plus 的 ElMessage（包名从 element-ui 变为 element-plus）
 */
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from '@/common/utils/user'
import CodeUtils from '@/common/utils/code'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 300000
})

// 请求拦截器：在每次请求前自动带上 token
service.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器：统一处理返回结果和错误提示
service.interceptors.response.use(
  response => {
    const res = response.data

    // 后端返回 code !== 2000 表示业务错误
    if (res.code !== 2000) {
      ElMessage({
        message: "操作失败," + res.message || 'Error',
        type: 'error',
        duration: 10 * 1000,
        showClose: true
      })
    }

    // 登录状态下，检查是否需要更新本地码表缓存
    let isGetCodeAll = response.config.url.indexOf('/userapi/code') != -1;
    if (res.success && getToken() && !isGetCodeAll) {
      let time = CodeUtils.time();
      if (res.codeUpdateTime != time) CodeUtils.update();
    }

    return res
  },
  error => {
    console.log(error)
    if (error.message == 'Network Error') {
      error.message = '网络异常，请检查服务器是否正常启动'
    }
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
