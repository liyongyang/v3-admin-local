import { request } from "@/utils/service"

type RoutesResponseData = IApiResponseData<{ data: any }>

class Sys {
  /** 获取路由 */
  getRoutersApi() {
    return request<RoutesResponseData>({
      url: "/system/menu/getRouters",
      method: "get"
    })
  }
}
export const sys = new Sys()
