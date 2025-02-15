import axios from 'axios'
import { API_ENDPOINTS } from '@/api/endpoint'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 토큰 만료 여부 확인
function isTokenExpired(token: string | null): boolean {
  if (!token)
    return true
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))

    return payload.exp * 1000 < Date.now()
  }
  catch (error) {
    return true
  }
}

// Refresh Token으로 Access Token 갱신
async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    if (!refreshToken)
      throw new Error('리프레시 토큰이 없습니다.')

    const response = await axios.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken })
    const newAccessToken: string = response.data.accessToken

    localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken)

    return newAccessToken
  }
  catch (error) {
    console.error('토큰 갱신 실패:', error)
    alert('세션이 만료되었습니다. 다시 로그인해 주세요.')
    logoutUser()

    return null
  }
}

// 요청 인터셉터 (Access Token 자동 갱신)
api.interceptors.request.use(async config => {
  let accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)

  if (isTokenExpired(accessToken)) {
    console.log('⚠️ Access Token 만료. 갱신 중...')
    accessToken = await refreshAccessToken()
  }

  if (accessToken)
    config.headers.Authorization = `Bearer ${accessToken}`

  return config
}, error => {
  console.error('요청 오류:', error)
  alert('요청 중 오류가 발생했습니다. 다시 시도해 주세요.')

  return Promise.reject(error)
})

// 로그아웃 (토큰 만료 시 실행)
function logoutUser(): void {
  console.warn('로그아웃: 세션 만료')
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  alert('세션이 만료되었습니다. 다시 로그인해 주세요.')
  window.location.href = '/login'
}

export { api, logoutUser }
