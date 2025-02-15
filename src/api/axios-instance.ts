import axios from 'axios'
import { API_ENDPOINTS } from '@/api/endpoint'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

// API 인스턴스 생성
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터 추가
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY)
    if (token)
      config.headers.Authorization = `Bearer ${token}`

    return config
  },
  error => {
    return Promise.reject(error)
  },
)

// 응답 인터셉터 추가 (토큰 만료 시 자동 갱신)
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      console.warn('⚠️ 액세스 토큰 만료, 리프레시 토큰 사용')

      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

      if (refreshToken) {
        try {
          const response = await axios.post(API_ENDPOINTS.AUTH.REFRESH, {
            refreshToken,
          })

          const newAccessToken = response.data.accessToken

          localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken)

          error.config.headers.Authorization = `Bearer ${newAccessToken}`

          return api(error.config)
        }
        catch (refreshError) {
          console.error('❌ 리프레시 토큰 갱신 실패:', refreshError)
          localStorage.removeItem(ACCESS_TOKEN_KEY)
          localStorage.removeItem(REFRESH_TOKEN_KEY)
          window.location.href = '/login'
        }
      }
      else {
        console.warn('❌ 리프레시 토큰 없음, 로그인 필요')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)
