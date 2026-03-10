#!/bin/bash

echo "🧪 测试 ContentAI 多供应商支持..."
echo ""

# 测试 API 健康检查
echo "1️⃣ 测试健康检查..."
curl -s http://localhost:3000/api/health | jq .

echo ""
echo "2️⃣ 获取可用供应商列表..."
curl -s http://localhost:3000/api/providers | jq .

echo ""
echo "3️⃣ 测试 OpenAI 供应商生成..."
curl -s -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "idea": "AI 正在改变世界",
    "platforms": ["twitter"],
    "provider": "openai"
  }' | jq '.data.twitter.content'

echo ""
echo "✅ 测试完成！"
