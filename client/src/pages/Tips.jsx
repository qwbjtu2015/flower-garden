import { useState } from 'react'

const tipsCategories = [
  {
    id: 'watering',
    icon: '💧',
    title: '浇水技巧',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'fertilizing',
    icon: '🧪',
    title: '施肥指南',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'pruning',
    icon: '✂️',
    title: '修剪方法',
    color: 'from-orange-500 to-amber-500'
  },
  {
    id: 'pest',
    icon: '🐛',
    title: '病虫害防治',
    color: 'from-red-500 to-rose-500'
  },
  {
    id: 'seasonal',
    icon: '🌿',
    title: '四季养护',
    color: 'from-purple-500 to-violet-500'
  },
  {
    id: 'soil',
    icon: '🪴',
    title: '土壤与盆器',
    color: 'from-yellow-600 to-amber-500'
  }
]

const tipsArticles = {
  watering: [
    {
      title: '见干见湿：最科学的浇水原则',
      content: `大多数室内植物死亡的原因都是过度浇水而非缺水。"见干见湿"是最基本的浇水原则：

**什么时候浇水？**
• 用手指插入土壤2-3厘米，如果感觉干燥就需要浇水
• 观察叶片，稍微萎蔫时再浇水
• 避免在土壤还很湿润时再次浇水

**怎么浇？**
• 沿着盆边慢慢浇，让水慢慢渗透
• 浇到盆底有水流出为止
• 避免直接浇在叶片上，尤其是多肉植物

**注意事项**
• 夏季高温时选择在早晨或傍晚浇水
• 冬季减少浇水频率
• 不同植物对水分需求差异很大`
    },
    {
      title: '不同季节的浇水调整',
      content: `季节变化会影响植物的浇水需求：

**春季**
• 植物进入生长期，逐渐增加浇水频率
• 每隔2-3天观察一次土壤湿度
• 可以开始补充液体肥料

**夏季**
• 高温蒸发快，需要增加浇水次数
• 喜水植物可能需要每天浇水
• 避免在烈日下浇水

**秋季**
• 逐渐减少浇水频率
• 为冬季做准备

**冬季**
• 大多数植物进入休眠期，大幅减少浇水
• 保持土壤偏干状态
• 选择温暖的中午浇水`
    },
    {
      title: '水培植物的养护要点',
      content: `水培植物养护相对简单，但仍需注意：

**换水频率**
• 春秋季：每7-10天换水一次
• 夏季：每3-5天换水一次
• 冬季：每2-3周换水一次

**水质要求**
• 使用放置1-2天的自来水
• 水温与室温相近
• 避免使用冰水或热水

**营养液添加**
• 每次换水时添加几滴营养液
• 不要过量，避免烧根
• 冬季可以不添加营养液`
    }
  ],
  fertilizing: [
    {
      title: '薄肥勤施：施肥的基本原则',
      content: `施肥是植物健康生长的关键，但要遵循"薄肥勤施"的原则：

**为什么薄肥勤施？**
• 浓度过高会烧伤根系
• 分次施用更利于植物吸收
• 避免肥料浪费和环境污染

**施肥时间**
• 生长季节（春夏季）施肥
• 休眠期（冬季）停止施肥
• 刚换盆的植物一个月内不施肥

**肥料类型选择**
• 生长期：以氮肥为主，促进叶片生长
• 开花前：增施磷钾肥，促进花芽分化
• 观叶植物：以氮肥为主
• 开花植物：磷钾肥为主`
    },
    {
      title: '有机肥vs化肥：如何选择',
      content: `有机肥和化肥各有优缺点：

**有机肥**
• 优点：改良土壤、肥效持久、营养全面
• 缺点：见效慢、可能带有虫卵
• 常见类型：鸡粪、羊粪、饼肥、淘米水

**化肥**
• 优点：见效快、养分含量精确
• 缺点：长期使用导致土壤板结
• 常见类型：复合肥、缓释肥、水溶肥

**推荐做法**
• 基肥使用有机肥
• 追肥使用水溶肥
• 阳台种植推荐使用商品有机肥`
    },
    {
      title: '常见肥料自制方法',
      content: `在家可以制作简单肥料：

**淘米水**
• 发酵1-2天后稀释使用
• 富含氮元素
• 适合观叶植物

**黄豆水**
• 黄豆煮熟后发酵1个月
• 稀释10倍使用
• 营养全面

**蛋壳肥**
• 蛋壳晒干后碾碎
• 埋入土中或泡水
• 提供钙质

**香蕉皮**
• 切碎后埋入土中
• 或泡水制作钾肥
• 促进开花结果`
    }
  ],
  pruning: [
    {
      title: '为什么要定期修剪',
      content: `修剪对植物健康非常重要：

**修剪的好处**
• 促进分枝，让株型更饱满
• 去除枯枝病叶，减少病虫害
• 通风透光，减少病害发生
• 控制株型，防止徒长
• 促进开花结果

**修剪时机**
• 生长期随时可以修剪整形
• 花后及时剪除残花
• 冬季休眠期可以进行重剪
• 病枝随时发现随时剪除

**基本修剪工具**
• 剪刀：用于细枝
• 修枝剪：用于粗枝
• 刀具：用于切口平滑
• 工具使用前要消毒`
    },
    {
      title: '常见植物的修剪方法',
      content: `不同植物有不同的修剪方法：

**草本植物**
• 及时摘心促进分枝
• 剪除残花延长花期
• 去除底部老叶

**木本植物**
• 保留主枝，去除交叉枝
• 短截过长枝条
• 保持良好的株型结构

**多肉植物**
• 去除徒长部分
• 剪下的部分可以扦插
• 保持通风良好

**藤本植物**
• 牵引固定枝条
• 去除杂乱枝条
• 花后短截残花枝`
    }
  ],
  pest: [
    {
      title: '常见虫害识别与防治',
      content: `及时发现虫害是防治的关键：

**蚜虫**
• 症状：叶片卷曲、粘液
• 防治：喷洒肥皂水或酒精
• 严重时使用吡虫啉

**红蜘蛛**
• 症状：叶片出现细小白点
• 防治：提高空气湿度
• 喷洒阿维菌素

**介壳虫**
• 症状：叶片有褐色小点
• 防治：人工刷除
• 严重时使用氧化乐果

**粉虱**
• 症状：叶片有小白蛾飞舞
• 防治：黄板诱杀
• 喷洒啶虫脒`
    },
    {
      title: '常见病害识别与防治',
      content: `植物病害主要分为两类：

**真菌性病害**
• 白粉病：叶片有白色粉末
  → 防治：加强通风，喷洒多菌灵
• 灰霉病：出现灰色霉层
  → 防治：去除病叶，喷洒百菌清
• 叶斑病：叶片有褐色斑点
  → 防治：剪除病叶，喷洒代森锰锌

**细菌性病害**
• 软腐病：茎叶腐烂发臭
  → 防治：切除病部，涂抹抗菌剂
• 细菌性叶斑：叶片有水渍状斑点
  → 防治：避免叶面喷水，喷洒铜制剂

**预防为主**
• 保持通风
• 控制浇水
• 定期检查`
    },
    {
      title: '天然驱虫方法',
      content: `在家可以制作天然驱虫剂：

**大蒜驱虫剂**
• 大蒜捣碎浸泡24小时
• 稀释10倍后喷洒
• 对蚜虫、红蜘蛛有效

**辣椒水**
• 辣椒煮水后冷却
• 稀释后喷洒
• 驱赶多种害虫

**烟丝水**
• 烟丝浸泡24-48小时
• 稀释后喷洒
• 预防多种虫害

**酒精擦除法**
• 用棉签蘸酒精擦拭
• 适合介壳虫
• 直接杀死害虫`
    }
  ],
  seasonal: [
    {
      title: '春季养护要点',
      content: `春季是植物生长的黄金期：

**换盆换土**
• 3-4月是最佳换盆时间
• 选择比原盆大1-2号的盆
• 更换新鲜营养土

**增加浇水施肥**
• 植物开始生长，需水量增加
• 开始施用稀释肥料
• 薄肥勤施，每周一次

**繁殖的好时机**
• 适合扦插繁殖
• 温度适宜，成活率高
• 可以进行分株繁殖

**病虫害预防**
• 天气回暖，病虫害开始活跃
• 定期检查叶片正反面
• 加强通风`
    },
    {
      title: '夏季养护要点',
      content: `夏季高温是考验植物的时节：

**遮阴降温**
• 喜阴植物移到散射光处
• 中午避免阳光直射
• 地面喷水降温

**增加浇水**
• 高温蒸发快，浇水要跟上
• 早晚各浇一次
• 必要时喷雾增加湿度

**停止施肥**
• 高温期大部分植物休眠
• 停止施用肥料
• 避免肥害

**通风防病**
• 加强空气流通
• 避免闷热潮湿
• 减少病虫害发生`
    },
    {
      title: '秋冬养护要点',
      content: `秋冬季节植物准备越冬：

**秋季（9-11月）**
• 逐渐减少浇水
• 停止施氮肥
• 为入室做好准备
• 适当增加光照

**冬季（12-2月）**
• 大部分植物进入休眠
• 保持土壤偏干
• 停止施肥
• 注意防寒保暖
• 多晒太阳

**入室注意事项**
• 室内温度不低于5°C
• 远离暖气出风口
• 减少浇水频率
• 晴好中午可开窗通风`
    }
  ],
  soil: [
    {
      title: '如何配制营养土',
      content: `好的土壤是植物健康的基础：

**通用营养土配方**
• 园土：30%
• 腐叶土：40%
• 河沙：20%
• 有机肥：10%

**多肉植物配土**
• 颗粒土：60%
• 泥炭土：30%
• 珍珠岩：10%
• 排水透气为主

**兰科植物配土**
• 松树皮：40%
• 椰糠：30%
• 珍珠岩：20%
• 陶粒：10%

**观叶植物配土**
• 腐叶土：50%
• 泥炭土：30%
• 珍珠岩：20%
• 保水透气兼顾`
    },
    {
      title: '如何选择合适的花盆',
      content: `花盆的选择也很重要：

**材质选择**
• 塑料盆：轻便便宜，保湿性好
• 陶盆：透气性好，美观大方
• 瓷盆：美观但透气差
• 水泥盆：适合大型植物

**大小选择**
• 花盆直径比植物冠幅小1-2号
• 深度适宜根系生长
• 不要小苗用大盆

**排水很重要**
• 必须有排水孔
• 盆底放陶粒或碎石
• 避免积水烂根`
    },
    {
      title: '土壤酸碱度与改良',
      content: `不同植物对土壤酸碱度有不同要求：

**酸碱度知识**
• pH值 < 7 为酸性
• pH值 = 7 为中性
• pH值 > 7 为碱性

**常见植物喜好**
• 杜鹃、茶花：喜酸性（pH 4.5-5.5）
• 大多数花卉：中性偏酸（pH 6-7）
• 石竹、天竺葵：耐碱性（pH 7-8）

**改良方法**
• 土壤偏酸：添加石灰或草木灰
• 土壤偏碱：添加硫酸亚铁或腐叶土
• 使用专用测土工具定期检测`
    }
  ]
}

