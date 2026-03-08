const express = require('express')

const app = express()
const PORT = 3001

// 中间件
app.use(express.json())

// API路由
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    server: 'server1',
    port: PORT,
    timestamp: new Date().toISOString()
  })
})

app.get('/api/user', (req, res) => {
  res.json({
    id: 1,
    name: '张三',
    server: 'server1',
    description: '来自第一个服务器的用户数据',
    features: ['用户管理', '权限控制', '数据分析']
  })
})

app.get('/api/products', (req, res) => {
  res.json({
    total: 10,
    server: 'server1',
    products: [
      { id: 1, name: '商品A - 服务器1', price: 100 },
      { id: 2, name: '商品B - 服务器1', price: 200 },
      { id: 3, name: '商品C - 服务器1', price: 300 }
    ],
    timestamp: new Date().toISOString()
  })
})

app.post('/api/submit', (req, res) => {
  const data = req.body
  res.json({
    success: true,
    server: 'server1',
    receivedData: data,
    message: '数据已提交到服务器1'
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器1 运行在 http://localhost:${PORT}`)
})