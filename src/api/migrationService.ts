import axios from 'axios'
import { API_ENDPOINTS } from '@/api/endpoint'

// 모든 제품 조회 API
export const getAllProducts = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.PRODUCTS.ALL)

    return response.data
  }
  catch (error) {
    console.error('Failed to fetch data:', error)
    throw new Error('상품 데이터를 불러오는 데 실패했습니다.')
  }
}

// 데이터 마이그레이션 API
export const startMigration = async () => {
  try {
    const response = await axios.post(API_ENDPOINTS.MIGRATION.MIGRATE)

    // 2초 딜레이
    await new Promise(resolve => setTimeout(resolve, 2000))

    if (response.status === 200) {
      if (typeof response.data === 'string')
        return response.data

      return response.data?.message || '이관이 완료되었습니다.'
    }
    else {
      throw new Error('이관 요청이 실패했습니다.')
    }
  }
  catch (error: any) {
    throw new Error(
      error.response?.data?.message
      || error.response?.data?.detail
      || '이관 중 알 수 없는 오류가 발생했습니다.',
    )
  }
}

// 이관 결과 로그 가져오기
export const getMigrationLogs = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.MIGRATION.MIGRATIONLOGS)

    return response.data
  }
  catch (error: any) {
    throw new Error(error.response?.data?.message || '이관 로그 데이터를 가져오는 중 오류가 발생했습니다.')
  }
}

// 특정 로그 삭제
export const deleteMigrationLog = async (id: number) => {
  try {
    await axios.delete(API_ENDPOINTS.MIGRATION.DELETE(id))

    return id // 삭제된 ID 반환
  }
  catch (error: any) {
    throw new Error(error.response?.data?.message || `ID ${id} 삭제 실패`)
  }
}

// 이관 로그 다운로드 (CSV)
export const downloadMigrationLogs = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.MIGRATION.DOWNLOAD, {
      responseType: 'blob',
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')

    link.href = url
    link.setAttribute('download', '데이터_이관_결과.csv')
    link.click()
    window.URL.revokeObjectURL(url)
  }
  catch (error: any) {
    throw new Error(`Export 실패: ${error.response?.data?.message || error.message}`)
  }
}
