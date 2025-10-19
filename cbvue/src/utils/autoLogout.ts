/**
 * 自动登出管理工具
 * 实现30分钟无操作自动登出功能
 */

import { useUserStore } from '@/store/modules/user'

// 30分钟（毫秒）
const AUTO_LOGOUT_TIME = 30 * 60 * 1000

class AutoLogoutManager {
  private timer: number | null = null
  private userStore: any = null
  private lastActivityTime: number = Date.now()

  constructor() {
    this.init()
  }

  private init() {
    // 监听用户活动
    this.setupActivityListeners()
    // 延迟检查登录状态，确保store已完全初始化
    setTimeout(() => {
      this.checkLoginStatus()
    }, 500)
  }

  /**
   * 设置用户活动监听器
   */
  private setupActivityListeners() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        this.resetTimer()
      }, true)
    })
  }

  /**
   * 检查登录状态
   */
  private checkLoginStatus() {
    this.userStore = useUserStore()
    
    // 监听登录状态变化
    this.userStore.$subscribe((mutation: any, state: any) => {
      console.log('登录状态变化:', state.isLoggedIn)
      if (state.isLoggedIn) {
        // 用户登录，延迟启动计时器确保登录流程完成
        console.log('用户登录，延迟2秒启动计时器')
        setTimeout(() => {
          console.log('启动自动登出计时器')
          this.startTimer()
        }, 2000)
      } else {
        // 用户登出，清除计时器
        console.log('用户登出，清除计时器')
        this.clearTimer()
      }
    })

    // 初始检查 - 只有在用户已经登录时才启动计时器
    if (this.userStore.isLoggedIn) {
      console.log('检测到用户已登录，延迟2秒启动计时器')
      setTimeout(() => {
        console.log('启动自动登出计时器')
        this.startTimer()
      }, 2000)
    } else {
      console.log('用户未登录，不启动计时器')
    }
  }

  /**
   * 启动计时器
   */
  private startTimer() {
    console.log('启动自动登出计时器')
    this.lastActivityTime = Date.now()
    this.clearTimer()
    
    this.timer = window.setInterval(() => {
      this.checkInactivity()
    }, 60000) // 每分钟检查一次
    
    console.log('计时器已启动，将在30分钟无操作后自动登出')
  }

  /**
   * 清除计时器
   */
  private clearTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  /**
   * 重置计时器（用户有活动时调用）
   */
  private resetTimer() {
    this.lastActivityTime = Date.now()
  }

  /**
   * 检查是否超时
   */
  private checkInactivity() {
    const currentTime = Date.now()
    const inactiveTime = currentTime - this.lastActivityTime
    
    if (inactiveTime >= AUTO_LOGOUT_TIME) {
      this.autoLogout()
    }
  }

  /**
   * 自动登出
   */
  private async autoLogout() {
    try {
      console.log('检测到用户长时间无操作，自动登出')
      
      // 清除计时器
      this.clearTimer()
      
      // 执行登出
      await this.userStore.logout()
      
      // 显示提示信息
      if (typeof window !== 'undefined') {
        alert('由于长时间无操作，您已被自动登出。请重新登录。')
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('自动登出失败:', error)
    }
  }

  /**
   * 手动重置活动时间（用于特定操作）
   */
  public resetActivityTime() {
    this.resetTimer()
  }

  /**
   * 销毁管理器
   */
  public destroy() {
    this.clearTimer()
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => {
      document.removeEventListener(event, () => {
        this.resetTimer()
      }, true)
    })
  }
}

// 创建单例实例
let autoLogoutManager: AutoLogoutManager | null = null

/**
 * 初始化自动登出管理器
 */
export function initAutoLogout() {
  if (!autoLogoutManager) {
    autoLogoutManager = new AutoLogoutManager()
  }
  return autoLogoutManager
}

/**
 * 获取自动登出管理器实例
 */
export function getAutoLogoutManager() {
  return autoLogoutManager
}

/**
 * 重置活动时间（用于特定操作）
 */
export function resetAutoLogoutTimer() {
  if (autoLogoutManager) {
    autoLogoutManager.resetActivityTime()
  }
}

export default AutoLogoutManager