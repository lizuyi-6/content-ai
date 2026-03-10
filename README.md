# 🚀 ContentAI

> **一个想法，自动生成全平台内容**  
> 支持 OpenAI / DeepSeek / Ollama 多种 AI 供应商

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version: v0.2](https://img.shields.io/badge/Version-v0.2-blue.svg)](https://github.com/lizuyi-6/content-ai/releases)
[![AI: Multi-Provider](https://img.shields.io/badge/AI-Multi--Provider-purple.svg)]()

---

## 🎯 解决什么问题？

内容创作者需要在多个平台分发内容，但每个平台的风格不同：
- **Twitter** 要短小精悍
- **LinkedIn** 要专业深度
- **微博** 要轻松有趣
- **小红书** 要真诚种草

ContentAI 帮你**一次输入，自动生成所有平台适配的内容**。

---

## ✨ 核心特性

| 特性 | 说明 |
|------|------|
| 🤖 **多 AI 供应商** | 支持 OpenAI / DeepSeek / Ollama，灵活切换 |
| 📱 **4 大平台** | Twitter/X, LinkedIn, 微博，小红书 |
| ⚡ **30 秒生成** | 输入想法，立即获得全平台内容 |
| 🎨 **零学习成本** | 打开网页就能用，无需安装 |
| 🔒 **隐私安全** | 可本地部署，数据不出服务器 |

---

## 🚀 5 分钟快速开始

### 第一步：克隆项目

```bash
git clone https://github.com/lizuyi-6/content-ai.git
cd content-ai
```

### 第二步：配置 API Key

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的 API Key：

```bash
# 使用 OpenAI（默认）
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-api-key-here

# 或使用 DeepSeek（中文优化，性价比高）
# AI_PROVIDER=deepseek
# DEEPSEEK_API_KEY=your-deepseek-key

# 或使用 Ollama（本地部署，免费）
# AI_PROVIDER=ollama
# OLLAMA_BASE_URL=http://localhost:11434
# OLLAMA_MODEL=llama3
```

### 第三步：启动服务

```bash
npm install
npm start
```

访问 **http://localhost:3000**，开始生成内容！

---

## 📖 使用示例

### 输入想法

```
我刚学会用 AI 写代码，效率提升了 10 倍。
最大的感悟是：AI 不是替代程序员，
而是让程序员专注于更有创造性的工作。
```

### 自动生成结果

**Twitter/X** 🐦
```
🚀 Just 10x'd my coding productivity with AI!

Key insight: AI isn't replacing developers—
it's freeing us to focus on creative work.

The future of coding is human + AI collaboration.

#AI #Coding #Productivity #DevLife
```

**LinkedIn** 💼
```
🤖 How AI Made Me a 10x Developer

Last week, I integrated AI into my coding workflow. 
The results surprised me...

[全文继续]
```

**微博** 📱
```
🚀 学会用 AI 写代码，效率直接提升 10 倍！

最大的感悟：AI 不是要替代程序员，
而是让我们专注于更有创造性的工作💡

#AI 编程# #效率提升# #开发者日常#
```

**小红书** 📕
```
💻 程序员必备！AI 编程效率提升 10 倍的秘密

姐妹们！今天一定要分享这个超好用的 AI 编程工具！

✨ 使用感受：
1️⃣ 代码生成超快
2️⃣ bug 自动修复
3️⃣ 文档一键生成

[全文继续]
```

---

## 🤖 AI 供应商对比

| 供应商 | 模型 | 价格 | 推荐场景 |
|--------|------|------|----------|
| **OpenAI** | GPT-4o-mini | $0.15/1M tokens | 追求质量，生产环境 |
| **DeepSeek** | DeepSeek-Chat | ¥1/1M tokens | 中文内容，性价比 |
| **Ollama** | Llama3/Qwen2.5 | 免费 | 本地测试，隐私敏感 |

**切换供应商**：修改 `.env` 中的 `AI_PROVIDER`，重启即可。

---

## 🔧 API 参考

### POST `/api/generate`

生成多平台内容

**请求示例**：
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "idea": "你的想法",
    "platforms": ["twitter", "weibo"],
    "provider": "deepseek"
  }'
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "twitter": {
      "platform": "Twitter/X",
      "content": "...",
      "length": 280,
      "provider": "deepseek",
      "model": "deepseek-chat"
    },
    "weibo": { ... }
  },
  "provider": "deepseek",
  "timestamp": "2026-03-10T00:20:00Z"
}
```

### GET `/api/providers`

获取可用供应商列表

```bash
curl http://localhost:3000/api/providers
```

---

## 🐳 Docker 部署

```bash
# 1. 构建镜像
docker build -t content-ai .

# 2. 运行容器
docker run -d -p 3000:3000 \
  --env-file .env \
  --name content-ai \
  content-ai

# 3. 查看日志
docker logs -f content-ai
```

或使用 Docker Compose：

```bash
docker-compose up -d
```

---

## 🛣️ 路线图

- [x] **v0.1** - MVP：基础内容生成
- [x] **v0.2** - 多 AI 供应商支持
- [ ] **v0.3** - 用户系统 + 内容历史
- [ ] **v0.4** - 定时发布功能
- [ ] **v0.5** - 数据分析（阅读/点赞/转发）

---

## 📚 更多文档

- [**供应商配置指南**](docs/PROVIDERS.md) - 详细配置说明
- [**快速开始**](QUICKSTART.md) - 5 分钟上手
- [**更新日志**](CHANGELOG.md) - 版本历史

---

## 🤝 贡献

欢迎贡献！

1. Fork 本仓库
2. 创建分支 `git checkout -b feature/YourFeature`
3. 提交 `git commit -m 'Add YourFeature'`
4. 推送 `git push origin feature/YourFeature`
5. 提交 Pull Request

---

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE)

---

## 📫 联系方式

- **GitHub**: [@lizuyi-6](https://github.com/lizuyi-6)
- **Email**: lizu@shijieqidian.cn
- **官网**: https://contentai.app (即将上线)

---

<div align="center">

**🚀 让内容创作更高效**

[快速开始](#-5-分钟快速开始) · [查看 API](#-api-参考) · [供应商配置](docs/PROVIDERS.md)

</div>
