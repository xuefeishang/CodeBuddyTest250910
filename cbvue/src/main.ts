import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 导入所有Element Plus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 导入自动登出管理器
import { initAutoLogout } from '@/utils/autoLogout'

const app = createApp(App)
const pinia = createPinia()

// 注册所有Element Plus图标为全局组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 初始化自动登出管理器
const appInstance = app.mount('#app')

// 延迟初始化自动登出管理器，确保应用完全初始化
setTimeout(() => {
  console.log('初始化自动登出管理器')
  initAutoLogout()
}, 1000)