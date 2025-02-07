<!-- src/components/ResultTable.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import CommonTable from '@/components/ds/migration/CommonTable.vue'
import { API_ENDPOINTS } from '@/api/endpoint'

interface MigrationLog {
  id: number
  totalCount: number
  successHaz: number
  successNonHaz: number
  status: string
  migrationTime: string
}

const migrationLogs = ref<MigrationLog[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const headers = [
  { title: 'ID', key: 'id' },
  { title: '총 이관 수', key: 'totalCount' },
  { title: '위해 상품 수', key: 'successHaz' },
  { title: '비위해 상품 수', key: 'successNonHaz' },
  { title: '이관 상태', key: 'status' },
  { title: '완료 시각', key: 'migrationTime' },
  { title: '삭제', key: 'delete' },
]

const resolveStatusColor = (status: string) => {
  if (status === 'SUCCESS')
    return 'success'
  if (status === 'FAIL')
    return 'error'

  return 'primary'
}

const getMigrationLogs = async () => {
  isLoading.value = true
  try {
    const response = await axios.get<MigrationLog[]>(API_ENDPOINTS.MIGRATION.MIGRATIONLOGS)

    migrationLogs.value = response.data
  }
  catch (err: any) {
    error.value = err.response?.data?.message || '데이터를 가져오는 중 오류가 발생했습니다.'
    console.error(error.value)
  }
  finally {
    isLoading.value = false
  }
}

const deleteLog = async (id: number) => {
  try {
    await axios.delete(API_ENDPOINTS.MIGRATION.DELETE(id))

    const index = migrationLogs.value.findIndex(log => log.id === id)
    if (index !== -1)
      migrationLogs.value.splice(index, 1)
  }
  catch (err: any) {
    console.error(`ID ${id} 삭제 실패:`, err.response?.data?.message || err.message)
  }
}

const download = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.MIGRATION.DOWNLOAD, {
      responseType: 'blob',
    })

    // 파일 다운로드 처리
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')

    link.href = url
    link.setAttribute('download', '데이터_이관_결과.csv')
    link.click()
    window.URL.revokeObjectURL(url)
  }
  catch (err) {
    console.error('Export 실패:', err)
  }
}

onMounted(() => {
  getMigrationLogs()
})
</script>

<template>
  <VCard class="mb-6">
    <VCardItem class="project-header d-flex flex-wrap justify-space-between gap-4">
      <VCardTitle>이관 결과</VCardTitle>
      <template #append>
        <VBtn
          variant="tonal"
          color="secondary"
          prepend-icon="tabler-upload"
          @click="download"
        >
          Export
        </VBtn>
      </template>
    </VCardItem>
    <VDivider />
    <VProgressLinear
      v-if="isLoading"
      indeterminate
      color="primary"
      class="mb-4"
    />
    <VAlert
      v-if="error"
      type="error"
      dismissible
      class="mb-4"
    >
      {{ error }}
    </VAlert>
    <CommonTable
      :headers="headers"
      :items="migrationLogs"
      :items-per-page="5"
      density="comfortable"
    >
      <!-- 상태(status) 컬럼 커스터마이징 -->
      <template #item.status="{ item }">
        <VChip
          :color="resolveStatusColor(item.status)"
          class="text-white"
          size="small"
        >
          {{ item.status }}
        </VChip>
      </template>
      <!-- 삭제(delete) 컬럼 커스터마이징 -->
      <template #item.delete="{ item }">
        <IconBtn @click="deleteLog(item.id)">
          <VIcon icon="tabler-trash" />
        </IconBtn>
      </template>
    </CommonTable>
  </VCard>
</template>
