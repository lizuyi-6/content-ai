# 🚀 ContentAI

**一个想法，自动生成多平台内容**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: MVP](https://img.shields.io/badge/Status-MVP-green.svg)]()
[![AI: Powered](https://img.shields.io/badge/AI-Powered-purple.svg)]()

---

## ✨ 功能特性

- 🤖 **AI 驱动** - 基于 GPT-4 自动生成内容
- 📱 **多平台支持** - Twitter/X, LinkedIn, 微博，小红书
- ⚡ **快速生成** - 30 秒内生成所有平台内容
- 📋 **一键复制** - 轻松复制内容到剪贴板
- 🎨 **简洁界面** - 无需学习成本，打开即用

---

## 🎯 使用场景

1. **内容创作者** - 一次创作，多平台分发
2. **创业者** - 快速建立个人品牌
3. **营销团队** - 提高内容生产效率
4. **开发者** - 分享技术洞察

---

## 🚀 快速开始

### 本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/lizuyi-6/content-ai.git
cd content-ai

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入 OpenAI API Key

# 4. 启动开发服务器
npm run dev

# 5. 访问 http://localhost:5173
```

### 生产部署

```bash
# 1. 构建前端
npm run build

# 2. 启动服务器
npm start

# 3. 访问 http://localhost:3000
```

---

## 📦 技术栈

**Backend**:
- Node.js + Express
- OpenAI API
- SQLite (可选，用于存储历史)

**Frontend**:
- React 18
- TailwindCSS
- Vite

**部署**:
- Docker (即将支持)
- Railway / Vercel
- PM2

---

## 💰 定价计划

| 计划 | 价格 | 功能 |
|------|------|------|
| **Free** | $0/月 | 每月 10 次生成 |
| **Pro** | $29/月 | 无限生成 + 定时发布 |
| **Team** | $79/月 | 多账号管理 + 数据分析 |

---

## 📸 使用示例

### 输入想法
```
我刚读完《原子习惯》，这本书教会我：
1. 每天进步 1%，一年后进步 37 倍
2. 关注系统而非目标
3. 习惯养成需要身份认同
```

### 自动生成
- ✅ Twitter 线程（3 条）
- ✅ LinkedIn 长文（专业深度）
- ✅ 微博文案（140 字）
- ✅ 小红书笔记（emoji + 标签）

---

## 🔧 API 参考

### POST /api/generate

生成多平台内容

**请求体**:
```json
{
  "idea": "你的想法",
  "platforms": ["twitter", "linkedin", "weibo", "xiaohongshu"]
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "twitter": {
      "platform": "Twitter/X",
      "content": "...",
      "length": 280
    },
    "linkedin": { ... },
    "weibo": { ... },
    "xiaohongshu": { ... }
  },
  "timestamp": "2026-03-10T00:00:00Z"
}
```

---

## 🛣️ 路线图

### v0.1 (MVP) ✅
- [x] 基础内容生成
- [x] 4 个平台支持
- [x] 简洁 UI

### v0.2 (Next)
- [ ] 用户系统 + 登录
- [ ] 内容历史保存
- [ ] 定时发布功能
- [ ] 更多平台（Facebook, Instagram）

### v0.3
- [ ] 数据分析（阅读/点赞/转发）
- [ ] A/B 测试
- [ ] 团队协作
- [ ] API 开放

---

## 🤝 贡献

欢迎贡献代码、报告问题、提出建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

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

[开始使用](#-快速开始) · [查看 API](#-api-参考) · [贡献代码](#-贡献)

</div>
