import { computed } from 'vue'
import migration from './migration'
import product from './product'
import { role } from '@/plugins/stores/store' // 반응형 role 가져오기

const isAdmin = computed(() => role.value === 'ADMIN')

// `navItems`를 반응형으로 유지하여 즉시 업데이트
const navItems = computed(() => (isAdmin.value ? [...product, ...migration] : [...product]))

export default navItems
