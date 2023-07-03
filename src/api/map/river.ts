import { request } from "@/utils/service"

class River {
  riverBasinId = 1
  points(params: any) {
    params.riverBasinId = this.riverBasinId
    return request<any>({
      url: "/wrb-modules-device/devicepoint/list",
      method: "post",
      params
    })
  }
  //地图加载感知设施
  findFacilityPerception(params: any) {
    params.riverBasinId = this.riverBasinId
    return request<any>({
      url: "/wrb-modules-device/oneMapBasin/findFacilityPerception",
      method: "get",
      params
    })
  }
  //查询单个监测点详情数据
  getDetail(params: any) {
    return request<any>({
      url: "/wrb-modules-device/devicepoint/getDetail",
      method: "post",
      params
    })
  }
}
export const river = new River()
