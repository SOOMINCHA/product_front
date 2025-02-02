<!-- src/components/InspectionDialog.vue -->
<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import BaseDialog from './BaseDialog.vue' // 경로를 정확히 설정

const props = defineProps<{
  visible: boolean
  inspections: Array<{
    icptInspSn: number
    icptInspArtclCn: string
    icptInspSpcfctCn: string
    icptInspRsltCn: string
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
    title="검사 정보"
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
          v-for="inspection in inspections"
          :key="inspection.icptInspSn"
          class="mb-4"
        >
          <p><strong>검사 순번:</strong> {{ inspection.icptInspSn }}</p>
          <p><strong>부적합 검사 항목:</strong> {{ inspection.icptInspArtclCn }}</p>
          <p><strong>부적합 검사:</strong> {{ inspection.icptInspSpcfctCn }}</p>
          <p><strong>부적합 검사 결과:</strong> {{ inspection.icptInspRsltCn }}</p>
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
