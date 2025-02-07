<script setup lang="ts">
import ProductFilter from '@/components/ds/product/ProductFilter.vue'
import ProductTable from '@/components/ds/product/ProductTable.vue'
import CompanyDialog from '@/components/ds/product/dialog/CompanyDialog.vue'
import InspectionDialog from '@/components/ds/product/dialog/InspectionDialog.vue'

import { productStore } from '@/composables/ds/productStore'

const categories = [
  { title: '식품', value: 1 },
  { title: '완구', value: 2 },
  { title: '홍삼/건강식품', value: 3 },
  { title: '생활용품', value: 4 },
  { title: '기타', value: 5 },
]

const reportTypes = [
  { title: '검사합격', value: '검사합격' },
  { title: '검사부적합', value: '검사부적합' },
  { title: '회수명령', value: '회수명령' },
]

const {
  // 상태
  allProducts,
  totalProduct,
  selectedRows,
  selectedCategory,
  searchQuery,
  selectedReportType,
  page,
  itemsPerPage,
  sortBy,
  orderBy,
  isCompanyDialogVisible,
  isCompanyLoading,
  selectedCompanies,
  isInspectionDialogVisible,
  isInspectionLoading,
  inspectionList,

  // 함수
  updateOptions,
  openCompanyDialog,
  openInspectionDialog,
  selectAllRows,
  exportCsv,
} = productStore()
</script>

<template>
  <div>
    <!-- 필터/테이블 컴포넌트 -->
    <VCard
      title="Filters"
      class="mb-6"
    >
      <ProductFilter
        :categories="categories"
        :report-types="reportTypes"
        :search-query="searchQuery"
        :selected-category="selectedCategory"
        :selected-report-type="selectedReportType"
        :items-per-page="itemsPerPage"
        @update:search-query="val => searchQuery = val"
        @update:selected-category="val => selectedCategory = val"
        @update:selected-report-type="val => selectedReportType = val"
        @update:items-per-page="val => itemsPerPage = val"
        @select-all-rows="selectAllRows"
        @export-csv="exportCsv"
      />

      <VDivider class="mt-4" />

      <ProductTable
        :all-products="allProducts"
        :total-product="totalProduct"
        :selected-rows="selectedRows"
        :page="page"
        :items-per-page="itemsPerPage"
        :sort-by="sortBy"
        :order-by="orderBy"
        @update:selected-rows="val => (selectedRows = val)"
        @update:page="val => (page = val)"
        @update-options="updateOptions"
        @open-company-dialog="openCompanyDialog"
        @open-inspection-dialog="openInspectionDialog"
      />
    </VCard>

    <!-- Dialogs -->
    <CompanyDialog
      :visible="isCompanyDialogVisible"
      :companies="selectedCompanies"
      :is-loading="isCompanyLoading"
      @update:visible="isCompanyDialogVisible = $event"
    />
    <InspectionDialog
      :visible="isInspectionDialogVisible"
      :inspections="inspectionList"
      :is-loading="isInspectionLoading"
      @update:visible="isInspectionDialogVisible = $event"
    />
  </div>
</template>
