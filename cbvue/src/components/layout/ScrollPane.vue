<template>
  <el-scrollbar ref="scrollbarRef" class="scroll-container" @wheel.prevent="handleScroll">
    <slot />
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ElScrollbar } from 'element-plus'

// 滚动条引用
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

// 滚动速度
const scrollSpeed = 15

// 处理滚轮事件
const handleScroll = (e: WheelEvent) => {
  // 兼容不同浏览器的滚轮事件
  const delta = e.deltaY || (e as any).wheelDelta * -1
  
  if (scrollbarRef.value?.$refs?.wrap) {
    const scrollWrapper = scrollbarRef.value.$refs.wrap as HTMLElement
    scrollWrapper.scrollLeft += delta > 0 ? scrollSpeed : -scrollSpeed
  }
}

// 移动到目标元素
const moveToTarget = (currentTag: HTMLElement) => {
  if (!scrollbarRef.value || !scrollbarRef.value.$refs?.wrap) {
    return
  }

  const scrollWrapper = scrollbarRef.value.$refs.wrap as HTMLElement
  
  // 确保目标元素存在
  if (!currentTag || !currentTag.offsetWidth) {
    return
  }

  // 容器宽度
  const containerWidth = scrollWrapper.offsetWidth
  
  // 当前标签的位置信息
  const tagOffsetLeft = currentTag.offsetLeft
  const tagWidth = currentTag.offsetWidth
  
  // 当前滚动位置
  const currentScrollLeft = scrollWrapper.scrollLeft
  
  // 目标滚动位置
  let targetScrollLeft = 0
  
  // 如果标签在可视区域左侧之外
  if (tagOffsetLeft < currentScrollLeft) {
    targetScrollLeft = tagOffsetLeft - 15 // 15px的边距
  } 
  // 如果标签在可视区域右侧之外
  else if (tagOffsetLeft + tagWidth > currentScrollLeft + containerWidth) {
    targetScrollLeft = tagOffsetLeft + tagWidth - containerWidth + 15 // 15px的边距
  }
  
  // 如果需要滚动
  if (targetScrollLeft !== 0) {
    scrollWrapper.scrollLeft = targetScrollLeft
  }
}

// 暴露方法给父组件
defineExpose({
  moveToTarget
})
</script>

<style scoped lang="scss">
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  
  :deep(.el-scrollbar__wrap) {
    overflow-x: auto;
    overflow-y: hidden;
  }
}
</style>