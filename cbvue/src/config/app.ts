// 应用程序全局配置

export default {
  // 应用信息
  app: {
    name: '企业级应用系统',
    version: '1.0.0',
    icon: 'Monitor',
    description: '基于Vue3的企业级应用系统'
  },
  
  // API配置
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000,
    // API请求重试配置
    retry: {
      maxRetries: 3,
      delay: 1000
    }
  },
  
  // 布局配置
  layout: {
    // 侧边栏主题 dark | light
    sideTheme: 'dark',
    // 是否显示顶部导航
    showHeader: true,
    // 是否显示标签栏
    showTagsView: true,
    // 是否固定头部
    fixedHeader: true,
    // 是否显示侧边栏Logo
    showSidebarLogo: true,
    // 是否显示动态标题
    showDynamicTitle: true,
    // 是否显示底部信息
    showFooter: true,
    // 是否显示灰色模式
    grayMode: false,
    // 是否显示色弱模式
    weakMode: false
  },
  
  // 主题配置
  theme: {
    // 默认主题色
    primaryColor: '#409EFF',
    // 成功色
    successColor: '#67C23A',
    // 警告色
    warningColor: '#E6A23C',
    // 危险色
    dangerColor: '#F56C6C',
    // 信息色
    infoColor: '#909399'
  },
  
  // 响应式断点配置（单位：px）
  responsive: {
    xs: 576,  // 超小屏幕
    sm: 768,  // 小屏幕
    md: 992,  // 中等屏幕
    lg: 1200, // 大屏幕
    xl: 1600  // 超大屏幕
  }
}