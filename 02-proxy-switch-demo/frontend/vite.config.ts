import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { proxySwitchPlugin } from './vite-plugin-proxy-switch'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  // 根据环境变量决定是否启用代理切换插件
  const plugins = [
    vue(),
    vueDevTools(),
  ]
  
  // 只有当 VITE_ENABLE_PROXY_SWITCH 为 true 时才加载代理切换插件
  if (env.VITE_ENABLE_PROXY_SWITCH === 'true') {
    plugins.unshift(proxySwitchPlugin())
  }

  return {
    plugins,
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
  }
})
