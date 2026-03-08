#!/bin/bash

echo "=== Proxy Switch Demo 测试 ==="
echo ""

# 检查后端服务是否运行
echo "检查后端服务..."
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ 服务器1 (localhost:3001) 运行正常"
else
    echo "❌ 服务器1 (localhost:3001) 未运行"
fi

if curl -s http://localhost:3002/health > /dev/null; then
    echo "✅ 服务器2 (localhost:3002) 运行正常"
else
    echo "❌ 服务器2 (localhost:3002) 未运行"
fi

# 检查前端服务是否运行
echo ""
echo "检查前端服务..."
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ 前端服务 (localhost:5173) 运行正常"
else
    echo "❌ 前端服务 (localhost:5173) 未运行"
fi

# 测试API切换功能
echo ""
echo "测试API切换功能..."
if curl -s http://localhost:3001/api/user | grep -q "张三"; then
    echo "✅ 服务器1 API 返回正确数据"
else
    echo "❌ 服务器1 API 数据异常"
fi

if curl -s http://localhost:3002/api/user | grep -q "李四"; then
    echo "✅ 服务器2 API 返回正确数据"
else
    echo "❌ 服务器2 API 数据异常"
fi

echo ""
echo "=== 测试完成 ==="
echo "请访问 http://localhost:5173 查看演示效果"