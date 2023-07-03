<template>
  <el-dialog class="container" v-model="dialogVisible" width="600px" align-center draggable>
    <template #header>
      <div flex h-9 leading-9 p-l-2 class="head">
        <span class="rela relative h-3 w-3">
          <span class="animate-ping absolute top-3 inline-flex h-3 w-3 rounded-full bg-purple-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-purple-800"></span>
        </span>
        <span m-x-2>{{ type ? "新增实体属性" : "修改实体属性" }}</span>
      </div>
    </template>
    <el-form
      v-if="type"
      ref="addFormRef"
      :model="addForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      size="default"
      status-icon
    >
      <el-form-item prop="cname" label="中文名">
        <el-input v-model="addForm.cname" clearable />
      </el-form-item>
      <el-form-item prop="ename" label="英文名">
        <el-input v-model="addForm.ename" clearable />
      </el-form-item>
      <el-form-item prop="type" label="属性类型">
        <el-select v-model="addForm.type" class="m-2" placeholder="Select">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="notOnly" label="是否允许多值">
        <el-switch v-model="addForm.notOnly" />
      </el-form-item>
      <el-form-item prop="desc" label="描述">
        <el-input :rows="2" type="textarea" v-model="addForm.desc" clearable />
      </el-form-item>
    </el-form>
    <el-form
      v-else
      ref="updateFormRef"
      :model="currRow"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      size="default"
      status-icon
    >
      <el-form-item prop="cname" label="中文名">
        <el-input v-model="currRow.cname" />
      </el-form-item>
      <el-form-item prop="ename" label="英文名">
        <el-input v-model="currRow.ename" />
      </el-form-item>
      <el-form-item prop="type" label="类型">
        <el-select v-model="currRow.type" class="m-2" placeholder="Select">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="notOnly" label="是否允许多值">
        <el-switch v-model="currRow.notOnly" />
      </el-form-item>
      <el-form-item prop="desc" label="描述">
        <el-input :rows="2" type="textarea" v-model="currRow.desc" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="updateForm(type ? addFormRef : updateFormRef)"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { ref, reactive, watch } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"

export default {
  name: "tableDialog",

  props: {
    type: Boolean,
    currRow: Object
  },

  setup(props, { expose }) {
    const options = [
      {
        value: "rlogin://qhmuhjqg.mq/hnnwhudip",
        label: "Option1"
      },
      {
        value: "Option2",
        label: "Option2"
      },
      {
        value: "Option3",
        label: "Option3"
      },
      {
        value: "Option4",
        label: "Option4"
      },
      {
        value: "Option5",
        label: "Option5"
      }
    ]
    const dialogVisible = ref(false)
    const addFormRef = ref<FormInstance>()
    const updateFormRef = ref<FormInstance>()
    const addForm = reactive({
      cname: "",
      ename: "",
      type: "",
      notOnly: true,
      desc: ""
    })
    const rules = reactive<FormRules>({
      cname: [{ required: true, trigger: "blur", message: "请输入中文名" }],
      ename: [{ required: true, trigger: "blur", message: "请输入英文名" }],
      type: [{ required: true, trigger: "change", message: "请选择属性类型" }]
    })
    const show = () => {
      dialogVisible.value = true
      if (!addFormRef.value) return
      addFormRef.value.resetFields()
    }
    const close = () => {
      dialogVisible.value = false
    }
    const submitForm = async (formEl: FormInstance | undefined) => {
      if (!formEl) return
      await formEl.validate((valid, fields) => {
        if (valid) {
          dialogVisible.value = false
          ElMessage({
            message: "submit",
            type: "success"
          })
          console.log("submit!")
        } else {
          console.log("error submit!", fields)
        }
      })
    }
    const updateForm = async (formEl: FormInstance | undefined) => {
      if (!formEl) return
      await formEl.validate((valid, fields) => {
        if (valid) {
          dialogVisible.value = false
          ElMessage({
            message: "submit",
            type: "success"
          })
        } else {
          console.log("error submit!", fields)
        }
      })
    }
    expose({
      show
    })
    watch(
      () => dialogVisible.value,
      () => {},
      { immediate: true }
    )

    return {
      options,
      dialogVisible,
      addForm,
      addFormRef,
      updateFormRef,
      rules,
      show,
      close,
      submitForm,
      updateForm
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  :deep(.el-dialog__header) {
    background-color: aqua;
  }
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
