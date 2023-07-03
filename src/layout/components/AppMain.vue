<script lang="ts" setup>
import { computed } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const key = computed(() => {
  return route.path
})
</script>

<template>
  <section class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <!-- <keep-alive> -->
        <component :is="Component" :key="key" />
        <!-- </keep-alive> -->
      </transition>
    </router-view>
  </section>
</template>

<style lang="scss" scoped>
.app-main {
  width: 100%;
  position: relative;
  // background-color: var(--v3-body-bg-color);
}

.fixed-header + .app-main {
  padding-top: 100px;
  height: 100vh;
  overflow: auto;
}

// .hasTagsView {
//   .app-main {
//     min-height: calc(100vh - 120px);
//   }
//   .fixed-header + .app-main {
//     padding-top: 100px;
//   }
// }
</style>
