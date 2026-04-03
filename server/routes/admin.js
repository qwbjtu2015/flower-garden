import express from 'express';
import { Flower } from '../models/Flower.js';
import { User } from '../models/User.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// 所有管理员路由都需要登录和管理员权限
router.use(authenticateToken);
router.use(requireAdmin);

// 获取所有花卉（管理视图）
router.get('/flowers', async (req, res) => {
  try {
    const flowers = await Flower.find().sort({ _id: 1 });
    res.json({ flowers });
  } catch (error) {
    console.error('获取花卉列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取单个花卉详情
router.get('/flowers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const flower = await Flower.findById(id);
    
    if (!flower) {
      return res.status(404).json({ error: '花卉不存在' });
    }
    
    res.json({ flower });
  } catch (error) {
    console.error('获取花卉详情错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 创建花卉
router.post('/flowers', async (req, res) => {
  try {
    const { name, name_en, category, image, description, care_tips, watering, sunlight, temperature, fertilizer, fertilizer_link, difficulty, season, bloom_time } = req.body;
    
    if (!name || !category || !image) {
      return res.status(400).json({ error: '名称、分类和图片不能为空' });
    }
    
    const flower = await Flower.create({
      name,
      name_en,
      category,
      image,
      description,
      care_tips,
      watering,
      sunlight,
      temperature,
      fertilizer,
      fertilizer_link,
      difficulty: difficulty || 'easy',
      season,
      bloom_time
    });
    
    res.status(201).json({ message: '花卉创建成功', id: flower._id });
  } catch (error) {
    console.error('创建花卉错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 更新花卉
router.put('/flowers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查花卉是否存在
    const existing = await Flower.findById(id);
    if (!existing) {
      return res.status(404).json({ error: '花卉不存在' });
    }
    
    const updateData = {};
    const fields = ['name', 'name_en', 'category', 'image', 'description', 'care_tips', 'watering', 'sunlight', 'temperature', 'fertilizer', 'fertilizer_link', 'difficulty', 'season', 'bloom_time'];
    
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    
    await Flower.findByIdAndUpdate(id, updateData);
    
    res.json({ message: '花卉更新成功' });
  } catch (error) {
    console.error('更新花卉错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除花卉
router.delete('/flowers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查花卉是否存在
    const existing = await Flower.findById(id);
    if (!existing) {
      return res.status(404).json({ error: '花卉不存在' });
    }
    
    await Flower.findByIdAndDelete(id);
    
    res.json({ message: '花卉删除成功' });
  } catch (error) {
    console.error('删除花卉错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取所有分类
router.get('/categories', async (req, res) => {
  try {
    const categories = await Flower.distinct('category');
    res.json({ categories });
  } catch (error) {
    console.error('获取分类错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取所有用户
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ _id: 1 });
    res.json({ users });
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 修改用户角色
router.put('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: '无效的角色' });
    }
    
    // 不能修改自己的角色
    if (id === req.user.id) {
      return res.status(400).json({ error: '不能修改自己的角色' });
    }
    
    await User.findByIdAndUpdate(id, { role });
    
    res.json({ message: '角色修改成功' });
  } catch (error) {
    console.error('修改用户角色错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
