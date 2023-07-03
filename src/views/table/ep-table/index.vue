<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { createTableDataApi, deleteTableDataApi, updateTableDataApi, getTableDataApi } from "@/api/table"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"

import TDialog from "@/components/Dialog/tableDialog.vue"
import { table } from "./mock.json"

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)

const dialogRef = ref(null)
const formRef = ref<FormInstance | null>(null)
const currRow = ref({})
const formData = reactive({
  username: "",
  password: ""
})
const formRules: FormRules = reactive({
  cname: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  password: [{ required: true, trigger: "blur", message: "请输入密码" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        createTableDataApi({
          username: formData.username,
          password: formData.password
        }).then(() => {
          ElMessage.success("新增成功")
          dialogVisible.value = false
          getTableData()
        })
      } else {
        updateTableDataApi({
          id: currentUpdateId.value,
          username: formData.username
        }).then(() => {
          ElMessage.success("修改成功")
          dialogVisible.value = false
          getTableData()
        })
      }
    } else {
      return false
    }
  })
}
const resetForm = () => {
  currentUpdateId.value = undefined
  formData.username = ""
  formData.password = ""
}
//#endregion

//#region 删
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`此操作将永久删除该数据，是否继续？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteTableDataApi(row.id).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | string>(undefined)

const setForm = ref({})
const setOpen = ref(false)
const setUpdate = (row: any) => {
  setForm.value = row
  setOpen.value = true
}
const handleUpdate = (row: any) => {
  currentUpdateId.value = row.id
  currRow.value = row
  dialogRef.value.show()
}
const addForm = (row: any) => {
  currentUpdateId.value = undefined
  dialogRef.value.show()
}
//#endregion

//#region 查
const tableData = ref<any[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  username: "",
  phone: ""
})
const getTableData = () => {
  console.log("table", table)
  currRow.value = table[0]
  loading.value = true
  getTableDataApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    username: searchData.username || undefined,
    phone: searchData.phone || undefined
  })
    .then((res) => {
      paginationData.total = res.data.total
      tableData.value = res.data.list
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  if (paginationData.currentPage === 1) {
    getTableData()
  }
  paginationData.currentPage = 1
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  if (paginationData.currentPage === 1) {
    getTableData()
  }
  paginationData.currentPage = 1
}
const handleRefresh = () => {
  getTableData()
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="container" m-r-4>
    <!-- <SubSidebar m-l-2 m-r-6 shadow-lg /> -->
    <div w-full>
      <el-card m-b-2>
        <el-form ref="searchFormRef" :inline="true" :model="searchData" size="small">
          <el-form-item prop="username" label="用户名">
            <el-input v-model="searchData.username" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="phone" label="手机号">
            <el-input v-model="searchData.phone" placeholder="请输入" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
            <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card v-loading="loading" shadow="never">
        <div uno-flex-sb m-b-2>
          <div>
            <el-button size="small" type="primary" :icon="CirclePlus" @click="addForm">新增实体属性</el-button>
            <!-- <el-button size="small" type="danger" :icon="Delete">批量删除</el-button> -->
          </div>
          <div>
            <el-tooltip content="下载">
              <el-button type="primary" :icon="Download" circle />
            </el-tooltip>
            <el-tooltip content="刷新表格">
              <el-button type="primary" :icon="RefreshRight" circle @click="handleRefresh" />
            </el-tooltip>
          </div>
        </div>
        <div class="table-wrapper">
          <el-table :data="table" size="small">
            <!-- <el-table-column type="selection" width="50" align="center" /> -->
            <el-table-column prop="cname" label="中文名" />
            <el-table-column prop="ename" label="英文名" />
            <el-table-column prop="type" label="类型" />
            <el-table-column prop="notOnly" label="允许多值">
              <template #default="scope">
                <el-tag v-if="scope.row.notOnly" type="success">YES</el-tag>
                <el-tag v-else type="danger">NO</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="desc" label="描述" width="220" />
            <el-table-column prop="config" label="高级设置">
              <template #default="scope">
                <el-tag type="info">MIN:{{ scope.row.config.min }}</el-tag>
                <el-tag type="info">MAX:{{ scope.row.config.max }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="creater" label="创建人" align="center" />
            <el-table-column prop="updateTime" label="最近更新时间" width="140" />
            <el-table-column fixed="right" label="操作" width="150" align="center">
              <template #default="scope">
                <el-button size="small" @click="setUpdate(scope.row)" icon="Setting" circle></el-button>
                <el-button type="primary" size="small" @click="handleUpdate(scope.row)" icon="Edit" circle></el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="handleDelete(scope.row)"
                  icon="DeleteFilled"
                  circle
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pager-wrapper">
          <el-pagination
            background
            :layout="paginationData.layout"
            :page-sizes="paginationData.pageSizes"
            :total="paginationData.total"
            :page-size="paginationData.pageSize"
            :currentPage="paginationData.currentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
      <!-- 新增/修改 -->
      <TDialog
        :dialogVisible="dialogVisible"
        :type="currentUpdateId === undefined"
        :currRow="currRow"
        ref="dialogRef"
      />
      <el-dialog v-model="setOpen" title="Shipping address">
        <el-form :model="setForm">
          <el-form-item label="Promotion name" :label-width="120">
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="Zones" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="Please select a zone">
              <el-option label="Zone No.1" value="shanghai" />
              <el-option label="Zone No.2" value="beijing" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="setOpen = false">Cancel</el-button>
            <el-button type="primary" @click="setOpen = false"> Confirm </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  :deep(.el-card__body) {
    padding: 14px;
  }
  :deep(.el-form--inline .el-form-item) {
    margin: 0;
    margin-right: 8px;
  }
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
