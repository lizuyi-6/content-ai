#!/bin/bash

echo "🚀 启动 ContentAI..."

# 检查 .env 文件
if [ ! -f .env ]; then
  echo "⚠️  .env 文件不存在，从 .env.example 复制"
  cp .env.example .env
  echo "请编辑 .env 文件，填入你的 OPENAI_API_KEY"
  exit 1
fi

# 检查依赖
if [ ! -d "node_modules" ]; then
  echo "📦 安装依赖..."
  npm install
fi

# 启动服务
echo "✅ 启动服务器..."
npm start

echo "🌐 访问 http://localhost:3000"
