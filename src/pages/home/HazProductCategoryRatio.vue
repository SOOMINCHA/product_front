<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { API_ENDPOINTS } from '@/api/endpoint'

const borderColor = 'rgba(var(--v-border-color), var(--v-border-opacity))'

// 차트 설정
const topicsChartConfig = ref({
  chart: {
    height: 270,
    type: 'bar',
    toolbar: { show: false },
  },

  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '70%',
      distributed: true,
      borderRadius: 7,
      borderRadiusApplication: 'end',
    },
  },

  colors: [
    'rgba(var(--v-theme-primary),1)',
    'rgba(var(--v-theme-info),1)',
    'rgba(var(--v-theme-success),1)',
    'rgba(var(--v-theme-secondary),1)',
    'rgba(var(--v-theme-error),1)',
    'rgba(var(--v-theme-warning),1)',
  ],

  grid: {
    borderColor,
    strokeDashArray: 10,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: false } },
    padding: { top: -35, bottom: -12 },
  },

  dataLabels: {
    enabled: true,
    style: {
      colors: ['#fff'],
      fontWeight: 200,
      fontSize: '13px',
    },
    offsetX: 0,
    dropShadow: { enabled: false },
    formatter(val: number) {
      return `${Math.round(val)}%`
    },
  },

  labels: [],

  xaxis: {
    categories: [],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: {
        colors: 'rgba(var(--v-theme-on-background), var(--v-disabled-opacity))',
        fontSize: '13px',
      },
      formatter(val: number) {
        return `${Math.round(val)}%`
      },
    },
  },

  yaxis: {
    max: 100,
    labels: {
      style: {
        colors: 'rgba(var(--v-theme-on-background), var(--v-disabled-opacity))',
        fontSize: '13px',
      },
      formatter(val: number) {
        return `${Math.round(val)}`
      },
    },
  },

  tooltip: {
    enabled: true,
    style: { fontSize: '12px' },
    onDatasetHover: { highlightDataSeries: false },
    y: {
      formatter: (val: number) => `${Math.round(val)}%`,
    },
  },

  legend: { show: false },
})

const topicsChartSeries = ref([{ data: [] }])
const topicsData = ref([])

const getHazProductRatio = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.HOME.HAZRATIO)
    const data = response.data

    topicsChartConfig.value.labels = data.map(item => item.categoryName)
    topicsChartConfig.value.xaxis.categories = data.map(item => item.categoryName)
    topicsChartSeries.value[0].data = data.map(item => Math.round(item.percentage))

    topicsData.value = data.map((item, index) => ({
      title: item.categoryName,
      value: Math.round(item.percentage),
      color: topicsChartConfig.value.colors[index % topicsChartConfig.value.colors.length],
    }))
  }
  catch (error) {
    console.error('데이터 불러오기 실패:', error)
  }
}

onMounted(getHazProductRatio)
</script>

<template>
  <VCard>
    <VCardItem title="카테고리별 위해상품 비율">
      <template #append>
        <MoreBtn />
      </template>
    </VCardItem>

    <VCardText>
      <VRow>
        <!-- 바 차트 -->
        <VCol
          cols="12"
          md="6"
          xl="8"
          lg="7"
        >
          <div>
            <VueApexCharts
              type="bar"
              height="260"
              :options="topicsChartConfig"
              :series="topicsChartSeries"
            />
          </div>
        </VCol>

        <!-- 비율 리스트 -->
        <VCol
          cols="12"
          md="6"
          lg="5"
          xl="4"
        >
          <div class="topic-progress d-flex flex-wrap gap-x-6 gap-y-10 ms-auto">
            <div
              v-for="topic in topicsData"
              :key="topic.title"
              class="d-flex gap-x-2"
            >
              <VBadge
                dot
                inline
                class="mt-1 custom-badge"
                :color="topic.color"
              />
              <div>
                <div
                  class="text-body-1"
                  style="min-inline-size: 90px;"
                >
                  {{ topic.title }}
                </div>
                <h5 class="text-h5">
                  {{ topic.value }}%
                </h5>
              </div>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
