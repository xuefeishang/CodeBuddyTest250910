<template>
  <div class="app-container" :class="{ 'mobile': isMobile }">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ 'collapsed': isCollapsed, 'mobile-sidebar': isMobile && !isCollapsed }">
      <!-- Logo区域 -->
      <div class="logo-container" @click="goHome">
        <el-icon class="logo" :size="32"><component :is="appIcon" /></el-icon>
        <h1 v-if="!isCollapsed">{{ appName }}</h1>
      </div>
      
      <!-- 菜单 -->
      <el-scrollbar>
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapsed"
          :background-color="sideTheme === 'dark' ? '#304156' : '#ffffff'"
          :text-color="sideTheme === 'dark' ? '#bfcbd9' : '#303133'"
          :active-text-color="theme.primaryColor"
          :unique-opened="true"
          :collapse-transition="false"
          router
          class="sidebar-menu"
        >
          <!-- 动态菜单项 -->
          <sidebar-item 
            v-for="route in routes" 
            :key="route.path" 
            :item="route" 
            :base-path="route.path"
          />
        </el-menu>
      </el-scrollbar>
      
      <!-- 全屏按钮保留 -->
      <div class="sidebar-footer" v-if="!isCollapsed">
        <el-tooltip content="全屏" placement="right">
          <div class="footer-item" @click="toggleFullScreen">
            <el-icon><FullScreen v-if="!isFullscreen" /><Aim v-else /></el-icon>
          </div>
        </el-tooltip>
      </div>
    </div>
    
    <!-- 主内容区 -->
    <div class="main-container">
      <!-- 头部 -->
      <div class="header" v-if="showHeader">
        <div class="header-left">
          <div class="collapse-btn" @click="toggleSidebar">
            <el-icon><Fold v-if="!isCollapsed" /><Expand v-else /></el-icon>
          </div>
          <breadcrumb />
        </div>
        <div class="header-right">
          <el-dropdown trigger="click">
            <div class="avatar-container">
              <img :src="userInfo.avatar" alt="Avatar" class="avatar" />
              <span class="username" v-if="!isMobile">{{ userInfo.realName }}</span>
              <el-icon><CaretBottom /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item @click="openThemeSettings">主题设置</el-dropdown-item>
                <el-dropdown-item @click="openDocs">文档管理</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      
      <!-- 标签栏 -->
      <!-- 标签视图容器 - 根据showTagsView配置决定是否显示 -->
      <div class="tags-view" v-if="showTagsView">
        <!-- 标签视图组件 -->
        <tags-view />
      </div>
      
      <!-- 内容区 -->
      <div class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
      
      <!-- 页脚 -->
      <div class="footer" v-if="showFooter">
        <p>© {{ new Date().getFullYear() }} {{ appName }} - 版权所有</p>
      </div>
    </div>
    
    <!-- 移动端遮罩层 -->
    <div 
      v-if="isMobile && !isCollapsed" 
      class="sidebar-overlay" 
      @click="closeSidebar"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import appConfig from '@/config/app'
import { 
  Fold, Expand, CaretBottom, Monitor, HomeFilled, 
  Setting, FullScreen, Aim, Document
} from '@element-plus/icons-vue'
import SidebarItem from './SidebarItem.vue'
import Breadcrumb from './Breadcrumb.vue'
import TagsView from './TagsView.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 获取用户信息
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

// 路由信息
const route = useRoute()
const router = useRouter()
const routes = computed(() => {
  // 获取完整的路由树
  const allRoutes = router.options.routes || []
  
  // 过滤出需要在侧边栏显示的路由
  return allRoutes.filter((route: any) => {
    const meta = route.meta || {}
    // 不显示隐藏的路由和登录页
    return !meta.hidden && route.path !== '/login' && route.name !== 'NotFound'
  })
})
const activeMenu = computed(() => {
  // 如果当前路由设置了activeMenu，则使用它
  if (route.meta.activeMenu) {
    return route.meta.activeMenu
  }
  return route.path
})

// 应用配置
const { app, layout, theme } = appConfig
const appName = app.name
const appIcon = app.icon
const { sideTheme, showHeader, showTagsView, showFooter } = layout

