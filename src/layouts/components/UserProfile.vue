<script setup lang="ts">
import { nextTick } from 'vue'
import { role } from '@/plugins/stores/store'
import avatar1 from '@images/avatars/avatar-12.png'

const router = useRouter()

const userData = ref({
  name: '',
  role: '',
  adminId: '',
})

const loadUserData = () => {
  const storedName = localStorage.getItem('name')
  const storedRole = localStorage.getItem('role')
  const storedAdminId = localStorage.getItem('adminId')

  userData.value = {
    name: storedName || '',
    role: storedRole || '',
    adminId: storedAdminId || '',
  }
}

const logout = async () => {
  localStorage.clear()

  role.value = ''
  userData.value = { name: '', role: '', adminId: '' }

  await nextTick() // 상태 변경이 완료된 후 라우팅 실행
  router.push('/product/all-product')
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
