# Demo

这个仓库包含两个技术演示项目，用于展示不同的开发技术和工具的使用方法。

## 项目结构

```
demo/
├── 01-mcp-demo/              # Model Context Protocol (MCP) 演示
├── 02-proxy-switch-demo/     # 代理切换 Vite 插件演示
└── README.md                 # 本文档
```

## 01-mcp-demo: Model Context Protocol (MCP) 演示

这是一个展示如何使用 Model Context Protocol (MCP) SDK 的演示项目。MCP 是一种用于构建 AI 模型与外部系统之间通信的标准协议。

### 功能描述

该项目包含两个示例：

1. **index.js** - 基础MCP服务器示例
   - 实现了一个简单的加法工具
   - 提供动态问候资源功能

2. **index2.js** - 进阶MCP服务器示例
   - 实现了完整的echo功能（工具、资源、提示）
   - 展示了MCP的三种主要组件类型

### 技术栈

- Node.js
- @modelcontextprotocol/sdk
- zod (用于类型验证)

### 运行方法

```bash
cd 01-mcp-demo
npm install

# 运行第一个示例
npm run mcp:index

# 运行第二个示例
npm run mcp:index2
```

### 项目结构

```
01-mcp-demo/
├── index.js                  # 基础MCP服务器示例
├── index2.js                 # 进阶MCP服务器示例
├── package.json              # 项目配置和脚本
└── package-lock.json         # 依赖锁定文件
```

## 02-proxy-switch-demo: 代理切换 Vite 插件演示

这是一个完整的全栈演示项目，展示如何创建一个Vite插件来实现运行时动态代理切换功能，特别适用于前端开发中需要在不同后端环境之间切换的场景。

### 功能描述

- **环境切换UI组件** - 页面顶部固定的环境选择器
- **动态代理切换** - 运行时无缝切换不同后端服务
- **自定义URL支持** - 支持输入自定义后端地址
- **持久化存储** - 环境选择保存到localStorage
- **实时更新** - 切换后自动刷新页面应用新配置

### 技术架构

- **前端**: Vue 3 + TypeScript + Vite + Element Plus
- **后端**: 两个Express服务器(3001/3002端口)
- **通信**: HTTP API + WebSocket

### 运行方法

```bash
cd 02-proxy-switch-demo
npm install

# 同时启动所有服务（前端+两个后端）
npm run dev

# 仅启动后端服务
npm run dev:servers

# 仅启动前端
npm run dev:frontend
```

### 访问地址

- **前端演示**: http://localhost:5173
- **服务器1**: http://localhost:3001
- **服务器2**: http://localhost:3002

### 功能测试

1. 打开 http://localhost:5173
2. 页面顶部会显示蓝色的环境切换器
3. 可以切换"server1"、"server2"或"自定义"
4. 点击"获取用户信息"按钮测试API
5. 观察不同环境返回的用户数据差异

### 项目结构

```
02-proxy-switch-demo/
├── frontend/                 # Vue 3前端项目
│   ├── src/
│   │   ├── views/           # 页面视图
│   │   │   └── HomeView.vue  # API测试界面
│   │   ├── App.vue          # 主应用组件
│   │   └── main.ts          # 入口文件
│   ├── vite-plugin-proxy-switch.ts  # Proxy Switch Vite插件
│   ├── vite.config.ts       # Vite配置
│   └── package.json
├── server1/                 # 第一个后端服务
│   ├── index.js
│   └── package.json
├── server2/                 # 第二个后端服务
│   ├── index.js
│   └── package.json
├── test.sh                  # 测试脚本
├── PROJECT_SUMMARY.md       # 详细项目总结
├── package.json             # 根目录启动脚本
└── README.md               # 该demo的详细文档
```

## 学习价值

### 01-mcp-demo

- 了解Model Context Protocol的工作原理
- 学习如何构建AI模型与外部系统的通信桥梁
- 掌握MCP工具、资源和提示的创建方法

### 02-proxy-switch-demo

- Vite插件开发经验和技巧
- 动态代理配置的实现方法
- Vue 3组件开发和状态管理
- 前后端协同开发实践
- WebSocket实时通信技术应用

## 总结

这两个演示项目涵盖了现代Web开发中的不同技术领域：

- **MCP Demo** 展示了AI应用开发中的通信协议实现
- **Proxy Switch Demo** 展示了前端开发工具链和工程化实践

通过这些示例，开发者可以学习到如何构建可扩展的应用架构、创建开发工具，以及实现前后端的高效通信。
