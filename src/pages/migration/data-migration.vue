<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getAllProducts, startMigration } from '@/api/migrationService'
import CommonTable from '@/components/ds/migration/CommonTable.vue'
import ResultDialog from '@/components/ds/migration/dialog/ResultDialog.vue'

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
const isLoading = ref(false)
const isLoaderVisible = ref(false)
const error = ref<string | null>(null)

const isMigrating = ref(false)
const isResultDialogVisible = ref(false)
const migrationMessage = ref('')

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

// 제품 데이터 불러오기
const fetchProducts = async () => {
  isLoading.value = true
  try {
    allProducts.value = await getAllProducts()
  }
  catch (err: any) {
    error.value = err.message
  }
  finally {
    isLoading.value = false
  }
}

// 마이그레이션 시작
const migrateData = async () => {
  isMigrating.value = true
  isLoaderVisible.value = true

  try {
    migrationMessage.value = await startMigration()
  }
  catch (err: any) {
    migrationMessage.value = err.message
  }
  finally {
    isMigrating.value = false
    isLoaderVisible.value = false
    isResultDialogVisible.value = true
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <VCard>
    <VCardText>
      <div class="d-flex justify-end flex-wrap gap-y-4">
        <VBtn
          variant="tonal"
          prepend-icon="tabler-transfer"
          :loading="isMigrating"
          @click="migrateData"
        >
          이관하기
        </VBtn>
      </div>
    </VCardText>

    <CommonTable
      :headers="headers"
      :items="allProducts"
      :is-loading="isLoading"
      :error="error"
    />

    <ResultDialog
      :visible="isResultDialogVisible"
      :message="migrationMessage"
      @update:visible="isResultDialogVisible = $event"
    />
  </VCard>
</template>
