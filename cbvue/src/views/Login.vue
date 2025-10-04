<!-- 登录页面模板 -->
<template>
  <!-- 登录页面容器 -->
  <div class="login-container">
    <!-- 登录框 -->
    <div class="login-box">
      <!-- 登录头部区域 -->
      <div class="login-header">
        <!-- 应用logo -->
        <el-icon :size="60" class="logo"><Monitor /></el-icon>
        <!-- 应用标题 -->
        <h2>华夏建龙企业级应用系统</h2>
      </div>
      
      <!-- 登录表单 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
        <!-- 用户名输入框 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            prefix-icon="User"
            size="large"
            clearable
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <!-- 密码输入框 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="密码"
            prefix-icon="Lock"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <!-- 记住我和忘记密码 -->
        <el-form-item>
          <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
          <el-link type="primary" class="forget-pwd" @click="showResetDialog">忘记密码?</el-link>
        </el-form-item>
        
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            size="large"
            class="login-button"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
      
      <!-- 密码重置对话框 -->
      <el-dialog v-model="resetDialogVisible" title="密码重置" width="500px">
        <el-form :model="resetForm">
          <el-form-item label="重置方式">
            <el-radio-group v-model="resetMethod">
              <el-radio label="sms">短信验证</el-radio>
              <el-radio label="email">邮箱验证</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="用户名">
            <el-input v-model="resetForm.username" placeholder="请输入用户名" />
          </el-form-item>
          
          <el-form-item v-if="resetMethod === 'email'" label="邮箱">
            <el-input v-model="resetForm.email" placeholder="请输入邮箱" />
          </el-form-item>
          
          <el-form-item v-if="resetMethod === 'sms'" label="手机号">
            <el-input v-model="resetForm.phone" placeholder="请输入手机号" />
          </el-form-item>
          
          <el-form-item label="验证码">
            <div class="code-input">
              <el-input v-model="resetForm.code" placeholder="请输入验证码" />
              <el-button type="primary" @click="sendCode">获取验证码</el-button>
            </div>
          </el-form-item>
          
          <el-form-item label="新密码">
            <el-input v-model="resetForm.newPassword" type="password" placeholder="请输入新密码" />
          </el-form-item>
          
          <el-form-item label="确认密码">
            <el-input v-model="resetForm.confirmPassword" type="password" placeholder="请确认新密码" />
          </el-form-item>
        </el-form>
        
        <template #footer>
          <el-button @click="resetDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitReset">确认重置</el-button>
        </template>
      </el-dialog>
      
      <!-- 登录页脚 -->
      <div class="login-footer">
        <p>© {{ new Date().getFullYear() }} 企业级应用系统 - 商雪飞版权所有</p>
      </div>
    </div>
  </div>
</template>

<!-- 脚本部分 -->
<script setup lang="ts">
// 导入Vue相关API
import { ref, reactive } from 'vue'
// 导入路由相关
import { useRouter } from 'vue-router'
// 导入Element Plus组件
import { ElMessage, FormInstance, ElDialog } from 'element-plus'
// 导入Element Plus图标
import { User, Lock, Monitor } from '@element-plus/icons-vue'
// 导入用户状态管理
import { useUserStore } from '@/store/modules/user'

// 获取路由实例
const router = useRouter()

// 获取用户状态存储实例
const userStore = useUserStore()

// 登录表单引用
const loginFormRef = ref<FormInstance>()

// 登录按钮加载状态
const loading = ref(false)

// 登录表单数据
const loginForm = reactive({
  username: 'admin',
  password: '123456',
  rememberMe: false
})

// 登录表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应为3-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度应为6-20个字符', trigger: 'blur' }
  ]
}

/**
 * 处理登录逻辑
 */
// 密码重置对话框显示状态
const resetDialogVisible = ref(false)
// 重置方式 (sms/email)
const resetMethod = ref('sms')
// 重置表单数据
const resetForm = reactive({
  username: '',
  email: '',
  phone: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
})

// 重置表单引用
const resetFormRef = ref<FormInstance>()

// 显示密码重置对话框
const showResetDialog = () => {
  resetDialogVisible.value = true
  resetForm.username = loginForm.username || ''
}

// 发送验证码
const sendCode = async () => {
  try {
    // 验证手机号或邮箱
    if (resetMethod.value === 'sms' && !resetForm.phone) {
      ElMessage.warning('请输入手机号')
      return
    }
    if (resetMethod.value === 'email' && !resetForm.email) {
      ElMessage.warning('请输入邮箱')
      return
    }
    
    // 这里调用发送验证码API
    // await userStore.sendResetCode({
    //   method: resetMethod.value,
    //   phone: resetForm.phone,
    //   email: resetForm.email
    // })
    
    ElMessage.success('验证码已发送')
  } catch (error) {
    ElMessage.error('发送验证码失败')
  }
}

// 提交密码重置
const submitReset = async () => {
  try {
    // 验证表单
    await resetFormRef.value?.validate()
    
    // 这里调用密码重置API
    // await userStore.resetPassword({
    //   username: resetForm.username,
    //   method: resetMethod.value,
    //   code: resetForm.code,
    //   newPassword: resetForm.newPassword,
    //   phone: resetForm.phone,
    //   email: resetForm.email
    // })
    
    ElMessage.success('密码重置成功')
    resetDialogVisible.value = false
  } catch (error) {
    console.error('密码重置失败:', error)
    ElMessage.error('密码重置失败')
  }
}

// 声明组件方法
defineExpose({
  sendCode,
  submitReset
})

const handleLogin = () => {
  loginFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        
        // 调用登录接口
        await userStore.login({
          username: loginForm.username,
          password: loginForm.password
        })
        
        // 登录成功
        ElMessage.success('登录成功')
        
        // 如果记住我，保存用户名
        if (loginForm.rememberMe) {
          localStorage.setItem('rememberedUsername', loginForm.username)
        } else {
          localStorage.removeItem('rememberedUsername')
        }
        
        // 跳转到首页
        router.push('/')
      } catch (error) {
        console.error('登录失败:', error)
        ElMessage.error('登录失败，请检查用户名和密码')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<!-- 样式部分 -->
<style scoped lang="scss">
/* 登录页面容器样式 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  /* 登录框样式 */
  .login-box {
    width: 100%;
    max-width: 400px;
    padding: 30px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    
    /* 登录头部样式 */
    .login-header {
      text-align: center;
      margin-bottom: 30px;
      
      .logo {
        margin-bottom: 15px;
        color: #409EFF;
      }
      
      h2 {
        font-size: 24px;
        color: #333;
        margin: 0;
      }
    }
    
    /* 登录表单样式 */
    .login-form {
      .login-button {
        width: 100%;
      }
      
      .forget-pwd {
        float: right;
      }
    }
    
    /* 登录页脚样式 */
    .login-footer {
      margin-top: 20px;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
  }
}

/* 验证码输入框样式 */
.code-input {
  display: flex;
  gap: 10px;
  
  .el-button {
    width: 120px;
  }
}

/* 移动端响应式适配 */
@media (max-width: 576px) {
  .login-container {
    background: #fff;
    
    .login-box {
      box-shadow: none;
      padding: 20px;
    }
  }
}
</style>