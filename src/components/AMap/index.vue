<template>
  <div class="map" h-full w-full>
    <div
      v-loading="loading"
      element-loading-text="地图加载中..."
      element-loading-background="#001428b0"
      h-full
      w-full
      id="container"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, shallowRef, onMounted, onUnmounted } from "vue"
import AMapLoader from "@amap/amap-jsapi-loader"

import { addDialog } from "@/components/Dialog/index"
import JCD from "@/components/Dialog/jcd/jcdPopup.vue"
import SP from "@/components/Dialog/jcd/spPopup.vue"

import { river } from "@/api/map/river"
import lake from "@/config/json/map/lake.json"
import riverMock from "@/config/json/map/river.json"
import dongbuPark from "@/config/json/map/dongbuPark.json"
import { CoordTransform } from "./baseClass/CoordTransform"

import { mapIcons } from "./baseClass/constant"

const Map = shallowRef()
const loca = shallowRef()
const mapKey = "b0a48ad91ec19ebe9c8502471a64f12a"
const showDetail = ref(false)
const detailInfo = ref()
const loading = ref(true)
const defaultoptios = ref({
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
})

const initMap = async () => {
  window._AMapSecurityConfig = { securityJsCode: "2d9dac986016ae154502daff889aa3db" }
  AMapLoader.load({
    key: mapKey,
    version: "2.0",
    plugins: ["AMap.ToolBar", "AMap.Scale", "AMap.DistrictSearch", "AMap.GeoJSON"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    Loca: {
      version: "2.0.0"
    }
  })
    .then(async (AMap) => {
      Map.value = new AMap.Map("container", {
        ...defaultoptios.value
      })
      // add tools
      const toolbar = new AMap.ToolBar()
      Map.value.addControl(toolbar)
      const scale = new AMap.Scale()
      Map.value.addControl(scale)

      loca.value = new Loca.Container({
        map: Map.value
      })
      Map.value.on("complete", function () {
        // ready
        loading.value = false
      })
      Map.value && addMapSource()
      // loading.value = false
    })
    .catch((e) => {
      console.log(e)
    })
}

const addMapSource = () => {
  Map.value.on("click", showInfoClick)
  addLights()
  // map-data
  drawBounds()
  getRiverData()
  getJcdData()
  //
  addMarkers()
  // Loca-data
  // 标注牌渲染
  const riverTips = [
    {
      name: "后溪沟支流",
      center: [106.498656, 29.607825]
    },
    {
      name: "刘家沟支流",
      center: [106.508264, 29.620001]
    },
    {
      name: "盘溪河",
      center: [106.518013, 29.612212]
    },
    {
      name: "跳墩河",
      center: [106.474849, 29.633695]
    },
    {
      name: "肖家河",
      center: [106.598178, 29.642395]
    },
    {
      name: "茅溪河",
      center: [106.572166, 29.621304]
    }
  ]
  const temp = riverTips.map((t) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: t.center
      },
      properties: {
        name: t.name,
        type: true
      }
    }
  })
  let geo = new Loca.GeoJSONSource({
    data: {
      type: "FeatureCollection",
      features: temp
    }
  })
  // addMarkers(geo)
  addPrismLayer(geo)
  // addZMarker(geo)
  //
  getLakes()
  //
  adddDongbuPark()
  //
  // breathPoints()
}
const addLights = () => {
  // 环境光1
  let ambLight = new Loca.AmbientLight({
    intensity: 0.5,
    color: "#a5bbff"
  })
  // 平行光
  let dirLight = new Loca.DirectionalLight({
    intensity: 0.6,
    color: "#ffffff",
    target: [0, 0, 0],
    position: [0, 3, 6]
  })
  loca.value.addLight(ambLight)
  loca.value.addLight(dirLight)
  const pointLightArr = [
    [106.515774, 29.602251, 100],
    [106.493299, 29.607555, 100],
    [106.508227, 29.612024, 100],
    [106.515099, 29.621757, 100],
    [106.529379, 29.622751, 100],
    [106.542614, 29.626488, 100],
    [106.5385, 29.628509, 100],
    [106.534672, 29.640405, 100],
    [106.508095, 29.602003, 350]
  ]

  pointLightArr.map((t) => {
    let item = new Loca.PointLight({
      color: "#5c1bcd",
      position: t,
      intensity: 5,
      // 距离表示从光源到光照强度为 0 的位置，0 就是光不会消失。
      distance: 500
    })
    loca.value.addLight(item)
  })
}

