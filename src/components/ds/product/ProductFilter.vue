<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps<{
  categories: Array<{ title: string; value: number }>
  reportTypes: Array<{ title: string; value: string }>
  searchQuery: string
  selectedCategory: number | null
  selectedReportType: string | null
  itemsPerPage: number
}>()

const emits = defineEmits([
  'update:searchQuery',
  'update:selectedCategory',
  'update:selectedReportType',
  'update:itemsPerPage',
  'selectAllRows',
  'exportCsv',
])

// 로컬 상태 (v-model 바인딩용)
const localSearchQuery = ref(props.searchQuery)
const localSelectedCategory = ref<number | null>(props.selectedCategory)
const localSelectedReportType = ref<string | null>(props.selectedReportType)
const localItemsPerPage = ref(props.itemsPerPage)

// 부모에게 변경사항 emit
watch(localSearchQuery, newVal => {
  emits('update:searchQuery', newVal)
})
watch(localSelectedCategory, newVal => {
  emits('update:selectedCategory', newVal)
})
watch(localSelectedReportType, newVal => {
  emits('update:selectedReportType', newVal)
})
watch(localItemsPerPage, newVal => {
  emits('update:itemsPerPage', newVal)
})

// 버튼 클릭시 부모 쪽 함수를 호출하기 위한 emit
const emitSelectAllRows = () => {
  emits('selectAllRows')
}

const emitExportCsv = () => {
  emits('exportCsv')
}
</script>

<template>
  <VCardText>
    <VRow>
      <VCol
        cols="12"
        sm="4"
      >
        <AppSelect
          v-model="localSelectedCategory"
          placeholder="카테고리"
          :items="categories"
          clearable
          clear-icon="tabler-x"
        />
      </VCol>
      <VCol
        cols="12"
        sm="4"
      >
        <AppSelect
          v-model="localSelectedReportType"
          placeholder="보고유형명"
          :items="reportTypes"
          clearable
          clear-icon="tabler-x"
        />
      </VCol>
    </VRow>
  </VCardText>

  <VDivider />

  <div class="d-flex flex-wrap gap-4 ma-6">
    <div class="d-flex align-center">
      <AppTextField
        v-model="localSearchQuery"
        placeholder="검색"
        style="inline-size: 200px;"
        class="me-3"
      />
    </div>

    <VSpacer />

    <div class="d-flex gap-4 flex-wrap align-center">
      <AppSelect
        v-model="localItemsPerPage"
        :items="[5, 10, 20, 25, 50]"
      />
      <!-- 전체 선택 버튼 -->
      <VBtn
        variant="tonal"
        color="primary"
        prepend-icon="tabler-check"
        @click="emitSelectAllRows"
      >
        전체 선택
      </VBtn>
      <VBtn
        variant="tonal"
        color="secondary"
        prepend-icon="tabler-upload"
        @click="emitExportCsv"
      >
        Export
      </VBtn>
    </div>
  </div>
</template>
