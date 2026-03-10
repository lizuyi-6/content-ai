# 🚀 ContentAI - 5 分钟快速开始

## 第一步：配置 API Key

```bash
cd /root/.openclaw/workspace/content-ai
cp .env.example .env
```

编辑 `.env` 文件：
```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**获取 OpenAI API Key**:
1. 访问 https://platform.openai.com/api-keys
2. 创建新 API Key
3. 复制到 `.env` 文件

---

## 第二步：启动服务

```bash
# 方式 1: 使用启动脚本
./start.sh

# 方式 2: 直接启动
npm start
```

服务器启动后，访问：http://localhost:3000

---

## 第三步：测试功能

### 方法 A: 浏览器测试
1. 打开 http://localhost:3000
2. 输入想法（例如："我刚读完《原子习惯》"）
3. 选择平台
4. 点击"生成内容"
5. 查看结果并复制

### 方法 B: API 测试
```bash
# 安装测试依赖
npm install node-fetch

# 运行测试
node test-api.js
```

---

## 第四步：部署上线（可选）

### Railway 部署

```bash
# 1. 安装 Railway CLI
npm i -g @railway/cli

# 2. 登录
railway login

# 3. 创建项目
railway init

# 4. 添加环境变量
railway variables set OPENAI_API_KEY=sk-xxx

# 5. 部署
railway up
```

### Docker 部署

```bash
# 1. 构建镜像
docker build -t content-ai .

# 2. 运行容器
docker run -d -p 3000:3000 --env-file .env content-ai

# 3. 访问
curl http://localhost:3000/api/health
```

---

## 🎯 下一步

- [ ] 添加用户系统
- [ ] 保存生成历史
- [ ] 定时发布功能
- [ ] 更多平台支持

---

## 💡 使用技巧

### 好的输入示例

✅ **具体**: "我刚学会用 React Hooks，发现 useEffect 比 class 组件的 componentDidMount 好用 10 倍"

❌ **模糊**: "我想写点东西"

✅ **有观点**: "远程工作不是未来，是现在。我在 3 个不同国家工作过，效率反而更高"

❌ **平淡**: "远程工作挺好的"

### 平台特点

- **Twitter**: 短小精悍，用数字和问题吸引注意
- **LinkedIn**: 专业深度，分享行业洞察
- **微博**: 轻松有趣，加 emoji 和话题
- **小红书**: 真诚分享，多用 emoji 和标签

---

## 🆘 常见问题

### Q: API 调用失败？
A: 检查 `.env` 文件中的 API Key 是否正确

### Q: 生成速度慢？
A: 第一次调用可能需要 10-20 秒，后续会更快

### Q: 内容不满意？
A: 调整输入的想法，更具体、更有观点会生成更好的内容

---

**祝你创作愉快！** 🎉
