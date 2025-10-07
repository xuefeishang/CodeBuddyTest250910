<template>
  <div class="tags-view-container">
    <scroll-pane ref="scrollPaneRef" class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :to="{ path: tag.path, query: tag.query }"
        class="tags-view-item"
        :class="isActive(tag) ? 'active' : ''"
        @click.middle="closeSelectedTag(tag)"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.meta?.title }}
        <el-icon 
          v-if="!isAffix(tag)" 
          class="close-icon"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <Close />
        </el-icon>
      </router-link>
    </scroll-pane>
    
    <!-- 右键菜单 -->
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { Close } from '@element-plus/icons-vue'
import ScrollPane from './ScrollPane.vue'

// 路由信息
const route = useRoute()
const router = useRouter()

// 滚动组件引用
const scrollPaneRef = ref<InstanceType<typeof ScrollPane> | null>(null)

// 访问过的视图
const visitedViews = ref<RouteLocationNormalizedLoaded[]>([])

// 固定的标签（不允许关闭）
const affixTags = ref<RouteLocationNormalizedLoaded[]>([])

// 右键菜单状态
const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref<RouteLocationNormalizedLoaded>({} as RouteLocationNormalizedLoaded)

// 初始化标签
const initTags = () => {
  // 添加当前路由到已访问视图
  addVisitedView(route)
  
  // 初始化固定标签
  initAffixTags()
}

// 初始化固定标签
const initAffixTags = () => {
  // 这里可以根据路由meta.affix属性来确定哪些标签是固定的
  // 例如：首页通常是固定的
  const homeRoute = router.options.routes.find(route => route.path === '/')
  if (homeRoute && homeRoute.path) {
    // 创建一个符合RouteLocationNormalizedLoaded接口的对象
    const homeRouteNormalized = {
      ...router.resolve(homeRoute.path),
      meta: {
        ...(homeRoute.meta || {}),
        title: homeRoute.meta?.title || '首页',
        affix: true
      }
    } as RouteLocationNormalizedLoaded
    
    affixTags.value.push(homeRouteNormalized)
    addVisitedView(homeRouteNormalized)
  }
}

// 刷新页面
const refreshPage = () => {
  // 简单的页面刷新
  window.location.reload()
}

// 添加已访问视图
const addVisitedView = (view: RouteLocationNormalizedLoaded) => {
  // 如果已经存在，则不重复添加
  if (visitedViews.value.some(v => v.path === view.path)) return
  
  // 只添加有标题的路由
  if (view.meta?.title) {
    visitedViews.value.push(
      Object.assign({}, view, {
        title: view.meta?.title || 'no-name'
      })
    )
  }
}

// 关闭选中的标签
const closeSelectedTag = (view: RouteLocationNormalizedLoaded) => {
  // 移除标签
  const index = visitedViews.value.findIndex(v => v.path === view.path)
  if (index !== -1) {
    visitedViews.value.splice(index, 1)
  }
  
  // 如果关闭的是当前激活的标签，则需要跳转到其他标签
  if (isActive(view)) {
    toLastView(visitedViews.value, view)
  }
}

// 关闭其他标签
const closeOthersTags = () => {
  // 过滤出固定标签和当前选中的标签
  visitedViews.value = visitedViews.value.filter(tag => {
    return isAffix(tag) || tag.path === selectedTag.value.path
  })
  
  // 如果当前路由不在保留的标签中，则跳转到最后一个标签
  if (visitedViews.value.findIndex(tag => tag.path === route.path) === -1) {
    toLastView(visitedViews.value)
  }
}

// 关闭所有标签
const closeAllTags = (view: RouteLocationNormalizedLoaded) => {
  // 只保留固定标签
  visitedViews.value = visitedViews.value.filter(tag => isAffix(tag))
  
  // 如果当前路由不在保留的标签中，则跳转到最后一个标签
  if (visitedViews.value.findIndex(tag => tag.path === route.path) === -1) {
    toLastView(visitedViews.value)
  }
}

// 刷新选中的标签
const refreshSelectedTag = (view: RouteLocationNormalizedLoaded) => {
  // 简单的刷新当前页面
  refreshPage()
}

// 跳转到最后一个标签
const toLastView = (visitedViews: RouteLocationNormalizedLoaded[], view?: RouteLocationNormalizedLoaded) => {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.path)
  } else {
    // 如果没有标签了，则跳转到首页
    if (view?.path === '/') {
      router.replace('/')
    } else {
      router.push('/')
    }
  }
}

// 打开右键菜单
const openMenu = (tag: RouteLocationNormalizedLoaded, e: MouseEvent) => {
  // 设置菜单位置
  const menuMinWidth = 105
  const offsetLeft = e.clientX
  const offsetWidth = document.body.offsetWidth
  const maxLeft = offsetWidth - menuMinWidth
  left.value = offsetLeft > maxLeft ? maxLeft : offsetLeft
  top.value = e.clientY
  
  // 显示菜单
  visible.value = true
  selectedTag.value = tag
}

// 关闭右键菜单
const closeMenu = () => {
  visible.value = false
}

// 判断标签是否是当前激活的
const isActive = (tag: RouteLocationNormalizedLoaded) => {
  return tag.path === route.path
}

// 判断标签是否是固定的
const isAffix = (tag: RouteLocationNormalizedLoaded) => {
  return tag.meta?.affix
}

// 监听路由变化
watch(
  () => route.path,
  () => {
    addVisitedView(route)
    moveToCurrentTag()
  }
)

// 移动到当前标签
const moveToCurrentTag = () => {
  nextTick(() => {
    if (scrollPaneRef.value) {
      // 找到当前标签的DOM元素
      const tags = document.querySelectorAll('.tags-view-item')
      for (const tag of tags) {
        if ((tag as HTMLElement).classList.contains('active')) {
          // 调用滚动组件的方法，将当前标签滚动到可视区域
          scrollPaneRef.value?.moveToTarget(tag as HTMLElement)
          break
        }
      }
    }
  })
}

// 点击页面其他地方关闭右键菜单
const handleClickOutside = (e: MouseEvent) => {
  const menu = document.querySelector('.contextmenu')
  if (menu && !menu.contains(e.target as Node)) {
    closeMenu()
  }
}

// 组件挂载时
onMounted(() => {
  initTags()
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载前
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
.tags-view-container {
  height: 40px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 30px;
      line-height: 30px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 5px;
      text-decoration: none;
      
      &:first-of-type {
        margin-left: 15px;
      }
      
      &:last-of-type {
        margin-right: 15px;
      }
      
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
      
      .close-icon {
        width: 16px;
        height: 16px;
        vertical-align: middle;
        margin-left: 5px;
        margin-top: -2px;
        
        &:hover {
          color: #f56c6c;
        }
      }
    }
  }
  
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>