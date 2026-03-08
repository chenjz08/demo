import type { Plugin } from 'vite'

const VIRTUAL_ID = 'virtual:env-switch.vue'
const RESOLVED_ID = '/@virtual/env-switch.vue'

// 环境映射表
const ENV_MAP: Record<string, string> = {
  server1: 'http://localhost:3001',
  server2: 'http://localhost:3002'
}

function getEnvSwitchSFC(): string {
  const envOptions = Object.entries(ENV_MAP)
    .map(([key, value]) => `        <el-option label="${key} (${value})" value="${key}" />`)
    .join('\n')

  return `<template>
  <div class="env-switcher">
    <div class="env-switch-container">
      <span class="env-label">当前环境: {{ currentEnv }}</span>
      <el-select v-model="selectedEnv" size="small" style="width: 220px" @change="handleEnvChange">
${envOptions}
        <el-option label="自定义" value="custom" />
      </el-select>
      <el-input
        v-if="selectedEnv === 'custom'"
        v-model="customUrl"
        size="small"
        placeholder="输入自定义URL"
        style="width: 200px"
        @blur="handleCustomUrlChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const currentEnv = ref('server1')
const selectedEnv = ref('server1')
const customUrl = ref('')

onMounted(async () => {
  const saved = localStorage.getItem('proxy-env')
  if (saved) {
    const parsed = JSON.parse(saved)
    currentEnv.value = parsed.env
    selectedEnv.value = parsed.env
    if (parsed.env === 'custom') {
      customUrl.value = parsed.url || ''
    }
    // 每次启动时将保存的 env 同步到 Vite 代理（server 重启后代理会重置）
    await initEnv(parsed)
  }
})

const initEnv = async (parsed: { env: string; url?: string }) => {
  try {
    const body = parsed.env === 'custom'
      ? { env: 'custom', customUrl: parsed.url }
      : { env: parsed.env }
    const response = await fetch('/__switch_env', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (response.ok) {
      const result = await response.json()
      currentEnv.value = result.env
    }
  } catch (error) {
    console.error('初始化环境出错:', error)
  }
}

const handleEnvChange = async () => {
  const env = selectedEnv.value
  if (env === 'custom') return

  try {
    const response = await fetch('/__switch_env', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ env })
    })
    if (response.ok) {
      const result = await response.json()
      currentEnv.value = result.env
      localStorage.setItem('proxy-env', JSON.stringify({ env: result.env, target: result.target }))
      setTimeout(() => window.location.reload(), 500)
    }
  } catch (error) {
    console.error('切换环境出错:', error)
  }
}

const handleCustomUrlChange = async () => {
  if (!customUrl.value) return

  try {
    const response = await fetch('/__switch_env', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ env: 'custom', customUrl: customUrl.value })
    })
    if (response.ok) {
      const result = await response.json()
      currentEnv.value = result.env
      localStorage.setItem('proxy-env', JSON.stringify({ env: 'custom', url: customUrl.value, target: result.target }))
      setTimeout(() => window.location.reload(), 500)
    }
  } catch (error) {
    console.error('切换自定义环境出错:', error)
  }
}
</script>

<style scoped>
.env-switcher {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #409eff;
  padding: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.env-switch-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  max-width: 800px;
  margin: 0 auto;
}

.env-label {
  color: white;
  font-weight: bold;
}
</style>
`
}

// 应用新的代理目标
function applyTarget(server: any, target: string) {
  if (!server.config.server?.proxy) return

  const proxy = server.config.server.proxy as Record<string, any>
  Object.keys(proxy).forEach(key => {
    if (proxy[key]) {
      proxy[key].target = target
      console.log(`Updated proxy for ${key} to target: ${target}`)
    }
  })
}

// 创建proxy-switch插件
export function proxySwitchPlugin(): Plugin {
  let server: any
  
  // 检查是否启用代理切换
  const enableProxySwitch = process.env.VITE_ENABLE_PROXY_SWITCH === 'true'

  return {
    name: 'vite-plugin-proxy-switch',
    apply: 'serve',
    enforce: 'pre',

    resolveId(id) {
      if (id === VIRTUAL_ID && enableProxySwitch) return RESOLVED_ID
    },

    load(id) {
      if (id === RESOLVED_ID && enableProxySwitch) return getEnvSwitchSFC()
    },

    transform(code, id) {
      // 如果未启用代理切换，则不进行任何转换
      if (!enableProxySwitch) return
      
      // 过滤掉子块请求（?vue&type=...）和非 App.vue 文件
      if (!id.includes('App.vue') || id.includes('?')) return

      let modified = code

      if (!code.includes(VIRTUAL_ID)) {
        modified = modified.replace(
          `import { RouterView } from 'vue-router'`,
          `import EnvSwitch from '${VIRTUAL_ID}'\nimport { RouterView } from 'vue-router'`
        )
      }

      if (!code.includes('<EnvSwitch')) {
        modified = modified.replace(
          `<div class="app-container">`,
          `<div class="app-container">\n    <EnvSwitch />`
        )
      }

      if (modified !== code) return { code: modified }
    },

    configureServer(viteServer) {
      server = viteServer
      
      // 如果未启用代理切换，则不配置中间件
      if (!enableProxySwitch) return

      server.middlewares.use('/__current_env', (req: any, res: any) => {
        const proxy = server.config.server?.proxy as Record<string, any>
        const target = proxy?.['/api']?.target || 'unknown'
        const env = Object.entries(ENV_MAP).find(([_, value]) => value === target)?.[0] || 'custom'

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ env, target }))
      })

      server.middlewares.use('/__switch_env', (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'text/plain' })
          res.end('Method Not Allowed')
          return
        }

        let body = ''
        req.on('data', (chunk: any) => { body += chunk.toString() })
        req.on('end', () => {
          try {
            const { env, customUrl } = JSON.parse(body)
            const target = env === 'custom' ? customUrl : ENV_MAP[env]

            if (!target) {
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Invalid environment' }))
              return
            }

            applyTarget(server, target)

            server.ws.send({ type: 'custom', event: 'env-switched', data: { env, target } })

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ ok: true, env, target }))
          } catch (error) {
            console.error('处理环境切换请求出错:', error)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Internal server error' }))
          }
        })
      })
    }
  }
}
