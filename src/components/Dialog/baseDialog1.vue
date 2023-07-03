<template>
  <el-button text @click="centerDialogVisible = true">{{ title || "open" }} </el-button>

  <el-dialog v-model="centerDialogVisible" :title="title" width="60%" align-center center>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="centerDialogVisible = false"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { ref } from "vue"

export default {
  name: "BaseDialog",

  props: {
    title: String
  },
  setup() {
    const centerDialogVisible = ref(false)
    return {
      centerDialogVisible
    }
  },
  methods: {
    show() {
      this.centerDialogVisible = true
    }
  }
}
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
