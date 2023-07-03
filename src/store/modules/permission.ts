import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { type RouteRecordRaw } from "vue-router"
import { constantRoutes, asyncRoutes } from "@/router"
import { sys } from "@/api/index"
import Layout from "@/layout/index.vue"
// import NewLayout from "@/components/newLayout/index.vue"
import ParentView from "@/components/ParentView/index.vue"

// import { type ILoginRequestData, loginApi, getUserInfoApi } from "@/api/login"

// const userStore = useUserStoreHook()

const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => {
      if (route.meta?.roles !== undefined) {
        return route.meta.roles.includes(role)
      } else {
        return false
      }
    })
  } else {
    return true
  }
}

const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
  const res: RouteRecordRaw[] = []
  routes.forEach((route) => {
    const r = { ...route }
    if (hasPermission(roles, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, roles)
      }
      res.push(r)
    }
  })
  return res
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRoutes1(asyncRouterMap: any, lastRouter = false, type = true) {
  return asyncRouterMap.filter((route: any) => {
    if (type && route.children && route.children.length > 0) {
      route.children = filterChildren(route.children, route.path)
      route.redirect = route.children[0] && route.children[0].path
    }

    if (route.component) {
      if (route.customizeComponent) {
        // route.component = NewLayout
      } else if (route.component === "Layout") {
        route.component = Layout
      } else if (route.component === "ParentView") {
        route.component = ParentView
      } else if (route.component.startsWith("http")) {
        route.component = loadView("newSystem/iframe/index")
        route.path = "/newsystem/iframe/index"
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRoutes1(route.children, route, type)
    } else {
      delete route["children"]
      delete route["redirect"]
    }
    return true
  })
}
const loadView = (view: string) => {
  // 路由懒加载
  return (resolve) => require([`@/views/${view}`], resolve)
}
// 配置path字段
const filterChildren = (childrenMap: Array<Object>, lastRouter: string[]) => {
  const children = []
  childrenMap.forEach((el) => {
    children.push({
      ...el,
      path:
        el.path.startsWith("/") || el.path.startsWith("http")
          ? el.path
          : (lastRouter == "/" ? "" : lastRouter) + "/" + el.path
    })
  })
  return children
}

export const usePermissionStore = defineStore("permission", () => {
  const routesConfig = ref<RouteRecordRaw[]>([])
  const dynamicRoutesConfig = ref<RouteRecordRaw[]>([])
  const localRoutesConfig = ref<RouteRecordRaw[]>([])
  const activeRouteConfig = ref<RouteRecordRaw[]>([])

  const SET_ACTIVEROUTE = async (route: RouteRecordRaw[]) => {
    activeRouteConfig.value = route
  }
  const setRoutes = async (roles: string[]) => {
    let onlineRoutes: any
    let local: any
    let topRoutes: any
    // onlineRoutes
    const getRoutes = await sys.getRoutersApi()
    const route = getRoutes.data.filter((t: any) => t.isPlatform === "1")
    onlineRoutes = filterAsyncRoutes1(route)
    onlineRoutes.push({ path: "*", redirect: "/404", hidden: true })
    topRoutes = onlineRoutes.filter(
      (it) => it.meta && it.meta.title && (it as any).customizeComponent && !(it as any).hidden
    )
    // local routes
    if (roles.includes("admin")) {
      local = asyncRoutes
    } else {
      local = filterAsyncRoutes(asyncRoutes, roles)
    }

    routesConfig.value = constantRoutes.concat(onlineRoutes)
    dynamicRoutesConfig.value = onlineRoutes
    localRoutesConfig.value = constantRoutes.concat(local)
    activeRouteConfig.value = topRoutes[0]
  }

  return { routesConfig, dynamicRoutesConfig, localRoutesConfig, activeRouteConfig, setRoutes, SET_ACTIVEROUTE }
})

/** 在 setup 外使用 */
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
