# 🚀 ContentAI

> **一个想法，自动生成全平台内容 | 完整 SaaS 功能**  
> 用户系统 · 内容历史 · 使用统计 · 多 AI 供应商

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version: v0.3](https://img.shields.io/badge/Version-v0.3-blue.svg)](https://github.com/lizuyi-6/content-ai/releases)
[![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-green.svg)]()

---

## 🎯 解决什么问题？

内容创作者需要在多个平台分发内容，但每个平台的风格不同。ContentAI 帮你**一次输入，自动生成所有平台适配的内容**，并提供完整的 SaaS 功能：用户系统、内容历史、使用统计。

---

## ✨ 核心功能（v0.3）

| 功能模块 | 说明 |
|----------|------|
| 🤖 **AI 生成** | 支持 OpenAI / DeepSeek / Ollama |
| 📱 **4 大平台** | Twitter/X, LinkedIn, 微博，小红书 |
| 🔐 **用户系统** | 注册/登录 + API Key 认证 |
| 📚 **内容历史** | 自动保存所有生成内容 |
| 📊 **使用统计** | 实时追踪用量 |
| 💳 **计划系统** | Free/Pro/Team 三级定价 |
| 🔒 **安全存储** | 密码 bcrypt 加密 + SQLite |

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/lizuyi-6/content-ai.git
cd content-ai
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`：
```bash
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-api-key-here
PORT=3000
```

### 3. 安装依赖

```bash
npm install
```

### 4. 启动服务

```bash
npm start
```

访问 **http://localhost:3000**，注册账号后即可使用！

---

## 📖 使用流程

### 第一步：注册账号
- 输入邮箱和密码
- 自动生成 API Key
- 默认 Free 计划（10 次/月）

### 第二步：生成内容
1. 输入想法
2. 选择平台（可多选）
3. 点击"生成内容"
4. 复制结果到对应平台

### 第三步：查看历史
- 所有生成内容自动保存
- 支持按时间查看
- 可随时删除

---

## 💰 定价计划

| 计划 | 价格 | 生成次数 | 功能 |
|------|------|----------|------|
| **Free** | $0/月 | 10 次 | 基础生成 + 历史保存 |
| **Pro** | $29/月 | 1000 次 | + 优先支持 + 统计分析 |
| **Team** | $79/月 | 10000 次 | + 多账号管理 + API 访问 |

---

## 🔧 API 参考

### 注册
```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "your-password",
  "name": "Your Name"
}
```

### 登录
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "your-password"
}
```

### 生成内容
```bash
POST /api/content/generate
Headers: X-API-Key: your-api-key
{
  "idea": "你的想法",
  "platforms": ["twitter", "weibo"]
}
```

### 查看历史
```bash
GET /api/content/history
Headers: X-API-Key: your-api-key
```

### 使用统计
```bash
GET /api/content/stats
Headers: X-API-Key: your-api-key
```

---

## 🛣️ 路线图

- [x] **v0.1** - MVP：基础生成
- [x] **v0.2** - 多 AI 供应商
- [x] **v0.3** - 用户系统 + 历史 + 统计
- [ ] **v0.4** - 定时发布
- [ ] **v0.5** - 数据分析看板
- [ ] **v0.6** - 支付集成（Stripe）

---

## 📚 更多文档

- [供应商配置](docs/PROVIDERS.md)
- [快速开始](QUICKSTART.md)
- [更新日志](CHANGELOG.md)

---

## 📄 许可证

MIT License

---

<div align="center">

**🚀 生产环境就绪**

[立即使用](#-快速开始) · [查看 API](#-api-参考) · [供应商配置](docs/PROVIDERS.md)

</div>
