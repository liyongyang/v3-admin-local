<script lang="ts" setup>
import { ref, computed, watch, onMounted, nextTick } from "vue"
import { type RouteLocationMatched, useRoute, useRouter } from "vue-router"
import { compile } from "path-to-regexp"
import { usePermissionStore } from "@/store/modules/permission"

const route = useRoute()
const router = useRouter()
const permissionStore = usePermissionStore()

const breadcrumbs = ref<RouteLocationMatched[]>([])
const idx = ref(0)

const topRoutes = computed(() => {
  const r = permissionStore.dynamicRoutesConfig.filter(
    (it) => it.meta && it.meta.title && (it as any).customizeComponent && !(it as any).hidden
  )
  const r2 = [
    {
      meta: {
        title: "数据建模"
      }
    },
    {
      meta: {
        title: "数据接入"
      }
    },
    {
      meta: {
        title: "数据处理"
      }
    },
    {
      meta: {
        title: "存储管理"
      }
    },
    {
      meta: {
        title: "数据服务"
      }
    },
    {
      meta: {
        title: "系统管理"
      }
    }
  ]
  return r2
})

const handleLink = (data: RouteLocationMatched, i: number) => {
  idx.value = i
  ;(permissionStore as any).SET_ACTIVEROUTE(data)

  // this.$router.push(data.redirect||data.path)
  // const { redirect, path } = item
  // if (redirect) {
  //   router.push(redirect as string)
  //   return
  // }
  // router.push(pathCompile(path))
}
const getBreadcrumb = () => {
  breadcrumbs.value = route.matched.filter((item) => {
    return item.meta && item.meta.title && item.meta.breadcrumb !== false
  })
}

const pathCompile = (path: string) => {
  const { params } = route
  const toPath = compile(path)
  return toPath(params)
}

watch(
  () => route.path,
  (path) => {
    if (path.startsWith("/redirect/")) {
      return
    }
    getBreadcrumb()
  }
)

getBreadcrumb()
</script>

<template>
  <div flex>
    <div
      op60
      hover="op100"
      @click="handleLink(it, i)"
      v-for="(it, i) in topRoutes"
      :key="i"
      :class="i === idx ? 'menu-active' : 'menu-defult'"
      h-full
      uno-flex-center
      uno-pading-0-20
    >
      <div class="iconbox">
        <!-- <i class="iconfont fs-30" :class="it.meta.icon" /> -->
        <div class="fs-28 oneline bold" fw700>{{ it.meta.title }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu-active {
  opacity: 1;
  cursor: pointer;
  background: url(@/assets/layout/menu-active.png) no-repeat center;
  background-size: 100% 100%;
}
.menu-defult {
  // opacity: 0.5;
  cursor: pointer;
}
</style>
