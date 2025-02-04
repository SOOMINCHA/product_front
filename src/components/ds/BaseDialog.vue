<!-- src/components/BaseDialog.vue -->
<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

const props = defineProps<{
  visible: boolean
  title: string
  width?: string
}>()

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void
}>()

const onUpdateModelValue = (value: boolean) => {
  emit('update:visible', value)
}

const closeDialog = () => {
  emit('update:visible', false)
}
</script>

<template>
  <VDialog
    :model-value="visible"
    :width="width"
    @update:model-value="onUpdateModelValue"
  >
    <DialogCloseBtn @click="closeDialog" />
    <VCard class="pa-2 pa-sm-3">
      <VCardTitle>
        <h4 class="text-h4 mb-2">
          {{ title }}
        </h4>
      </VCardTitle>
      <VCardText>
        <slot name="content" />
      </VCardText>
      <VCardActions>
        <slot name="actions">
          <VBtn
            color="primary"
            @click="closeDialog"
          >
            Close
          </VBtn>
        </slot>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
