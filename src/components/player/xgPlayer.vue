<template>
  <div w-full h-full relative rounded-md>
    <div class="player" id="refPlayer"></div>
  </div>
</template>

<script lang="ts">
import { ref, nextTick, onMounted, onUnmounted, onBeforeMount, shallowRef } from "vue"
import axios from "axios"
import Player from "xgplayer"

import FlvJsPlayer from "xgplayer-flv.js"

export default {
  name: "livePlayer",
  components: { FlvJsPlayer },
  props: {
    isLive: Boolean,
    config: Object
  },
  data() {
    return {
      urlConfig: {},
      videoUrl: null
    }
  },
  setup(props) {
    const config = ref(props.config)
    const player = ref()
    const urlConfig = ref()
    const videoUrl = ref()
    const easyplayer = ref()
    const refPlayer = ref()
    const cfKbs = ref(null)
    const isNotMute = ref(false)
    const fullscreen = ref(false)
    const state = ref(false)

    onMounted(() => {
      init()
    })
    onUnmounted(() => {
      videoUrl.value = null
    })
    const init = () => {
      console.log("===config", props.isLive, config)
      if (props.isLive) {
        initLive()
        return
      }
      initRecord()
    }
    const initLive = () => {
      axios({
        method: "get",
        url: "http://222.180.171.210/video/play/start/" + config.value?.mn + "/" + config.value?.deviceNum
      }).then((res) => {
        urlConfig.value = res.data.data
        console.log("-urlConfig--", urlConfig.value)
        if (urlConfig && location.protocol === "https:") {
          if (urlConfig.value.wss_flv === null) {
            console.error("媒体服务器未配置ssl端口, 使用http端口")
            videoUrl.value = urlConfig.value.fmp4
          } else {
            videoUrl.value = urlConfig.value.https_flv.replace("222.180.171.212:9080", "222.180.171.210") // wss://222.180.171.212:9080
          }
        } else {
          videoUrl.value = urlConfig.value.fmp4
        }
        console.log("ws_flv", videoUrl.value)
        player.value = new Player({
          id: "refPlayer",
          url: videoUrl.value,
          fluid: true,
          autoplay: true,
          isLive: true,
          screenShot: {
            saveImg: true
          },
          ignores: ["play"]
        })
      })
    }
    const initRecord = () => {}
    return { config, videoUrl, refPlayer, init, initLive }
  },
  mounted() {
    this.init()
  },
  methods: {}
  //   init() {
  //     if (this.isLive) {
  //       this.initLive()
  //       return
  //     }
  //     this.initRecord()
  //   },
  //   initLive() {
  //     axios({
  //       method: "get",
  //       url: "http://222.180.171.210/video/play/start/" + this.config?.mn + "/" + this.config?.deviceNum
  //     }).then((res) => {
  //       this.urlConfig = res.data.data
  //       if (res.data.data && location.protocol === "https:") {
  //         if (res.data.data.wss_flv === null) {
  //           console.error("媒体服务器未配置ssl端口, 使用http端口")
  //           this.videoUrl = res.data.data.wss_flv
  //         } else {
  //           this.videoUrl = res.data.data.https_flv.replace("222.180.171.212:9080", "222.180.171.210") // wss://222.180.171.212:9080
  //         }
  //       } else {
  //         this.videoUrl = res.data.data.ws_flv
  //       }
  //     })
  //   },
  //   initRecord() {},
  //   pause(error: object) {
  //     this.$refs.refPlayer.pause()
  //     console.log("error", error)
  //   }
  // }
}
</script>
<style>
.player {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  :deep(.xgplayer-time) {
    white-space: nowrap;
  }
}
</style>
