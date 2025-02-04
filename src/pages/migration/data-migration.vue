<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import ResultDialog from '@/components/ds/migration/dialog/ResultDialog.vue'
import { API_ENDPOINTS } from '@/api/endpoint'

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

const allProducts = ref<Product[]>([])

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

// 전체 상품 데이터
const getAllProducts = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.PRODUCTS.ALL)

    allProducts.value = response.data
  }
  catch (error) {
    console.error('Failed to fetch data:', error)
  }
}

const isMigrating = ref(false)
const isResultDialogVisible = ref(false)
const migrationMessage = ref('')

const isLoaderVisible = ref(false)

const startMigration = async () => {
  isMigrating.value = true
  isLoaderVisible.value = true

  try {
    const response = await axios.post(API_ENDPOINTS.MIGRATION.MIGRATE)

    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log(response.data)

    if (response.status === 200) {
      if (typeof response.data === 'string')
        migrationMessage.value = response.data
      else
        migrationMessage.value = response.data?.message
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

onMounted(() => {
  getAllProducts()
})

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
