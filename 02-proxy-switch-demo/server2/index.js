const express = require('express')

const app = express()
const PORT = 3002

// 中间件
app.use(express.json())

// API路由
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    server: 'server2',
    port: PORT,
    timestamp: new Date().toISOString()
  })
})

app.get('/api/user', (req, res) => {
  res.json({
    id: 2,
    name: '李四',
    server: 'server2',
    description: '来自第二个服务器的用户数据',
    features: ['订单管理', '支付处理', '库存控制']
  })
})

app.get('/api/products', (req, res) => {
  res.json({
    total: 20,
    server: 'server2',
    products: [
      { id: 4, name: '产品X - 服务器2', price: 150 },
      { id: 5, name: '产品Y - 服务器2', price: 250 },
      { id: 6, name: '产品Z - 服务器2', price: 350 }
    ],
    timestamp: new Date().toISOString()
  })
})

app.post('/api/submit', (req, res) => {
  const data = req.body
  res.json({
    success: true,
    server: 'server2',
    receivedData: data,
    message: '数据已提交到服务器2'
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器2 运行在 http://localhost:${PORT}`)
})