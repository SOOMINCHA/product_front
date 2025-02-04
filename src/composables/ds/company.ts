import axios from 'axios'
import { ref } from 'vue'
import { API_ENDPOINTS } from '@/api/endpoint'

export function useCompany() {
  const isCompanyDialogVisible = ref(false)
  const isCompanyLoading = ref(false)
  const selectedCompanies = ref([])

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

  return {
    isCompanyDialogVisible,
    isCompanyLoading,
    selectedCompanies,
    openCompanyDialog,
  }
}
