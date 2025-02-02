<script setup lang="ts">
import ProductTable from './index.vue'

const productsData = [
  { productName: 'Hazardous Product 1', productBrand: 'Brand C', category: 'Electronics', stock: true, status: 'Published', id: 3 },
  { productName: 'Hazardous Product 2', productBrand: 'Brand D', category: 'Games', stock: false, status: 'Inactive', id: 4 },
]

const headers = [
  { title: 'Product', key: 'product' },
  { title: 'Category', key: 'category' },
  { title: 'Stock', key: 'stock', sortable: false },
  { title: 'SKU', key: 'sku' },
  { title: 'Price', key: 'price' },
  { title: 'QTY', key: 'qty' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false },
]
</script>

<template>
  <ProductTable
    :products-data="productsData"
    :headers="headers"
  />
</template>
