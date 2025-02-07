<!-- src/components/CompanyDialog.vue -->
<script setup lang="ts">
import BaseDialog from '@/components/ds/BaseDialog.vue'

const props = defineProps<{
  visible: boolean
  companies: Array<{
    bzentySn: number | null
    bzentyTypeNm: string
    bzentyNm: string
    bzentyTelno: string
    bzentyZip: string
    bzentyAddr: string
    bzentyDaddr: string | null
  }>
  isLoading: boolean
}>()

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void
}>()

const emitUpdateVisible = (value: boolean) => {
  emit('update:visible', value)
}
</script>

<template>
  <BaseDialog
    :visible="visible"
    title="업체 정보"
    width="800"
    @update:visible="emitUpdateVisible"
  >
    <template #content>
      <div
        v-if="isLoading"
        class="d-flex justify-center"
      >
        <VProgressCircular indeterminate />
      </div>
      <div v-else>
        <div
          v-for="company in companies"
          :key="company.bzentySn"
          class="mb-4"
        >
          <p><strong>업체 순번:</strong> {{ company.bzentySn }}</p>
          <p><strong>업체 유형명:</strong> {{ company.bzentyTypeNm }}</p>
          <p><strong>업체명:</strong> {{ company.bzentyNm }}</p>
          <p><strong>업체 전화번호:</strong> {{ company.bzentyTelno || '정보 없음' }}</p>
          <p><strong>업체 우편번호:</strong> {{ company.bzentyZip }}</p>
          <p><strong>업체 주소:</strong> {{ company.bzentyAddr }}</p>
          <p><strong>업체 상세 주소:</strong> {{ company.bzentyDaddr || '정보 없음' }}</p>
          <VDivider class="my-2" />
        </div>
      </div>
    </template>
    <template #actions>
      <VBtn
        color="primary"
        @click="emitUpdateVisible(false)"
      >
        Close
      </VBtn>
    </template>
  </BaseDialog>
</template>
