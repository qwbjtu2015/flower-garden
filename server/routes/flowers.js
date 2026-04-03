import express from 'express';
import { getDb } from '../db/database.js';

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

// 获取所有花卉（支持分类筛选）
router.get('/', (req, res) => {
  try {
    const { category, search, difficulty } = req.query;
    const db = getDb();

    let sql = 'SELECT * FROM flowers WHERE 1=1';

    if (category && category !== '全部') {
      sql += ` AND category = '${category}'`;
    }

    if (search) {
      const searchTerm = search.replace(/'/g, "''");
      sql += ` AND (name LIKE '%${searchTerm}%' OR name_en LIKE '%${searchTerm}%' OR description LIKE '%${searchTerm}%')`;
    }

    if (difficulty && difficulty !== 'all') {
      sql += ` AND difficulty = '${difficulty}'`;
    }

    sql += ' ORDER BY created_at DESC';

    const flowers = resultToArray(db.exec(sql));

    // 获取分类统计
    const categories = resultToArray(db.exec('SELECT category, COUNT(*) as count FROM flowers GROUP BY category'));

    res.json({ flowers, categories });
  } catch (error) {
    console.error('获取花卉列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取单个花卉详情
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const flowers = resultToArray(db.exec(`SELECT * FROM flowers WHERE id = ${id}`));

    if (flowers.length === 0) {
      return res.status(404).json({ error: '花卉不存在' });
    }

    const flower = flowers[0];

    // 获取评论统计
    const stats = resultToArray(db.exec(`SELECT COUNT(*) as count, AVG(rating) as avgRating FROM comments WHERE flower_id = ${id}`));

    res.json({
      ...flower,
      commentCount: stats[0]?.count || 0,
      avgRating: stats[0]?.avgRating ? Number(stats[0].avgRating.toFixed(1)) : 0
    });
  } catch (error) {
    console.error('获取花卉详情错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取所有分类
router.get('/meta/categories', (req, res) => {
  try {
    const db = getDb();
    const categories = resultToArray(db.exec('SELECT DISTINCT category FROM flowers ORDER BY category'));

    res.json({ categories: categories.map(c => c.category) });
  } catch (error) {
    console.error('获取分类错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
