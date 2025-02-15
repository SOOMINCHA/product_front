<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { role } from '@/plugins/stores/store'
import avatar1 from '@images/avatars/avatar-12.png'

// ✅ Access & Refresh Token 저장 키
const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

const router = useRouter()

const userData = ref({
  name: '',
  role: '',
  adminId: '',
})

// ✅ 사용자 정보 로드 함수
const loadUserData = () => {
  const storedName = localStorage.getItem('name')
  const storedRole = localStorage.getItem('role')
  const storedAdminId = localStorage.getItem('adminId')
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)

  // ✅ Access Token이 없으면 자동 로그아웃
  if (!accessToken)
    logout()

  userData.value = {
    name: storedName || '',
    role: storedRole || '',
    adminId: storedAdminId || '',
  }
}

// ✅ 로그아웃 함수 (Access & Refresh Token 제거)
const logout = async () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem('role')
  localStorage.removeItem('adminId')
  localStorage.removeItem('name')

  role.value = ''
  userData.value = { name: '', role: '', adminId: '' }

  await nextTick() // 상태 변경이 완료된 후 라우팅 실행
  router.push('/login')
}

onMounted(() => {
  loadUserData()
})
</script>

<template>
  <div>
    <VBadge
      v-if="userData.role === 'ADMIN' && userData.name"
      dot
      location="bottom right"
      offset-x="3"
      offset-y="3"
      bordered
      color="success"
    >
      <VAvatar
        class="cursor-pointer"
        color="primary"
        variant="tonal"
      >
        <VImg :src="avatar1" />

        <!-- SECTION Menu -->
        <VMenu
          activator="parent"
          width="230"
          location="bottom end"
          offset="14px"
        >
          <VList>
            <!-- 사용자 정보 -->
            <VListItem>
              <template #prepend>
                <VListItemAction start>
                  <VBadge
                    dot
                    location="bottom right"
                    offset-x="3"
                    offset-y="3"
                    color="success"
                  >
                    <VAvatar
                      color="primary"
                      variant="tonal"
                    >
                      <VImg :src="avatar1" />
                    </VAvatar>
                  </VBadge>
                </VListItemAction>
              </template>

              <VListItemTitle class="font-weight-semibold">
                {{ userData.name }}
              </VListItemTitle>
              <VListItemSubtitle>{{ userData.role }}</VListItemSubtitle>
            </VListItem>

            <VDivider class="my-2" />

            <!-- 👉 Profile -->
            <VListItem link>
              <template #prepend>
                <VIcon
                  class="me-2"
                  icon="tabler-user"
                  size="22"
                />
              </template>

              <VListItemTitle>Profile</VListItemTitle>
            </VListItem>

            <!-- 👉 Settings -->
            <VListItem link>
              <template #prepend>
                <VIcon
                  class="me-2"
                  icon="tabler-settings"
                  size="22"
                />
              </template>

              <VListItemTitle>Settings</VListItemTitle>
            </VListItem>

            <!-- 👉 Pricing -->
            <VListItem link>
              <template #prepend>
                <VIcon
                  class="me-2"
                  icon="tabler-currency-dollar"
                  size="22"
                />
              </template>

              <VListItemTitle>Pricing</VListItemTitle>
            </VListItem>

            <!-- 👉 FAQ -->
            <VListItem link>
              <template #prepend>
                <VIcon
                  class="me-2"
                  icon="tabler-help"
                  size="22"
                />
              </template>

              <VListItemTitle>FAQ</VListItemTitle>
            </VListItem>

            <VDivider class="my-2" />

            <!-- 👉 Logout -->
            <VListItem @click="logout">
              <template #prepend>
                <VIcon
                  class="me-2"
                  icon="tabler-logout"
                  size="22"
                />
              </template>

              <VListItemTitle>Logout</VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>
      </VAvatar>
    </VBadge>

    <VBtn
      v-else
      color="primary"
      variant="plain"
      @click="router.push('/login')"
    >
      Login
    </VBtn>
  </div>
</template>
