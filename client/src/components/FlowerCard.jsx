import { Link } from 'react-router-dom'

export default function FlowerCard({ flower }) {
  const difficultyLabels = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    hard: 'bg-red-100 text-red-700 border-red-200'
  }

  return (
    <Link to={`/flower/${flower.id}`} className="card group block">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={flower.image}
          alt={flower.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300/f9fafb/9ca3af?text=No+Image'
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-sm">
            {flower.category}
          </span>
        </div>

        {/* Difficulty Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${difficultyColors[flower.difficulty]}`}>
            {difficultyLabels[flower.difficulty]}
          </span>
        </div>

        {/* Bloom Time */}
        {flower.bloom_time && (
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 bg-pink-500/90 backdrop-blur-sm rounded-full text-sm font-medium text-white shadow-sm">
              🌸 {flower.bloom_time}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-pink-600 transition-colors">
              {flower.name}
            </h3>
            <p className="text-sm text-gray-500">{flower.name_en}</p>
          </div>
          <span className="text-pink-500 text-xl">›</span>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {flower.description}
        </p>

        {/* Quick Info */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span>💧</span>
            <span>{flower.watering.split('。')[0].substring(0, 10)}...</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
