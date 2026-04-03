import express from 'express';
import bcrypt from 'bcryptjs';
import { getDb, saveDb } from '../db/database.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 辅助函数：将sql.js结果转换为对象
function resultToArray(result) {
  if (!result || result.length === 0) return [];
  const columns = result[0].columns;
  return result[0].values.map(row => {
    const obj = {};
    columns.forEach((col, i) => obj[col] = row[i]);
    return obj;
  });
}

// 注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: '请填写所有必填字段' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: '密码至少6位' });
    }

    const db = getDb();

    // 检查用户名和邮箱是否已存在
    const existing = db.exec(`SELECT id FROM users WHERE username = '${username}' OR email = '${email}'`);
    if (existing.length > 0 && existing[0].values.length > 0) {
      return res.status(400).json({ error: '用户名或邮箱已被注册' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    db.run(`INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${hashedPassword}')`);
    saveDb();

    // 获取新用户ID
    const newUser = db.exec('SELECT last_insert_rowid()');
    const userId = newUser[0].values[0][0];

    const user = { id: userId, username, email };
    const token = generateToken(user);

    res.status(201).json({
      message: '注册成功',
      user: { id: user.id, username: user.username, email: user.email },
      token
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '请填写邮箱和密码' });
    }

    const db = getDb();

    // 查找用户
    const result = db.exec(`SELECT * FROM users WHERE email = '${email}'`);
    
    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    const columns = result[0].columns;
    const userRow = result[0].values[0];
    const user = {};
    columns.forEach((col, i) => user[col] = userRow[i]);

    // 验证密码
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    const token = generateToken(user);

    res.json({
      message: '登录成功',
      user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar, role: user.role },
      token
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取当前用户信息
router.get('/me', authenticateToken, (req, res) => {
  const db = getDb();
  const result = db.exec(`SELECT id, username, email, avatar, role, created_at FROM users WHERE id = ${req.user.id}`);
  
  if (result.length === 0 || result[0].values.length === 0) {
    return res.status(404).json({ error: '用户不存在' });
  }

  const columns = result[0].columns;
  const userRow = result[0].values[0];
  const user = {};
  columns.forEach((col, i) => user[col] = userRow[i]);

  res.json({ user });
});

// 更新用户信息
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const db = getDb();

    if (username) {
      // 检查用户名是否被其他用户使用
      const existing = db.exec(`SELECT id FROM users WHERE username = '${username}' AND id != ${req.user.id}`);
      if (existing.length > 0 && existing[0].values.length > 0) {
        return res.status(400).json({ error: '用户名已被使用' });
      }

      db.run(`UPDATE users SET username = '${username}' WHERE id = ${req.user.id}`);
    }

    if (avatar) {
      db.run(`UPDATE users SET avatar = '${avatar}' WHERE id = ${req.user.id}`);
    }

    saveDb();

    const result = db.exec(`SELECT id, username, email, avatar FROM users WHERE id = ${req.user.id}`);
    const columns = result[0].columns;
    const userRow = result[0].values[0];
    const user = {};
    columns.forEach((col, i) => user[col] = userRow[i]);

    res.json({ message: '更新成功', user });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
