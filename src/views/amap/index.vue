<template>
  <div flex h-full class="map-container">
    <div relative h-full :class="sliderState ? 'w-4/5' : 'w-full'">
      <AMap />
      <!-- <OMap /> -->
      <!-- <div animate-pulse absolute right-0 w-5 h-20 rounded-r-4 class="bottom-1/2" @click="sliderShow()"> -->
      <div
        class="slider-show bottom-1/2"
        uno-flex-center
        cursor-pointer
        absolute
        w-5
        h-20
        right-0
        z-4
        rounded-l-4
        @click="sliderShow()"
      >
        <el-icon v-if="sliderState" color="white"><ArrowRightBold /></el-icon>
        <el-icon v-else color="white"><ArrowLeftBold /></el-icon>
      </div>
    </div>
    <SliderInfo v-show="sliderState" />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref, shallowRef, instance, nextTick, unref, onBeforeMount, reactive } from "vue"
import AMap from "@/components/AMap/index.vue"
import OMap from "@/components/OMap/index.vue"
import SliderInfo from "./components/sliderInfo.vue"

const sliderState = ref(false)
const sliderShow = () => {
  sliderState.value = !sliderState.value
}
const flatten = (arr) => {
  if (arr.length === 0) return []
  const [first, ...rest] = arr
  if (Array.isArray(first)) {
    return [...flatten(first), ...flatten(rest)]
  }
  return [first, ...flatten(rest)]
}
const a = flatten([1, [[2]]]) // [1, 2]

onBeforeMount(() => {
  console.log("=====", a)
})
</script>
<style lang="scss" scoped>
.map-container {
  .slider-show {
    background-color: var(--el-color-primary);
  }
  .more-icon {
  }
}
</style>
