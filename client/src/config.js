// API 基础地址配置
// 生产环境直接使用后端地址
const PROD_API = 'https://flower-garden-m5vg.onrender.com'

// 开发环境: 空字符串（使用 Vite 代理）
// 生产环境: 使用后端 API 地址
export const API_BASE = import.meta.env.PROD ? PROD_API : ''

// 完整的 API URL
export const getApiUrl = (path) => `${API_BASE}/api${path}`
