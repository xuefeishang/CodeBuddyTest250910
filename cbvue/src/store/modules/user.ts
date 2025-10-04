import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref({
    id: '',
    username: '',
    realName: '',
    avatar: '',
    roles: [] as string[],
    permissions: [] as string[]
  })
  const isLoggedIn = ref(!!token.value)

  // 动作
  const login = (loginData: { username: string; password: string }) => {
    // 这里应该是实际的API调用，现在我们模拟一个成功的登录
    return new Promise<void>((resolve) => {
      // 模拟API请求延迟
      setTimeout(() => {
        const mockToken = 'mock-token-' + Date.now()
        token.value = mockToken
        localStorage.setItem('token', mockToken)
        
        // 模拟用户信息
        userInfo.value = {
          id: '1',
          username: loginData.username,
          realName: '测试用户',
          avatar: 'https://placeholder.pics/svg/100/DEDEDE/555555/Avatar',
          roles: ['admin'],
          permissions: ['system:user:list', 'system:user:create', 'system:user:edit', 'system:user:delete']
        }
        
        isLoggedIn.value = true
        resolve()
      }, 1000)
    })
  }

  const logout = () => {
    // 清除用户信息
    token.value = ''
    localStorage.removeItem('token')
    userInfo.value = {
      id: '',
      username: '',
      realName: '',
      avatar: '',
      roles: [],
      permissions: []
    }
    isLoggedIn.value = false
  }

  const getUserInfo = () => {
    // 这里应该是实际的API调用，现在我们模拟获取用户信息
    return new Promise<void>((resolve) => {
      // 如果已经有token，模拟获取用户信息
      if (token.value) {
        setTimeout(() => {
          userInfo.value = {
            id: '1',
            username: 'admin',
            realName: '管理员',
            avatar: 'https://placeholder.pics/svg/100/DEDEDE/555555/Avatar',
            roles: ['admin'],
            permissions: ['system:user:list', 'system:user:create', 'system:user:edit', 'system:user:delete']
          }
          isLoggedIn.value = true
          resolve()
        }, 500)
      } else {
        resolve()
      }
    })
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