const drawBounds = () => {
  // 创建行政区查询对象
  const district = new AMap.DistrictSearch({
    subdistrict: 0, //获取边界不需要返回下级行政区
    extensions: "all", //返回行政区边界坐标组等具体信息
    level: "district" //查询行政级别为 市
  })

  district.setLevel("district")
  district.search("渝北区", (status: any, result: { districtList: { boundaries: any }[] }) => {
    // // 获取边界信息
    // let bounds = result.districtList[0].boundaries
    // let polygons = null
    // if (bounds) {
    //   //生成行政区划polygon
    //   for (var i = 0; i < bounds.length; i += 1) {
    //     //构造MultiPolygon的path
    //     bounds[i] = [bounds[i]]
    //   }
    //   polygons = new AMap.Polygon({
    //     strokeWeight: 2,
    //     path: bounds,
    //     zIndex: 1,
    //     fillOpacity: 0.1,
    //     fillColor: "#f9f9ec",
    //     strokeColor: "#6a26a8"
    //   })
    // }

    // 外多边形坐标数组和内多边形坐标数组
    var outer = [
      new AMap.LngLat(-360, 90, true),
      new AMap.LngLat(-360, -90, true),
      new AMap.LngLat(360, -90, true),
      new AMap.LngLat(360, 90, true)
    ]
    var holes = result.districtList[0].boundaries
    // console.log('holes', result.districtList[0].boundaries)
    var pathArray = [outer]
    pathArray.push.apply(pathArray, holes)
    // console.log('pathArray', pathArray)
    var polygon = new AMap.Polygon({
      path: pathArray,
      strokeColor: "#00eeff",
      strokeWeight: 2, // 线宽
      fillColor: "#000",
      fillOpacity: 1
    })
    polygon.setPath(pathArray) // 多边形轮廓线的节点坐标数组。

    Map.value.add(polygon)
    polygon.on("click", (e: any) => {
      showInfoClick(e)
    })
    // Map.value.setFitView(polygons) //视口自适应
  })
}

const getLakes = () => {
  let geo = new Loca.GeoJSONSource({
    data: lake
  })
  addPolygonLayer(geo)
}

const getRiverData = () => {
  let geo = new Loca.GeoJSONSource({
    data: riverMock
  })
  addPulseLineLayer(geo)
}

const breathPoints = (t: any) => {
  // 红色呼吸点
  // const errorPoints = pointsMock.errorPoints.map((t) => {
  const errorPoints = t.map((t: any) => {
    return {
      type: "Feature",
      properties: {
        texture: "//a.amap.com/Loca/static/loca-v2/demos/images/breath_red.png"
      },
      geometry: {
        type: "Point",
        coordinates: t
      }
    }
  })
  let errorP = new Loca.GeoJSONSource({
    data: {
      type: "FeatureCollection",
      features: errorPoints
    }
  })
  // // 黄色呼吸点
  // const warnPoints = pointsMock.warnPoints.map((t) => {
  //   return {
  //     type: "Feature",
  //     geometry: {
  //       type: "Point",
  //       coordinates: t
  //     },
  //     properties: {}
  //   }
  // })
  // let warnP = new Loca.GeoJSONSource({
  //   data: {
  //     type: "FeatureCollection",
  //     features: warnPoints
  //   }
  // })
  addScatterLayer(errorP, "error")
  // addScatterLayer(warnP, "warn")
}

