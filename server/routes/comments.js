import express from 'express';
import { getDb, saveDb } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

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

// 获取花卉评论
router.get('/:flowerId/comments', (req, res) => {
  try {
    const { flowerId } = req.params;
    const { limit = 20, offset = 0 } = req.query;
    const db = getDb();

    const comments = resultToArray(db.exec(`
      SELECT c.*, u.username, u.avatar
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.flower_id = ${flowerId}
      ORDER BY c.created_at DESC
      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
    `));

    const total = resultToArray(db.exec(`SELECT COUNT(*) as count FROM comments WHERE flower_id = ${flowerId}`));

    res.json({
      comments,
      total: total[0]?.count || 0,
      hasMore: parseInt(offset) + comments.length < (total[0]?.count || 0)
    });
  } catch (error) {
    console.error('获取评论错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 添加评论
router.post('/:flowerId/comments', authenticateToken, (req, res) => {
  try {
    const { flowerId } = req.params;
    const { content, rating = 5 } = req.body;
    const userId = req.user.id;
    const db = getDb();

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: '评论内容不能为空' });
    }

    if (content.length > 500) {
      return res.status(400).json({ error: '评论内容不能超过500字' });
    }

    // 检查花卉是否存在
    const flowers = resultToArray(db.exec(`SELECT id FROM flowers WHERE id = ${flowerId}`));
    if (flowers.length === 0) {
      return res.status(404).json({ error: '花卉不存在' });
    }

    // 创建评论
    const safeContent = content.trim().replace(/'/g, "''");
    db.run(`INSERT INTO comments (flower_id, user_id, content, rating) VALUES (${flowerId}, ${userId}, '${safeContent}', ${rating})`);
    saveDb();

    // 获取新评论ID
    const newComment = resultToArray(db.exec('SELECT last_insert_rowid()'));
    const commentId = newComment[0]['last_insert_rowid()'];

    // 获取完整的评论信息
    const comments = resultToArray(db.exec(`
      SELECT c.*, u.username, u.avatar
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ${commentId}
    `));

    res.status(201).json({ message: '评论发布成功', comment: comments[0] });
  } catch (error) {
    console.error('添加评论错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除评论
router.delete('/comments/:commentId', authenticateToken, (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    const db = getDb();

    const comments = resultToArray(db.exec(`SELECT * FROM comments WHERE id = ${commentId}`));

    if (comments.length === 0) {
      return res.status(404).json({ error: '评论不存在' });
    }

    if (comments[0].user_id !== userId) {
      return res.status(403).json({ error: '只能删除自己的评论' });
    }

    db.run(`DELETE FROM comments WHERE id = ${commentId}`);
    saveDb();

    res.json({ message: '评论已删除' });
  } catch (error) {
    console.error('删除评论错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
