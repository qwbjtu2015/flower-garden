// API 基础地址配置
// 开发环境: 空字符串（使用 Vite 代理）
// 生产环境: 设置为你的后端 API 地址
export const API_BASE = import.meta.env.VITE_API_URL || ''

// 完整的 API URL
export const getApiUrl = (path) => `${API_BASE}/api${path}`
