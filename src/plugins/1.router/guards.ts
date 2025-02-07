import type { RouteNamedMap, _RouterTyped } from 'unplugin-vue-router'

export const setupGuards = (router: _RouterTyped<RouteNamedMap & { [key: string]: any }>) => {
  router.beforeEach(to => {
    if (to.meta.public)
      return

    const token = localStorage.getItem('token') || null
    const role = localStorage.getItem('role') || null

    // 로그인 여부 및 권한 확인
    const isLoggedIn = !!token
    const isAdmin = role === 'ADMIN'

    if (to.path === '/') {
      if (isAdmin)
        return
      else
        return '/product/product-list' // 일반 사용자는 리다이렉트
    }

    if (to.meta.unauthenticatedOnly) {
      if (isLoggedIn)
        return '/'
      else return undefined
    }

    // 관리자 (ADMIN)은 모든 페이지 접근 가능
    if (isAdmin)
      return

    // 비로그인 사용자는 특정 페이지만 접근 가능
    const allowedRoutesForGuests = ['product-product-list', 'login']

    if (!allowedRoutesForGuests.includes(to.name as string))
      return { name: 'not-authorized' }
  })
}