// 侧边栏状态
const isCollapsed = ref(false)
const isMobile = ref(false)
const isFullscreen = ref(false)
const themeDrawerVisible = ref(false)

// 切换侧边栏
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  // 保存用户偏好
  localStorage.setItem('sidebarStatus', isCollapsed.value ? '1' : '0')
}

// 关闭侧边栏（移动端）
const closeSidebar = () => {
  isCollapsed.value = true
}

// 跳转到首页
const goHome = () => {
  router.push('/')
}

// 处理链接点击
const handleLink = (to: string) => {
  if (/^(https?:|mailto:|tel:)/.test(to)) {
    // 外部链接
    window.open(to, '_blank')
  } else {
    // 内部路由
    router.push(to)
  }
}

// 切换全屏
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      isFullscreen.value = true
    })
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        isFullscreen.value = false
      })
    }
  }
}

// 打开主题设置
const openThemeSettings = () => {
  ElMessageBox.alert('主题设置功能正在开发中', '提示', {
    confirmButtonText: '确定',
    callback: () => {
      ElMessage({
        type: 'info',
        message: '敬请期待!'
      })
    }
  })
}

// 打开文档
const openDocs = () => {
  window.open('https://docs.example.com', '_blank')
}

// 退出登录
const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

// 监听窗口大小变化
const checkIsMobile = () => {
  const width = window.innerWidth
  isMobile.value = width < appConfig.responsive.md
  
  // 在移动端默认折叠侧边栏
  if (isMobile.value) {
    isCollapsed.value = true
  }
}

// 监听路由变化，在移动端自动关闭侧边栏
watch(() => route.path, () => {
  if (isMobile.value) {
    isCollapsed.value = true
  }
})

// 组件挂载时添加窗口大小变化监听
onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
})

// 组件卸载前移除监听
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkIsMobile)
})
</script>

<style scoped lang="scss">
.app-container {
  display: flex;
  height: 100vh;
  width: 100%;
  
  // 侧边栏
  .sidebar {
    width: 250px;
    height: 100%;
    background-color: v-bind('sideTheme === "dark" ? "#304156" : "#ffffff"');
    transition: width 0.3s;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    z-index: 1000;
    overflow-y: auto;
    overflow-x: hidden;
    
    &.collapsed {
      width: 64px;
    }
    
    // 移动端侧边栏
    &.mobile-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
    }
    
    // Logo容器
    .logo-container {
      height: 60px;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: v-bind('sideTheme === "dark" ? "#263445" : "#f0f2f5"');
      overflow: hidden;
      
      .logo {
        width: 32px;
        height: 32px;
        margin-right: 10px;
      }
      
      h1 {
        color: v-bind('sideTheme === "dark" ? "#ffffff" : "#303133"');
        font-size: 18px;
        font-weight: 600;
        margin: 0;
        white-space: nowrap;
      }
    }
    
    // 菜单
    .sidebar-menu {
      border-right: none;
      height: calc(100% - 120px);
    }
    

  }
  
  // 主内容区
  .main-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    
    // 头部
    .header {
      height: 60px;
      background-color: #ffffff;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px;
      
      .header-left {
        display: flex;
        align-items: center;
        
        .collapse-btn {
          font-size: 20px;
          cursor: pointer;
          margin-right: 15px;
          
          &:hover {
            color: v-bind('theme.primaryColor');
          }
        }
      }
      
      .header-right {
        display: flex;
        align-items: center;
        
        .avatar-container {
          display: flex;
          align-items: center;
          cursor: pointer;
          
          .avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            margin-right: 8px;
          }
          
          .username {
            font-size: 14px;
            margin-right: 5px;
          }
        }
      }
    }
    
    // 标签栏
    .tags-view {
      height: 40px;
      background-color: #ffffff;
      border-bottom: 1px solid #d8dce5;
    }
    
    // 内容区
    .app-main {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      background-color: #f0f2f5;
    }
    
    // 页脚
    .footer {
      height: 40px;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
      font-size: 14px;
      border-top: 1px solid #e8e8e8;
    }
  }
  
  // 移动端遮罩层
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
}

// 移动端样式
.mobile {
  .main-container {
    margin-left: 0;
  }
}

// 过渡动画
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>