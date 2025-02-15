<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api/axios-instance'
import { API_ENDPOINTS } from '@/api/endpoint'
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

// Access & Refresh Token 저장 키
const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

// 로그인
const login = async () => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      adminId: form.value.adminId,
      password: form.value.password,
    })

    const accessToken: string = response.data.accessToken
    const refreshToken: string = response.data.refreshToken
    const userRole: string = response.data.role
    const adminId: string = response.data.adminId
    const name: string = response.data.name || ''

    // 토큰 저장
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    localStorage.setItem('role', userRole)
    localStorage.setItem('adminId', adminId)
    localStorage.setItem('name', name)

    role.value = userRole

    // 관리자 페이지로 리디렉션
    if (userRole === 'ADMIN')
      router.push('/')
    else
      alert('관리자 페이지에 접근할 수 있는 권한이 없습니다.')
  }
  catch (error: any) {
    console.error('로그인 오류:', error.response ? error.response.data : error.message)
    alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.')
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-wrapper d-flex align-center justify-center pa-4">
      <div class="position-relative my-sm-16">
        <VNodeRenderer
          :nodes="h('div', { innerHTML: authV1TopShape })"
          class="text-primary auth-v1-top-shape d-none d-sm-block"
        />
        <VNodeRenderer
          :nodes="h('div', { innerHTML: authV1BottomShape })"
          class="text-primary auth-v1-bottom-shape d-none d-sm-block"
        />

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
                <VCol cols="12">
                  <AppTextField
                    v-model="form.adminId"
                    autofocus
                    label="Admin ID"
                    placeholder="아이디를 입력해 주세요."
                  />
                </VCol>

                <VCol cols="12">
                  <AppTextField
                    v-model="form.password"
                    label="Password"
                    placeholder="············"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  />
                  <div class="d-flex align-center justify-space-between flex-wrap my-6">
                    <VCheckbox
                      v-model="form.remember"
                      label="Remember me"
                    />
                  </div>
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
