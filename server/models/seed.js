import { Flower } from './Flower.js';
import { User } from './User.js';
import bcrypt from 'bcryptjs';

// 12种示例花卉数据
const flowers = [
  {
    name: '玫瑰',
    name_en: 'Rose',
    category: '灌木花卉',
    image: 'https://images.unsplash.com/photo-1518882605630-8eb699f86a93?w=800',
    description: '玫瑰是世界上最著名的花卉之一，象征着爱情与美丽。花色丰富，花香馥郁，深受人们喜爱。',
    care_tips: '1. 保持充足阳光，每天至少6小时直射光\n2. 定期修剪枯叶和残花\n3. 注意通风，预防病虫害\n4. 冬季适当保暖',
    watering: '春秋季每2-3天浇水一次，夏季每天浇水，冬季减少浇水。保持土壤微湿但不积水。',
    sunlight: '喜欢充足阳光，需要每天6小时以上的直射光照。阳光充足花开更艳。',
    temperature: '适宜生长温度15-26°C，冬季不低于5°C。',
    fertilizer: '生长期每两周施一次复合肥，花期前增施磷钾肥。可使用有机肥如腐熟的鸡粪。',
    fertilizer_link: 'https://search.jd.com/Search?keyword=%E7%8E%AB%E7%91%B0%E8%82%9A%E8%8D%AF+%E6%B0%B4%E6%BA%B6%E8%82%9A&enc=utf-8',
    difficulty: 'medium',
    season: '春夏秋',
    bloom_time: '5-10月'
  },
  {
    name: '月季',
    name_en: 'China Rose',
    category: '灌木花卉',
    image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800',
    description: '月季被誉为"花中皇后"，花期长，几乎全年开花。品种繁多，是庭院和阳台的常见花卉。',
    care_tips: '1. 喜阳光充足的环境\n2. 生长季节注意追肥\n3. 及时修剪残花\n4. 防治蚜虫和红蜘蛛',
    watering: '生长期保持土壤湿润，夏季高温时每天浇水，冬季控制浇水。',
    sunlight: '需要充足的光照，每天至少4小时阳光。',
    temperature: '适宜温度15-28°C，耐寒性较好。',
    fertilizer: '春季萌芽期施氮肥，花期前施磷钾肥，秋季补充有机肥。',
    fertilizer_link: 'https://search.jd.com/Search?keyword=%E6%9C%88%E5%AD%A3%E8%82%9A%E8%8D%AF+%E6%B0%B4%E6%BA%B6%E8%82%9A&enc=utf-8',
    difficulty: 'easy',
    season: '全年',
    bloom_time: '全年开花'
  },
  {
    name: '郁金香',
    name_en: 'Tulip',
    category: '球根花卉',
    image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800',
    description: '郁金香是荷兰国花，花型独特，色彩艳丽。春季开花，是重要的观赏花卉。',
    care_tips: '1. 种植深度为球根高度的3倍\n2. 生长期保证充足光照\n3. 花后及时剪除残花\n4. 夏季收球储存',
    watering: '种植后浇透水，生长期保持土壤湿润，开花后控制浇水。',
    sunlight: '需要充足的阳光，每天至少6小时光照。',
    temperature: '生长期适宜温度10-20°C，耐寒不耐热。',
    fertilizer: '种植时施底肥，生长期追施磷钾肥促进开花。',
    fertilizer_link: 'https://search.jd.com/Search?keyword=%E9%83%81%E9%87%91%E9%A6%99%E8%82%9A%E8%8D%AF+%E9%93%B6%E9%82%A3%E8%82%9A&enc=utf-8',
    difficulty: 'medium',
    season: '春秋',
    bloom_time: '3-5月'
  },
  {
    name: '兰花',
    name_en: 'Orchid',
    category: '兰科花卉',
    image: 'https://images.unsplash.com/photo-1566836610593-62a64888c216?w=800',
    description: '兰花是高雅花卉的代名词，品种繁多，花形优美，香气宜人。中国传统名花之一。',
    care_tips: '1. 选用疏松透气的专用介质\n2. 保持空气湿度\n3. 避免强光直射\n4. 定期施肥薄肥勤施',
    watering: '7-10天浇水一次，用温水沿盆边浇水，避免积水。冬季减少浇水。',
    sunlight: '喜欢散射光，避免阳光直射。放在东窗或北窗处最佳。',
    temperature: '适宜温度15-28°C，不耐严寒，冬季需保暖。',
    fertilizer: '生长期使用兰花专用肥，稀释后施用，薄肥勤施。',
    fertilizer_link: 'https://search.jd.com/Search?keyword=%E5%85%B0%E8%8A%B1%E4%B8%93%E7%94%A8%E8%82%9A%E8%8D%AF&enc=utf-8',
    difficulty: 'hard',
    season: '冬春',
    bloom_time: '1-4月'
  },
  {
    name: '向日葵',
    name_en: 'Sunflower',
    category: '一年生花卉',
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800',
    description: '向日葵是充满阳光气息的花卉，花大色艳，永远追随太阳。象征着积极乐观的生活态度。',
    care_tips: '1. 选择阳光充足的位置种植\n2. 定期浇水保持土壤湿润\n3. 设立支架防止倒伏\n4. 及时采收成熟的瓜子',
    watering: '幼苗期保持湿润，成株后每周浇水2-3次，夏季高温时增加浇水。',
    sunlight: '必须充足的阳光，每天至少8小时直射光。',
    temperature: '适宜温度18-30°C，喜温暖耐热。',
    fertilizer: '种植时施足底肥，生长期追施氮肥，开花前增施磷钾肥。',
    fertilizer_link: 'https://search.jd.com/Search?keyword=%E5%90%91%E6%97%A5%E8%91%97%E8%82%9A%E8%8D%AF+%E8%82%A0%E8%93%84%E8%82%9A&enc=utf-8',
    difficulty: 'easy',
    season: '夏秋',
    bloom_time: '7-9月'
  },
  {
    name: '牡丹',
    name_en: 'Peony',
    category: '木本花卉',
    image: 'https://images.unsplash.com/photo-1526317844070-40e3b2b5ced1?w=800',
    description: '牡丹是中国的国花，花大如盘，雍容华贵。素有"花中之王"的美誉。',
    care_tips: '1. 选择通风良好的位置\n2. 春季萌芽前修剪\n3. 花后及时施肥补充营养\n4. 秋季控制浇水',
    watering: '春季适量浇水，花期保持湿润，雨季注意排水，冬季控水。',
    sunlight: '喜阳光但忌暴晒，夏季需要适当遮阴。',
    temperature: '耐寒性强，适宜温度12-25°C。',
    fertilizer: '花后施复合肥，秋季施有机肥，冬季停肥。',
    fertilizer_link: 'https://search.jd.com/Search?keyword=%E7%89%B1%E7%89%9B%E8%82%9A%E8%8D%AF+%E6%B0%B4%E6%BA%B6%E8%82%9A&enc=utf-8',
    difficulty: 'hard',
    season: '春夏',
    bloom_time: '4-5月'
  },
  {
    name: '百合',
    name_en: 'Lily',
    category: '球根花卉',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800',
    description: '百合花姿雅致，花香浓郁，是重要的切花材料。象征纯洁和百年好合。',
    care_tips: '1. 选用深厚疏松的土壤\n2. 避免阳光直射花苞\n3. 设立支架支撑花茎\n4. 花后剪除残花保留叶片',
    watering: '生长期保持土壤湿润，见干见湿，忌积水。',
    sunlight: '喜阳光充足，夏季中午需要遮阴。',
    temperature: '适宜温度15-25°C，耐寒性较好。',
    fertilizer: '生长期每两周施一次液肥，现蕾期增施磷钾肥。',
    fertilizer_link: 'https://search.jd.com/Search?keyword=%E7%99%BE%E5%90%88%E8%8D%AF%E8%82%9A%E8%8D%AF+%E9%93%B6%E9%82%A3%E8%82%9A&enc=utf-8',
    difficulty: 'medium',
    season: '春夏秋',
    bloom_time: '5-8月'
  },
  {
    name: '菊花',
    name_en: 'Chrysanthemum',
    category: '多年生花卉',
    image: 'https://images.unsplash.com/photo-1501492673258-2892bc6e43f2?w=800',
    description: '菊花是中国的传统名花，品种繁多，花色丰富。秋季开花，象征高洁长寿。',
    care_tips: '1. 生长期注意摘心促分枝\n2. 定期转动花盆使受光均匀\n3. 及时摘除侧蕾集中养分\n4. 花后修剪残枝',
    watering: '生长期保持土壤湿润，高温时每天浇水，花期减少浇水。',
    sunlight: '需要充足阳光，菊花的短日照特性促进开花。',
    temperature: '适宜温度15-25°C，耐寒性好。',
    fertilizer: '生长期施氮肥，现蕾后增施磷钾肥。',
    fertilizer_link: 'https://search.jd.com/Search?keyword=%E8%91%89%E8%8D%AF%E8%82%9A%E8%8D%AF+%E9%93%B6%E9%82%A3%E8%82%9A&enc=utf-8',
    difficulty: 'easy',
    season: '秋冬',
    bloom_time: '9-11月'
  },
  {
    name: '薰衣草',
    name_en: 'Lavender',
    category: '香草花卉',
    image: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=800',
    description: '薰衣草是世界著名的香草植物，花紫色，香气宜人。可用于提取精油或干燥保存。',
    care_tips: '1. 喜欢碱性排水良好的土壤\n2. 避免过度浇水和施肥\n3. 定期修剪保持株型\n4. 夏季注意通风',
    watering: '耐干旱，宁干勿湿。夏季每周浇水1-2次，冬季每月浇水一次。',
    sunlight: '必须充足的阳光，每天至少6小时直射光。',
    temperature: '适宜温度15-25°C，耐寒耐热。',
    fertilizer: '对肥料需求不高，春季施少量缓释肥即可。',
    fertilizer_link: 'https://search.jd.com/Search?keyword=%E8%96%B0%E8%A1%A3%E8%8D%AF%E8%82%9A%E8%8D%AF+%E7%BC%93%E9%87%8A%E8%82%9A&enc=utf-8',
    difficulty: 'medium',
    season: '春夏',
    bloom_time: '5-7月'
  },
  {
    name: '蝴蝶兰',
    name_en: 'Moth Orchid',
    category: '兰科花卉',
    image: 'https://images.unsplash.com/photo-1596573455029-3a6d5253ef12?w=800',
    description: '蝴蝶兰是市场最常见的兰花品种，花形如蝴蝶展翅，色彩丰富，观赏期长。',
    care_tips: '1. 使用专用兰花介质\n2. 保持环境通风\n3. 避免空调直吹\n4. 花箭剪至第二个节点可复花',
    watering: '每周浇水一次，用浸盆法，浇水后沥干。冬季减少浇水。',
    sunlight: '喜欢散射光，避免阳光直射，放在明亮的室内位置即可。',
    temperature: '适宜温度18-28°C，不耐低温，冬季需保暖。',
    fertilizer: '使用蝴蝶兰专用肥，稀释1000倍，生长期每两周施一次。',
    fertilizer_link: 'https://search.jd.com/Search?keyword=%E8%9D%B4%E8%9D%B6%E5%85%B0%E8%82%9A%E8%8D%AF+%E6%B0%B4%E6%BA%B6%E8%82%9A&enc=utf-8',
    difficulty: 'medium',
    season: '冬春',
    bloom_time: '2-4月'
  },
  {
    name: '仙客来',
    name_en: 'Cyclamen',
    category: '球根花卉',
    image: 'https://images.unsplash.com/photo-1572969176007-e38f9c85ca08?w=800',
    description: '仙客来花形独特，花色艳丽，冬季室内重要的观赏花卉。寓意喜迎宾客。',
    care_tips: '1. 避免叶心积水\n2. 保持环境凉爽\n3. 及时摘除枯叶残花\n4. 花期不要换盆',
    watering: '采用浸盆法浇水，避免水浇到叶心和球茎上。',
    sunlight: '喜欢散射光，放在明亮的窗边，避免阳光直射。',
    temperature: '适宜温度10-18°C，不耐高温，室内凉爽处养护最佳。',
    fertilizer: '生长期每两周施一次稀释液肥，花期停止施肥。',
    fertilizer_link: 'https://search.jd.com/Search?keyword=%E4%BB%99%E5%AE%A2%E6%9D%A5%E8%82%9A%E8%8D%AF+%E9%93%B6%E9%82%A3%E8%82%9A&enc=utf-8',
    difficulty: 'medium',
    season: '秋冬春',
    bloom_time: '10-4月'
  },
  {
    name: '绿萝',
    name_en: 'Pothos',
    category: '观叶植物',
    image: 'https://images.unsplash.com/photo-1597055181300-e3633a917e45?w=800',
    description: '绿萝是经典的室内绿植，生命力顽强，可净化空气。是新手的理想选择。',
    care_tips: '1. 可水培或土培\n2. 定期清洁叶片\n3. 适当修剪过长枝条\n4. 每月转动花盆使株型均匀',
    watering: '土壤微干时浇水，夏季多浇，冬季少浇。水培注意换水。',
    sunlight: '耐阴，放在明亮的散射光处最佳，避免阳光直射。',
    temperature: '适宜温度15-30°C，不耐寒，冬季注意保暖。',
    fertilizer: '生长期每月施一次稀释液肥或缓释肥即可。',
    fertilizer_link: 'https://search.jd.com/Search?keyword=%E7%BB%BF%E8%90%9D%E8%82%9A%E8%8D%AF+%E6%B0%B4%E6%BA%B6%E8%82%9A&enc=utf-8',
    difficulty: 'easy',
    season: '全年',
    bloom_time: '观叶植物'
  }
];

export async function seedDatabase() {
  try {
    // 检查是否已有花卉数据
    const count = await Flower.countDocuments();
    
    if (count === 0) {
      console.log('🌱 开始播种花卉数据...');
      await Flower.insertMany(flowers);
      console.log(`✅ 已插入 ${flowers.length} 种花卉数据`);
    } else {
      console.log(`📊 数据库中已有 ${count} 种花卉，跳过播种`);
    }
  } catch (error) {
    console.error('播种失败:', error);
  }
}

export async function createAdminUser() {
  try {
    const ADMIN_EMAIL = 'admin@flowergarden.com';
    const ADMIN_PASSWORD = 'admin123';
    
    // 检查是否已存在管理员
    const existing = await User.findOne({ email: ADMIN_EMAIL });
    
    if (existing) {
      console.log('管理员账号已存在');
      return;
    }
    
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    
    await User.create({
      username: '管理员',
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log(`管理员账号已创建: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  } catch (error) {
    console.error('创建管理员失败:', error);
  }
}
