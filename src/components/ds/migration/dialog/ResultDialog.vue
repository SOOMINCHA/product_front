<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import BaseDialog from '@/components/ds/BaseDialog.vue'

const props = defineProps<{
  visible: boolean
  message: string
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
    title="이관 결과"
    width="500"
    @update:visible="emitUpdateVisible"
  >
    <template #content>
      <pre>{{ message }}</pre>
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
