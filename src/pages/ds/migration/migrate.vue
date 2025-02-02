<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import ResultDialog from '@/pages/ds/ResultDialog.vue' // 경로를 프로젝트 구조에 맞게 조정

// TypeScript 인터페이스 정의
interface Product {
  id: number
  productName: string
  productType: string
  institution: string
  notificationYn: string
  reportType: string
  reason: string | null
  createdAt: string
}

// 데이터 상태 관리
const allProducts = ref<Product[]>([])

// 테이블 헤더 정의
const headers = [
  { title: '상품 ID', key: 'id' },
  { title: '제품명', key: 'productName' },
  { title: '제품유형명', key: 'productType' },
  { title: '검사기관명', key: 'institution' },
  { title: '통보취소여부', key: 'notificationYn' },
  { title: '보고유형명', key: 'reportType' },
  { title: '회수사유명', key: 'reason' },
  { title: '등록일시', key: 'createdAt' },
]

// API로 데이터 불러오기
const getAllProducts = async () => {
  try {
    const response = await axios.get('http://localhost:8081/api/products/all')

    allProducts.value = response.data
  }
  catch (error) {
    console.error('Failed to fetch data:', error)
  }
}

const isMigrating = ref(false)
const isResultDialogVisible = ref(false)
const migrationMessage = ref('') // API로부터 받은 메시지 저장

// 로더 다이얼로그 상태 (유지)
const isLoaderVisible = ref(false)

// 이관 요청 처리
const startMigration = async () => {
  isMigrating.value = true
  isLoaderVisible.value = true

  try {
    // API 요청
    const response = await axios.post('http://localhost:8081/api/products/migrate')

    // 2초 대기
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log(response.data) // UTF-8 메시지 출력
    // 응답 처리
    if (response.status === 200) {
      if (typeof response.data === 'string')
        migrationMessage.value = response.data
      else
        migrationMessage.value = response.data?.message || '이관 요청이 성공했지만 메시지가 반환되지 않았습니다.'
    }
    else {
      migrationMessage.value = '이관 요청이 실패했습니다.'
    }
  }
  catch (error: any) {
    migrationMessage.value = error.response?.data?.message
                             || error.response?.data?.detail
                             || '이관 중 알 수 없는 오류가 발생했습니다.'
  }
  finally {
    isMigrating.value = false
    isLoaderVisible.value = false
    isResultDialogVisible.value = true
  }
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  getAllProducts()
})

// 컬러를 결정하는 함수
const resolveStatusColor = (reportType: string) => {
  if (reportType === '검사합격')
    return 'success'
  if (reportType === '검사부적합')
    return 'error'

  return 'warning'
}
</script>

<template>
  <VCard>
    <VCardText>
      <div class="d-flex justify-end flex-wrap gap-y-4">
        <VBtn
          variant="tonal"
          prepend-icon="tabler-transfer"
          :loading="isMigrating"
          :disabled="isMigrating"
          @click="startMigration"
        >
          이관하기
        </VBtn>
      </div>
    </VCardText>

    <VDivider />

    <VDataTable
      :headers="headers"
      :items="allProducts"
      density="compact"
      :items-per-page="25"
      style="overflow-x: auto; white-space: nowrap;"
    >
      <template #item.reportType="{ item }">
        <VChip
          :color="resolveStatusColor(item.reportType)"
          class="text-white"
          size="small"
        >
          {{ item.reportType }}
        </VChip>
      </template>
    </VDataTable>

    <!-- ResultDialog 컴포넌트 사용 -->
    <ResultDialog
      :visible="isResultDialogVisible"
      :message="migrationMessage"
      @update:visible="isResultDialogVisible = $event"
    />
  </VCard>
</template>
