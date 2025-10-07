<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
        <span 
          v-if="index === breadcrumbs.length - 1 || !item.redirect" 
          class="no-redirect"
        >{{ item.meta?.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta?.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationMatched } from 'vue-router'

// 定义面包屑项的接口
interface BreadcrumbItem {
  path: string
  redirect?: string | object
  meta?: {
    title?: string
  }
}

const route = useRoute()
const router = useRouter()
const breadcrumbs = ref<BreadcrumbItem[]>([])

// 获取面包屑数据
const getBreadcrumb = () => {
  // 过滤掉没有meta.title的路由
  let matched: BreadcrumbItem[] = route.matched
    .filter(item => item.meta && item.meta.title)
    .map(item => ({
      path: item.path,
      redirect: item.redirect,
      meta: item.meta
    }))
  
  // 如果第一个不是首页，添加首页
  const first = matched[0]
  if (first && first.path !== '/') {
    const homeItem: BreadcrumbItem = {
      path: '/',
      redirect: '/',
      meta: { title: '首页' }
    }
    matched = [homeItem, ...matched]
  }
  
  breadcrumbs.value = matched
}

// 处理链接点击
const handleLink = (item: BreadcrumbItem) => {
  const { redirect, path } = item
  if (redirect) {
    // 处理不同类型的redirect
    if (typeof redirect === 'string') {
      router.push(redirect)
    } else {
      router.push(redirect as any)
    }
    return
  }
  router.push(path)
}

// 监听路由变化
watch(
  () => route.path,
  () => {
    getBreadcrumb()
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.app-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 60px;
  margin-left: 8px;
  
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
  
  a {
    color: #666;
    font-weight: normal;
    
    &:hover {
      color: #409EFF;
    }
  }
}

// 面包屑动画
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}

.breadcrumb-enter-from,
.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>