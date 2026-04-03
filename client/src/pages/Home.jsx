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
  const [showFilters, setShowFilters] = useState(false)

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
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-100 via-rose-50 to-orange-50 py-12 sm:py-20">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-4 left-4 sm:top-10 sm:left-10 text-5xl sm:text-8xl animate-float hidden sm:block">🌺</div>
          <div className="absolute top-10 right-4 sm:top-20 sm:right-20 text-4xl sm:text-6xl animate-float hidden sm:block" style={{animationDelay: '0.5s'}}>🌷</div>
          <div className="absolute bottom-4 left-1/4 text-4xl sm:text-7xl animate-float hidden sm:block" style={{animationDelay: '1s'}}>🌻</div>
          <div className="absolute bottom-10 right-1/4 text-3xl sm:text-5xl animate-float hidden sm:block" style={{animationDelay: '1.5s'}}>🌹</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 sm:mb-6">
              遇见<span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">最美的花</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 px-2">
              从新手到专家，我们为您提供全面的花卉养护指南。
            </p>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-lg mx-auto px-2">
              <input
                type="text"
                placeholder="搜索花卉名称..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-full border-2 border-white shadow-lg focus:border-pink-400 focus:outline-none transition-colors text-sm sm:text-base"
              />
              <button type="submit" className="btn-primary px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base">
                🔍 搜索
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section id="flowers" className="bg-white/80 backdrop-blur-sm sticky top-14 sm:top-16 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          {/* Mobile Filter Toggle */}
          <div className="flex items-center justify-between sm:hidden mb-2">
            <span className="text-sm text-gray-600">
              已选: {selectedCategory}
            </span>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 text-pink-600 text-sm font-medium"
            >
              <span>筛选</span>
              <svg className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Filter Content */}
          <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
              {/* 分类筛选 */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
                <span className="text-gray-600 font-medium text-sm whitespace-nowrap">分类:</span>
                <div className="flex gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
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
              <div className="flex items-center gap-2 sm:ml-auto">
                <span className="text-gray-600 font-medium text-sm">难度:</span>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 sm:px-4 py-1.5 rounded-full border border-gray-200 text-sm focus:border-pink-400 focus:outline-none bg-white"
                >
                  <option value="all">全部</option>
                  <option value="easy">简单</option>
                  <option value="medium">中等</option>
                  <option value="hard">困难</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flowers Grid */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span>🌼</span>
              花卉目录
              <span className="text-sm sm:text-base font-normal text-gray-500">({flowers.length}种)</span>
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16 sm:py-20">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-pink-500 border-t-transparent"></div>
            </div>
          ) : flowers.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <div className="text-5xl sm:text-6xl mb-4">🌱</div>
              <p className="text-gray-500 text-base sm:text-lg">暂无符合条件的花卉</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {flowers.map((flower, index) => (
                <div key={flower._id} className="animate-fade-in" style={{animationDelay: `${index * 50}ms`}}>
                  <FlowerCard flower={flower} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Tips Section */}
      <section id="tips" className="py-12 sm:py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 text-center mb-8 sm:mb-12 flex items-center justify-center gap-2">
            <span className="text-2xl sm:text-3xl">💡</span>
            养花小贴士
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
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
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{icon}</div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm sm:text-base">{description}</p>
    </div>
  )
}
