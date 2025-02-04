import axios from 'axios'
import { nextTick, onMounted, ref, watch } from 'vue'
import { API_ENDPOINTS } from '@/api/endpoint'

export function useProductManager() {
  // ---- 타입 정의 ----
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

  // ----- 상태 관리 -----
  const allProducts = ref<Product[]>([])
  const totalProduct = ref(0)
  const selectedRows = ref<Product[]>([])

  // 필터 관련
  const selectedCategory = ref<number | null>(null)
  const searchQuery = ref('')
  const selectedReportType = ref<string | null>(null)

  // 페이지네이션/정렬
  const page = ref(1)
  const itemsPerPage = ref(10)
  const sortBy = ref('id')
  const orderBy = ref('ASC')

  // 다이얼로그 상태
  const isCompanyDialogVisible = ref(false)
  const isCompanyLoading = ref(false)
  const selectedCompanies = ref<Company[]>([])

  const isInspectionDialogVisible = ref(false)
  const isInspectionLoading = ref(false)
  const inspectionList = ref<Inspection[]>([])

  // ----- 데이터 가져오기 -----
  const fetchProducts = async () => {
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

      const response = await axios.get(API_ENDPOINTS.PRODUCTS.CATEGORY, { params })

      allProducts.value = response.data.products || []
      totalProduct.value = response.data.totalCount || 0
    }
    catch (error) {
      allProducts.value = []
      totalProduct.value = 0
    }
  }

  // ----- 정렬/옵션 업데이트 -----
  const updateOptions = (options: any) => {
    const newSort = options.sortBy[0]
    if (newSort) {
      sortBy.value = newSort.key
      orderBy.value = newSort.order
    }
    fetchProducts()
  }

  // ----- Watchers -----
  watch([searchQuery, selectedCategory, selectedReportType, sortBy, orderBy, page, itemsPerPage], () => {
    fetchProducts()
  })

  onMounted(() => {
    fetchProducts()
  })

  // ----- 다이얼로그 관련 로직 -----
  const openCompanyDialog = async (id: number) => {
    try {
      isCompanyLoading.value = true

      const response = await axios.get(API_ENDPOINTS.PRODUCTS.COMPANY(id))

      selectedCompanies.value = response.data
      isCompanyDialogVisible.value = true
    }
    catch (error) {
      alert('업체 정보를 불러오는 데 실패했습니다.')
    }
    finally {
      isCompanyLoading.value = false
    }
  }

  const openInspectionDialog = async (id: number) => {
    try {
      isInspectionLoading.value = true

      const response = await axios.get(API_ENDPOINTS.PRODUCTS.INSPECTION(id))

      inspectionList.value = response.data
      isInspectionDialogVisible.value = true
    }
    catch (error) {
      alert('검사 정보를 불러오는 데 실패했습니다.')
    }
    finally {
      isInspectionLoading.value = false
    }
  }

  // ----- CSV Export -----
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

      const params = new URLSearchParams()

      selectedIds.forEach(id => params.append('ids', id))

      const response = await axios.get(API_ENDPOINTS.PRODUCTS.DOWNLOAD, {
        params,
        responseType: 'blob',
      })

      const blob = new Blob([response.data], { type: 'text/csv' })
      const link = document.createElement('a')

      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', 'products.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    catch (error) {
      alert('CSV 내보내기에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // ----- 전체 선택 -----
  const selectAllRows = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.PRODUCTS.ALL)

      if (response.data && Array.isArray(response.data)) {
        const allData = response.data
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
    }
    catch (error) {
      alert('전체 선택 중 오류가 발생했습니다.')
    }
  }

  // ----- 반환 -----
  return {
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
    fetchProducts,
    updateOptions,
    openCompanyDialog,
    openInspectionDialog,
    exportCsv,
    selectAllRows,
  }
}
