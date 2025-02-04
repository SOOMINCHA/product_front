<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { API_ENDPOINTS } from '@/api/endpoint'

interface Product {
  id: number
  productName: string
  productType: string
  institution: string
  notificationYn: string
  reportType: string
  reason: string
  migTime: string
}

const allProducts = ref<Product[]>([])

const getRecentList = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.HOME.RECENT)

    allProducts.value = response.data
  }
  catch (error) {
    console.error('데이터 불러오기 실패:', error)
  }
}

onMounted(getRecentList)

const headers = [
  { title: '상품 ID', key: 'id' },
  { title: '제품명', key: 'productName' },
  { title: '제품유형명', key: 'productType' },
  { title: '검사기관명', key: 'institution' },
  { title: '통보취소여부', key: 'notificationYn' },
  { title: '보고유형명', key: 'reportType' },
  { title: '회수사유명', key: 'reason' },
  { title: '이관일시', key: 'migTime' },
]
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardTitle>이관된 위해상품</VCardTitle>
        <VCardSubtitle>최근 7일 동안 이관된 위해상품 항목</VCardSubtitle>
        <VCardText>
          <VDataTable
            :headers="headers"
            :items="allProducts"
            density="compact"
            :items-per-page="5"
          />
          <p v-if="allProducts.length === 0">
            ⚠️ 최근 7일 동안 이관된 위해상품이 없습니다.
          </p>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
