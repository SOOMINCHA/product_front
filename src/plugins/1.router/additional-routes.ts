import type { RouteRecordRaw } from 'vue-router/auto'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/pages/index.vue'),
  },

  // ✅ 로그인 페이지 (누구나 접근 가능)
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login.vue'),
  },

  // ✅ 일반 사용자가 접근할 수 있는 페이지 (상품 페이지)
  {
    path: '/ds/product/all-prd',
    name: 'ds-product-all-prd',
    component: () => import('@/pages/ds/product/all-prd.vue'),
  },

  // ✅ 관리자 전용 페이지 (로그인 필요 & ADMIN 권한 필요)
  {
    path: '/ds/migration/migrate',
    name: 'ds-migration-migrate',
    component: () => import('@/pages/ds/migration/migrate.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/ds/migration/results',
    name: 'ds-migration-results',
    component: () => import('@/pages/ds/migration/results.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  // ❌ 접근 불가 페이지 (권한 없는 사용자가 접근 시 표시)
  {
    path: '/not-authorized',
    name: 'not-authorized',
    component: () => import('@/pages/not-authorized.vue'),
  },

  // // 🔹 기본 홈(`/`) 접속 시, 로그인 여부에 따라 리디렉트
  // {
  //   path: '/',
  //   name: 'index',
  //   redirect: to => {
  //     const token = localStorage.getItem('token')
  //     const userData = token ? JSON.parse(atob(token.split('.')[1])) : null // JWT 디코딩
  //     const isLoggedIn = !!token
  //     const userRole = userData?.role || null

  //     console.log("🔍 홈(`/`) 접속 시 리디렉트 체크:", { isLoggedIn, userRole })

  //     if (!isLoggedIn) return { name: 'ds-product-all-prd' } // ✅ 비로그인 사용자는 상품 페이지로 이동
  //     return userRole === 'ADMIN' ? { name: 'ds-migration-migrate' } : { name: 'ds-product-all-prd' }
  //   },
  // },

  // // 🔹 정의되지 않은 경로 -> 상품 페이지로 리디렉트
  // {
  //   path: '/:pathMatch(.*)*',
  //   redirect: { name: 'ds-product-all-prd' },
  // },
]
