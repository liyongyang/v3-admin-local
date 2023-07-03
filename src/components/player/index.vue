<!-- <template>
  <component
    ref="refPlayer"
    :is="comp"
    :isLive="isLive"
    :isClosed="isClosed"
    :isControl="isControl"
    :fullscreen="fullscreen"
    :that="that"
    :videoUrl="videoUrl"
  ></component>
</template>

<script lang="ts">
import axios from "axios";
import { devices } from "@/api/devices"

import livePlayer from "./liveplayer.vue"
export default {
  name: "player",
	components: { livePlayer }

  props: {
		isLive:Boolean
		isClosed:Boolean
		isControl:Boolean
		fullscreen:Boolean
		isDialog:Boolean
		that:Boolean
    config: Object
  },
  videoUrl = ""
  comp = ""
  mounted(): void {
    this.init(this.config);
  }

  init(data?) {
    if (!data) return;

    if ((data.deviceId && data.channelId) || data.sourceType === "huayue") {
      this.comp = "livePlayer";
    } else (data.cameraId) {
      this.comp = "flvPlayer";
    }

    this.videoUrl = data.url;
    console.log("this.videoUrl", this.comp, this.videoUrl, data);

    this.$nextTick(() => {
      (this.$refs.refPlayer as any).init(data);
    });
  }
  beforeDestroy(): void {
    this.close();
  }

  close() {
    (this.$refs.refPlayer as any) && (this.$refs.refPlayer as any).close();
  }
}
</script> -->
