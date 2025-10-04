<template>
  <div v-if="!item.hidden">
    <!-- 没有子菜单的情况 -->
    <template v-if="!hasChildren(item)">
      <el-menu-item :index="resolvePath(item.path)" @click="handleLink(resolvePath(item.path))">
        <el-icon v-if="item.meta && item.meta.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <template #title>{{ item.meta?.title }}</template>
      </el-menu-item>
    </template>
    
    <!-- 有子菜单的情况 -->
    <el-sub-menu v-else :index="resolvePath(item.path)">
      <template #title>
        <el-icon v-if="item.meta && item.meta.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      
      <!-- 递归渲染子菜单 -->
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import path from 'path-browserify'

// 定义props
const props = defineProps({
  item: {
    type: Object as () => RouteRecordRaw,
    required: true
  },
  basePath: {
    type: String,
    default: ''
  }
})

const router = useRouter()

// 判断是否有子菜单
const hasChildren = (route: RouteRecordRaw) => {
  if (route.children) {
    return route.children.filter(child => !child.hidden).length > 0
  }
  return false
}

// 解析路径
const resolvePath = (routePath: string) => {
  if (/^(https?:|mailto:|tel:)/.test(routePath)) {
    return routePath
  }
  return path.resolve(props.basePath, routePath)
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
</script>

<style scoped lang="scss">
.el-menu-item, .el-sub-menu {
  .el-icon {
    margin-right: 10px;
    width: 24px;
    text-align: center;
  }
}
</style>