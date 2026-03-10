// 用户认证路由
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = express.Router();

// 注册
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码必填' });
    }

    // 检查用户是否已存在
    const existingUser = db.userOps.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: '该邮箱已注册' });
    }

    // 密码加密
    const passwordHash = await bcrypt.hash(password, 10);
    
    // 创建用户
    const result = db.userOps.create(email, passwordHash, name);
    const user = db.userOps.findByEmail(email);

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        api_key: user.api_key,
        plan: user.plan,
        usage_count: user.usage_count,
        usage_limit: user.usage_limit
      }
    });

  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({ error: '注册失败' });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码必填' });
    }

    const user = db.userOps.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        api_key: user.api_key,
        plan: user.plan,
        usage_count: user.usage_count,
        usage_limit: user.usage_limit
      }
    });

  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ error: '登录失败' });
  }
});

// 获取当前用户信息
router.get('/me', (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ error: '未授权' });
    }

    const user = db.userOps.findByApiKey(apiKey);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        usage_count: user.usage_count,
        usage_limit: user.usage_limit
      }
    });

  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

// 升级计划（简化版，实际应集成 Stripe）
router.post('/upgrade', (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const { plan } = req.body; // pro or team

    if (!apiKey) {
      return res.status(401).json({ error: '未授权' });
    }

    const user = db.userOps.findByApiKey(apiKey);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 更新计划和使用限制
    const limits = { free: 10, pro: 1000, team: 10000 };
    const stmt = db.db.prepare(`
      UPDATE users SET plan = ?, usage_limit = ?
      WHERE id = ?
    `);
    stmt.run(plan, limits[plan] || 1000, user.id);

    res.json({
      success: true,
      message: '计划已升级',
      data: { plan, usage_limit: limits[plan] }
    });

  } catch (error) {
    console.error('升级计划失败:', error);
    res.status(500).json({ error: '升级计划失败' });
  }
});

module.exports = router;
