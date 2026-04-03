import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { API_BASE } from '../config'

export default function Admin() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('flowers')
  const [flowers, setFlowers] = useState([])
  const [users, setUsers] = useState([])
  const [editingFlower, setEditingFlower] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 检查管理员权限
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'flowers') {
        const res = await fetch(`${API_BASE}/api/admin/flowers`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        setFlowers(data.flowers || [])
      } else if (activeTab === 'users') {
        const res = await fetch(`${API_BASE}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('获取数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveFlower = async (flowerData) => {
    try {
      const url = editingFlower 
        ? `${API_BASE}/api/admin/flowers/${editingFlower.id}` 
        : `${API_BASE}/api/admin/flowers`
      
      const res = await fetch(url, {
        method: editingFlower ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(flowerData)
      })
      
      if (!res.ok) throw new Error('保存失败')
      
      setShowModal(false)
      setEditingFlower(null)
      fetchData()
    } catch (error) {
      alert(error.message)
    }
  }

  const handleDeleteFlower = async (id) => {
    if (!confirm('确定要删除这朵花吗？')) return
    
    try {
      const res = await fetch(`${API_BASE}/api/admin/flowers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (!res.ok) throw new Error('删除失败')
      
      fetchData()
    } catch (error) {
      alert(error.message)
    }
  }

  const handleChangeRole = async (userId, newRole) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      })
      
      if (!res.ok) throw new Error('修改失败')
      
      fetchData()
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <span>⚙️</span> 管理后台
          </h1>
          <p className="text-gray-500 mt-2">管理员：{user.username}</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('flowers')}
              className={`px-8 py-4 font-medium transition-colors ${
                activeTab === 'flowers'
                  ? 'text-pink-600 border-b-2 border-pink-500 bg-pink-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🌺 花卉管理
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-8 py-4 font-medium transition-colors ${
                activeTab === 'users'
                  ? 'text-pink-600 border-b-2 border-pink-500 bg-pink-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              👥 用户管理
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'flowers' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">花卉列表</h2>
                  <button
                    onClick={() => {
                      setEditingFlower({})
                      setShowModal(true)
                    }}
                    className="btn-primary"
                  >
                    + 添加花卉
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-8">加载中...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th className="pb-3 pr-4">ID</th>
                          <th className="pb-3 pr-4">名称</th>
                          <th className="pb-3 pr-4">分类</th>
                          <th className="pb-3 pr-4">难度</th>
                          <th className="pb-3">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {flowers.map(flower => (
                          <tr key={flower.id} className="border-b hover:bg-gray-50">
                            <td className="py-4 pr-4">{flower.id}</td>
                            <td className="py-4 pr-4">
                              <div className="flex items-center gap-3">
                                <img src={flower.image} alt={flower.name} className="w-12 h-12 rounded-lg object-cover" />
                                <div>
                                  <div className="font-medium">{flower.name}</div>
                                  <div className="text-sm text-gray-500">{flower.name_en}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 pr-4">{flower.category}</td>
                            <td className="py-4 pr-4">
                              <span className={`px-2 py-1 rounded text-sm ${
                                flower.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                flower.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {flower.difficulty === 'easy' ? '简单' : flower.difficulty === 'medium' ? '中等' : '困难'}
                              </span>
                            </td>
                            <td className="py-4">
                              <button
                                onClick={() => {
                                  setEditingFlower(flower)
                                  setShowModal(true)
                                }}
                                className="text-pink-600 hover:underline mr-4"
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => handleDeleteFlower(flower.id)}
                                className="text-red-600 hover:underline"
                              >
                                删除
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-bold mb-6">用户列表</h2>
                
                {loading ? (
                  <div className="text-center py-8">加载中...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th className="pb-3 pr-4">ID</th>
                          <th className="pb-3 pr-4">用户名</th>
                          <th className="pb-3 pr-4">邮箱</th>
                          <th className="pb-3 pr-4">角色</th>
                          <th className="pb-3">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id} className="border-b hover:bg-gray-50">
                            <td className="py-4 pr-4">{u.id}</td>
                            <td className="py-4 pr-4 font-medium">{u.username}</td>
                            <td className="py-4 pr-4 text-gray-600">{u.email}</td>
                            <td className="py-4 pr-4">
                              <span className={`px-2 py-1 rounded text-sm ${
                                u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {u.role === 'admin' ? '管理员' : '普通用户'}
                              </span>
                            </td>
                            <td className="py-4">
                              {u.id !== user.id && (
                                <select
                                  value={u.role}
                                  onChange={(e) => handleChangeRole(u.id, e.target.value)}
                                  className="px-3 py-1 border rounded-lg text-sm"
                                >
                                  <option value="user">设为用户</option>
                                  <option value="admin">设为管理员</option>
                                </select>
                              )}
                              {u.id === user.id && (
                                <span className="text-gray-400 text-sm">当前用户</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <FlowerModal
          flower={editingFlower}
          onSave={handleSaveFlower}
          onClose={() => {
            setShowModal(false)
            setEditingFlower(null)
          }}
          token={token}
        />
      )}
    </div>
  )
}

function FlowerModal({ flower, onSave, onClose, token }) {
  const [formData, setFormData] = useState({
    name: flower?.name || '',
    name_en: flower?.name_en || '',
    category: flower?.category || '灌木花卉',
    image: flower?.image || '',
    description: flower?.description || '',
    care_tips: flower?.care_tips || '',
    watering: flower?.watering || '',
    sunlight: flower?.sunlight || '',
    temperature: flower?.temperature || '',
    fertilizer: flower?.fertilizer || '',
    fertilizer_link: flower?.fertilizer_link || '',
    difficulty: flower?.difficulty || 'easy',
    season: flower?.season || '',
    bloom_time: flower?.bloom_time || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {flower?.id ? '编辑花卉' : '添加花卉'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">名称 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">英文名</label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">分类 *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="input-field"
                required
              >
                <option value="灌木花卉">灌木花卉</option>
                <option value="球根花卉">球根花卉</option>
                <option value="兰科花卉">兰科花卉</option>
                <option value="一年生花卉">一年生花卉</option>
                <option value="木本花卉">木本花卉</option>
                <option value="多年生花卉">多年生花卉</option>
                <option value="香草花卉">香草花卉</option>
                <option value="观叶植物">观叶植物</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">难度</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                className="input-field"
              >
                <option value="easy">简单</option>
                <option value="medium">中等</option>
                <option value="hard">困难</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">图片URL *</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="input-field"
              placeholder="https://..."
              required
            />
            {formData.image && (
              <img src={formData.image} alt="预览" className="mt-2 w-32 h-32 object-cover rounded-lg" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="input-field"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">浇水方法</label>
              <textarea
                value={formData.watering}
                onChange={(e) => setFormData({...formData, watering: e.target.value})}
                className="input-field"
                rows="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">光照需求</label>
              <textarea
                value={formData.sunlight}
                onChange={(e) => setFormData({...formData, sunlight: e.target.value})}
                className="input-field"
                rows="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">温度要求</label>
              <input
                type="text"
                value={formData.temperature}
                onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                className="input-field"
                placeholder="如：15-25°C"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">最佳季节</label>
              <input
                type="text"
                value={formData.season}
                onChange={(e) => setFormData({...formData, season: e.target.value})}
                className="input-field"
                placeholder="如：春夏秋"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">花期</label>
              <input
                type="text"
                value={formData.bloom_time}
                onChange={(e) => setFormData({...formData, bloom_time: e.target.value})}
                className="input-field"
                placeholder="如：5-10月"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">养护技巧</label>
            <textarea
              value={formData.care_tips}
              onChange={(e) => setFormData({...formData, care_tips: e.target.value})}
              className="input-field"
              rows="4"
              placeholder="每条技巧用换行分隔"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">施肥指南</label>
              <textarea
                value={formData.fertilizer}
                onChange={(e) => setFormData({...formData, fertilizer: e.target.value})}
                className="input-field"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">肥料购买链接</label>
              <input
                type="url"
                value={formData.fertilizer_link}
                onChange={(e) => setFormData({...formData, fertilizer_link: e.target.value})}
                className="input-field"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button type="button" onClick={onClose} className="btn-secondary">
              取消
            </button>
            <button type="submit" className="btn-primary">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
