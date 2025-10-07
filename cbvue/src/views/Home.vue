<template>
  <div class="home-container">
    <!-- 欢迎信息 -->
    <el-card class="welcome-card">
      <template #header>
        <div class="welcome-header">
          <el-avatar :size="64" :src="userInfo.avatar" />
          <div class="welcome-info">
            <h2>欢迎回来，{{ userInfo.realName }}</h2>
            <p>今天是 {{ currentDate }}，祝您工作愉快！</p>
          </div>
        </div>
      </template>
      <div class="quick-stats">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="6">
            <div class="stat-item">
              <el-icon class="stat-icon"><Document /></el-icon>
              <div class="stat-content">
                <div class="stat-value">28</div>
                <div class="stat-label">待处理任务</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <div class="stat-item">
              <el-icon class="stat-icon"><Bell /></el-icon>
              <div class="stat-content">
                <div class="stat-value">12</div>
                <div class="stat-label">未读消息</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <div class="stat-item">
              <el-icon class="stat-icon"><Calendar /></el-icon>
              <div class="stat-content">
                <div class="stat-value">5</div>
                <div class="stat-label">今日会议</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <div class="stat-item">
              <el-icon class="stat-icon"><Finished /></el-icon>
              <div class="stat-content">
                <div class="stat-value">85%</div>
                <div class="stat-label">项目进度</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 内容区域 -->
    <el-row :gutter="20" class="dashboard-content">
      <!-- 左侧内容 -->
      <el-col :xs="24" :lg="16">
        <!-- 待办任务 -->
        <el-card class="dashboard-card">
          <template #header>
            <div class="card-header">
              <h3>待办任务</h3>
              <el-button type="primary" size="small" plain>查看全部</el-button>
            </div>
          </template>
          <el-table :data="todoList" style="width: 100%" :max-height="300">
            <el-table-column prop="title" label="任务名称" min-width="180" />
            <el-table-column prop="priority" label="优先级" width="100">
              <template #default="scope">
                <template v-if="scope?.row">
                  <el-tag v-if="scope.row.priority" :type="getPriorityType(scope.row.priority)">
                    {{ scope.row.priority }}
                  </el-tag>
                  <span v-else>-</span>
                </template>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="deadline" label="截止日期" width="120" />
            <el-table-column label="操作" width="120">
              <template #default>
                <el-button link type="primary" size="small">处理</el-button>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 项目进度 -->
        <el-card class="dashboard-card">
          <template #header>
            <div class="card-header">
              <h3>项目进度</h3>
              <el-button type="primary" size="small" plain>查看详情</el-button>
            </div>
          </template>
          <div class="project-progress">
            <div v-for="(project, index) in projectList" :key="index" class="project-item">
              <div class="project-info">
                <h4>{{ project.name }}</h4>
                <span>{{ project.progress }}%</span>
              </div>
              <el-progress :percentage="project.progress" :status="getProgressStatus(project.progress)" />
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧内容 -->
      <el-col :xs="24" :lg="8">
        <!-- 通知公告 -->
        <el-card class="dashboard-card">
          <template #header>
            <div class="card-header">
              <h3>通知公告</h3>
              <el-button type="primary" size="small" plain>更多</el-button>
            </div>
          </template>
          <div class="notice-list">
            <div v-for="(notice, index) in noticeList" :key="index" class="notice-item">
              <div class="notice-title">{{ notice.title }}</div>
              <div class="notice-time">{{ notice.time }}</div>
            </div>
          </div>
        </el-card>

        <!-- 快捷入口 -->
        <el-card class="dashboard-card">
          <template #header>
            <div class="card-header">
              <h3>快捷入口</h3>
            </div>
          </template>
          <div class="shortcut-list">
            <el-row :gutter="20">
              <el-col :span="8" v-for="(shortcut, index) in shortcutList" :key="index">
                <div class="shortcut-item" @click="navigateTo(shortcut.path)">
                  <el-icon class="shortcut-icon"><component :is="shortcut.icon" /></el-icon>
                  <div class="shortcut-name">{{ shortcut.name }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { Document, Bell, Calendar, Finished, User, Setting, Tickets, Operation, List, Message } from '@element-plus/icons-vue'
import { 
  ElProgress,
  ElTable,
  ElTableColumn,
  ElTag,
  ElButton,
  ElCard,
  ElRow,
  ElCol,
  ElIcon,
  ElAvatar
} from 'element-plus'

// 路由
const router = useRouter()

// 用户信息
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

// 当前日期
const currentDate = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
})

