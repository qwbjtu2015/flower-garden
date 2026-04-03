import express from 'express';
import { Flower } from '../models/Flower.js';
import { User } from '../models/User.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// 所有管理员路由都需要登录和管理员权限
// 注意：update-fertilizer-links 是临时无需认证的接口，完成后请删除
router.use(authenticateToken);
router.use(requireAdmin);

// 临时接口：批量更新肥料链接（无需认证，完成后请删除此接口）
router.post('/fix-fertilizer-links', async (req, res) => {
  try {
    const fertilizerLinks = {
      '玫瑰': 'https://search.jd.com/Search?keyword=%E7%8E%AB%E7%91%B0%E8%8A%B1%E8%82%A5%E6%96%99&enc=utf-8',
      '月季': 'https://search.jd.com/Search?keyword=%E6%9C%88%E5%AD%A3%E8%8A%B1%E8%82%A5%E6%96%99&enc=utf-8',
      '郁金香': 'https://search.jd.com/Search?keyword=%E9%83%81%E9%87%91%E9%A6%99%E7%A7%8D%E7%90%83%E8%82%A5%E6%96%99&enc=utf-8',
      '兰花': 'https://search.jd.com/Search?keyword=%E5%85%B0%E8%8A%B1%E4%B8%93%E7%94%A8%E8%82%A5%E6%96%99&enc=utf-8',
      '向日葵': 'https://search.jd.com/Search?keyword=%E5%90%91%E6%97%A5%E8%91%97%E8%82%A5%E6%96%99&enc=utf-8',
      '牡丹': 'https://search.jd.com/Search?keyword=%E7%89%B1%E7%89%9B%E8%8A%B1%E8%82%A5%E6%96%99&enc=utf-8',
      '百合': 'https://search.jd.com/Search?keyword=%E7%99%BE%E5%90%88%E8%8A%B1%E8%82%A5%E6%96%99&enc=utf-8',
      '菊花': 'https://search.jd.com/Search?keyword=%E8%91%89%E8%8A%B1%E8%82%A5%E6%96%99&enc=utf-8',
      '薰衣草': 'https://search.jd.com/Search?keyword=%E8%96%B0%E8%A1%A3%E8%8D%AF%E8%82%A5%E6%96%99&enc=utf-8',
      '蝴蝶兰': 'https://search.jd.com/Search?keyword=%E8%9D%B4%E8%9D%B6%E5%85%B0%E8%82%A5%E6%96%99&enc=utf-8',
      '仙客来': 'https://search.jd.com/Search?keyword=%E4%BB%99%E5%AE%A2%E6%9D%A5%E8%82%A5%E6%96%99&enc=utf-8',
      '绿萝': 'https://search.jd.com/Search?keyword=%E7%BB%BF%E8%90%9D%E8%82%A5%E6%96%99&enc=utf-8'
    };

    let updatedCount = 0;
    for (const [name, link] of Object.entries(fertilizerLinks)) {
      const result = await Flower.updateOne({ name }, { $set: { fertilizer_link: link } });
      if (result.modifiedCount > 0) updatedCount++;
    }

    res.json({ success: true, message: `已更新 ${updatedCount} 条肥料链接` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

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

// 批量更新肥料购买链接
router.post('/update-fertilizer-links', async (req, res) => {
  try {
    // 花卉名称到肥料链接的映射（中文关键词）
    const fertilizerLinks = {
      '玫瑰': 'https://search.jd.com/Search?keyword=%E7%8E%AB%E7%91%B0%E8%8A%B1%E8%82%A5%E6%96%99&enc=utf-8',
      '月季': 'https://search.jd.com/Search?keyword=%E6%9C%88%E5%AD%A3%E8%8A%B1%E8%82%A5%E6%96%99&enc=utf-8',
      '郁金香': 'https://search.jd.com/Search?keyword=%E9%83%81%E9%87%91%E9%A6%99%E7%A7%8D%E7%90%83%E8%82%A5%E6%96%99&enc=utf-8',
      '兰花': 'https://search.jd.com/Search?keyword=%E5%85%B0%E8%8A%B1%E4%B8%93%E7%94%A8%E8%82%A5%E6%96%99&enc=utf-8',
      '向日葵': 'https://search.jd.com/Search?keyword=%E5%90%91%E6%97%A5%E8%91%97%E8%82%A5%E6%96%99&enc=utf-8',
      '牡丹': 'https://search.jd.com/Search?keyword=%E7%89%B1%E7%89%9B%E8%8A%B1%E8%82%A5%E6%96%99&enc=utf-8',
      '百合': 'https://search.jd.com/Search?keyword=%E7%99%BE%E5%90%88%E8%8A%B1%E8%82%A5%E6%96%99&enc=utf-8',
      '菊花': 'https://search.jd.com/Search?keyword=%E8%91%89%E8%8A%B1%E8%82%A5%E6%96%99&enc=utf-8',
      '薰衣草': 'https://search.jd.com/Search?keyword=%E8%96%B0%E8%A1%A3%E8%8D%AF%E8%82%A5%E6%96%99&enc=utf-8',
      '蝴蝶兰': 'https://search.jd.com/Search?keyword=%E8%9D%B4%E8%9D%B6%E5%85%B0%E8%82%A5%E6%96%99&enc=utf-8',
      '仙客来': 'https://search.jd.com/Search?keyword=%E4%BB%99%E5%AE%A2%E6%9D%A5%E8%82%A5%E6%96%99&enc=utf-8',
      '绿萝': 'https://search.jd.com/Search?keyword=%E7%BB%BF%E8%90%9D%E8%82%A5%E6%96%99&enc=utf-8'
    };

    let updatedCount = 0;
    const results = [];

    for (const [name, link] of Object.entries(fertilizerLinks)) {
      const result = await Flower.updateOne(
        { name },
        { $set: { fertilizer_link: link } }
      );
      
      results.push({ name, link, updated: result.modifiedCount > 0 });
      if (result.modifiedCount > 0) {
        updatedCount++;
      }
    }

    res.json({ 
      message: `成功更新 ${updatedCount} 条肥料链接`,
      results 
    });
  } catch (error) {
    console.error('批量更新肥料链接错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
