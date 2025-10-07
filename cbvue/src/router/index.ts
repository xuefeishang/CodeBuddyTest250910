import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 系统管理路由
const systemRoutes: RouteRecordRaw[] = [
  {
    path: '/system',
    name: 'System',
    component: () => import('@/views/system/Index.vue'),
    meta: { title: '系统管理', icon: 'Setting' },
    children: [
      {
        path: 'user',
        name: 'UserManagement',
        component: () => import('@/views/system/user/Index.vue'),
        meta: { title: '用户管理', icon: 'User' }
      },
      {
        path: 'role',
        name: 'RoleManagement',
        component: () => import('@/views/system/role/Index.vue'),
        meta: { title: '角色管理', icon: 'UserFilled' }
      },
      {
        path: 'menu',
        name: 'MenuManagement',
        component: () => import('@/views/system/menu/Index.vue'),
        meta: { title: '菜单管理', icon: 'Menu' }
      }
    ]
  }
]

// CRM路由
const crmRoutes: RouteRecordRaw[] = [
  {
    path: '/crm',
    name: 'CRM',
    component: () => import('@/views/crm/Index.vue'),
    meta: { title: '客户关系管理', icon: 'Service' },
    children: [
      {
        path: 'customer',
        name: 'CustomerManagement',
        component: () => import('@/views/crm/customer/Index.vue'),
        meta: { title: '客户管理', icon: 'Notebook' }
      },
      {
        path: 'supplier',
        name: 'SupplierManagement',
        component: () => import('@/views/crm/supplier/Index.vue'),
        meta: { title: '供应商管理', icon: 'Shop' }
      },
      {
        path: 'opportunity',
        name: 'OpportunityManagement',
        component: () => import('@/views/crm/opportunity/Index.vue'),
        meta: { title: '商机管理', icon: 'Opportunity' }
      },
      {
        path: 'contract',
        name: 'ContractManagement',
        component: () => import('@/views/crm/contract/Index.vue'),
        meta: { title: '合同管理', icon: 'Document' }
      }
    ]
  }
]

// 项目管理路由
const projectRoutes: RouteRecordRaw[] = [
  {
    path: '/project',
    name: 'Project',
    component: () => import('@/views/project/Index.vue'),
    meta: { title: '项目管理', icon: 'Briefcase' },
    children: [
      {
        path: 'list',
        name: 'ProjectList',
        component: () => import('@/views/project/list/Index.vue'),
        meta: { title: '项目列表', icon: 'List' }
      },
      {
        path: 'task',
        name: 'TaskManagement',
        component: () => import('@/views/project/task/Index.vue'),
        meta: { title: '任务管理', icon: 'Tickets' }
      }
    ]
  }
]

// 生产管理路由
const productionRoutes: RouteRecordRaw[] = [
  {
    path: '/production',
    name: 'Production',
    component: () => import('@/views/production/Index.vue'),
    meta: { title: '生产管理', icon: 'Operation' },
    children: [
      {
        path: 'mineral-processing',
        name: 'MineralProcessing',
        component: () => import('@/views/production/mineral-processing/Index.vue'),
        meta: { title: '选矿管理', icon: 'Finished' }
      },
      {
        path: 'mining',
        name: 'Mining',
        component: () => import('@/views/production/mining/Index.vue'),
        meta: { title: '采矿管理', icon: 'SetUp' }
      },
      {
        path: 'tailings',
        name: 'Tailings',
        component: () => import('@/views/production/tailings/Index.vue'),
        meta: { title: '尾矿管理', icon: 'SetUp' }
      },
      {
        path: 'quality-control',
        name: 'QualityControl',
        component: () => import('@/views/production/quality-control/Index.vue'),
        meta: { title: '质检管理', icon: 'SetUp' }
      }
    ]
  }
]

// 工作流路由
const workflowRoutes: RouteRecordRaw[] = [
  {
    path: '/workflow',
    name: 'Workflow',
    component: () => import('@/views/workflow/Index.vue'),
    meta: { title: '流程审批', icon: 'Operation' },
    children: [
      {
        path: 'approval',
        name: 'ApprovalCenter',
        component: () => import('@/views/workflow/approval/Index.vue'),
        meta: { title: '审批中心', icon: 'Finished' }
      },
      {
        path: 'design',
        name: 'ProcessDesign',
        component: () => import('@/views/workflow/design/Index.vue'),
        meta: { title: '流程设计', icon: 'SetUp' }
      }
    ]
  }
]

// 基础路由
const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页', icon: 'HomeFilled' },
    children: []
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  }
]

// 404 错误路由 - 必须放在最后
const notFoundRoutes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '页面未找到' }
  }
]

// 合并所有路由 - 注意：通配符路由必须放在最后
const routes: RouteRecordRaw[] = [
  ...baseRoutes,
  ...systemRoutes,
  ...crmRoutes,
  ...projectRoutes,
  ...productionRoutes,
  ...workflowRoutes,
  ...notFoundRoutes  // 通配符路由放在最后，确保其他路由优先匹配
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title as string || '华夏建龙企业级应用'} - 华夏建龙企业级应用系统`
  
  // 这里可以添加登录验证、权限验证等逻辑
  // 例如：检查是否登录
  const isAuthenticated = localStorage.getItem('token')
  
  if (to.name !== 'Login' && !isAuthenticated) {
    // 如果未登录且访问的不是登录页，则重定向到登录页
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router