<template>
  <!-- <Teleport to="body"> -->
  <el-dialog
    align-center="true"
    v-for="(item, index) in dialogList"
    :key="index"
    :title="item.title"
    :width="item.width"
    v-model="item.visible"
    @close="() => closeDialog(item, index, '', true)"
  >
    <template #header>
      <span class="absolute inline-flex rounded-full h-4 w-4 bg-white"></span>
      <span class="animate-pulse absolute m1 inline-flex h-2 w-2 rounded-full bg-blue-500 opacity-75"></span>
      <span mx-6>{{ item.title }} </span>
    </template>
    <component :is="item.component" v-bind="item.props" @close="(...args:any) => closeDialog(item, index, args)" />
    <template v-if="item.footer" #footer>
      <span class="dialog-footer"></span>
    </template>
  </el-dialog>
  <!-- </Teleport> -->
</template>

<script setup lang="ts">
import { dialogList, closeDialog } from "./index"
</script>
