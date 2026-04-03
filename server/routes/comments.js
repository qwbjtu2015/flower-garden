import express from 'express';
import { Comment } from '../models/Comment.js';
import { Flower } from '../models/Flower.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 获取花卉评论
router.get('/:flowerId/comments', async (req, res) => {
  try {
    const { flowerId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const comments = await Comment.find({ flower_id: flowerId })
      .populate('user_id', 'username avatar')
      .sort({ created_at: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    const total = await Comment.countDocuments({ flower_id: flowerId });

    // 格式化返回数据
    const formattedComments = comments.map(c => ({
      id: c._id,
      flower_id: c.flower_id,
      user_id: c.user_id._id,
      username: c.user_id.username,
      avatar: c.user_id.avatar,
      content: c.content,
      rating: c.rating,
      created_at: c.created_at
    }));

    res.json({
      comments: formattedComments,
      total,
      hasMore: parseInt(offset) + comments.length < total
    });
  } catch (error) {
    console.error('获取评论错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 添加评论
router.post('/:flowerId/comments', authenticateToken, async (req, res) => {
  try {
    const { flowerId } = req.params;
    const { content, rating = 5 } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: '评论内容不能为空' });
    }

    if (content.length > 500) {
      return res.status(400).json({ error: '评论内容不能超过500字' });
    }

    // 检查花卉是否存在
    const flower = await Flower.findById(flowerId);
    if (!flower) {
      return res.status(404).json({ error: '花卉不存在' });
    }

    // 创建评论
    const comment = await Comment.create({
      flower_id: flowerId,
      user_id: userId,
      content: content.trim(),
      rating
    });

    // 重新查询获取完整信息
    const fullComment = await Comment.findById(comment._id)
      .populate('user_id', 'username avatar');

    const result = {
      id: fullComment._id,
      flower_id: fullComment.flower_id,
      user_id: fullComment.user_id._id,
      username: fullComment.user_id.username,
      avatar: fullComment.user_id.avatar,
      content: fullComment.content,
      rating: fullComment.rating,
      created_at: fullComment.created_at
    };

    res.status(201).json({ message: '评论发布成功', comment: result });
  } catch (error) {
    console.error('添加评论错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除评论
router.delete('/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: '评论不存在' });
    }

    // 检查权限（评论作者或管理员可以删除）
    const user = await (await import('../models/User.js')).User.findById(userId);
    if (comment.user_id.toString() !== userId && user.role !== 'admin') {
      return res.status(403).json({ error: '只能删除自己的评论' });
    }

    await Comment.findByIdAndDelete(commentId);

    res.json({ message: '评论已删除' });
  } catch (error) {
    console.error('删除评论错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
