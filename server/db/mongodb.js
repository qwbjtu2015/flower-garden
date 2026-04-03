import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flowergarden';

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB 连接成功');
  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error);
    process.exit(1);
  }
}

// 连接断开时重连
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB 连接断开');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB 连接错误:', err);
});

export default mongoose;
