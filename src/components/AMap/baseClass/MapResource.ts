import AMapLoader from "@amap/amap-jsapi-loader"
import { ref, onMounted } from "vue"

import jcz from "@/assets/map/swjcz.png"

export function MapResource(props: any) {
  // const api = props.river
  // const riverId = props.riverBasinId
  // const Map = props.Map

  const mapKey = "b0a48ad91ec19ebe9c8502471a64f12a"
  const defaultoptios = {
    //设置地图容器id
    viewMode: "3D", //是否为3D地图模式
    zoom: 14, //初始化地图级别
    pitch: 45,
    // rotation: 10,
    zooms: [8.5, 20],
    // showBuildingBlock: false,
    // showIndoorMap: false,
    // showLabel: false,
    mapStyle: "amap://styles/541bfd2805802c6437e557260f300d03",
    features: ["bg", "point", "road", "building"], //"building"
    center: [106.507649, 29.618437] //初始化地图中心点位置
  }

  const map = ref(null)
  const marker = ref(null)

  onMounted(() => {
    const map = ref(null)
    const marker = ref(null)

    onMounted(() => {
      AMapLoader.load({
        key: "b0a48ad91ec19ebe9c8502471a64f12a",
        version: "2.0",
        plugins: ["AMap.Marker"]
      }).then((AMap) => {
        const mapInstance = new AMap.Map("map-container", {
          zoom: 10,
          center: [116.397428, 39.90923]
        })
        map.value = mapInstance

        const markerInstance = new AMap.Marker({
          position: [116.397428, 39.90923],
          title: "Marker"
        })
        markerInstance.setMap(mapInstance)
        marker.value = markerInstance
      })
    })
  })

  const load = () => {
    console.log("------first----", Map)
    loadJcd()
  }
  const loadJcd = () => {
    const layers = [1, 2]
    const factors = [1, 2, 3, 4, 5, 6, 7, 8, 12]
    const props = {
      facilityType: layers.join(","),
      perceptionType: factors.join(","),
      riverBasinId: riverId,
      target: ""
    }
    api.findFacilityPerception(props).then((res: any) => {
      console.log("--loadJcd----", res)
      const startIcon = Map.value.Icon({
        image: jcz,
        imageSize: Map.value.Size(16, 16)
      })
      res.data.map((l: any) => {
        if (l.longitude && l.latitude && l.alarmInfo) {
          let startMarker = Map.value.Marker({
            position: Map.value.LngLat(l.longitude, l.latitude),
            icon: startIcon,
            offset: Map.value.Pixel(-8, -16)
          })
          const info = []
          info.push(`<div text-xs bg-green-600 bg-opacity-60 rounded color-white p-2 >${l.deviceName}</div> `)
          const infoWindow = Map.value.InfoWindow({
            isCustom: true, //使用自定义窗体
            content: info.join(""),
            offset: Map.value.Pixel(0, -30)
          })
          startMarker.on("mousemove", (e: any) => {
            infoWindow.open(Map.value, startMarker.getPosition())
          })

          startMarker.on("click", () => {
            // if (l.alarmInfo) {
            //   showDetail.value = true
            // }
            // detailInfo.value = l.alarmInfo || []
            console.log("object_____", l.alarmInfo)
          })
          // let test = Map.value.Marker({
          //   position: Map.value.LngLat(106.50683315201009, 29.603174213800976),
          //   icon: startIcon,
          //   offset: Map.value.Pixel(-13, -30)
          // })
          // Map.value.add(test)
          Map.value.add(startMarker)
        }
      })
    })
  }
  return { map, marker, load }
}
