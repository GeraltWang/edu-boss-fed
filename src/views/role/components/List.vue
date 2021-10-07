<template>
    <div class="role-list">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-form :model="form" ref="form" :inline="true" lable-position="left" lable-width="80px">
                    <el-form-item label="输入搜索:" prop="name">
                        <el-input size="small" v-model="form.name" placeholder="角色名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="small" @click="onQuery" :disabled="loading">查询</el-button>
                        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-button size="small" @click="onAdd">添加角色</el-button>
            <el-table
            :data="role"
            v-loading="loading"
            border
            style="width: 100%"
            max-height="570">
                <el-table-column
                type="index"
                header-align="center"
                align="center"
                label="序号"
                width="50">
                </el-table-column>
                <el-table-column
                prop="code"
                label="编号"
                header-align="center"
                align="center"
                width="80">
                </el-table-column>
                <el-table-column
                prop="name"
                label="角色名称"
                header-align="center"
                align="center">
                </el-table-column>
                <el-table-column
                prop="description"
                label="描述"
                header-align="center"
                align="center">
                </el-table-column>
                <!-- 设置过滤器需要使用作用域插槽获取数据 -->
                <el-table-column
                label="添加时间"
                header-align="center"
                align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.createdTime | dateFormate }}</span>
                </template>
                </el-table-column>
                <el-table-column
                label="操作"
                header-align="center"
                align="center"
                width="160">
                <template slot-scope="scope">
                    <div>
                        <el-button type="text" size="mini">分配菜单</el-button>
                        <el-button type="text" size="mini">分配资源</el-button>
                    </div>
                    <div>
                       <el-button
                        @click="handleEdit(scope.$index, scope.row)"
                        type="warning"
                        size="mini">
                        编辑
                        </el-button>
                        <el-button
                        @click="handleDelete(scope.$index, scope.row)"
                        type="danger"
                        size="mini">
                        删除
                        </el-button>
                    </div>
                </template>
                </el-table-column>
          </el-table>
        </el-card>
        <!-- 新增角色弹出 dialog -->
        <el-dialog :title="isEdit ? '编辑角色' : '添加角色'" :visible.sync="dialogFormVisible" lock-scroll width="40%">
            <create-or-edit
                :is-edit="isEdit"
                :edit-role-id="editRoleId"
                @addSuccess="receiveSuccess"
                @addCancel="receiveCancel"
            ></create-or-edit>
        </el-dialog>
    </div>
</template>
<script>
import { getRolePages, deleteRole } from '@/services/role.js'
import CreateOrEdit from './CreateOrEdit.vue'

export default {
  name: 'RoleList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      // 查询表单
      form: {
        name: ''
      },
      // 角色列表
      role: [],
      // 角色列表加载状态
      loading: false,
      // 新增角色表单
      addRole: {},
      // 新增角色表单显示状态
      dialogFormVisible: false,
      // 控制对话框的功能状态 新增/编辑
      isEdit: false,
      // 存储正在编辑角色的id
      editRoleId: ''
    }
  },
  created () {
    this.loadAllRoles()
  },
  methods: {
    async loadAllRoles (form = {}) {
      this.loading = true
      const { data } = await getRolePages(form)
      if (data.code === '000000') {
        this.role = data.data.records
        this.loading = false
      }
    },
    // 顶部筛选表单查询
    onQuery () {
      this.loadAllRoles(this.form)
    },
    // 重置查询表单
    resetQuery () {
      this.$refs.form.resetFields()
    },
    // 添加角色，显示dialog
    onAdd () {
      this.isEdit = false
      this.dialogFormVisible = true
    },
    // 子组件$emit,添加角色时触发
    receiveSuccess () {
      // 隐藏dialog
      this.dialogFormVisible = false
      // 刷新角色列表
      this.loadAllRoles()
    },
    // 子组件$emit,取消添加角色时触发
    receiveCancel () {
      this.dialogFormVisible = false
      this.$message.info('取消操作')
    },
    // 编辑角色
    handleEdit (index, row) {
      this.isEdit = true
      this.dialogFormVisible = true
      this.editRoleId = row.id
      console.log(row.id);
    },
    // 删除角色
    async handleDelete (index, row) {
      this.$confirm(`确认删除角色${row.name}吗？`, '系统提示')
        .then(async () => {
          await deleteRole(row.id)
          this.$message.success('删除成功')
          this.loadAllRoles()
        })
        .catch((err) => {
          if (err && err.response) {
            this.$message.error('操作失败,请稍后重试')
          } else {
            this.$message.info('取消删除')
          }
        })
      console.log(index, row);
    }
  },
  filters: {
    // 日期过滤器
    dateFormate (time) {
      const date = new Date(time)
      const month = parseInt(date.getMonth()) + 1 < 10 ? '0' + (parseInt(date.getMonth()) + 1) : parseInt(date.getMonth()) + 1
      const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      const min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return `
        ${date.getFullYear()}-${month}-${day}
        ${hour}:${min}:${second}`
    }
  }
}
</script>
<style lang="scss" scoped>
.create-or-edit{
    display: flex;
    align-items: center;
    flex-direction: column;
}
</style>
