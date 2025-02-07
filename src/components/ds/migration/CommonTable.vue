<script setup lang="ts">
interface TableHeader {
  title: string
  key: string
}

interface TableItem {
  [key: string]: any
}

const props = defineProps<{
  headers: TableHeader[]
  items: TableItem[]
  isLoading?: boolean
  error?: string | null
  itemsPerPage?: number
}>()
</script>

<template>
  <VCard>
    <VDivider />

    <!-- 로딩 상태 -->
    <VProgressLinear
      v-if="isLoading"
      indeterminate
      color="primary"
      class="mb-4"
    />

    <!-- 에러 메시지 -->
    <VAlert
      v-if="error"
      type="error"
      dismissible
      class="mb-4"
    >
      {{ error }}
    </VAlert>

    <!-- 데이터 테이블 -->
    <VDataTable
      :headers="headers"
      :items="items"
      :items-per-page="itemsPerPage ?? 25"
      density="comfortable"
      style="overflow-x: auto; white-space: nowrap;"
    >
      <template
        v-for="(_, slot) in $slots"
        #[slot]="scope"
      >
        <slot
          :name="slot"
          v-bind="scope"
        />
      </template>
    </VDataTable>
  </VCard>
</template>
