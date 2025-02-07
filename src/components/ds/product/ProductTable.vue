<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  allProducts: Array<any>
  totalProduct: number
  selectedRows: Array<any>
  page: number
  itemsPerPage: number
  sortBy: string
  orderBy: string
}>()

const emits = defineEmits([
  'update:selectedRows',
  'update:page',
  'updateOptions',
  'update:sortBy',
  'update:orderBy',
  'openCompanyDialog',
  'openInspectionDialog',
])

const headers = [
  { title: '상품 ID', key: 'id' },
  { title: '제품명', key: 'productName' },
  { title: '제품유형명', key: 'productType' },
  { title: '검사기관명', key: 'institution' },
  { title: '통보취소여부', key: 'notificationYn' },
  { title: '보고유형명', key: 'reportType' },
  { title: '회수사유명', key: 'reason' },
  { title: '상세보기', key: 'actions' },
]

const localSelectedRows = ref(props.selectedRows)
const localPage = ref(props.page)
const localItemsPerPage = ref(props.itemsPerPage)

watch(localSelectedRows, newVal => {
  emits('update:selectedRows', newVal)
})
watch(localPage, newVal => {
  emits('update:page', newVal)
})
watch(localItemsPerPage, newVal => {
})

const resolveStatusColor = (reportType: string) => {
  if (reportType === '검사합격')
    return 'success'
  if (reportType === '검사부적합')
    return 'error'

  return 'warning'
}

const emitUpdateOptions = (options: any) => {
  emits('updateOptions', options)
}

const onOpenCompanyDialog = (productId: number) => {
  emits('openCompanyDialog', productId)
}

const onOpenInspectionDialog = (productId: number) => {
  emits('openInspectionDialog', productId)
}
</script>

<template>
  <VDataTableServer
    v-model:items-per-page="localItemsPerPage"
    v-model:model-value="localSelectedRows"
    v-model:page="localPage"
    :item-value="row => row.id"
    :headers="headers"
    show-select
    :items="allProducts"
    :items-length="totalProduct"
    class="text-no-wrap"
    return-object
    @update:options="val => emitUpdateOptions(val)"
  >
    <!-- 보고유형 -->
    <template #item.reportType="{ item }">
      <VChip
        :color="resolveStatusColor(item.reportType)"
        class="text-white"
        size="small"
      >
        {{ item.reportType }}
      </VChip>
    </template>

    <!-- Actions (회사/검사) -->
    <template #item.actions="{ item }">
      <IconBtn>
        <VIcon
          icon="tabler-user"
          @click="onOpenCompanyDialog(item.id)"
        />
      </IconBtn>
      <IconBtn>
        <VIcon
          icon="tabler-file-description"
          @click="onOpenInspectionDialog(item.id)"
        />
      </IconBtn>
    </template>

    <!-- pagination -->
    <template #bottom>
      <TablePagination
        v-model:page="localPage"
        :items-per-page="localItemsPerPage"
        :total-items="totalProduct"
      />
    </template>
  </VDataTableServer>
</template>
