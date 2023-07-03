import { request } from "@/utils/service"

class Devices {
  //查询单个监测点详情数据
  getDetail(params: Object) {
    return request<any>({
      url: "/wrb-modules-device/devicepoint/getDetail",
      method: "post",
      params
    })
  }
}
export const devices = new Devices()
