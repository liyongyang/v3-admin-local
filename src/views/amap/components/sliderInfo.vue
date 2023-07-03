<template>
  <el-card h-full class="slider-container w-1/5">
    <!-- <pieCharts type="line" /> -->
    <div class="info-items">
      <div flex h-9 leading-9 p-l-2 class="head">
        <span class="rela relative h-3 w-3">
          <span class="animate-ping absolute top-3 inline-flex h-3 w-3 rounded-full bg-purple-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-purple-800"></span>
        </span>
        <span m-x-2>title_name</span>
        <span>-desc</span>
      </div>
      <div class="border-blue-300 shadow rounded-md p-1 max-w-sm m2 bg-blue-400">
        <p m1 p1>123</p>
      </div>
      <div class="m-t-2 m-x-2 border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
        <div class="animate-pulse flex space-x-4">
          <div class="rounded-full bg-blue-400 h-12 w-12"></div>
          <div class="flex-1 space-y-4 py-1">
            <div class="h-4 bg-blue-400 rounded w-3/4"></div>
            <div class="space-y-2">
              <div class="h-4 bg-blue-400 rounded"></div>
              <div class="h-4 bg-blue-400 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
import { ref } from "vue"
import linesCharts from "@/components/Charts/lines.vue"
import pieCharts from "@/components/Charts/pie.vue"
</script>

<style lang="scss" scoped>
.slider-container {
  :deep(.el-card__body) {
    padding: 0;
  }
  .info-items {
    .head {
      color: var(--v3-card-title-color);
      border-left: 2px solid var(--v3-card-title-color);
      background: var(--v3-card-title-background);
    }
  }
}
</style>
