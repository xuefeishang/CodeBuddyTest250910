<template>
  <div class="app-layout">
    <!-- 顶部导航栏 -->
    <div class="app-header">
      <div class="header-left">
        <div class="logo">
          <el-icon><Setting /></el-icon>
          <span class="logo-text">华夏建龙企业级应用系统</span>
        </div>
      </div>
      <div class="header-right">
        <div class="user-info">
          <el-dropdown @command="handleCommand">
            <div class="user-avatar">
              <el-avatar :size="32" :src="userInfo?.avatar || ''">{{ userInfo?.realName?.charAt(0) || 'U' }}</el-avatar>
              <span class="user-name">{{ userInfo?.realName || '用户' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                <el-dropdown-item command="settings">系统设置</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="app-body">
      <!-- 侧边栏 -->
      <div class="app-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-toggle" @click="toggleSidebar">
          <el-icon><Expand v-if="sidebarCollapsed" /><Fold v-else /></el-icon>
        </div>
        
        <el-menu
          :default-active="activeMenu"
          :collapse="sidebarCollapsed"
          :unique-opened="true"
          router
          class="sidebar-menu"
        >
          <sidebar-item
            v-for="route in menuRoutes"
            :key="route.path"
            :item="route"
          />
        </el-menu>
      </div>

      <!-- 主内容区 -->
      <div class="app-content">
        <!-- 面包屑导航 -->
        <div class="app-breadcrumb-container">
          <breadcrumb />
        </div>
        
        <!-- 多页签 -->
        <div class="app-tags-view-container">
          <tags-view />
        </div>
        
        <!-- 页面内容 -->
        <div class="content-wrapper">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import SidebarItem from './SidebarItem.vue'
import Breadcrumb from './Breadcrumb.vue'
import TagsView from './TagsView.vue'
import router from '@/router'

const route = useRoute()
const routerInstance = useRouter()
const userStore = useUserStore()

// 侧边栏折叠状态
const sidebarCollapsed = ref(false)

// 用户信息
const userInfo = computed(() => userStore.userInfo)

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 获取菜单路由
const menuRoutes = computed(() => {
  return [
    { 
      path: '/system', 
      meta: { title: '系统管理', icon: 'Setting' }, 
      children: [
        { path: '/system/user', name: 'UserManagement', meta: { title: '用户管理', icon: 'User' } },
        { path: '/system/role', name: 'RoleManagement', meta: { title: '角色管理', icon: 'UserFilled' } },
        { path: '/system/menu', name: 'MenuManagement', meta: { title: '菜单管理', icon: 'Menu' } }
      ] 
    },
    { 
      path: '/crm', 
      meta: { title: '客户关系管理', icon: 'Service' }, 
      children: [
        { path: '/crm/customer', name: 'CustomerManagement', meta: { title: '客户管理', icon: 'Notebook' } },
        { path: '/crm/supplier', name: 'SupplierManagement', meta: { title: '供应商管理', icon: 'Shop' } },
        { path: '/crm/opportunity', name: 'OpportunityManagement', meta: { title: '商机管理', icon: 'Opportunity' } },
        { path: '/crm/contract', name: 'ContractManagement', meta: { title: '合同管理', icon: 'Document' } }
      ] 
    },
    { 
      path: '/project', 
      meta: { title: '项目管理', icon: 'Briefcase' }, 
      children: [
        { path: '/project/list', name: 'ProjectList', meta: { title: '项目列表', icon: 'List' } },
        { path: '/project/task', name: 'TaskManagement', meta: { title: '任务管理', icon: 'Tickets' } }
      ] 
    },
    { 
      path: '/production', 
      meta: { title: '生产管理', icon: 'Operation' }, 
      children: [
        { path: '/production/mineral-processing', name: 'MineralProcessing', meta: { title: '选矿管理', icon: 'Finished' } },
        { path: '/production/mining', name: 'Mining', meta: { title: '采矿管理', icon: 'SetUp' } },
        { path: '/production/tailings', name: 'Tailings', meta: { title: '尾矿管理', icon: 'SetUp' } },
        { path: '/production/quality-control', name: 'QualityControl', meta: { title: '质检管理', icon: 'SetUp' } }
      ] 
    },
    { 
      path: '/workflow', 
      meta: { title: '流程审批', icon: 'Operation' }, 
      children: [
        { path: '/workflow/approval', name: 'ApprovalCenter', meta: { title: '审批中心', icon: 'Finished' } },
        { path: '/workflow/design', name: 'ProcessDesign', meta: { title: '流程设计', icon: 'SetUp' } }
      ] 
    }
  ]
})

// 切换侧边栏
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// 处理用户下拉菜单命令
const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人资料功能开发中...')
      break
    case 'settings':
      ElMessage.info('系统设置功能开发中...')
      break
    case 'logout':
      userStore.logout()
      routerInstance.push('/login')
      break
  }
}

// 监听路由变化，更新页面标题
watch(() => route.meta.title, (title) => {
  if (title) {
    document.title = `${title} - 华夏建龙企业级应用系统`
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  
  .app-header {
    height: 60px;
    background: #fff;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    
    .header-left {
      .logo {
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: bold;
        color: #409eff;
        
        .logo-text {
          margin-left: 8px;
        }
      }
    }
    
    .header-right {
      .user-info {
        .user-avatar {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 4px;
          transition: background-color 0.3s;
          
          &:hover {
            background-color: #f5f7fa;
          }
          
          .user-name {
            margin: 0 8px;
            font-size: 14px;
          }
        }
      }
    }
  }
  
  .app-body {
    display: flex;
    flex: 1;
    overflow: hidden;
    
    .app-sidebar {
      width: 240px;
      background: #304156;
      transition: width 0.3s;
      position: relative;
      
      &.collapsed {
        width: 64px;
      }
      
      .sidebar-toggle {
        position: absolute;
        top: 10px;
        right: -15px;
        width: 30px;
        height: 30px;
        background: #409eff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        z-index: 100;
        
        &:hover {
          background: #66b1ff;
        }
      }
      
      .sidebar-menu {
        border: none;
        background: #304156;
        
        :deep(.el-menu-item) {
          color: #bfcbd9;
          
          &:hover {
            background-color: #263445 !important;
            color: #409eff;
          }
          
          &.is-active {
            background-color: #409eff !important;
            color: white;
          }
        }
        
        :deep(.el-sub-menu__title) {
          color: #bfcbd9;
          
          &:hover {
            background-color: #263445 !important;
            color: #409eff;
          }
        }
        
        :deep(.el-sub-menu .el-menu-item) {
          background-color: #1f2d3d !important;
          
          &:hover {
            background-color: #001528 !important;
            color: #409eff;
          }
          
          &.is-active {
            background-color: #409eff !important;
            color: white;
          }
        }
      }
    }
    
    .app-content {
      flex: 1;
      background: #f0f2f5;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      
      .app-breadcrumb-container {
        height: 40px;
        background: #fff;
        border-bottom: 1px solid #e6e6e6;
        padding: 0 20px;
        display: flex;
        align-items: center;
      }
      
      .app-tags-view-container {
        height: 40px;
        background: #fff;
        border-bottom: 1px solid #e6e6e6;
      }
      
      .content-wrapper {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
      }
    }
  }
}

// 响应式适配
@media (max-width: 768px) {
  .app-layout {
    .app-header {
      padding: 0 10px;
      
      .logo {
        .logo-text {
          display: none;
        }
      }
      
      .user-name {
        display: none;
      }
    }
    
    .app-sidebar {
      width: 64px;
      
      &.collapsed {
        width: 0;
      }
    }
  }
}
</style>