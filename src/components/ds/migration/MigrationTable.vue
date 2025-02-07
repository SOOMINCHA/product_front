<script setup lang="ts">

// 상위에서 전달받은 props
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

const props = defineProps<{
  headers: Array<{ title: string; key: string }>
  products: Product[]
}>()

const resolveStatusColor = (reportType: string) => {
  if (reportType === '검사합격')
    return 'success'
  if (reportType === '검사부적합')
    return 'error'

  return 'warning'
}
</script>

<template>
  <VDataTable
    :headers="props.headers"
    :items="props.products"
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
</template>
