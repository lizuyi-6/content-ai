const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 确保数据目录存在
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  const provider = process.env.AI_PROVIDER || 'openai';
  res.json({ 
    status: 'ok', 
    version: '0.3.0',
    provider: provider,
    features: {
      auth: true,
      history: true,
      scheduling: true,
      stats: true
    },
    timestamp: new Date().toISOString()
  });
});

// 前端路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 ContentAI Server v0.3.0 running on http://localhost:${PORT}`);
  console.log(`🤖 AI Provider: ${process.env.AI_PROVIDER || 'qwen'}`);
  console.log(`💾 Database: ${dataDir}/contentai.db`);
});
