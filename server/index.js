const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const AIProviderManager = require('./ai-providers');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 初始化 AI 供应商管理器
const aiManager = new AIProviderManager();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// 内容生成模板
const PLATFORM_TEMPLATES = {
  twitter: {
    name: 'Twitter/X',
    maxLength: 280,
    threads: true,
    description: '短小精悍，适合快速传播观点'
  },
  linkedin: {
    name: 'LinkedIn',
    maxLength: 3000,
    threads: false,
    description: '专业长文，适合深度思考和行业洞察'
  },
  weibo: {
    name: '微博',
    maxLength: 140,
    threads: false,
    description: '中文短内容，适合热点和日常分享'
  },
  xiaohongshu: {
    name: '小红书',
    maxLength: 1000,
    threads: false,
    description: '种草笔记，emoji + 标签，适合产品推荐'
  }
};

// 生成内容 API
app.post('/api/generate', async (req, res) => {
  try {
    const { 
      idea, 
      platforms = ['twitter', 'linkedin', 'weibo', 'xiaohongshu'],
      provider // 可选，指定供应商
    } = req.body;

    if (!idea) {
      return res.status(400).json({ error: '请输入内容想法' });
    }

    const results = {};
    const providerName = provider || process.env.AI_PROVIDER || 'openai';
    
    for (const platform of platforms) {
      const template = PLATFORM_TEMPLATES[platform];
      if (!template) continue;

      const result = await aiManager.generate(idea, platform, template, providerName);
      
      results[platform] = {
        platform: template.name,
        content: result.content,
        length: result.content.length,
        provider: result.provider,
        model: result.model
      };
    }

    res.json({
      success: true,
      data: results,
      provider: providerName,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('生成失败:', error);
    res.status(500).json({
      success: false,
      error: error.message || '生成失败，请稍后重试'
    });
  }
});

// 获取可用供应商列表
app.get('/api/providers', (req, res) => {
  try {
    const providers = aiManager.listProviders();
    const currentProvider = process.env.AI_PROVIDER || 'openai';
    
    res.json({
      success: true,
      providers,
      currentProvider
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  const provider = process.env.AI_PROVIDER || 'openai';
  res.json({ 
    status: 'ok', 
    version: '0.2.0',
    provider: provider,
    timestamp: new Date().toISOString()
  });
});

// 前端路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 ContentAI Server running on http://localhost:${PORT}`);
  console.log(`🤖 AI Provider: ${process.env.AI_PROVIDER || 'openai'}`);
});
