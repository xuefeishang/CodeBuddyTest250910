import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService, type LoginRequest, type UserInfo } from '@/services/auth'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo>({
    id: '',
    username: '',
    realName: '',
    avatar: '',
    email: '',
    phone: '',
    roles: [] as string[],
    permissions: [] as string[]
  })
  const isLoggedIn = ref(!!token.value)

  // 动作
  const login = async (loginData: LoginRequest) => {
    try {
      const response = await authService.login(loginData)
      token.value = response.token
      localStorage.setItem('token', response.token)
      userInfo.value = response.userInfo
      isLoggedIn.value = true
      

    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      // 清除用户信息
      token.value = ''
      localStorage.removeItem('token')
      userInfo.value = {
        id: '',
        username: '',
        realName: '',
        avatar: '',
        email: '',
        phone: '',
        roles: [],
        permissions: []
      }
      isLoggedIn.value = false
    }
  }

  const getUserInfo = async () => {
    if (token.value) {
      try {
        const response = await authService.getCurrentUser()
        userInfo.value = response
        isLoggedIn.value = true
      } catch (error) {
        console.error('获取用户信息失败:', error)
        // 如果获取用户信息失败，清除token
        logout()
        throw error
      }
    }
  }

  // 检查是否有某个权限
  const hasPermission = (permission: string) => {
    return userInfo.value.permissions.includes(permission)
  }

  // 检查是否有某个角色
  const hasRole = (role: string) => {
    return userInfo.value.roles.includes(role)
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    logout,
    getUserInfo,
    hasPermission,
    hasRole
  }
})