<script setup lang="ts">
import AllProductRatio from '@/pages/home/AllProductRatio.vue'
import HazProductCategoryRatio from '@/pages/home/HazProductCategoryRatio.vue'
import MonthlyMigrationStats from '@/pages/home/MonthlyMigrationStats.vue'

import TransferDashboard from '@/pages/home/TransferDashboard.vue'
</script>

<template>
  <VRow class="match-height">
    <VCol cols="12">
      <TransferDashboard />
    </VCol>

    <VCol
      cols="12"
      lg="6"
      md="6"
      sm="12"
    >
      <AllProductRatio />
    </VCol>
    <VCol
      cols="12"
      lg="6"
      md="6"
      sm="12"
    >
      <MonthlyMigrationStats />
    </VCol>

    <VCol cols="12">
      <HazProductCategoryRatio />
    </VCol>
  </VRow>
</template>
