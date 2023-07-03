<template>
  <div class="map-box" id="map-box" ref="mapBox"></div>
</template>
<script lang="ts" setup>
import { ref, shallowRef, onBeforeMount, onMounted, onUnmounted } from "vue"

import "ol/css"
import { fromLonLat } from "ol/proj"
import Map from "ol/Map"
import View from "ol/View"
import { ImageArcGISRest, TileArcGISRest, XYZ, ImageWMS, Vector as VectorSource } from "ol/source"
import {
  Image as ImageLayer,
  Tile as TileLayer,
  Vector as VectorLayer,
  Group as LayerGroup,
  Heatmap as HeatmapLayer
} from "ol/layer"
import { defaults as Defaults, OverviewMap } from "ol/control"

// import XYZ from "ol/source/XYZ"
import { register } from "ol/proj/proj4"
import TileGrid from "ol/tilegrid/TileGrid"
import Projection from "ol/proj/Projection"

import mapRes from "@/config/json/map/dispatch-config.json"

const OMap = shallowRef()
const OLayer = shallowRef() // 默认图层，永远呈现在地图的最上方

const initMap = () => {
  const view = mapRes?.view
  const projection = new Projection({
    code: view.projection.code,
    extent: view.projection.extent
  })
  OMap.value = new Map({
    // layers: [],
    layers: [
      new TileLayer({
        source: new XYZ({
          url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}"
          // url: "http://dt.cqmap.cn/GKTile/WMS.svc/GetTileX10_3?layer=liangjiang_meikeyuan_5&level={l}&row={r}&col={c}"
        })
      })
    ],
    view: new View({
      projection: projection,
      resolutions: view.resolutions,
      zoom: view.zoom,
      minZoom: view.minZoom,
      maxZoom: view.maxZoom,
      center: view.center,
      extent: view.extent
    }),
    target: "map-box" // 地图的dom
  })
  OLayer.value = new VectorLayer({
    OMap,
    source: new VectorSource()
  })
  initOverviewMap()
}
const initOverviewMap = () => {
  const map = OMap.value
  const view = mapRes?.view
  const tileGridConfig = mapRes?.tileGrid
  const layers = mapRes?.layers

  const projection = new Projection({
    code: view.projection.code,
    extent: view.projection.extent
  })
  const tileGrid = new TileGrid({
    origin: tileGridConfig.origin,
    extent: tileGridConfig.extent,
    resolutions: tileGridConfig.resolutions
  })
  const baseLayer = layers.find((l) => l.name === "base")
  if (baseLayer) {
    const olayers = []
    baseLayer.source.forEach((s) => {
      let layer = {}
      if (s.type === "xyz") {
        layer = new TileLayer({
          source: new XYZ({
            projection: projection,
            tileGrid,
            url: s.url
          })
        })
      }
      if (layer) {
        olayers.push(layer)
      }
    })
    console.log("object", olayers)
    const overviewMap = new OverviewMap({ layers: olayers })
    OMap.value.addControl(overviewMap)
  }
}
onMounted(() => {
  initMap()
})
</script>
<style>
.map-box {
  width: 100%;
  height: 100%;
}
</style>
