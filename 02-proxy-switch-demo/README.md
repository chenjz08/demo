# Proxy Switch Vite 插件演示项目

这个项目演示了如何在 Vite 开发环境中实现运行时切换后端服务的功能。

## 项目结构

```
02-proxy-switch-demo/
├── frontend/                 # Vue 3 + TypeScript + Vite 前端项目
│   ├── src/
│   │   ├── views/           # 页面视图
│   │   ├── App.vue          # 主应用组件（干净无Switch逻辑）
│   │   └── main.ts          # 入口文件
│   ├── vite-plugin-proxy-switch.ts  # Proxy Switch Vite插件（虚拟模块实现）
│   ├── vite.config.ts       # Vite配置
│   └── package.json
├── server1/                 # 第一个Node.js Express后端服务
│   ├── index.js
│   └── package.json
├── server2/                 # 第二个Node.js Express后端服务
│   ├── index.js
│   └── package.json
├── package.json             # 根目录package.json(启动脚本)
└── README.md               # 项目说明文档
```

## 功能演示

### Proxy Switch 插件功能

- **环境切换UI**：页面顶部显示环境选择器
- **预设环境**：支持两个预设的server环境
- **自定义环境**：支持输入自定义URL
- **持久化**：环境选择保存到localStorage
- **实时切换**：切换环境后自动刷新页面

### 后端服务

两个Express服务器提供相同的API端点，但返回不同的数据：

- **服务器1 (localhost:3001)**：
  - 用户：张三，特征：用户管理、权限控制、数据分析

- **服务器2 (localhost:3002)**：
  - 用户：李四，特征：订单管理、支付处理、库存控制

## 快速开始

### 1. 启动所有服务（推荐）

```bash
npm run dev
```

这将同时启动：
- Server1 (http://localhost:3001)
- Server2 (http://localhost:3002)
- 前端开发服务器 (http://localhost:5173)

### 2. 分别启动服务

如果需要分别启动服务：

```bash
# 只启动后端服务
npm run dev:servers

# 只启动前端（需要后端已运行）
npm run dev:frontend

# 或者单独启动
npm run start:server1
npm run start:server2
npm run start:frontend
```

## 使用说明

1. **启动项目**后，浏览器会自动打开前端页面

2. **环境切换**：
   - 页面顶部有一个蓝色的环境切换器
   - 默认选择"server1"
   - 可以切换到"server2"查看不同数据
   - 也可以选择"自定义"输入自己的URL

3. **API测试**：
   - 点击"获取用户信息"按钮测试API
   - 观察切换环境后返回用户数据的变化
   - 查看下方显示的API响应结果

## 技术实现

### Proxy Switch 实现原理

1. **实际Vue组件**：
   - 创建 `src/components/EnvSwitch.vue` 环境切换组件
   - 提供直观的环境选择和自定义URL输入功能

2. **Vite中间件**：
   - 在 `vite.config.ts` 中配置自定义中间件
   - 注册 `/__switch_env` 接口处理环境切换
   - 注册 `/__current_env` 接口获取当前环境

3. **动态代理更新**：
   - 运行时修改 Vite 代理配置中的 target
   - 通过 WebSocket 通知客户端环境变更
   - 支持多个代理路径同时更新
   - 支持不同的API路径配置

4. **持久化存储**：
   - 使用 localStorage 保存用户选择
   - 页面刷新后自动恢复上次选择的环境

### 原始插件代码

项目中的 `vite-plugin-proxy-switch.ts` 文件包含了基于虚拟模块的原始实现，可以作为参考学习使用。

### 前端技术栈

- **Vue 3** + TypeScript
- **Vite** 作为构建工具
- **Element Plus** UI库
- **Vue Router** 路由管理
- **Pinia** 状态管理

### 后端技术栈

- **Node.js** + Express
- 相同的API接口，不同的返回数据
- 通过Vite代理访问，无需CORS支持

## 开发说明

### 添加新的环境

在 `frontend/vite-plugin-proxy-switch.ts` 中修改 `ENV_MAP`：

```typescript
const ENV_MAP: Record<string, string> = {
  server1: 'http://localhost:3001',
  server2: 'http://localhost:3002',
  // 添加新环境
  server3: 'http://localhost:3003'
}
```

### 自定义API接口

在 `server1/index.js` 和 `server2/index.js` 中添加新的路由：

```javascript
app.get('/api/new-endpoint', (req, res) => {
  res.json({ data: '响应数据', server: 'server1' })
})
```

## 注意事项

1. 此插件仅在开发模式下有效
2. 切换环境后会自动刷新页面
3. 自定义URL需要确保返回相同的API结构
4. 前端开发服务器端口可能因占用而变化
5. 代理配置需要正确处理API路径重写规则

## 故障排除

### 常见问题

1. **API返回HTML而不是JSON**：
   - 检查代理配置中的路径重写规则
   - 确保API路径与后端路由匹配

2. **环境切换不生效**：
   - 检查所有代理路径是否都在中间件中更新
   - 查看浏览器控制台是否有错误信息

3. **端口占用问题**：
   - 使用 `pkill -f "node.*index.js"` 停止所有后端服务
   - 使用 `pkill -f vite` 停止前端服务
   - 然后重新启动

4. **服务启动失败**：
   - 检查各个目录下的日志文件
   - 确保端口3001、3002、5173没有被其他程序占用

## 扩展功能

可以考虑的功能扩展：

- 支持更多环境预设
- 添加环境认证
- 支持API前缀配置
- 添加网络请求监控
- 支持HTTP和HTTPS协议