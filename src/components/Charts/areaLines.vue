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
      <div class="myChart" ref="myChartRef" />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue"
import * as echarts from "echarts"

import { useFetchGetDate } from "@/hooks/useFetchGetDate"
const { defaultTime, shortcuts, pickDate, getPickDate } = useFetchGetDate()

const showRangePicker = ref(false)
let chartBox: any
const myChartRef = ref()
const options = {
  color: ["#80FFA5", "#00DDFF", "#37A2FF", "#FF0087", "#FFBF00"],
  title: {
    // text: "Gradient Stacked Area Chart"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985"
      }
    }
  },
  legend: {
    data: ["Line 1", "Line 2", "Line 3", "Line 4", "Line 5"]
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
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: [
    {
      name: "Line 1",
      type: "line",
      stack: "Total",
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgb(128, 255, 165)"
          },
          {
            offset: 1,
            color: "rgb(1, 191, 236,0.5)"
          }
        ])
      },
      emphasis: {
        focus: "series"
      },
      data: [140, 232, 101, 264, 90, 340, 250]
    },
    {
      name: "Line 2",
      type: "line",
      stack: "Total",
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgb(0, 221, 255)"
          },
          {
            offset: 1,
            color: "rgb(77, 119, 255,0.5)"
          }
        ])
      },
      emphasis: {
        focus: "series"
      },
      data: [120, 282, 111, 234, 220, 340, 310]
    },
    {
      name: "Line 5",
      type: "line",
      stack: "Total",
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      label: {
        show: true,
        position: "top"
      },
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgb(255, 191, 0)"
          },
          {
            offset: 1,
            color: "rgb(224, 62, 76,0.5)"
          }
        ])
      },
      emphasis: {
        focus: "series"
      },
      data: [220, 302, 181, 234, 210, 290, 150]
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
onMounted(() => {
  getData()
})
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
