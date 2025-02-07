// src/api/endpoints.ts

const API_BASE_URL = 'http://54.174.115.49:8081/api'

export const API_ENDPOINTS = {
  HOME: {
    RATIO: `${API_BASE_URL}/products/all-ratio`, //  위해상품+비위해상품 비율
    HAZRATIO: `${API_BASE_URL}/products/hazardous-ratio`, //  위해상품 카테고리 통계
    STATS: `${API_BASE_URL}/products/migration-stats`, //  데이터 이관 통계
    RECENT: `${API_BASE_URL}/products/recent`, // 최근 7일 동안 아괸된 위해상품 항목
  },
  PRODUCTS: {
    ALL: `${API_BASE_URL}/products/all`, // 모든 상품 조회
    CATEGORY: `${API_BASE_URL}/products/category`, // 카테고리 + 검색어 기능
    COMPANY: (id: number) => `${API_BASE_URL}/products/company/${id}`, // 업체 정보
    INSPECTION: (id: number) => `${API_BASE_URL}/products/inspection/${id}`, // 검사부적합 정보
    DOWNLOAD: `${API_BASE_URL}/products/download`, // 상품 목록CSV 다운로드
  },
  MIGRATION: {
    MIGRATE: `${API_BASE_URL}/products/migrate`, // 데이터 이관 실행
    MIGRATIONLOGS: `${API_BASE_URL}/products/migrationLogs`, // 이관 로그 조회
    DELETE: (id: number) => `${API_BASE_URL}/products/delete/${id}`, // 이관 로그 삭제
    DOWNLOAD: `${API_BASE_URL}/products/download-logs`, // 이관 로그 다운로드
  },
  AUTH: {
    LOGIN: `${API_BASE_URL}/products/admin/login`, // 관리자 로그인
  },
}
