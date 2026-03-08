#!/bin/bash

echo "=== 测试 dev:proxy 脚本 ==="
cd /Users/chenjz08/Codespace/demo/02-proxy-switch-demo

# 验证脚本是否正确添加
echo "1. 检查 package.json 中的 dev:proxy 脚本:"
npm run | grep "dev:proxy"

# 验证环境变量是否正确读取
echo ""
echo "2. 检查 vite 插件配置:"
grep -n "VITE_ENABLE_PROXY_SWITCH" frontend/vite-plugin-proxy-switch.ts

# 验证 vite.config.ts 是否正确处理环境变量
echo ""
echo "3. 检查 vite.config.ts 中的环境变量处理:"
grep -A 10 -B 2 "loadEnv" frontend/vite.config.ts

echo ""
echo "=== 测试完成 ==="