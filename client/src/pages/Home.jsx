import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import FlowerCard from '../components/FlowerCard'
import { API_BASE } from '../config'

export default function Home() {
  const [flowers, setFlowers] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFlowers()
  }, [selectedCategory, selectedDifficulty])

  const fetchFlowers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== '全部') params.append('category', selectedCategory)
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty)
      if (searchKeyword) params.append('search', searchKeyword)

      const res = await fetch(`${API_BASE}/api/flowers?${params}`)
      const data = await res.json()
      setFlowers(data.flowers)
      setCategories(['全部', ...data.categories.map(c => c.category)])
    } catch (error) {
      console.error('获取花卉数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchFlowers()
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-100 via-rose-50 to-orange-50 py-20">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 text-8xl animate-float">🌺</div>
          <div className="absolute top-20 right-20 text-6xl animate-float" style={{animationDelay: '0.5s'}}>🌷</div>
          <div className="absolute bottom-10 left-1/4 text-7xl animate-float" style={{animationDelay: '1s'}}>🌻</div>
          <div className="absolute bottom-20 right-1/4 text-5xl animate-float" style={{animationDelay: '1.5s'}}>🌹</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              遇见<span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">最美的花</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              从新手到专家，我们为您提供全面的花卉养护指南。
              让每一朵花都在您的花园里绽放光彩。
            </p>
            <form onSubmit={handleSearch} className="flex gap-3 max-w-xl mx-auto">
              <input
                type="text"
                placeholder="搜索花卉名称..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="flex-1 px-6 py-4 rounded-full border-2 border-white shadow-lg focus:border-pink-400 focus:outline-none transition-colors"
              />
              <button type="submit" className="btn-primary px-8">
                搜索
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section id="flowers" className="py-8 bg-white/80 backdrop-blur-sm sticky top-16 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* 分类筛选 */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">分类:</span>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-pink-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 难度筛选 */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-gray-600 font-medium">难度:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-1.5 rounded-full border border-gray-200 text-sm focus:border-pink-400 focus:outline-none"
              >
                <option value="all">全部</option>
                <option value="easy">简单</option>
                <option value="medium">中等</option>
                <option value="hard">困难</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Flowers Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">
              <span className="text-3xl">🌼</span>
              花卉目录
              <span className="text-lg font-normal text-gray-500">({flowers.length} 种花卉)</span>
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
            </div>
          ) : flowers.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🌱</div>
              <p className="text-gray-500 text-lg">暂无符合条件的花卉</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {flowers.map((flower, index) => (
                <div key={flower.id} className="animate-fade-in" style={{animationDelay: `${index * 50}ms`}}>
                  <FlowerCard flower={flower} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Tips Section */}
      <section id="tips" className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title text-center justify-center mb-12">
            <span className="text-3xl">💡</span>
            养花小贴士
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TipCard
              icon="💧"
              title="适量浇水"
              description="大多数植物死于过度浇水而非缺水。遵循'见干见湿'原则，土壤表面干燥时再浇水。"
            />
            <TipCard
              icon="☀️"
              title="适当光照"
              description="了解植物的光照需求，喜阳植物需要充足阳光，耐阴植物避免暴晒。"
            />
            <TipCard
              icon="🌱"
              title="合理施肥"
              description="薄肥勤施是基本原则。生长季施肥，休眠期停肥，避免烧根。"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function TipCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
