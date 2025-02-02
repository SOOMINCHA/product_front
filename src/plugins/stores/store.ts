import { ref, watchEffect } from 'vue'

// ✅ `role`을 반응형으로 선언하여 전역 상태로 관리
export const role = ref(localStorage.getItem('role') || '')

// ✅ `role` 변경 시 `localStorage`도 동기화
watchEffect(() => {
  if (role.value)
    localStorage.setItem('role', role.value)
  else
    localStorage.removeItem('role')
})
