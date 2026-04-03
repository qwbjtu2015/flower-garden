import mongoose from 'mongoose';

// MongoDB 连接字符串
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://qwbjtu15_db_user:Ey37Alpp0gTjFS8e@default.vncewmm.mongodb.net/?appName=default';

// 花卉名称到肥料链接的映射
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

// 花卉 Schema
const flowerSchema = new mongoose.Schema({
  name: String,
  fertilizer_link: String
}, { timestamps: true });

const Flower = mongoose.model('Flower', flowerSchema, 'flowers');

async function updateFertilizerLinks() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB 连接成功');

    let updatedCount = 0;

    for (const [name, link] of Object.entries(fertilizerLinks)) {
      const result = await Flower.updateOne(
        { name },
        { $set: { fertilizer_link: link } }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ ${name}: ${link}`);
        updatedCount += result.modifiedCount;
      } else {
        console.log(`⚠️ ${name}: 未找到或未更新`);
      }
    }

    console.log(`\n🎉 完成！共更新 ${updatedCount} 条记录`);
    
  } catch (error) {
    console.error('❌ 更新失败:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

updateFertilizerLinks();
