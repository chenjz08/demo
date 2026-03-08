import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { proxySwitchPlugin } from './vite-plugin-proxy-switch'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    proxySwitchPlugin(),
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // 默认使用server1
        changeOrigin: true
      },
      '/health': {
        target: 'http://localhost:3001', // 默认使用server1
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/health/, '/health')
      }
    }
  }
})
