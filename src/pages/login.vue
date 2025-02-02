<script setup lang="ts">
import axios from 'axios'
import { role } from '@/plugins/stores/store'
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg?raw'
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg?raw'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

const form = ref({
  adminId: 'admin',
  password: 'password',
  remember: false,
})

const isPasswordVisible = ref(false)
const router = useRouter()

// 로그인 API 요청
// 로그인 API 요청
const login = async () => {
  try {
    console.log('로그인 요청 데이터:', {
      adminId: form.value.adminId,
      password: form.value.password,
    })

    const response = await axios.post('http://localhost:8081/api/products/admin/login', {
      adminId: form.value.adminId,
      password: form.value.password,
    })

    console.log('API 응답:', response.data) // 응답 확인

    // ✅ 응답에서 사용자 정보 추출
    const token = response.data.token
    const userRole = response.data.role
    const adminId = response.data.adminId
    const name = response.data.name || ''

    // ✅ 1. localStorage에 저장
    localStorage.setItem('jwt', token)
    localStorage.setItem('role', userRole)
    localStorage.setItem('adminId', adminId)
    localStorage.setItem('name', name)

    // ✅ 2. Vue 반응형 상태 즉시 업데이트 (새로고침 없이 네비게이션 변경)
    role.value = userRole // ✅ role을 즉시 변경하여 UI 반영

    // ✅ 3. 관리자 페이지로 리디렉션
    if (userRole === 'ADMIN')
      router.push('/ds/product/all-prd')
    else
      alert('You are not authorized to access admin pages.')
  }
  catch (error) {
    console.error('로그인 오류:', error.response ? error.response.data : error.message)
    alert('Login failed. Please check your credentials.')
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-wrapper d-flex align-center justify-center pa-4">
      <div class="position-relative my-sm-16">
        <!-- 👉 Top shape -->
        <VNodeRenderer
          :nodes="h('div', { innerHTML: authV1TopShape })"
          class="text-primary auth-v1-top-shape d-none d-sm-block"
        />

        <!-- 👉 Bottom shape -->
        <VNodeRenderer
          :nodes="h('div', { innerHTML: authV1BottomShape })"
          class="text-primary auth-v1-bottom-shape d-none d-sm-block"
        />

        <!-- 👉 Auth Card -->
        <VCard
          class="auth-card"
          max-width="460"
          :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
        >
          <VCardItem class="justify-center">
            <VCardTitle>
              <RouterLink to="/">
                <div class="app-logo">
                  <VNodeRenderer :nodes="themeConfig.app.logo" />
                  <h1 class="app-logo-title">
                    {{ themeConfig.app.title }}
                  </h1>
                </div>
              </RouterLink>
            </VCardTitle>
          </VCardItem>

          <VCardText>
            <h4 class="text-h4 mb-1">
              Welcome to <span class="text-capitalize">{{ themeConfig.app.title }}</span>! 👋🏻
            </h4>
            <p class="mb-0">
              Please sign-in to your account and start the adventure
            </p>
          </VCardText>

          <VCardText>
            <VForm @submit.prevent="login">
              <VRow>
                <!-- email -->
                <VCol cols="12">
                  <AppTextField
                    v-model="form.adminId"
                    autofocus
                    label="Admin ID"
                    type="email"
                    placeholder="아이디를 입력해 주세요."
                  />
                </VCol>

                <!-- password -->
                <VCol cols="12">
                  <AppTextField
                    v-model="form.password"
                    label="Password"
                    placeholder="············"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  />

                  <!-- remember me checkbox -->
                  <div class="d-flex align-center justify-space-between flex-wrap my-6">
                    <VCheckbox
                      v-model="form.remember"
                      label="Remember me"
                    />
                  </div>

                  <!-- login button -->
                  <VBtn
                    block
                    type="submit"
                  >
                    Login
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