const getJcdData = () => {
  const layers = [1, 2]
  const factors = [1, 2, 3, 4, 5, 6, 7, 8, 12]
  river
    .findFacilityPerception({
      facilityType: layers.join(","),
      perceptionType: factors.join(","),
      target: ""
    })
    .then((res) => {
      addJcdMarkers(res)

      //   })
      // river.points({}).then((res) => {
    })
}

// 点击
const showInfoClick = (e: any) => {
  console.log("showInfoClick", [e.lnglat.getLng(), e.lnglat.getLat()]) //记录最后一次点击的经纬度
}

// 标注文本
const addText = (data: any) => {
  let text = new AMap.Text({
    zIndex: 60,
    text: "",
    anchor: "center", // 设置文本标记锚点
    cursor: "pointer",
    offset: [0, -28],
    style: {
      padding: "8px 14px",
      "margin-bottom": "1rem",
      "background-image": "linear-gradient(to right,#0a715088,#038684,#2f6ff088,#00000043)",
      "background-color": "rgba(0,0,0,0.3)",
      "text-align": "center",
      "font-size": "16px",
      "border-radius": "6px",
      border: "1px solid #038643",
      color: "#fff"
    }
  })

  Map.value.add(text)

  text.on("click", (e: any) => {
    let feat = data.queryFeature(e.pixel.toArray())
    if (feat) {
      showDetail.value = true
      detailInfo.value = feat.properties || null
      openChildDialog("shuiku", detailInfo.value)
    }
  })

  Map.value.on("mousemove", (e: any) => {
    let feat = data.queryFeature(e.pixel.toArray())
    if (feat) {
      text.show()
      text.setText(feat.properties.name)
      text.setPosition(e.lnglat)
    } else {
      text.hide()
    }
  })
}

// 标注牌-自定义
const addPrismLayer = (geo: any) => {
  const feat = geo.options.data.features
  feat.map((t: any) => {
    let tips = new AMap.Marker({
      zIndex: 60,
      anchor: "bottom-center",
      position: [t.geometry.coordinates[0], t.geometry.coordinates[1], 1000],
      content: `<div text-sm rounded color-white py-1 px-2
            style="background-image:linear-gradient(to right,#0a715088,#116b6a,#0a715088,#00000043);
            border:1px solid #0a71507d;">${t.properties.name}</div>`
    })
    Map.value.add(tips)
    tips.on("click", () => {
      showDetail.value = true
      detailInfo.value = t || null
    })
  })
  let tip = new Loca.PrismLayer({
    zIndex: 60,
    opacity: 1,
    visible: true,
    hasSide: true
  })
  tip.setSource(geo)
  tip.setStyle({
    unit: "meter",
    sideNumber: 2,
    topColor: "#E97091",
    sideTopColor: "#fbfbfb",
    sideBottomColor: "#fbfbfb",
    height: 1000,
    rotation: 360,
    altitude: 0
  })
  loca.value.add(tip)
}

// 河流
const addPulseLineLayer = (geo: any) => {
  let riverColors = ["#7F3CFF", "#4CC19B", "#E06AC4", "#ffb73f", "#F15C1A", "#7A0FA6"]
  let layer = new Loca.PulseLineLayer({
    zIndex: 10,
    opacity: 1,
    visible: true,
    zooms: [10, 22]
  })
  layer.setSource(geo)
  layer.setStyle({
    altitude: 0,
    lineWidth: 2,
    // 脉冲头颜色
    headColor: (_: any, feature: any) => {
      return riverColors[(feature.properties.type - 1) % 6]
    },
    // 脉冲尾颜色
    trailColor: "rgba(128, 128, 128, 0.5)",
    // 脉冲长度，0.25 表示一段脉冲占整条路的 1/4
    interval: 0.25,
    // 脉冲线的速度，几秒钟跑完整段路
    duration: 5000
  })
  loca.value.add(layer)
  loca.value.animate.start()
}

