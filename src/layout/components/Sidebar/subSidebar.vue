<script lang="ts" setup>
import { ref, computed, watch } from "vue"
import { useRoute } from "vue-router"
import { storeToRefs } from "pinia"
import { useAppStore } from "@/store/modules/app"
import { usePermissionStore } from "@/store/modules/permission"
import { useSettingsStore } from "@/store/modules/settings"
import SubSidebarItem from "./subSidebarItem.vue"
import { getCssVariableValue } from "@/utils"

const v3SidebarMenuBgColor = getCssVariableValue("--v3-sidebar-menu-bg-color")
const v3SidebarMenuTextColor = getCssVariableValue("--v3-sidebar-menu-text-color")
const v3SidebarMenuActiveTextColor = getCssVariableValue("--v3-sidebar-menu-active-text-color")

const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()
const settingsStore = useSettingsStore()

const { showSubSlider } = storeToRefs(settingsStore)

const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta?.activeMenu) {
    return meta.activeMenu
  }
  return path
})
const getRoutes = computed(() => {
  // const routes = [...permissionStore.dynamicRoutesConfig]
  // routes.pop()
  // return routes.filter((it) => it.name === (permissionStore.activeRouteConfig as any).name)[0]

  const routes = [...permissionStore.localRoutesConfig]
  return routes
})

const isCollapse = computed(() => {
  return !appStore.sidebar.opened
})

watch(
  () => route.path,
  (newPath, oldPath) => {
    console.log("newPath", newPath)
  },
  { immediate: true }
)
const sliderShow = () => {
  showSubSlider.value = !showSubSlider.value
}
</script>

<template>
  <div class="container">
    <div
      class="slider-show bottom-1/2"
      uno-flex-center
      cursor-pointer
      absolute
      w-5
      h-20
      right--5
      z-4
      rounded-r-4
      @click="sliderShow()"
    >
      <el-icon v-if="showSubSlider" animate-pulse color="white"><ArrowRightBold /></el-icon>
      <el-icon v-else animate-pulse color="white"><ArrowLeftBold /></el-icon>
    </div>
    <div v-show="showSubSlider">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :text-color="v3SidebarMenuTextColor"
        :active-text-color="v3SidebarMenuActiveTextColor"
        :unique-opened="true"
        :collapse-transition="false"
      >
        <SubSidebarItem />
      </el-menu>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
  .slider-show {
    background-color: var(--el-color-primary);
  }
}
.container-hiden {
  transition-duration: 0.5s;
}
@mixin tip-line {
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 100%;
    background-color: var(--v3-sidebar-menu-tip-line-bg-color);
  }
}

.el-scrollbar {
  height: 100%;
  :deep(.scrollbar-wrapper) {
    // 限制水平宽度
    overflow-x: hidden !important;
    .el-scrollbar__view {
      height: 100%;
    }
  }
  // 滚动条
  :deep(.el-scrollbar__bar) {
    &.is-horizontal {
      // 隐藏水平滚动条
      display: none;
    }
  }
}

.el-menu {
  border: none;
  height: 100%;
  width: 100% !important;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title),
:deep(.el-sub-menu .el-menu-item) {
  height: var(--v3-sidebar-menu-item-height);
  line-height: var(--v3-sidebar-menu-item-height);
  &.is-active,
  &:hover {
    background-color: var(--v3-sidebar-menu-hover-bg-color);
  }
  display: block;
  * {
    vertical-align: middle;
  }
}

:deep(.el-menu-item) {
  &.is-active {
    @include tip-line;
  }
}

.el-menu--collapse {
  :deep(.el-sub-menu) {
    &.is-active {
      .el-sub-menu__title {
        color: var(--v3-sidebar-menu-active-text-color) !important;
        @include tip-line;
      }
    }
  }
}
</style>
