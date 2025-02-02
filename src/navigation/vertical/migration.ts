export default [
  {
    title: '데이터 이관',
    icon: { icon: 'tabler-database-export' },
    children: [
      {
        title: '이관 실행',
        to: 'ds-migration-migrate',
      },
      {
        title: '이관 결과 보기',
        to: 'ds-migration-results',
      },
    ],
  },
]
