import { nextTick, onMounted, ref, watch } from 'vue'
import {
  downloadCsv,
  fetchAllProducts,
  fetchCompanyInfo,
  fetchInspectionInfo,
  fetchProducts,
} from '@/api/productService'

export function productStore() {
  const allProducts = ref([])
  const totalProduct = ref(0)
  const selectedRows = ref([])

  const selectedCategory = ref<number | null>(null)
  const searchQuery = ref('')
  const selectedReportType = ref<string | null>(null)

  const page = ref(1)
  const itemsPerPage = ref(20)
  const sortBy = ref('id')
  const orderBy = ref('ASC')

  const isCompanyDialogVisible = ref(false)
  const isCompanyLoading = ref(false)
  const selectedCompanies = ref([])

  const isInspectionDialogVisible = ref(false)
  const isInspectionLoading = ref(false)
  const inspectionList = ref([])

  // 상품 목록 가져오기
  const loadProducts = async () => {
    const params = {
      searchQuery: searchQuery.value,
      categoryId: selectedCategory.value || null,
      reportType: selectedReportType.value || null,
      page: page.value,
      itemsPerPage: itemsPerPage.value,
      sortBy: sortBy.value,
      orderBy: orderBy.value,
    }

    const data = await fetchProducts(params)

    allProducts.value = data.products
    totalProduct.value = data.totalCount
  }

  const updateOptions = (options: any) => {
    const newSort = options.sortBy[0]
    if (newSort) {
      sortBy.value = newSort.key
      orderBy.value = newSort.order
    }
    loadProducts()
  }

  watch([searchQuery, selectedCategory, selectedReportType, sortBy, orderBy, page, itemsPerPage], () => {
    loadProducts()
  })

  onMounted(() => {
    loadProducts()
  })

  // 업체 정보 다이얼로그 열기
  const openCompanyDialog = async (id: number) => {
    try {
      isCompanyLoading.value = true
      selectedCompanies.value = await fetchCompanyInfo(id)
      isCompanyDialogVisible.value = true
    }
    catch (error) {
      alert(error.message)
    }
    finally {
      isCompanyLoading.value = false
    }
  }

  // 검사 정보 다이얼로그 열기
  const openInspectionDialog = async (id: number) => {
    try {
      isInspectionLoading.value = true
      inspectionList.value = await fetchInspectionInfo(id)
      isInspectionDialogVisible.value = true
    }
    catch (error) {
      alert(error.message)
    }
    finally {
      isInspectionLoading.value = false
    }
  }

  // CSV 내보내기
  const exportCsv = async () => {
    if (selectedRows.value.length === 0) {
      alert('적어도 하나의 상품을 선택해주세요.')

      return
    }

    try {
      const selectedIds = selectedRows.value.map(item => item.id)
      if (selectedIds.length === 0) {
        alert('선택된 유효한 상품이 없습니다.')

        return
      }

      const data = await downloadCsv(selectedIds)
      const blob = new Blob([data], { type: 'text/csv' })
      const link = document.createElement('a')

      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', 'products.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    catch (error) {
      alert(error.message)
    }
  }

  // 전체 선택
  const selectAllRows = async () => {
    try {
      const allData = await fetchAllProducts()
      const isAllSelected = selectedRows.value.length === allData.length

      if (isAllSelected) {
        alert('전체 선택이 해제되었습니다.')
        selectedRows.value = []
      }
      else {
        alert(`총 ${allData.length}개의 항목이 선택되었습니다.`)
        selectedRows.value = [...allData]
      }

      await nextTick()
    }
    catch (error) {
      alert(error.message)
    }
  }

  return {
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
    loadProducts,
    updateOptions,
    openCompanyDialog,
    openInspectionDialog,
    exportCsv,
    selectAllRows,
  }
}
