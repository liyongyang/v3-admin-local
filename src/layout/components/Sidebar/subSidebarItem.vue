<script lang="ts" setup>
import { ref, watch, onUnmounted, type PropType } from "vue"

import { useRoute, type RouteRecordRaw } from "vue-router"

const route = useRoute()
const searchId = ref(null)
const activeId = ref(0)
const menus = ref({})

watch(
  () => route.path,
  (newPath, oldPath) => {
    switch (newPath) {
      case "/table/element-plus":
        menus.value = [
          {
            id: 0,
            name: "实体属性"
          },
          {
            id: 1,
            name: "逻辑属性"
          }
        ]
        break

      default:
        menus.value = []
        break
    }
  },
  { immediate: true }
)
const getSearch = () => {
  console.log("searchId:", searchId.value)
}
const add = () => {}
onUnmounted(() => {})
</script>

<template>
  <div class="sub-container" w-42 p-2>
    <div uno-flex-sb m-y-4>
      <el-input
        v-model="searchId"
        size="small"
        prefix-icon="Search"
        placeholder="搜索"
        clearable
        @change="getSearch"
        style="width: 120px"
      ></el-input>
      <el-button type="primary" icon="Plus" size="small" circle @click="add" />
    </div>
    <div
      v-for="item in menus"
      :key="item.id"
      uno-flex-sb
      text-xs
      cursor-pointer
      p-2
      m-y-4
      rounded
      shadow-lg
      hover:bg-blue-100
      :class="item.id === activeId ? 'active' : 'defult'"
      class="scrollbar-demo-item"
      @click="activeId = item.id"
    >
      <span font-semibold>{{ item.name }}</span>
      <el-icon><MoreFilled /></el-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sub-container {
  transition: width 0.28s;
  height: calc(100vh - 96px);
  .defult {
    // color: var(--el-table-header-text-color);
  }
  .active {
    color: var(--el-color-primary);
  }
}
.scrollbar-demo-item {
  border-left: 4px solid var(--el-color-primary);
}
</style>