// 湖库
const addPolygonLayer = (geo: any) => {
  let polygon = new Loca.PolygonLayer({
    zIndex: 20,
    cullface: "none",
    shininess: 10,
    hasSide: true
    // cullface: 'none'
  })
  polygon.setSource(geo)
  polygon.setStyle({
    topColor: "#26b688",
    sideTopColor: "#0a7150",
    sideBottomColor: "#1a232c",
    height: 20,
    altitude: 0
  })
  loca.value.add(polygon)
  addText(polygon)
  // let text = new AMap.Text({
  //   zIndex: 60,
  //   text: "",
  //   anchor: "center", // 设置文本标记锚点
  //   cursor: "pointer",
  //   offset: [0, -28],
  //   style: {
  //     padding: "8px 14px",
  //     "margin-bottom": "1rem",
  //     "background-image": "linear-gradient(to right,#0a715088,#038684,#2f6ff088,#00000043)",
  //     "background-color": "rgba(0,0,0,0.3)",
  //     "text-align": "center",
  //     "font-size": "16px",
  //     "border-radius": "6px",
  //     border: "1px solid #038643",
  //     color: "#fff"
  //   }
  // })

  // Map.value.add(text)

  // text.on("click", (e: any) => {
  //   let feat = polygon.queryFeature(e.pixel.toArray())
  //   if (feat) {
  //     showDetail.value = true
  //     detailInfo.value = feat.properties || []
  //   }
  // })

  // Map.value.on("mousemove", (e: any) => {
  //   let feat = polygon.queryFeature(e.pixel.toArray())
  //   if (feat) {
  //     text.show()
  //     text.setText(feat.properties.name)
  //     text.setPosition(e.lnglat)
  //   } else {
  //     text.hide()
  //   }
  // })
}

// 呼吸点
const addScatterLayer = (geo: any, type: any) => {
  let texture = {
    error: "//a.amap.com/Loca/static/loca-v2/demos/images/breath_red.png",
    warn: "//a.amap.com/Loca/static/loca-v2/demos/images/breath_yellow.png"
  }
  let breathP = new Loca.ScatterLayer({
    zIndex: 50,
    opacity: 1,
    visible: true,
    zooms: [2, 22]
  })
  breathP.setSource(geo)
  breathP.setStyle({
    unit: "px",
    size: [40, 40],
    borderWidth: 0,
    texture: texture[type],
    // texture: "//a.amap.com/Loca/s tatic/loca-v2/demos/images/breath_red.png",
    duration: 1500,
    animate: true
  })
  loca.value.add(breathP)
}

// 标注点
const addMarkers = () => {
  // 创建一个 Icon
  let startIcon = new AMap.Icon({
    // 图标尺寸
    size: new AMap.Size(36, 36),
    // 图标的取图地址
    image: "/src/assets/map/sw.png",
    // 图标所用图片大小
    imageSize: new AMap.Size(36, 36),
    // 图标取图偏移量
    imageOffset: new AMap.Pixel(0, 0)
  })

  // 将 icon 传入 marker
  let jcd = new AMap.Marker({
    position: new AMap.LngLat(106.5175308, 29.62026114),
    icon: startIcon,
    offset: new AMap.Pixel(-13, -30)
  })

  // 创建一个 icon
  let endIcon = new AMap.Icon({
    size: new AMap.Size(25, 34),
    image: "//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png",
    imageSize: new AMap.Size(135, 40),
    imageOffset: new AMap.Pixel(-95, -3)
  })
  // 将 icon 传入 marker
  let t = [
    [106.48818677796777, 29.612747054680327],
    [106.48242259849653, 29.608140029673613],
    [106.4929398161423, 29.61647766103804]
  ]
  const test = CoordTransform.wgs84togcj02([106.4929398161423, 29.61647766103804])

  let endMarker = new AMap.Marker({
    position: new AMap.LngLat(test[0], test[1]),
    icon: endIcon,
    offset: new AMap.Pixel(-13, -30)
  })
  // 将 markers 添加到地图
  Map.value.add([jcd, endMarker])
}

