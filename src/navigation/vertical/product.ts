export default [
  {
    title: '상품관리',
    icon: { icon: 'tabler-shopping-cart' },
    children: [
      {
        title: '전체상품관리',
        to: 'ds-product-all-prd',
      },
      {
        title: '위해상품관리',
        to: 'ds-product-haz-prd',
      },
      {
        title: '비위해상품관리',
        to: 'ds-product-nonhaz-prd',
      },
    ],
  },
]
