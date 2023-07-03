<script lang="ts" setup>
import { ref, watch } from "vue"

import { useFetchGetDate } from "@/hooks/useFetchGetDate"

const { defaultTime, shortcuts, pickDate, getPickDate } = useFetchGetDate()

const rePickDate = ref(getPickDate.value)
defineExpose({
  rePickDate
})
// 使用defineEmits创建名称，接受一个数组
const emit = defineEmits(["getData"])

watch(pickDate, () => {
  emit("getData", getPickDate.value)
})
</script>

<template>
  <div class="v-data-picker" h-full text-lg>
    <el-date-picker
      v-model="pickDate"
      type="daterange"
      clearable:false
      range-separator="To"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      :shortcuts="shortcuts"
      :default-value="defaultTime"
      size="small"
    />
  </div>
</template>
<style lang="scss" scoped>
.v-data-picker {
  :deep(.el-input__wrapper) {
    height: 28px;
    width: 260px;
    // border: 1px solid rgba(77, 37, 37, 0);
    border-radius: 12px !important;
  }
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