// 监测点
const addJcdMarkers = (res: any) => {
  let sz: number[][] = []
  res.data.map((l: any) => {
    // detectionType:1水质站 2水位 3气象站 4流量站 5视频 6液位站 7毒气站 8河长牌 9流速 12语音播报
    const longlat = CoordTransform.wgs84togcj02([parseFloat(l.longitude), parseFloat(l.latitude)])
    if (l.longitude && l.latitude) {
      const info = []
      let title = ""
      let msg = ""
      let style = ""
      let iconStatus = ""
      if (l.deviceStatus == 1) {
        title = "设备信息"
        msg = l.deviceName
        style = `
          background: rgba(0, 0, 48, 0.8);
          border: 1px solid rgba(81, 81, 189, 1);
          box-shadow: 0 0 10px rgba(81, 81, 189, 1);
        `
        iconStatus = `${l.detectionType}_1`
      } else {
        if (l.alarmInfo && l.detectionType != 5) {
          title = "报警提示"
          msg = `${l.deviceName}:${l.alarmInfo.alarmName} `
          style = `
          border: 1px solid #bc515c;
          box-shadow: 0 0 10px #bc515c;
          background: rgba(48, 0, 5, 0.8);
        `
          iconStatus = `${l.detectionType}_2`
        } else if (!l.lastRevTime && l.detectionType != 5) {
          title = "离线提示"
          msg = `${l.deviceName}:设备已离线`
          style = `
          border: 1px solid #bdbdbd;
          background: rgba(48, 48, 48, 0.8);
          box-shadow: 0 0 10px #bdbdbd;
        `
          iconStatus = `${l.detectionType}_0`
        } else {
          title = "故障提示"
          msg = l.deviceName + "设备故障"
          style = `
          border: 1px solid #bdbdbd;
          background: rgba(48, 48, 48, 0.8);
          box-shadow: 0 0 10px #bdbdbd;
        `
          iconStatus = `${l.detectionType}_0`
        }
      }
      info.push(
        `<div relative text-sm rounded color-white p2 style="${style}">
          <span class="animate-pulse inline-flex h-2 w-2 rounded-full bg-white opacity-75"></span>
          <span p2 font-bold >${title}:</span>
          <li mt-2>${msg}</li>
        </div> `
      )
      const infoWindow = new AMap.InfoWindow({
        isCustom: true, //使用自定义窗体
        content: info.join(""),
        offset: new AMap.Pixel(0, -18)
      })

      // 水质测站中断报警呼吸点
      if (l.detectionType === "1" && l.alarmInfo) {
        sz.push(longlat)
      }
      let setIcon = new AMap.Icon({
        zIndex: 20,
        image: mapIcons[iconStatus],
        imageSize: new AMap.Size(32, 32)
      })
      let jcd = new AMap.Marker({
        zIndex: 50,
        position: longlat,
        icon: setIcon,
        offset: new AMap.Pixel(-16, -30)
      })
      jcd.on("mousemove", () => {
        infoWindow.open(Map.value, jcd.getPosition())
      })
      jcd.on("mouseout", () => {
        infoWindow.close()
      })
      jcd.on("click", () => {
        detailInfo.value = l
        openChildDialog(l.detectionType, detailInfo.value)
      })
      Map.value.add(jcd)
    }
  })
  breathPoints(sz)
}

