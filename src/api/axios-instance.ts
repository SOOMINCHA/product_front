import axios from 'axios'
import { API_ENDPOINTS } from '@/api/endpoint'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const ROLE_KEY = 'role'

// API 인스턴스 생성
export const api = axios.create({
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
  error => Promise.reject(error),
)

// 응답 인터셉터 추가 (토큰 만료 시 자동 갱신)
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      console.warn('액세스 토큰 만료, 리프레시 토큰 사용')

      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

      if (refreshToken) {
        try {
          const response = await axios.post(API_ENDPOINTS.AUTH.REFRESH, {
            refreshToken,
          })

          const newAccessToken = response.data.accessToken
          const role = response.data.role

          // 새로운 토큰 및 역할(role) 저장
          localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken)
          localStorage.setItem(ROLE_KEY, role)

          // 기존 요청 헤더 업데이트
          error.config.headers.Authorization = `Bearer ${newAccessToken}`

          console.info('✅ 새 액세스 토큰 발급 완료:', newAccessToken)

          return api(error.config)
        }
        catch (refreshError) {
          console.error('리프레시 토큰 갱신 실패:', refreshError)

          // 토큰 삭제 및 로그인 페이지로 이동
          localStorage.removeItem(ACCESS_TOKEN_KEY)
          localStorage.removeItem(REFRESH_TOKEN_KEY)
          localStorage.removeItem(ROLE_KEY)
          window.location.href = '/login'
        }
      }
      else {
        console.warn('리프레시 토큰 없음, 로그인 필요')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)
