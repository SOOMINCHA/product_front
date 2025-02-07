<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  deleteMigrationLog,
  downloadMigrationLogs,
  getMigrationLogs,
} from '@/api/migrationService'
import CommonTable from '@/components/ds/migration/CommonTable.vue'

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

// 이관 결과 로그 가져오기
const fetchMigrationLogs = async () => {
  isLoading.value = true
  try {
    migrationLogs.value = await getMigrationLogs()
  }
  catch (err: any) {
    error.value = err.message
  }
  finally {
    isLoading.value = false
  }
}

// 특정 로그 삭제
const deleteLogs = async (id: number) => {
  try {
    await deleteMigrationLog(id)
    migrationLogs.value = migrationLogs.value.filter(log => log.id !== id)
  }
  catch (err: any) {
    console.error(err.message)
  }
}

// CSV 다운로드
const download = async () => {
  try {
    await downloadMigrationLogs()
  }
  catch (err: any) {
    console.error(err.message)
  }
}

const resolveStatusColor = (reportType: string) => {
  if (reportType === 'SUCCESS')
    return 'success'
  if (reportType === 'FAIL')
    return 'error'

  return 'secondary'
}

onMounted(() => {
  fetchMigrationLogs()
})
</script>

<template>
  <VCard class="mb-6">
    <VCardItem class="d-flex flex-wrap justify-space-between gap-4">
      <VCardTitle>이관 결과</VCardTitle>
      <template #append>
        <!-- 👉 Export button -->
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

    <CommonTable
      :headers="headers"
      :items="migrationLogs"
      :is-loading="isLoading"
      :error="error"
    >
      <template #item.status="{ item }">
        <VChip
          :color="resolveStatusColor(item.status)"
          class="text-white"
          size="small"
        >
          {{ item.status }}
        </VChip>
      </template>
      <!-- DELETE 컬럼 (휴지통 아이콘 버튼) -->
      <template #item.delete="{ item }">
        <IconBtn @click="deleteLogs(item.id)">
          <VIcon icon="tabler-trash" />
        </IconBtn>
      </template>
    </CommonTable>
  </VCard>
</template>
