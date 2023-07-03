<template>
  <div class="container">
    <div flex m4>
      <DatePicker />
      <el-button type="success" round @click="openDialog('TC1')">TC1</el-button>
      <el-button type="info" round @click="openDialog('TC2')">TC2</el-button>
      <el-button type="danger" plain @click="openDialog('TC3')">TC3</el-button>
    </div>
    <el-row justify="space-between" :gutter="24" my-4>
      <el-col :span="12">
        <linesCharts type="line" />
      </el-col>
      <el-col :span="12">
        <areaLinesCharts />
      </el-col>
    </el-row>
    <el-row justify="space-between" :gutter="24">
      <el-col :span="8">
        <pieCharts />
      </el-col>
      <el-col :span="16">
        <VTable />
      </el-col>
    </el-row>
    <!-- <BaseDialog :title="title" ref="DialogRef" /> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import DatePicker from "@/components/DatePicker/index.vue"
import BaseDialog from "@/components/Dialog/baseDialog1.vue"
import linesCharts from "@/components/Charts/lines.vue"
import pieCharts from "@/components/Charts/pie.vue"
import areaLinesCharts from "@/components/Charts/areaLines.vue"
import VTable from "@/components/Table/defaultTable.vue"

// Dialog-props
const title = ref("")
const DialogRef = ref()
const openDialog = (t: string) => {
  title.value = t
  ;(DialogRef as any).value.show()
}
</script>

<style lang="scss" scoped>
.container {
  margin: 0 auto;

  :deep(.el-card__header) {
    height: 48px;
    padding: 8px 10px;
  }
  :deep(.el-card) {
    background-color: #f6ece0;
  }
}
</style>
