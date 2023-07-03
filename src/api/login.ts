import { request } from "@/utils/service"

export interface ILoginRequestData {
  /** admin 或 editor */
  username: "admin" | "editor"
  /** 密码 */
  password: string
  /** 验证码 */
  // code: string
}

// type LoginCodeResponseData = IApiResponseData<string>
type LoginResponseData = IApiResponseData<{ token: string }>
type UserInfoResponseData = IApiResponseData<{ username: string; roles: string[] }>

class Login {
  /** 获取登录验证码 */
  // getLoginCodeApi() {
  //   return request<LoginCodeResponseData>({
  //     url: "login/code",
  //     method: "get"
  //   })
  // }

  /** 登录并返回 Token */
  loginApi(data: ILoginRequestData) {
    return request<LoginResponseData>({
      url: "/auth/login",
      method: "post",
      data
    })
  }
  /** 获取用户详情 */
  getUserInfoApi() {
    return request<UserInfoResponseData>({
      url: "/system/user/getInfo",
      method: "get"
    })
  }
  /** 获取路由 */
  getRoutersApi() {
    return request<UserInfoResponseData>({
      url: "/system/menu/getRouters",
      method: "get"
    })
  }
}
export const login = new Login()
