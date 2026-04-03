import express from 'express';
import { Flower } from '../models/Flower.js';
import { Comment } from '../models/Comment.js';

const router = express.Router();

// 获取所有花卉（支持分类筛选）
router.get('/', async (req, res) => {
  try {
    const { category, search, difficulty } = req.query;
    
    const filter = {};
    
    if (category && category !== '全部') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { name_en: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (difficulty && difficulty !== 'all') {
      filter.difficulty = difficulty;
    }

    const flowers = await Flower.find(filter).sort({ created_at: -1 });

    // 获取分类统计
    const categories = await Flower.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({ 
      flowers, 
      categories: categories.map(c => ({ category: c._id, count: c.count })) 
    });
  } catch (error) {
    console.error('获取花卉列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取单个花卉详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const flower = await Flower.findById(id);

    if (!flower) {
      return res.status(404).json({ error: '花卉不存在' });
    }

    // 获取评论统计
    const stats = await Comment.aggregate([
      { $match: { flower_id: flower._id } },
      { 
        $group: { 
          _id: null, 
          count: { $sum: 1 }, 
          avgRating: { $avg: '$rating' } 
        } 
      }
    ]);

    res.json({
      ...flower.toObject(),
      commentCount: stats[0]?.count || 0,
      avgRating: stats[0]?.avgRating ? Number(stats[0].avgRating.toFixed(1)) : 0
    });
  } catch (error) {
    console.error('获取花卉详情错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取所有分类
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Flower.distinct('category');

    res.json({ categories });
  } catch (error) {
    console.error('获取分类错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
