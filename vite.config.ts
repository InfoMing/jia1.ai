/**
 * Vite 构建配置
 *
 * Vite 是构建工具，替代原来的 Vue CLI + Webpack。
 * 核心差异：
 *   - 配置文件从 vue.config.js → vite.config.ts
 *   - 启动命令从 vue-cli-service serve → vite
 *   - 构建命令从 vue-cli-service build → vite build
 *   - 环境变量从 process.env.VUE_APP_* → import.meta.env.VITE_*
 */
import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'          // Vue 3 SFC 单文件组件编译
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig(({ mode }) => {
  // 加载环境变量（必须用 VITE_ 前缀才能在客户端代码中访问）
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      // Vue 3 编译插件
      vue(),

      // SVG 图标自动注册为 <svg-icon> 组件
      createSvgIconsPlugin({
        iconDirs: [resolve(__dirname, 'src/admin/assets/icons/svg')],
        symbolId: 'icon-[name]',
      }),
    ],

    // 路径别名：@ 指向 src/
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },

    // 开发服务器配置
    server: {
      port: 9527,
      host: '0.0.0.0',
      open: true,
    },

    // 生产构建配置
    build: {
      outDir: resolve(__dirname, '..', 'web-deploy', 'dist', 'docs'),
      assetsDir: 'static',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            // 将 Element Plus 单独打包为一个 chunk
            'element-plus': ['element-plus'],
            // 将 Vue 运行时单独打包
            vue: ['vue', 'vue-router', 'pinia'],
          },
        },
      },
    },

    // CSS 预处理
    css: {
      preprocessorOptions: {
        scss: {
          // 静默 @import 废弃警告（Dart Sass 3.0 将移除 @import，项目逐步迁移到 @use）
          silenceDeprecations: ['import'],
        },
      },
    },
  }
})
