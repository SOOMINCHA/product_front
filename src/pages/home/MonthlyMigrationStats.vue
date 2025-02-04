<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useTheme } from 'vuetify'
import axios from 'axios'
import { hexToRgb } from '@layouts/utils'
import { API_ENDPOINTS } from '@/api/endpoint'

const vuetifyTheme = useTheme()

// 상태 변수 설정
const categories = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'])
const series = ref<{ name: string; data: number[] }[]>([])

const getMonthlyMig = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.HOME.STATS)
    const apiData = response.data.data

    // 기본값 설정 (초기 0으로)
    const dataMap = {
      Jan: { successHazTotal: 0, successNonHazTotal: 0 },
      Feb: { successHazTotal: 0, successNonHazTotal: 0 },
      Mar: { successHazTotal: 0, successNonHazTotal: 0 },
      Apr: { successHazTotal: 0, successNonHazTotal: 0 },
      May: { successHazTotal: 0, successNonHazTotal: 0 },
      Jun: { successHazTotal: 0, successNonHazTotal: 0 },
    }

    // API 데이터로 업데이트
    apiData.forEach((item: any) => {
      if (dataMap[item.month]) {
        dataMap[item.month].successHazTotal = item.successHazTotal
        dataMap[item.month].successNonHazTotal = item.successNonHazTotal
      }
    })

    // 데이터 변환
    series.value = [
      {
        name: '위해상품',
        data: categories.value.map(month => dataMap[month].successHazTotal),
      },
      {
        name: '비위해상품',
        data: categories.value.map(month => dataMap[month].successNonHazTotal),
      },
    ]
  }
  catch (error) {
    console.error('데이터를 불러오는 중 오류 발생:', error)
  }
}

onMounted(getMonthlyMig)

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables

  const borderColor = `rgba(${hexToRgb(String(variableTheme['border-color']))},${variableTheme['border-opacity']})`
  const labelColor = `rgba(${hexToRgb(currentTheme['on-surface'])},${variableTheme['disabled-opacity']})`
  const legendColor = `rgba(${hexToRgb(currentTheme['on-background'])},${variableTheme['medium-emphasis-opacity']})`

  return {
    chart: {
      type: 'radar',
      toolbar: { show: false },
    },
    plotOptions: {
      radar: {
        polygons: {
          strokeColors: borderColor,
          connectorColors: borderColor,
        },
      },
    },
    stroke: { show: false, width: 0 },
    legend: {
      show: true,
      fontSize: '13px',
      position: 'bottom',
      labels: { colors: legendColor, useSeriesColors: false },
      markers: { height: 12, width: 12, offsetX: -8 },
      itemMargin: { horizontal: 10 },
      onItemHover: { highlightDataSeries: false },
    },
    colors: [currentTheme.primary, currentTheme.info],
    fill: { opacity: [1, 0.85] },
    markers: { size: 0 },
    grid: {
      show: false,
      padding: { top: 0, bottom: -5 },
    },
    xaxis: {
      categories: categories.value,
      labels: {
        show: true,
        style: {
          colors: categories.value.map(() => labelColor),
          fontSize: '13px',
          fontFamily: 'Public Sans',
        },
      },
    },
    yaxis: {
      show: false,
      min: 0,
      max: Math.max(...series.value.flatMap(s => s.data)) + 50, // 최대값 자동 조정
      tickAmount: 4,
    },
    tooltip: {
      y: {
        formatter: val => `${val}건`,
      },
    },
    responsive: [
      {
        breakpoint: 769,
        options: {
          chart: { height: 372 },
        },
      },
    ],
  }
})
</script>

<template>
  <VCard>
    <VCardItem class="pb-4">
      <VCardTitle>월별 이관 횟수</VCardTitle>
      <VCardSubtitle>최근 6개월간 이관된 데이터 수</VCardSubtitle>

      <template #append>
        <div class="mt-n4 me-n2">
          <MoreBtn
            size="small"
            :menu-list="[
              { title: 'View More', value: 'View More' },
              { title: 'Delete', value: 'Delete' },
            ]"
          />
        </div>
      </template>
    </VCardItem>

    <VCardText>
      <VueApexCharts
        :options="chartOptions"
        :series="series"
        height="290"
      />
    </VCardText>
  </VCard>
</template>
