import axios from 'axios'
import { API_ENDPOINTS } from '@/api/endpoint'

// 상품 목록 가져오기
export const fetchProducts = async (params: any) => {
  try {
    const response = await axios.get(API_ENDPOINTS.PRODUCTS.CATEGORY, { params })

    return response.data
  }
  catch (error) {
    return { products: [], totalCount: 0 }
  }
}

// 업체 정보 가져오기
export const fetchCompanyInfo = async (id: number) => {
  try {
    const response = await axios.get(API_ENDPOINTS.PRODUCTS.COMPANY(id))

    return response.data
  }
  catch (error) {
    throw new Error('업체 정보를 불러오는 데 실패했습니다.')
  }
}

// 검사 정보 가져오기
export const fetchInspectionInfo = async (id: number) => {
  try {
    const response = await axios.get(API_ENDPOINTS.PRODUCTS.INSPECTION(id))

    return response.data
  }
  catch (error) {
    throw new Error('검사 정보를 불러오는 데 실패했습니다.')
  }
}

// 선택된 상품의 CSV 다운로드
export const downloadCsv = async (selectedIds: number[]) => {
  try {
    const params = new URLSearchParams()

    selectedIds.forEach(id => params.append('ids', id.toString()))

    const response = await axios.get(API_ENDPOINTS.PRODUCTS.DOWNLOAD, {
      params,
      responseType: 'blob',
    })

    return response.data
  }
  catch (error) {
    throw new Error('CSV 내보내기에 실패했습니다.')
  }
}

// 전체 상품 선택
export const fetchAllProducts = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.PRODUCTS.ALL)

    return response.data
  }
  catch (error) {
    throw new Error('전체 선택 중 오류가 발생했습니다.')
  }
}