export default function Tips() {
  const [selectedCategory, setSelectedCategory] = useState('watering')

  const currentArticles = tipsArticles[selectedCategory] || []
  const currentCategory = tipsCategories.find(c => c.id === selectedCategory)

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-pink-50/30">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">🌱 养护技巧</h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
            从新手到专家，学习科学的花卉养护方法
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 justify-center">
          {tipsCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all flex items-center gap-2 text-sm sm:text-base ${
                selectedCategory === cat.id
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg scale-105`
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow'
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <span>{cat.title}</span>
            </button>
          ))}
        </div>

        {/* Category Header */}
        <div className={`bg-gradient-to-r ${currentCategory?.color || 'from-pink-500 to-rose-500'} text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-xl`}>
          <div className="flex items-center gap-4">
            <span className="text-5xl sm:text-6xl">{currentCategory?.icon}</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">{currentCategory?.title}</h2>
              <p className="text-white/80 mt-1">{currentArticles.length} 篇技巧文章</p>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {currentArticles.map((article, index) => (
            <article
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6 sm:p-8">
                {/* Article Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentCategory?.color || 'from-pink-500 to-rose-500'} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}>
                    {index + 1}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors leading-tight pt-1">
                    {article.title}
                  </h3>
                </div>

                {/* Article Content */}
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {article.content.split('\n').map((line, lineIndex) => {
                    // Check if it's a section header (starts with **)
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return (
                        <p key={lineIndex} className="font-bold text-gray-700 mt-4 mb-2 first:mt-0">
                          {line.replace(/\*\*/g, '')}
                        </p>
                      )
                    }
                    // Check if it's a bullet point
                    if (line.startsWith('•')) {
                      return (
                        <p key={lineIndex} className="ml-4 mb-1">
                          {line}
                        </p>
                      )
                    }
                    // Empty line
                    if (line.trim() === '') {
                      return <br key={lineIndex} />
                    }
                    // Regular paragraph
                    return (
                      <p key={lineIndex} className="mb-2">
                        {line}
                      </p>
                    )
                  })}
                </div>
              </div>

              {/* Bottom decoration */}
              <div className={`h-2 bg-gradient-to-r ${currentCategory?.color || 'from-pink-500 to-rose-500'}`} />
            </article>
          ))}
        </div>

        {/* Quick Tips Section */}
        <section className="mt-12 sm:mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8 flex items-center justify-center gap-3">
            <span className="text-3xl sm:text-4xl">💡</span>
            新手必备技巧
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <QuickTip
              icon="💧"
              title="不要过度浇水"
              desc="大多数植物死于浇水过多而非缺水"
              color="blue"
            />
            <QuickTip
              icon="☀️"
              title="了解光照需求"
              desc="喜阳植物需要充足阳光，耐阴植物避免暴晒"
              color="yellow"
            />
            <QuickTip
              icon="🧪"
              title="薄肥勤施"
              desc="宁可少施肥也不要施肥过量"
              color="green"
            />
            <QuickTip
              icon="🔍"
              title="定期检查"
              desc="经常观察植物，发现问题及时处理"
              color="red"
            />
          </div>
        </section>

        {/* Coming Soon Notice */}
        <section className="mt-12 sm:mt-16 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-6 sm:p-8 text-center">
          <div className="text-4xl sm:text-5xl mb-4">📝</div>
          <h3 className="text-xl sm:text-2xl font-bold mb-2">更多内容持续更新中</h3>
          <p className="text-white/80 text-sm sm:text-base">
            我们会持续添加更多养护技巧和实用教程，敬请期待！
          </p>
        </section>
      </div>
    </div>
  )
}

function QuickTip({ icon, title, desc, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600'
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all group">
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h4 className="font-bold text-gray-800 mb-1">{title}</h4>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  )
}
