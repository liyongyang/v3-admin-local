<template>
  <div class="container m4">
    <el-row :gutter="48" class="header" m4>
      <el-col :span="6" v-for="item in headInfo" cursor-pointer>
        <el-card hover:bg-gray-700>
          <div flex justify-between mb-1 text-sm>
            <span>{{ item.name }}</span>
            <el-tooltip class="box-item" effect="dark" content="Top Left prompts info" placement="bottom-end">
              <el-icon><Warning /></el-icon>
            </el-tooltip>
          </div>
          <div :class="item.className" font-bold text-3xl>
            <CountTo :endVal="item.value" :duration="3000"></CountTo>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="content">
        <linesCharts type="line" :chartConfig="chartConfig" />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, shallowRef } from "vue"
import CountTo from "@/components/CountTo/vue-countTo.vue"
import linesCharts from "@/components/Charts/lines.vue"

const headInfo = [
  {
    name: "工单总数",
    className: "total",
    value: 129
  },
  {
    name: "我创建的",
    className: "my-list",
    value: 9
  },
  {
    name: "我相关的",
    className: "my-facous",
    value: 12
  },
  {
    name: "我的待办",
    className: "todo",
    value: 2
  }
]
const chartConfig = shallowRef({
  title: "工单数据分析"
})
</script>

<style lang="scss" scoped>
.container {
  margin: 0 auto;
  .header {
    :deep(.el-card) {
      color: #94a3b8;
      background-color: #1e293b;

      // background-image: var(--el-dialog-bg-color);
      // background-color: #f6f4c9;
    }
    .total {
      color: #7dd3fc;
      border-bottom: 1px solid #7dd3fc;
    }
    .my-list {
      color: #23a79d;
      border-bottom: 1px solid #23a79d;
    }
    .my-facous {
      color: #e4c441;
      border-bottom: 1px solid #e4c441;
    }
    .todo {
      color: #f471b5;
      border-bottom: 1px solid #f471b5;
    }
  }
}
</style>