// 待办任务列表
const todoList = ref([
  { title: '完成项目需求文档', priority: '高', deadline: '2025-09-15' },
  { title: '客户需求沟通会议', priority: '中', deadline: '2025-09-12' },
  { title: '系统测试报告审核', priority: '中', deadline: '2025-09-18' },
  { title: '项目周报提交', priority: '低', deadline: '2025-09-11' },
  { title: '团队建设活动策划', priority: '低', deadline: '2025-09-20' }
])

// 项目进度列表
const projectList = ref([
  { name: '企业官网改版', progress: 75 },
  { name: '移动端APP开发', progress: 45 },
  { name: '数据分析平台', progress: 90 },
  { name: '客户管理系统升级', progress: 30 }
])

// 通知公告列表
const noticeList = ref([
  { title: '关于系统升级维护的通知', time: '2025-09-10 10:30' },
  { title: '第三季度工作总结会议安排', time: '2025-09-09 16:45' },
  { title: '新版本功能发布说明', time: '2025-09-08 09:15' },
  { title: '企业文化建设活动通知', time: '2025-09-07 14:20' }
])

// 快捷入口列表
const shortcutList = ref([
  { name: '用户管理', icon: 'User', path: '/system/user' },
  { name: '角色管理', icon: 'Setting', path: '/system/role' },
  { name: '客户管理', icon: 'List', path: '/crm/customer' },
  { name: '项目管理', icon: 'Tickets', path: '/project/list' },
  { name: '流程审批', icon: 'Operation', path: '/workflow/approval' },
  { name: '消息中心', icon: 'Message', path: '/message' }
])

// 获取优先级对应的标签类型
const getPriorityType = (priority: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  switch (priority) {
    case '高':
      return 'danger'
    case '中':
      return 'warning'
    case '低':
      return 'info'
    default:
      return 'info'
  }
}

// 获取进度对应的状态
const getProgressStatus = (progress: number) => {
  if (progress < 30) return 'exception'
  if (progress < 70) return ''
  return 'success'
}

// 导航到指定路径
const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped lang="scss">
.home-container {
  padding: 20px;
  
  .welcome-card {
    margin-bottom: 20px;
    
    .welcome-header {
      display: flex;
      align-items: center;
      
      .welcome-info {
        margin-left: 20px;
        
        h2 {
          margin: 0 0 5px 0;
          font-size: 20px;
        }
        
        p {
          margin: 0;
          color: #666;
        }
      }
    }
    
    .quick-stats {
      margin-top: 20px;
      
      .stat-item {
        display: flex;
        align-items: center;
        padding: 15px;
        background-color: #f8f9fa;
        border-radius: 4px;
        margin-bottom: 15px;
        
        .stat-icon {
          font-size: 32px;
          margin-right: 15px;
          color: #409EFF;
        }
        
        .stat-content {
          .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }
          
          .stat-label {
            font-size: 14px;
            color: #666;
          }
        }
      }
    }
  }
  
  .dashboard-content {
    .dashboard-card {
      margin-bottom: 20px;
      
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        h3 {
          margin: 0;
          font-size: 16px;
        }
      }
      
      .project-progress {
        .project-item {
          margin-bottom: 15px;
          
          .project-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            
            h4 {
              margin: 0;
              font-size: 14px;
            }
          }
        }
      }
      
      .notice-list {
        .notice-item {
          padding: 10px 0;
          border-bottom: 1px solid #eee;
          
          &:last-child {
            border-bottom: none;
          }
          
          .notice-title {
            font-size: 14px;
            margin-bottom: 5px;
          }
          
          .notice-time {
            font-size: 12px;
            color: #999;
          }
        }
      }
      
      .shortcut-list {
        .shortcut-item {
          text-align: center;
          padding: 15px 0;
          cursor: pointer;
          
          &:hover {
            background-color: #f5f7fa;
          }
          
          .shortcut-icon {
            font-size: 24px;
            color: #409EFF;
            margin-bottom: 8px;
          }
          
          .shortcut-name {
            font-size: 14px;
          }
        }
      }
    }
  }
}

// 响应式适配
@media (max-width: 768px) {
  .home-container {
    padding: 10px;
    
    .welcome-card {
      .welcome-header {
        flex-direction: column;
        text-align: center;
        
        .welcome-info {
          margin-left: 0;
          margin-top: 15px;
        }
      }
    }
  }
}
</style>