const openChildDialog = (type: any, config: any) => {
  let com = null
  let setWidth = "680px"
  let setFooter = true
  switch (type) {
    case "5":
      com = SP
      setWidth = "780px"
      setFooter = false
      break
    default:
      com = JCD
      break
  }
  addDialog({
    title: config.deviceName || config.name,
    width: setWidth,
    props: {
      config
    },
    footer: setFooter,
    component: com,
    callBack: (config: any) => {
      //当弹窗任务结束后，调用父页面的回掉函数。（比如我新增完成了需要刷新列表页面）
      console.log("回调函数", config)
    }
  })
}
// 动步公园-自定义
const adddDongbuPark = () => {
  let geo = new Loca.GeoJSONSource({
    data: dongbuPark
  })
  let polygon = new Loca.PolygonLayer({
    zIndex: 20,
    cullface: "none",
    shininess: 1
  })

  polygon.setSource(geo)
  polygon.setStyle({
    topColor: (_: any, feature: any) => {
      return feature.properties.color
    },
    sideTopColor: "#ffb170",
    sideBottomColor: "#ffb170",
    height: (_: any, feature: any) => {
      return feature.properties.height
    },
    altitude: 0
  })
  loca.value.add(polygon)

  let text = new AMap.Text({
    zIndex: 60,
    text: "",
    anchor: "center", // 设置文本标记锚点
    cursor: "pointer",
    offset: [0, -28],
    style: {
      padding: "8px 14px",
      "margin-bottom": "1rem",
      "background-image": "linear-gradient(to right,#0a715088,#038684,#2f6ff088,#00000043)",
      "background-color": "rgba(0,0,0,0.3)",
      "text-align": "center",
      "font-size": "16px",
      "border-radius": "6px",
      border: "1px solid #038643",
      color: "#fff"
    }
  })

  Map.value.add(text)

  text.on("click", (e: any) => {
    let feat = polygon.queryFeature(e.pixel.toArray())
    if (feat) {
      showDetail.value = true
      detailInfo.value = geo.options.data.name || null
      openChildDialog("gongyuan", detailInfo.value)
    }
  })
  Map.value.on("mousemove", (e: any) => {
    let feat = polygon.queryFeature(e.pixel.toArray())
    if (feat) {
      text.show()
      text.setText(geo.options.data.name)
      text.setPosition(e.lnglat)
    } else {
      text.hide()
    }
  })
}

// 标牌点
const addZMarker = (geo: any) => {
  // 文字主体图层
  let zMarker = new Loca.ZMarkerLayer({
    zIndex: 120,
    depth: false
  })
  zMarker.setSource(geo)
  zMarker.setStyle({
    content: (_: any, feature: any) => {
      let props = feature.properties
      let leftColor = "#0a715088"
      let rightColor = props.type ? "#038684" : "rgba(172, 137, 51, 0.3)"
      let borderColor = props.type ? "#2f6ff088" : "rgba(172, 137, 51, 1)"
      return `<div style="width: 490px; height: 228px; padding: 0 0;">
          <p style="display: block; height:80px; line-height:80px;
            font-size:40px;background-image: linear-gradient(to right,#0a715088,#038684,#2f6ff088,#00000043);
            border:4px solid #038643;color:#fff; border-radius: 15px; text-align:center; margin:0; padding:5px;">
            ${props.name}
          </p>
          <span style="width: 6px; height: 240px; margin: 0 auto; display: block; background: #038684"></span>
        </div>`
    },
    unit: "px",
    rotation: 0,
    alwaysFront: true,
    size: [160, 90],
    altitude: 0
  })
  // 浮动三角
  let triangleZMarker = new Loca.ZMarkerLayer({
    // loca,
    zIndex: 60,
    depth: false
  })
  triangleZMarker.setSource(geo)
  triangleZMarker.setStyle({
    content: (feat: any) => {
      return (
        '<div style="width: 120px; height: 120px; background: url(https://a.amap.com/Loca/static/loca-v2/demos/images/triangle_' +
        "blue" +
        '.png);"></div>'
      )
    },
    unit: "px",
    rotation: 0,
    alwaysFront: true,
    size: [80, 80],
    altitude: 15
  })
  triangleZMarker.addAnimate({
    key: "altitude",
    value: [0, 1],
    random: true,
    transform: 1000,
    delay: 2000,
    yoyo: true,
    repeat: 999999
  })

  loca.value.animate.start()
  loca.value.add(zMarker)
  loca.value.add(triangleZMarker)
}

onMounted(() => {
  initMap()
})

onUnmounted(() => {})
</script>
<style>
.app {
  cursor: pointer;
  color: rgb(52, 57, 106);
  background-color: #1a232c;
  background-image: linear-gradient(to right, #0a715088, #038684, #2f6ff088, #00000043);
}
li {
  list-style: none;
}
</style>
