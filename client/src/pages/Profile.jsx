import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState(user?.username || '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ username })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setMessage('更新成功！')
      setEditing(false)
      // 刷新页面以获取最新用户信息
      window.location.reload()
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      logout()
      navigate('/')
    }
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-8 text-white text-center">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm mx-auto mb-4 flex items-center justify-center text-4xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-white/80 mt-1">{user.email}</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {message && (
              <div className={`mb-6 px-4 py-3 rounded-xl text-sm ${
                message.includes('成功') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {message}
              </div>
            )}

            {editing ? (
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field"
                    minLength={2}
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary disabled:opacity-50"
                  >
                    {loading ? '保存中...' : '保存'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="btn-secondary"
                  >
                    取消
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500">用户名</p>
                    <p className="font-medium text-gray-800">{user.username}</p>
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-pink-600 hover:text-pink-700 font-medium text-sm"
                  >
                    修改
                  </button>
                </div>

                <div className="py-4 border-b border-gray-100">
                  <p className="text-sm text-gray-500">邮箱</p>
                  <p className="font-medium text-gray-800">{user.email}</p>
                </div>

                <div className="py-4 border-b border-gray-100">
                  <p className="text-sm text-gray-500">注册时间</p>
                  <p className="font-medium text-gray-800">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('zh-CN') : '未知'}
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>💡</span> 养花小贴士
          </h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>• 定期浇水，但避免过度浇水</li>
            <li>• 给予适当的光照条件</li>
            <li>• 适时施肥，注意薄肥勤施</li>
            <li>• 定期检查病虫害，及时处理</li>
            <li>• 保持良好的通风环境</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
