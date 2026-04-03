import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import CommentSection from '../components/CommentSection'
import { API_BASE } from '../config'

export default function FlowerDetail() {
  const { id } = useParams()
  const { user, token } = useAuth()
  const [flower, setFlower] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('care')

  useEffect(() => {
    fetchFlower()
  }, [id])

  const fetchFlower = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/api/flowers/${id}`)
      if (!res.ok) throw new Error('花卉不存在')
      const data = await res.json()
      setFlower(data)
    } catch (error) {
      console.error('获取花卉详情失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!flower) {
    return (
      <div className="text-center py-16 sm:py-20 px-4">
        <div className="text-5xl sm:text-6xl mb-4">🌸</div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">花卉不存在</h2>
        <p className="text-gray-500 mb-6">该花卉可能已被移除或链接失效</p>
        <Link to="/" className="btn-primary">
          返回首页
        </Link>
      </div>
    )
  }

  const difficultyLabels = { easy: '简单', medium: '中等', hard: '困难' }
  const difficultyColors = { easy: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-700', hard: 'bg-red-100 text-red-700' }

  return (
    <div className="animate-fade-in">
      {/* Hero Image */}
      <div className="relative h-[40vh] sm:h-[50vh] min-h-[300px] sm:min-h-[400px] overflow-hidden">
        <img
          src={flower.image}
          alt={flower.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/1200x600/f9fafb/9ca3af?text=No+Image'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Back Button */}
        <Link 
          to="/" 
          className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
              <span className="px-3 sm:px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium">
                {flower.category}
              </span>
              <span className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium ${difficultyColors[flower.difficulty]}`}>
                {difficultyLabels[flower.difficulty]}
              </span>
              {flower.season && (
                <span className="px-3 sm:px-4 py-1 bg-pink-500/80 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium">
                  🌸 {flower.season}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1">{flower.name}</h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80">{flower.name_en}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Sidebar - Mobile First */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:hidden">
          <div className="flex items-center justify-between text-sm mb-4">
            <span className="text-gray-500">用户评价</span>
            <div className="flex items-center gap-2">
              <StarRating rating={flower.avgRating} />
              <span className="font-medium text-gray-700">{flower.avgRating || 0}</span>
              <span className="text-gray-400">({flower.commentCount})</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-500">分类</span>
              <p className="font-medium text-gray-800 mt-1">{flower.category}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-500">花期</span>
              <p className="font-medium text-gray-800 mt-1">{flower.bloom_time || '观叶植物'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <span>📖</span> 简介
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{flower.description}</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActiveTab('care')}
                  className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-center text-sm sm:text-base font-medium transition-colors ${
                    activeTab === 'care' 
                      ? 'text-pink-600 border-b-2 border-pink-500 bg-pink-50' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  🌱 养护
                </button>
                <button
                  onClick={() => setActiveTab('fertilizer')}
                  className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-center text-sm sm:text-base font-medium transition-colors ${
                    activeTab === 'fertilizer' 
                      ? 'text-pink-600 border-b-2 border-pink-500 bg-pink-50' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  🧪 施肥
                </button>
              </div>

              <div className="p-4 sm:p-6">
                {activeTab === 'care' && (
                  <div className="space-y-4 sm:space-y-6">
                    <CareItem icon="💧" title="浇水方法" content={flower.watering} />
                    <CareItem icon="☀️" title="光照需求" content={flower.sunlight} />
                    <CareItem icon="🌡️" title="温度要求" content={flower.temperature} />
                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="font-bold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">📝 养护要点</h3>
                      <div className="text-sm sm:text-base">
                        {flower.care_tips.split('\n').map((tip, i) => (
                          tip.trim() && <p key={i} className="text-gray-600 mb-2">{tip}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'fertilizer' && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                      <span className="text-xl sm:text-2xl">🧪</span> 施肥指南
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">{flower.fertilizer}</p>
                    
                    {flower.fertilizer_link && (
                      <a
                        href={flower.fertilizer_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/30 hover:shadow-xl transition-all text-sm sm:text-base"
                      >
                        <span>🛒</span>
                        <span>购买肥料</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Comments */}
            <CommentSection flowerId={id} flowerName={flower.name} />
          </div>

          {/* Sidebar - Desktop */}
          <div className="hidden sm:block lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4">📊 基础信息</h3>
              
              <div className="space-y-3 sm:space-y-4">
                <InfoRow label="中文名" value={flower.name} />
                <InfoRow label="英文名" value={flower.name_en} />
                <InfoRow label="分类" value={flower.category} />
                <InfoRow label="养护难度" value={difficultyLabels[flower.difficulty]} color={difficultyColors[flower.difficulty]} />
                <InfoRow label="最佳季节" value={flower.season || '全年'} />
                <InfoRow label="花期" value={flower.bloom_time || '观叶植物'} />
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">评价</span>
                  <div className="flex items-center gap-2">
                    <StarRating rating={flower.avgRating} />
                    <span className="font-medium text-gray-700">{flower.avgRating || 0}</span>
                    <span className="text-gray-400">({flower.commentCount})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CareItem({ icon, title, content }) {
  return (
    <div className="flex gap-3 sm:gap-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-pink-50 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-gray-800 mb-1 text-sm sm:text-base">{title}</h4>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{content}</p>
      </div>
    </div>
  )
}

function InfoRow({ label, value, color }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className={`font-medium text-sm ${color || 'text-gray-800'}`}>{value}</span>
    </div>
  )
}

function StarRating({ rating, size = 'sm' }) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5
  
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} ${
            i < fullStars ? 'text-yellow-400' : i === fullStars && hasHalf ? 'text-yellow-400/50' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}
