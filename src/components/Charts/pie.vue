<template>
  <div class="chart-wrapper">
    <el-card>
      <template #header>
        <div uno-flex-sb>
          <el-row text-lg>
            <el-col uno-flex-center animate-pulse>
              <el-icon color="#6366F1"><Histogram /></el-icon>
              <span px-2>lines</span>
            </el-col>
          </el-row>
          <el-row style="height: 28px">
            <el-col v-if="showRangePicker" translate-x-4 duration-500 transition-opacity>
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
            </el-col>
            <el-col v-else>
              <el-icon op30 dark:op60 hover="op80" dark:hover="op80" @click="showRangePicker = true"
                ><Calendar
              /></el-icon>
            </el-col>
          </el-row>
        </div>
      </template>
      <div class="myChart" ref="myChartRef" />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue"
import * as echarts from "echarts"
// import DatePicker from "@/components/DatePicker/index.vue"

import { useFetchGetDate } from "@/hooks/useFetchGetDate"
const { defaultTime, shortcuts, pickDate, getPickDate } = useFetchGetDate()

const showRangePicker = ref(false)
// const dataPicker = ref()
const myChartRef = ref()
let chartBox: any
const options = {
  tooltip: {
    trigger: "item"
  },
  legend: {
    orient: "vertical",
    left: 10,
    top: "center",
    bottom: 20
  },
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2
      },
      label: {
        show: false,
        position: "center"
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: "bold"
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: "Search Engine" },
        { value: 735, name: "Direct" },
        { value: 580, name: "Email" },
        { value: 484, name: "Union Ads" },
        { value: 300, name: "Video Ads" }
      ]
    }
  ]
}
const initChart = () => {
  // 绘制图表
  if (chartBox) {
    chartBox.dispose()
    chartBox = null
  }
  chartBox = echarts.init(myChartRef.value)
  chartBox.setOption(options)
  window.onresize = () => {
    //自适应大小, 不用的话不会自适应大小。
    chartBox.resize()
  }
  console.log("绘制图表,time:", getPickDate.value)
}
const getData = () => {
  if (!getPickDate.value.length) {
    showRangePicker.value = false
  }
  initChart()
}
watch(
  pickDate,
  () => {
    nextTick(() => {
      getData()
    })
  },
  { immediate: true, deep: true }
)
onMounted(() => {})
onUnmounted(() => {
  chartBox.dispose()
})
</script>
<style lang="scss" scoped>
.chart-wrapper {
  :deep(.el-input__wrapper) {
    height: 24px;
    width: 260px;
    border-radius: 12px !important;
  }
  .myChart {
    width: initial;
    height: 300px;
  }
}
</style>
