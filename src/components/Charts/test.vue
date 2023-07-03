<template>
  <div class="chart-wrapper">
    <el-card>
      <template #header>
        <div uno-flex-sb>
          <el-row text-lg>
            <el-col text-gray-500 hover:text-gray-700 uno-flex-center>
              <el-icon color="#6366F1"><Histogram /></el-icon>
              <span px-2>lines</span>
            </el-col>
          </el-row>
          <el-row style="height: 28px">
            <el-col v-if="showRangePicker">
              <DatePicker @getData="getData" />
            </el-col>
            <el-col v-else>
              <el-icon m2 op30 dark:op60 hover="op80" dark:hover="op80" @click="showRangePicker = true"
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
import { ref, onMounted, nextTick } from "vue"
import DatePicker from "@/components/DatePicker/index.vue"
import * as echarts from "echarts"

const showRangePicker = ref(false)

const pickDate = ref([])
const myChartRef = ref()
const chartBox = ref()
const options = {
  title: {
    // text: "Stacked Line"
  },
  tooltip: {
    trigger: "axis"
  },
  legend: {
    data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"]
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
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
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: "Union Ads",
      type: "line",
      stack: "Total",
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: "Video Ads",
      type: "line",
      stack: "Total",
      data: [150, 232, 201, 154, 190, 330, 410]
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
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
}

const getData = (v) => {
  pickDate.value = v || []
  initChart()
  if (!pickDate.value.length) {
    showRangePicker.value = false
  }
}
const initChart = () => {
  // 绘制图表
  if (chartBox.value) {
    chartBox.value.dispose
    chartBox.value = null
  }
  chartBox.value = echarts.init(myChartRef.value)
  chartBox.value.setOption(options)
  console.log("绘制图表,time:", pickDate.value)
}
onMounted(() => {
  nextTick(() => {
    getData([])
  })
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
