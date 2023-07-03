<script lang="ts" setup>
import { useFetchSelect } from "@/hooks/useFetchSelect"
import { useFetchGetDate } from "@/hooks/useFetchGetDate"
import { getSelectDataApi } from "@/api/hook-demo/use-fetch-select"

const { loading, options, value } = useFetchSelect({
  api: getSelectDataApi
})
const { today, defaultTime, shortcuts, pickDate, getPickDate } = useFetchGetDate()
</script>

<template>
  <div class="app-container">
    <h4>该示例是演示：通过 hook 自动调用 api 后拿到 Select 组件需要的数据并传递给 Select 组件</h4>
    <h5>{{ value || "-" }}</h5>
    <el-select :loading="loading" v-model="value" filterable>
      <el-option v-for="(item, index) in options" v-bind="item" :key="index" placeholder="请选择" />
    </el-select>
    <h5>Select V2 示例（如果数据量过多，可以选择该组件）</h5>
    <el-select-v2 :loading="loading" v-model="value" :options="options" filterable placeholder="请选择" />
    <el-divider />
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>日期时间选择器封装</span>
          <el-button class="button" text>button</el-button>
        </div>
      </template>
      <el-date-picker
        v-model="pickDate"
        type="daterange"
        unlink-panels
        clearable:false
        range-separator="To"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        :shortcuts="shortcuts"
        :default-value="defaultTime"
        size="small"
      />
    </el-card>
    <p>today:{{ today }}</p>
    <p>pickDate:{{ pickDate }}</p>
    <p>getPickDate:{{ getPickDate }}</p>
  </div>
</template>
<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
