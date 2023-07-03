<template>
  <div class="container">
    <div v-if="isOnline">
      <live-player :isLive="isLive" :config="config" />
    </div>
    <div v-else>
      <p text-center>{{ tips }}</p>
      <li v-for="(t, index) in config" :key="t">{{ index }}: {{ t }}</li>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue"
import axios from "axios"

// import LivePlayer from "@/components/player/xgPlayer.vue"
import LivePlayer from "@/components/player/liveplayer.vue"

export default {
  name: "sp",
  components: { LivePlayer },
  props: {
    config: Object
  },
  setup(props) {
    const isOnline = ref(false)
    const UrlConfig = ref()
    const isLive = ref(true)
    const tips = "设备当前为离线状态，请稍后再试！"
    const getPlayerInfo = () => {
      props.config &&
        axios({
          method: "get",
          url: "http://222.180.171.212:18080/api/device/query/devices/" + props.config.mn
        }).then((res) => {
          isOnline.value = res.data.online ? true : false
        })
    }
    onMounted(() => {
      getPlayerInfo()
    })
    return { isOnline, tips, UrlConfig, isLive }
  }
}
</script>
