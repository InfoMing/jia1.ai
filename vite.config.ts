import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // 自定义域名从站点根目录提供资源，保持绝对路径稳定。
  base: '/',
  plugins: [vue()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') }
  },
  server: {
    port: 9527,
    host: '0.0.0.0',
    open: true
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    assetsDir: 'static',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: { vue: ['vue', 'vue-router'] }
      }
    }
  }
})
