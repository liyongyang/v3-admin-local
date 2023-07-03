<script lang="ts" setup>
import { ref, type PropType } from "vue"
import { type RouteRecordRaw } from "vue-router"
import { CirclePlus } from "@element-plus/icons-vue"

// const props = defineProps({
//   item: {
//     type: Object as PropType<RouteRecordRaw>,
//     required: true
//   },
//   basePath: {
//     type: String,
//     default: ""
//   }
// })
const searchId = ref(null)
const count = ref(10)

const getSearch = () => {
  console.log("searchId:", searchId.value)
}
const add = () => {
  count.value++
}
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
    <el-scrollbar max-height="640px">
      <div
        v-for="item in count"
        :key="item"
        uno-flex-sb
        text-xs
        cursor-pointer
        p-1
        m-2
        rounded
        shadow
        hover:bg-blue-100
        class="scrollbar-demo-item"
      >
        <span>item{{ item }}</span>
        <el-icon><MoreFilled /></el-icon>
      </div>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.sub-container {
  :deep(.el-card__body) {
    padding: 2px;
  }
}
.scrollbar-demo-item {
  border-left: 2px solid var(--el-color-primary);
}
</style>
