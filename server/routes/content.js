// 内容管理路由
const express = require('express');
const db = require('../db');
const AIProviderManager = require('../ai-providers');

const router = express.Router();
const aiManager = new AIProviderManager();

// 中间件：验证 API Key
function authMiddleware(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ error: '未授权，请提供 API Key' });
  }

  const user = db.userOps.findByApiKey(apiKey);
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }

  req.user = user;
  next();
}

// 生成内容（需要认证）
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { idea, platforms = ['twitter', 'linkedin', 'weibo', 'xiaohongshu'], provider } = req.body;
    const user = req.user;

    if (!idea) {
      return res.status(400).json({ error: '请输入内容想法' });
    }

    // 检查使用限制
    if (user.usage_count >= user.usage_limit) {
      return res.status(403).json({ 
        error: '已达到使用上限，请升级计划',
        upgrade_available: true
      });
    }

    const results = {};
    const providerName = provider || process.env.AI_PROVIDER || 'openai';
    
    for (const platform of platforms) {
      const template = {
        twitter: { name: 'Twitter/X', maxLength: 280 },
        linkedin: { name: 'LinkedIn', maxLength: 3000 },
        weibo: { name: '微博', maxLength: 140 },
        xiaohongshu: { name: '小红书', maxLength: 1000 }
      }[platform];

      if (!template) continue;

      const result = await aiManager.generate(idea, platform, template, providerName);
      
      // 保存到数据库
      db.contentOps.create(
        user.id,
        idea,
        platform,
        result.content,
        result.provider,
        result.model
      );

      results[platform] = {
        platform: template.name,
        content: result.content,
        length: result.content.length,
        provider: result.provider,
        model: result.model
      };
    }

    // 更新使用统计
    db.userOps.updateUsage(user.id, user.usage_count + 1);
    const today = new Date().toISOString().split('T')[0];
    db.statsOps.increment(user.id, today);

    res.json({
      success: true,
      data: results,
      provider: providerName,
      usage: {
        used: user.usage_count + 1,
        limit: user.usage_limit,
        remaining: user.usage_limit - (user.usage_count + 1)
      },
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

// 获取内容历史
router.get('/history', authMiddleware, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const contents = db.contentOps.findByUser(req.user.id, limit, offset);

    res.json({
      success: true,
      data: contents,
      pagination: { limit, offset, total: contents.length }
    });

  } catch (error) {
    console.error('获取历史失败:', error);
    res.status(500).json({ error: '获取历史失败' });
  }
});

// 删除内容
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const result = db.contentOps.delete(req.user.id, req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: '内容不存在' });
    }

    res.json({ success: true, message: '已删除' });

  } catch (error) {
    console.error('删除失败:', error);
    res.status(500).json({ error: '删除失败' });
  }
});

// 获取使用统计
router.get('/stats', authMiddleware, (req, res) => {
  try {
    const { start, end } = req.query;
    const startDate = start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = end || new Date().toISOString().split('T')[0];

    const stats = db.statsOps.getByUser(req.user.id, startDate, endDate);

    res.json({
      success: true,
      data: {
        stats,
        total: stats.reduce((sum, s) => sum + s.count, 0),
        period: { start: startDate, end: endDate }
      }
    });

  } catch (error) {
    console.error('获取统计失败:', error);
    res.status(500).json({ error: '获取统计失败' });
  }
});

module.exports = router;
