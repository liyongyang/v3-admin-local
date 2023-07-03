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
            <el-col v-if="showRangePicker">
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
      <div class="myChart" ref="myChartRef"></div>
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
const myChartRef = ref()
let chartBox: any
const options = {
  title: {
    // text: 'Stacked Line'
  },
  tooltip: {
    trigger: "axis",
    show: true
  },
  legend: {},
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: "Email",
      type: "line",
      stack: "Total",
      smooth: true,
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: "Direct",
      type: "line",
      stack: "Total",
      data: [320, 332, 301, 334, 390, 330, 320]
    },
    {
      name: "Search Engine",
      type: "line",
      stack: "Total",
      smooth: true,
      data: [820, 932, 901, 934, 1290, 1330, 1320]
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
    width: 100%;
    height: 300px;
  }
}
</style>
