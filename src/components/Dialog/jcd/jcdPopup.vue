<template>
  <div class="jcd-container">
    <div v-if="config.alarmInfo" text-center>
      <li v-for="(t, index) in config" :key="t">{{ index }}: {{ t }}</li>
      <img src="@/assets/map/offline.png" alt="" srcset="" />
      <p>{{ config.alarmInfo.alarmName }}</p>
    </div>
    <div v-else>
      <li :class="'item_' + index" v-for="(t, index) in config" :key="t">{{ index }}: {{ t }}</li>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue"
export default {
  name: "jcd",

  props: {
    config: Object
  },
  setup(props) {
    onMounted(() => {
      console.log("props", props.config)
    })
    return {}
  },
  methods: {
    show() {}
  }
}
</script>
<style lang="scss" scoped>
.jcd-container {
  width: 100%;
  height: 460px;
  overflow-y: scroll;
}
</style>
