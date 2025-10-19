import { post, get } from './http'

// 登录请求接口
export interface LoginRequest {
  username: string
  password: string
}

// 登录响应接口
export interface LoginResponse {
  token: string
  userInfo: {
    id: string
    username: string
    realName: string
    avatar: string
    email: string
    phone: string
    roles: string[]
    permissions: string[]
  }
}

// 用户信息接口
export interface UserInfo {
  id: string
  username: string
  realName: string
  avatar: string
  email: string
  phone: string
  roles: string[]
  permissions: string[]
}

// 认证服务
export const authService = {
  // 用户登录
  async login(loginData: LoginRequest): Promise<LoginResponse> {
    const response = await post<LoginResponse>('/auth/login', loginData)
    return response
  },

  // 用户登出
  async logout(): Promise<void> {
    await post('/auth/logout')
  },

  // 获取当前用户信息
  async getCurrentUser(): Promise<UserInfo> {
    const response = await get<UserInfo>('/auth/me')
    return response
  },

  // 获取用户菜单权限
  async getUserMenus(): Promise<any[]> {
    const response = await get<any[]>('/auth/menus')
    return response
  }
}

export default authService