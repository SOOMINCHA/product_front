<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import CompanyDialog from '@/pages/ds/CompanyDialog.vue'
import InspectionDialog from '@/pages/ds/InspectionDialog.vue'

// TypeScript 인터페이스 정의
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

interface Company {
  bzentySn: number | null
  bzentyTypeNm: string
  bzentyNm: string
  bzentyTelno: string
  bzentyZip: string
  bzentyAddr: string
  bzentyDaddr: string | null
}

interface Inspection {
  icptInspSn: number
  icptInspArtclCn: string
  icptInspSpcfctCn: string
  icptInspRsltCn: string
}

// 테이블 헤더 정의
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

const categories = ref([
  { title: '식품', value: 1 },
  { title: '완구', value: 2 },
  { title: '홍삼/건강식품', value: 3 },
  { title: '생활용품', value: 4 },
  { title: '기타', value: 5 },
])

const reportTypes = ref([
  { title: '검사합격', value: '검사합격' },
  { title: '검사부적합', value: '검사부적합' },
  { title: '회수명령', value: '회수명령' },
])

const resolveStatusColor = (reportType: string) => {
  if (reportType === '검사합격')
    return 'success'
  if (reportType === '검사부적합')
    return 'error'

  return 'warning'
}

// 상태 관리
const allProducts = ref<Product[]>([])
const totalProduct = ref(0)
const selectedRows = ref<Product[]>([])

const selectedReportType = ref<string | null>(null)
const searchQuery = ref('')
const selectedCategory = ref<number | null>(null)
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref('id')
const orderBy = ref('ASC')

// 팝업 상태와 데이터
const isCompanyDialogVisible = ref(false)
const isCompanyLoading = ref(false)
const selectedCompanies = ref<Company[]>([])

const isInspectionDialogVisible = ref(false)
const isInspectionLoading = ref(false)
const inspectionList = ref<Inspection[]>([])

// API 호출: 상품 리스트 불러오기
const selectAllProducts = async () => {
  try {
    const params = {
      searchQuery: searchQuery.value,
      categoryId: selectedCategory.value || null,
      reportType: selectedReportType.value || null,
      page: page.value,
      itemsPerPage: itemsPerPage.value,
      sortBy: sortBy.value,
      orderBy: orderBy.value,
    }

    const response = await axios.get('http://localhost:8081/api/products/product', { params })

    allProducts.value = response.data.products || []
    totalProduct.value = response.data.totalCount || 0
    console.log(response.data.products)
  }
  catch (error) {
    console.error('상품 불러오기 실패:', error)
    allProducts.value = []
    totalProduct.value = 0
  }
}

// 정렬 및 옵션 업데이트
const updateOptions = (options: any) => {
  const newSort = options.sortBy[0]
  if (newSort) {
    sortBy.value = newSort.key
    orderBy.value = newSort.order
  }
  selectAllProducts()
}

// 상태 변화 시 데이터 갱신
watch([searchQuery, selectedCategory, selectedReportType, sortBy, orderBy, page, itemsPerPage], () => {
  console.log('Filters changed:', {
    searchQuery: searchQuery.value,
    selectedCategory: selectedCategory.value,
    selectedReportType: selectedReportType.value,
    sortBy: sortBy.value,
    orderBy: orderBy.value,
    page: page.value,
    itemsPerPage: itemsPerPage.value,
  })
  selectAllProducts()
})

// API 호출 후 팝업 열기 - 회사 정보
const openCompanyDialog = async (id: number) => {
  try {
    isCompanyLoading.value = true

    const response = await axios.get(`http://localhost:8081/api/products/company/${id}`)

    selectedCompanies.value = response.data
    isCompanyDialogVisible.value = true
  }
  catch (error) {
    console.error('업체 정보 불러오기 실패:', error)
    alert('업체 정보를 불러오는 데 실패했습니다.')
  }
  finally {
    isCompanyLoading.value = false
  }
}

// API 호출 후 팝업 열기 - 검사 정보
const openInspectionDialog = async (id: number) => {
  try {
    isInspectionLoading.value = true

    const response = await axios.get(`http://localhost:8081/api/products/inspection/${id}`)

    inspectionList.value = response.data
    isInspectionDialogVisible.value = true
  }
  catch (error) {
    console.error('검사 정보 불러오기 실패:', error)
    alert('검사 정보를 불러오는 데 실패했습니다.')
  }
  finally {
    isInspectionLoading.value = false
  }
}

// 초기 데이터 로드
onMounted(() => {
  selectAllProducts()
})
</script>

<template>
  <div>
    <!-- 필터 -->
    <VCard
      title="Filters"
      class="mb-6"
    >
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            sm="4"
          >
            <AppSelect
              v-model="selectedCategory"
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
              v-model="selectedReportType"
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
            v-model="searchQuery"
            placeholder="검색"
            style="inline-size: 200px;"
            class="me-3"
          />
        </div>

        <VSpacer />
        <div class="d-flex gap-4 flex-wrap align-center">
          <AppSelect
            v-model="itemsPerPage"
            :items="[5, 10, 20, 25, 50]"
          />
          <VBtn
            variant="tonal"
            color="secondary"
            prepend-icon="tabler-upload"
          >
            Export
          </VBtn>
        </div>
      </div>

      <VDivider class="mt-4" />

      <!-- 👉 Datatable  -->
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:model-value="selectedRows"
        v-model:page="page"
        :headers="headers"
        show-select
        :items="allProducts"
        :items-length="totalProduct"
        class="text-no-wrap"
        @update:options="updateOptions"
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
        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn>
            <VIcon
              icon="tabler-user"
              @click="openCompanyDialog(item.id)"
            />
          </IconBtn>
          <IconBtn>
            <VIcon
              icon="tabler-file-description"
              @click="openInspectionDialog(item.id)"
            />
          </IconBtn>
        </template>

        <!-- pagination -->
        <template #bottom>
          <TablePagination
            v-model:page="page"
            :items-per-page="itemsPerPage"
            :total-items="totalProduct"
          />
        </template>
      </VDataTableServer>
    </VCard>

    <!-- CompanyDialog 컴포넌트 사용 -->
    <CompanyDialog
      :visible="isCompanyDialogVisible"
      :companies="selectedCompanies"
      :is-loading="isCompanyLoading"
      @update:visible="isCompanyDialogVisible = $event"
    />

    <!-- InspectionDialog 컴포넌트 사용 -->
    <InspectionDialog
      :visible="isInspectionDialogVisible"
      :inspections="inspectionList"
      :is-loading="isInspectionLoading"
      @update:visible="isInspectionDialogVisible = $event"
    />
  </div>
</template>
