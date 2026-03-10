# AI 供应商配置指南

ContentAI 支持多种 AI 供应商，你可以根据需求灵活切换。

---

## 🎯 支持的供应商

| 供应商 | 说明 | 价格 | 推荐场景 |
|--------|------|------|----------|
| **OpenAI** | GPT-4/GPT-3.5，质量最佳 | 中高 | 生产环境，追求质量 |
| **DeepSeek** | 深度求索，中文优化 | 低 | 中文内容，性价比 |
| **Ollama** | 本地部署，免费 | 免费 | 隐私敏感，测试 |
| **Custom** | 自定义 API | 取决于供应商 | 特殊需求 |

---

## ⚙️ 配置方法

### 1. OpenAI（默认）

**获取 API Key**:
1. 访问 https://platform.openai.com/api-keys
2. 创建新 API Key
3. 复制到 `.env` 文件

**.env 配置**:
```bash
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4o-mini  # 或 gpt-4-turbo
```

**可选：使用 Azure OpenAI**:
```bash
AI_PROVIDER=openai
OPENAI_API_KEY=your-azure-key
OPENAI_BASE_URL=https://your-endpoint.openai.azure.com
OPENAI_MODEL=your-deployment-name
```

---

### 2. DeepSeek（推荐中文用户）

**获取 API Key**:
1. 访问 https://platform.deepseek.com
2. 注册并创建 API Key
3. 复制到 `.env` 文件

**.env 配置**:
```bash
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=your-deepseek-api-key
DEEPSEEK_MODEL=deepseek-chat
```

**优势**:
- 价格比 OpenAI 低 10 倍
- 中文理解更好
- API 兼容 OpenAI 格式

---

### 3. Ollama（本地部署）

**安装 Ollama**:
```bash
# macOS
curl -fsSL https://ollama.com/install.sh | sh

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# 下载 https://ollama.com/download/windows
```

**下载模型**:
```bash
ollama pull llama3  # Meta Llama 3
ollama pull mistral  # Mistral AI
ollama pull qwen2.5  # 通义千问（中文优化）
```

**.env 配置**:
```bash
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3  # 或 mistral, qwen2.5
```

**优势**:
- 完全免费
- 数据本地处理，隐私安全
- 无需网络

---

### 4. 自定义供应商

如果你有自定义的 AI API，可以这样配置：

**.env 配置**:
```bash
AI_PROVIDER=custom
CUSTOM_API_URL=https://your-api.com/v1/chat
CUSTOM_API_KEY=your-api-key
CUSTOM_MODEL=your-model-name
```

**API 要求**:
- 支持 POST 请求
- Content-Type: application/json
- 请求体格式：
```json
{
  "model": "your-model",
  "messages": [
    {"role": "system", "content": "..."},
    {"role": "user", "content": "..."}
  ],
  "max_tokens": 1000,
  "temperature": 0.7
}
```

- 响应格式（支持多种）：
```json
{"choices": [{"message": {"content": "..."}}]}
// 或
{"response": "..."}
// 或
{"content": "..."}
```

---

## 🔄 切换供应商

### 方法 1: 修改 .env 文件

编辑 `.env` 文件，修改 `AI_PROVIDER` 变量，然后重启服务器。

### 方法 2: 前端界面选择

启动服务器后，访问 http://localhost:3000，在设置面板中选择供应商。

### 方法 3: API 调用时指定

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "idea": "你的想法",
    "platforms": ["twitter"],
    "provider": "deepseek"
  }'
```

---

## 💰 价格对比

### OpenAI
- GPT-4o-mini: $0.15 / 1M 输入 tokens
- GPT-4-turbo: $10 / 1M 输入 tokens
- **每次生成成本**: ~$0.01-0.05

### DeepSeek
- DeepSeek-Chat: ¥1 / 1M tokens（约 $0.14）
- **每次生成成本**: ~$0.001-0.005

### Ollama
- 完全免费（仅需电费）
- **每次生成成本**: $0

---

## 🎯 推荐配置

### 个人用户（追求性价比）
```bash
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=your-key
```

### 企业用户（追求质量）
```bash
AI_PROVIDER=openai
OPENAI_API_KEY=your-key
OPENAI_MODEL=gpt-4-turbo
```

### 开发者（本地测试）
```bash
AI_PROVIDER=ollama
OLLAMA_MODEL=qwen2.5  # 中文优化
```

### 隐私敏感场景
```bash
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
# 数据完全本地处理
```

---

## 🛠️ 故障排查

### Q: 切换供应商后报错？
A: 确保新供应商的 API Key 已正确配置，并重启服务器。

### Q: Ollama 连接失败？
A: 检查 Ollama 服务是否运行：`ollama list`

### Q: 自定义 API 不工作？
A: 检查 API 格式是否符合要求，使用 Postman 测试。

### Q: 如何查看当前使用的供应商？
A: 访问 `/api/health` 或查看前端界面的设置面板。

---

**祝你使用愉快！** 🎉
