// SQLite 数据库 - 用户系统 + 内容历史
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../data/contentai.db'));

// 初始化数据库表
db.exec(`
  -- 用户表
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    avatar TEXT,
    plan TEXT DEFAULT 'free', -- free, pro, team
    api_key TEXT UNIQUE,
    usage_count INTEGER DEFAULT 0,
    usage_limit INTEGER DEFAULT 10,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 内容历史表
  CREATE TABLE IF NOT EXISTS contents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    idea TEXT NOT NULL,
    platform TEXT NOT NULL,
    content TEXT NOT NULL,
    provider TEXT,
    model TEXT,
    length INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- 定时任务表
  CREATE TABLE IF NOT EXISTS scheduled_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content_id INTEGER,
    platform TEXT NOT NULL,
    scheduled_time DATETIME NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, posted, failed
    post_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
  );

  -- 使用统计表
  CREATE TABLE IF NOT EXISTS usage_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT NOT NULL,
    count INTEGER DEFAULT 0,
    UNIQUE(user_id, date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- 创建索引
  CREATE INDEX IF NOT EXISTS idx_contents_user_id ON contents(user_id);
  CREATE INDEX IF NOT EXISTS idx_contents_created_at ON contents(created_at);
  CREATE INDEX IF NOT EXISTS idx_scheduled_posts_time ON scheduled_posts(scheduled_time);
  CREATE INDEX IF NOT EXISTS idx_usage_stats_user_date ON usage_stats(user_id, date);
`);

// 用户操作
const userOps = {
  create(email, passwordHash, name = '') {
    const stmt = db.prepare(`
      INSERT INTO users (email, password_hash, name, api_key)
      VALUES (?, ?, ?, ?)
    `);
    const apiKey = 'sk_' + Math.random().toString(36).substring(2, 32);
    return stmt.run(email, passwordHash, name, apiKey);
  },

  findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  },

  findByApiKey(apiKey) {
    const stmt = db.prepare('SELECT * FROM users WHERE api_key = ?');
    return stmt.get(apiKey);
  },

  updateUsage(userId, count) {
    const stmt = db.prepare(`
      UPDATE users SET usage_count = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(count, userId);
  },

  incrementUsage(userId) {
    const user = this.findByEmail(userId); // 简化：实际应该用 ID 查找
    return this.updateUsage(userId, user.usage_count + 1);
  }
};

// 内容操作
const contentOps = {
  create(userId, idea, platform, content, provider, model) {
    const stmt = db.prepare(`
      INSERT INTO contents (user_id, idea, platform, content, provider, model, length)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(userId, idea, platform, content, provider, model, content.length);
  },

  findByUser(userId, limit = 50, offset = 0) {
    const stmt = db.prepare(`
      SELECT * FROM contents WHERE user_id = ?
      ORDER BY created_at DESC LIMIT ? OFFSET ?
    `);
    return stmt.all(userId, limit, offset);
  },

  delete(userId, contentId) {
    const stmt = db.prepare(`
      DELETE FROM contents WHERE id = ? AND user_id = ?
    `);
    return stmt.run(contentId, userId);
  }
};

// 定时任务操作
const scheduledOps = {
  create(userId, contentId, platform, scheduledTime) {
    const stmt = db.prepare(`
      INSERT INTO scheduled_posts (user_id, content_id, platform, scheduled_time)
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(userId, contentId, platform, scheduledTime);
  },

  getPending() {
    const stmt = db.prepare(`
      SELECT * FROM scheduled_posts 
      WHERE status = 'pending' AND scheduled_time <= CURRENT_TIMESTAMP
      ORDER BY scheduled_time ASC
    `);
    return stmt.all();
  },

  updateStatus(id, status, postUrl = null) {
    const stmt = db.prepare(`
      UPDATE scheduled_posts SET status = ?, post_url = ?
      WHERE id = ?
    `);
    return stmt.run(status, postUrl, id);
  }
};

// 使用统计操作
const statsOps = {
  increment(userId, date) {
    const stmt = db.prepare(`
      INSERT INTO usage_stats (user_id, date, count)
      VALUES (?, ?, 1)
      ON CONFLICT(user_id, date) DO UPDATE SET count = count + 1
    `);
    return stmt.run(userId, date);
  },

  getByUser(userId, startDate, endDate) {
    const stmt = db.prepare(`
      SELECT * FROM usage_stats 
      WHERE user_id = ? AND date BETWEEN ? AND ?
      ORDER BY date ASC
    `);
    return stmt.all(userId, startDate, endDate);
  }
};

module.exports = {
  db,
  userOps,
  contentOps,
  scheduledOps,
  statsOps
};
