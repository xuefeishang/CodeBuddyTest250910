<template>
  <div v-if="!(item as any).hidden && item.meta?.title">
    <!-- 有子菜单的情况 -->
    <el-sub-menu v-if="hasChildren(item)" :index="item.path">
      <template #title>
        <el-icon v-if="item.meta && item.meta.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      
      <!-- 递归渲染子菜单 -->
      <sidebar-item
        v-for="child in getChildren(item)"
        :key="child.path"
        :item="child"
      />
    </el-sub-menu>
    
    <!-- 没有子菜单的情况 -->
    <el-menu-item v-else :index="item.path" @click="handleLink(item.path)">
      <el-icon v-if="item.meta && item.meta.icon">
        <component :is="item.meta.icon" />
      </el-icon>
      <template #title>{{ item.meta?.title }}</template>
    </el-menu-item>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

// 定义菜单项类型
interface MenuItem {
  path: string
  name?: string
  meta?: {
    title: string
    icon: string
  }
  children?: MenuItem[]
  hidden?: boolean
}

// 定义props
const props = defineProps({
  item: {
    type: Object as () => MenuItem,
    required: true
  }
})

const router = useRouter()

// 判断是否有子菜单
const hasChildren = (route: MenuItem) => {
  if (route.children) {
    return route.children.filter(child => !child.hidden && child.meta?.title).length > 0
  }
  return false
}

// 获取子菜单项
const getChildren = (route: MenuItem) => {
  if (route.children) {
    return route.children.filter(child => !child.hidden && child.meta?.title)
  }
  return []
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