<script setup lang="ts">
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { API_ENDPOINTS } from '@/api/endpoint'

const hazardousData = ref(0)
const nonHazardousData = ref(0)

const getAllProductRatio = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.HOME.RATIO)

    if (response.data) {
      hazardousData.value = response.data.hazardous
      nonHazardousData.value = response.data.nonHazardous
    }
  }
  catch (error) {
    console.error('Error fetching product ratio data:', error)
  }
}

onMounted(getAllProductRatio)

const materialsChartConfig = computed(() => ({
  labels: ['위해상품', '비위해상품'],
  colors: ['#FF5733CC', '#28C76FCC'], // 위험물(빨강), 비위험물(초록)
  stroke: { width: 0 },
  dataLabels: {
    enabled: false,
    formatter(val: string) {
      return `${Number.parseInt(val)}개`
    },
  },
  legend: {
    show: true,
    position: 'bottom',
    offsetY: 10,
    markers: {
      width: 8,
      height: 8,
      offsetX: -3,
    },
    itemMargin: { horizontal: 15, vertical: 5 },
    fontSize: '13px',
    fontWeight: 400,
  },
  tooltip: { theme: false },
  grid: { padding: { top: 15 } },
  plotOptions: {
    pie: {
      donut: {
        size: '75%',
        labels: {
          show: true,
          value: {
            fontSize: '24px',
            fontWeight: 500,
            offsetY: -20,
            formatter(val: string) {
              return `${Number.parseInt(val)}개`
            },
          },
          name: { offsetY: 20 },
          total: {
            show: true,
            fontSize: '0.9375rem',
            fontWeight: 400,
            label: 'Total',
            formatter() {
              return `${hazardousData.value + nonHazardousData.value}개`
            },
          },
        },
      },
    },
  },
}))

const materialsChartSeries = computed(() => [hazardousData.value, nonHazardousData.value])
</script>

<template>
  <VCard>
    <VCardItem title="위해상품 & 비위해상품">
      <VCardSubtitle>전체 상품 개수 대비 위해상품 및 비위해상품 개수</VCardSubtitle>
      <template #append>
        <MoreBtn />
      </template>
    </VCardItem>
    <VCardText>
      <VueApexCharts
        type="donut"
        height="400"
        :options="materialsChartConfig"
        :series="materialsChartSeries"
      />
    </VCardText>
  </VCard>
</template>
