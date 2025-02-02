import type { RouteNamedMap, _RouterTyped } from 'unplugin-vue-router'

export const setupGuards = (router: _RouterTyped<RouteNamedMap & { [key: string]: any }>) => {
  router.beforeEach(to => {
    // ✅ public route는 그대로 유지
    if (to.meta.public)
      return

    // ✅ 홈 페이지(`/`)는 모든 사용자가 접근 가능하도록 예외 처리
    if (to.path === '/')
      return

    // ✅ 로컬 스토리지에서 관리자 정보 가져오기 (개별 키로 접근)
    const token = localStorage.getItem('token') || null
    const role = localStorage.getItem('role') || null

    // ✅ 로그인 여부 확인
    const isLoggedIn = !!token
    const isAdmin = role === 'ADMIN' // 관리자 여부 확인

    // ✅ 로그인 페이지 접근 제어 (비로그인 사용자만 허용)
    if (to.meta.unauthenticatedOnly) {
      if (isLoggedIn)
        return '/'
      else return undefined
    }

    // ✅ 관리자 (ADMIN)은 모든 페이지 접근 가능
    if (isAdmin)
      return

    // ✅ 비로그인 사용자는 상품 및 로그인 페이지만 접근 가능
    const allowedRoutesForGuests = ['ds-product-all-prd', 'login']

    if (!allowedRoutesForGuests.includes(to.name as string))
      return { name: 'not-authorized' } // 권한이 없는 경우 not-authorized 페이지로 이동
  })
}
