const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// OpenAI 配置
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-demo-key'
});

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
    description: '种草笔记， emoji + 标签，适合产品推荐'
  }
};

// 生成内容 API
app.post('/api/generate', async (req, res) => {
  try {
    const { idea, platforms = ['twitter', 'linkedin', 'weibo', 'xiaohongshu'] } = req.body;

    if (!idea) {
      return res.status(400).json({ error: '请输入内容想法' });
    }

    const results = {};
    
    for (const platform of platforms) {
      const template = PLATFORM_TEMPLATES[platform];
      if (!template) continue;

      const prompt = buildPrompt(idea, platform, template);
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `你是专业的${template.name}内容创作者，擅长将想法转化为${template.description}。`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: platform === 'twitter' ? 500 : 1000,
        temperature: 0.7
      });

      results[platform] = {
        platform: template.name,
        content: completion.choices[0].message.content,
        length: completion.choices[0].message.content.length
      };
    }

    res.json({
      success: true,
      data: results,
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

// 构建提示词
function buildPrompt(idea, platform, template) {
  const prompts = {
    twitter: `将以下想法转化为 3-5 条 Twitter 线程：

想法：${idea}

要求：
- 每条不超过 280 字符
- 第一条要吸引眼球（用数字、问题或惊人事实）
- 中间条提供价值（数据、案例、洞察）
- 最后一条要有行动号召（CTA）
- 使用相关 hashtag（2-3 个）
- 用英语写`,

    linkedin: `将以下想法转化为专业的 LinkedIn 长文：

想法：${idea}

要求：
- 开头用个人故事或观察引入
- 主体部分分 3-4 个要点，每点有深度
- 结尾总结 + 引发讨论的问题
- 专业但亲切的语气
- 3-5 个相关 hashtag
- 用英语写`,

    weibo: `将以下想法转化为微博文案：

想法：${idea}

要求：
- 不超过 140 字
- 开头吸引注意（可以用 emoji）
- 内容有趣或有价值
- 结尾可加互动问题
- 2-3 个话题标签 #标签#
- 用中文写`,

    xiaohongshu: `将以下想法转化为小红书种草笔记：

想法：${idea}

要求：
- 标题要吸引点击（用 emoji + 关键词）
- 正文分点说明，每点用 emoji 开头
- 真诚分享的语气
- 结尾加相关标签
- 用中文写，多用 emoji`
  };

  return prompts[platform] || prompts.twitter;
}

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '0.1.0' });
});

// 前端路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 ContentAI Server running on http://localhost:${PORT}`);
});
