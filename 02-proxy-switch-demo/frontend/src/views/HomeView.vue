<template>
  <div class="home">
    <div class="api-test-container">
      <h1>Proxy Switch 演示</h1>
      <p>页面顶部的环境切换器通过虚拟模块自动注入</p>
      
      <div class="actions">
        <el-button type="primary" @click="fetchUser" :loading="loading.user" size="large">
          获取用户信息
        </el-button>
      </div>

      <div class="results" v-if="results.length > 0">
        <h3>API 响应结果:</h3>
        <el-card v-for="(result, index) in results" :key="index" class="result-card">
          <template #header>
            <div class="card-header">
              <span>{{ result.method }} {{ result.url }}</span>
              <el-tag :type="result.success ? 'success' : 'danger'" size="large">
                {{ result.success ? '成功' : '失败' }}
              </el-tag>
            </div>
          </template>
          <pre class="result-content">{{ JSON.stringify(result.data, null, 2) }}</pre>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElCard, ElTag, ElMessage } from 'element-plus'

// 加载状态
const loading = ref({
  user: false
})

// API结果
const results = ref<Array<{
  method: string
  url: string
  success: boolean
  data: any
}>>([])

// 添加结果
const addResult = (method: string, url: string, success: boolean, data: any) => {
  results.value.unshift({
    method,
    url,
    success,
    data
  })
  // 限制结果数量
  if (results.value.length > 3) {
    results.value = results.value.slice(0, 3)
  }
}

// 获取用户信息
const fetchUser = async () => {
  loading.value.user = true
  try {
    const response = await fetch('/api/user')
    const data = await response.json()
    addResult('GET', '/api/user', response.ok, data)
    if (response.ok) {
      ElMessage.success('获取用户信息成功')
    }
  } catch (error) {
    addResult('GET', '/api/user', false, { error: error.message })
    ElMessage.error('获取用户信息失败')
  } finally {
    loading.value.user = false
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
}

.api-test-container {
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  color: #409eff;
  text-align: center;
  margin-bottom: 20px;
}

p {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
}

.results {
  margin-top: 30px;
}

.results h3 {
  margin-bottom: 20px;
  color: #303133;
}

.result-card {
  margin-bottom: 25px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-content {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 15px;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  overflow-x: auto;
  white-space: pre-wrap;
}
</style>
