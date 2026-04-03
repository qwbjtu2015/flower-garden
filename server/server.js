import express from 'express';
import cors from 'cors';
import { connectDB } from './db/mongodb.js';
import { seedDatabase, createAdminUser } from './models/seed.js';
import authRoutes from './routes/auth.js';
import flowerRoutes from './routes/flowers.js';
import commentRoutes from './routes/comments.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 请求日志
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/flowers', flowerRoutes);
app.use('/api/flowers', commentRoutes);
app.use('/api/admin', adminRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

// 初始化数据库后启动服务器
async function startServer() {
  try {
    await connectDB();
    
    // 播种花卉数据
    await seedDatabase();
    
    // 创建管理员账号
    await createAdminUser();
    
    app.listen(PORT, () => {
      console.log(`🌸 花语花园服务器已启动: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('服务器启动失败:', error);
    process.exit(1);
  }
}

startServer();
