import axios from 'axios'
import { ref } from 'vue'
import { API_ENDPOINTS } from '@/api/endpoint'

export function useInspection() {
  const isInspectionDialogVisible = ref(false)
  const isInspectionLoading = ref(false)
  const inspectionList = ref([])

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

  return {
    isInspectionDialogVisible,
    isInspectionLoading,
    inspectionList,
    openInspectionDialog,
  }
}
