<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useUserStore } from '@/store/modules/user'

// 获取用户信息
const userStore = useUserStore()

// 初始化用户信息
userStore.getUserInfo()
</script>

<template>
  <!-- 登录页不使用布局 -->
  <RouterView v-if="$route.path === '/login'" />
  
  <!-- 其他页面使用布局 -->
  <AppLayout v-else>
    <RouterView />
  </AppLayout>
</template>

<style lang="scss">
// 全局样式
#app {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  height: 100vh;
}

// 重置样式
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

// 滚动条样式
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(144, 147, 153, 0.5);
}

// 响应式字体
html {
  font-size: 16px;
}

@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}

@media (max-width: 576px) {
  html {
    font-size: 12px;
  }
}
</style>