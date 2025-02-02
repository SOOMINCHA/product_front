<script setup lang="ts">
import ProductTable from './index.vue'

const productsData = [
  { productName: 'Non-Hazardous Product 1', productBrand: 'Brand E', category: 'Office', stock: true, status: 'Scheduled', id: 5 },
  { productName: 'Non-Hazardous Product 2', productBrand: 'Brand F', category: 'Shoes', stock: false, status: 'Published', id: 6 },
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
