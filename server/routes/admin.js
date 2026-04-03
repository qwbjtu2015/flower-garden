import express from 'express';
import { getDb, saveDb } from '../db/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// 辅助函数：将sql.js结果转换为对象数组
function resultToArray(result) {
  if (!result || result.length === 0) return [];
  const columns = result[0].columns;
  return result[0].values.map(row => {
    const obj = {};
    columns.forEach((col, i) => obj[col] = row[i]);
    return obj;
  });
}

// 所有管理员路由都需要登录和管理员权限
router.use(authenticateToken);
router.use(requireAdmin);

// 获取所有花卉（管理视图）
router.get('/flowers', (req, res) => {
  try {
    const db = getDb();
    const flowers = resultToArray(db.exec('SELECT * FROM flowers ORDER BY id'));
    res.json({ flowers });
  } catch (error) {
    console.error('获取花卉列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取单个花卉详情
router.get('/flowers/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const flowers = resultToArray(db.exec(`SELECT * FROM flowers WHERE id = ${id}`));
    
    if (flowers.length === 0) {
      return res.status(404).json({ error: '花卉不存在' });
    }
    
    res.json({ flower: flowers[0] });
  } catch (error) {
    console.error('获取花卉详情错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 创建花卉
router.post('/flowers', (req, res) => {
  try {
    const { name, name_en, category, image, description, care_tips, watering, sunlight, temperature, fertilizer, fertilizer_link, difficulty, season, bloom_time } = req.body;
    
    if (!name || !category || !image) {
      return res.status(400).json({ error: '名称、分类和图片不能为空' });
    }
    
    const db = getDb();
    
    // 防止SQL注入
    const safeName = name.replace(/'/g, "''");
    const safeNameEn = (name_en || '').replace(/'/g, "''");
    const safeCategory = category.replace(/'/g, "''");
    const safeImage = image.replace(/'/g, "''");
    const safeDescription = (description || '').replace(/'/g, "''");
    const safeCareTips = (care_tips || '').replace(/'/g, "''");
    const safeWatering = (watering || '').replace(/'/g, "''");
    const safeSunlight = (sunlight || '').replace(/'/g, "''");
    const safeTemperature = (temperature || '').replace(/'/g, "''");
    const safeFertilizer = (fertilizer || '').replace(/'/g, "''");
    const safeFertilizerLink = (fertilizer_link || '').replace(/'/g, "''");
    const safeDifficulty = difficulty || 'easy';
    const safeSeason = (season || '').replace(/'/g, "''");
    const safeBloomTime = (bloom_time || '').replace(/'/g, "''");
    
    db.run(`
      INSERT INTO flowers (name, name_en, category, image, description, care_tips, watering, sunlight, temperature, fertilizer, fertilizer_link, difficulty, season, bloom_time)
      VALUES ('${safeName}', '${safeNameEn}', '${safeCategory}', '${safeImage}', '${safeDescription}', '${safeCareTips}', '${safeWatering}', '${safeSunlight}', '${safeTemperature}', '${safeFertilizer}', '${safeFertilizerLink}', '${safeDifficulty}', '${safeSeason}', '${safeBloomTime}')
    `);
    saveDb();
    
    // 获取新花卉ID
    const newFlower = resultToArray(db.exec('SELECT last_insert_rowid()'));
    const flowerId = newFlower[0]['last_insert_rowid()'];
    
    res.status(201).json({ message: '花卉创建成功', id: flowerId });
  } catch (error) {
    console.error('创建花卉错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 更新花卉
router.put('/flowers/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, name_en, category, image, description, care_tips, watering, sunlight, temperature, fertilizer, fertilizer_link, difficulty, season, bloom_time } = req.body;
    
    const db = getDb();
    
    // 检查花卉是否存在
    const existing = resultToArray(db.exec(`SELECT id FROM flowers WHERE id = ${id}`));
    if (existing.length === 0) {
      return res.status(404).json({ error: '花卉不存在' });
    }
    
    // 防止SQL注入
    const safeName = (name || '').replace(/'/g, "''");
    const safeNameEn = (name_en || '').replace(/'/g, "''");
    const safeCategory = (category || '').replace(/'/g, "''");
    const safeImage = (image || '').replace(/'/g, "''");
    const safeDescription = (description || '').replace(/'/g, "''");
    const safeCareTips = (care_tips || '').replace(/'/g, "''");
    const safeWatering = (watering || '').replace(/'/g, "''");
    const safeSunlight = (sunlight || '').replace(/'/g, "''");
    const safeTemperature = (temperature || '').replace(/'/g, "''");
    const safeFertilizer = (fertilizer || '').replace(/'/g, "''");
    const safeFertilizerLink = (fertilizer_link || '').replace(/'/g, "''");
    const safeDifficulty = difficulty || 'easy';
    const safeSeason = (season || '').replace(/'/g, "''");
    const safeBloomTime = (bloom_time || '').replace(/'/g, "''");
    
    db.run(`
      UPDATE flowers SET 
        name = '${safeName}',
        name_en = '${safeNameEn}',
        category = '${safeCategory}',
        image = '${safeImage}',
        description = '${safeDescription}',
        care_tips = '${safeCareTips}',
        watering = '${safeWatering}',
        sunlight = '${safeSunlight}',
        temperature = '${safeTemperature}',
        fertilizer = '${safeFertilizer}',
        fertilizer_link = '${safeFertilizerLink}',
        difficulty = '${safeDifficulty}',
        season = '${safeSeason}',
        bloom_time = '${safeBloomTime}'
      WHERE id = ${id}
    `);
    saveDb();
    
    res.json({ message: '花卉更新成功' });
  } catch (error) {
    console.error('更新花卉错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除花卉
router.delete('/flowers/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    
    // 检查花卉是否存在
    const existing = resultToArray(db.exec(`SELECT id FROM flowers WHERE id = ${id}`));
    if (existing.length === 0) {
      return res.status(404).json({ error: '花卉不存在' });
    }
    
    // 删除花卉
    db.run(`DELETE FROM flowers WHERE id = ${id}`);
    saveDb();
    
    res.json({ message: '花卉删除成功' });
  } catch (error) {
    console.error('删除花卉错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取所有分类
router.get('/categories', (req, res) => {
  try {
    const db = getDb();
    const categories = resultToArray(db.exec('SELECT DISTINCT category FROM flowers ORDER BY category'));
    res.json({ categories: categories.map(c => c.category) });
  } catch (error) {
    console.error('获取分类错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取所有用户
router.get('/users', (req, res) => {
  try {
    const db = getDb();
    const users = resultToArray(db.exec('SELECT id, username, email, role, created_at FROM users ORDER BY id'));
    res.json({ users });
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 修改用户角色
router.put('/users/:id/role', (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: '无效的角色' });
    }
    
    const db = getDb();
    
    // 不能修改自己的角色
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: '不能修改自己的角色' });
    }
    
    db.run(`UPDATE users SET role = '${role}' WHERE id = ${id}`);
    saveDb();
    
    res.json({ message: '角色修改成功' });
  } catch (error) {
    console.error('修改用户角色错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
