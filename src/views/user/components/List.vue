<template>
    <div class="user-list">
        <el-card>
            <div slot="header" class="el-card-header">
                <el-form
                :inline="true"
                :model="queryUser"
                ref="queryFrom"
                size="small"
                label-position="top">
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="queryUser.phone" size="small" placeholder="输入手机号" clearable></el-input>
                </el-form-item>
                <el-form-item label="注册时间" prop="timeRange">
                    <el-date-picker
                    v-model="queryUser.timeRange"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="操作">
                    <el-button :disabled="loading" @click="reSetQuery">重置</el-button>
                    <el-button type="primary" :disabled="loading" @click="query">查询</el-button>
                </el-form-item>
                </el-form>
            </div>
            <el-table
            :data="userList"
            v-loading="loading"
            border
            style="width: 100%"
            max-height="500">
              <el-table-column
            type="index"
            header-align="center"
            align="center"
            label="序号"
            width="50">
            </el-table-column>
            <!-- 用户头像 -->
            <el-table-column
            prop="portrait"
            label="头像"
            header-align="center"
            align="center"
            width="80">
              <template slot-scope="scope">
                  <el-avatar size="small" :src="scope.row.portrait || 'http://www.lgstatic.com/thumbnail_100x100/i/image2/M01/5E/65/CgotOVszSAOANi0LAAAse2IVWAE693.jpg'"></el-avatar>
              </template>
            </el-table-column>
            <el-table-column
            prop="name"
            label="用户名"
            header-align="center"
            align="center">
            </el-table-column>
            <el-table-column
            prop="phone"
            label="手机号"
            header-align="center"
            align="center">
            </el-table-column>
            <!-- 设置过滤器需要使用作用域插槽获取数据 -->
            <el-table-column
            label="注册时间"
            header-align="center"
            align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime | dateFormate }}</span>
              </template>
            </el-table-column>
            <!-- 用户状态 -->
            <el-table-column
            label="状态"
            header-align="center"
            align="center"
            width="110">
              <template slot-scope="scope">
                <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="ENABLE"
                inactive-value="DISABLE"
                @change="handleForbidUser(scope.row)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column
            label="操作"
            header-align="center"
            align="center"
            width="110"
            >
            <template slot-scope="scope">
                <el-button
                @click="handleSelectRole(scope.row)"
                type="danger"
                size="mini">
                分配角色
                </el-button>
            </template>
            </el-table-column>
            </el-table>
        </el-card>
        <!-- 分页组件 -->
        <el-row type="flex" class="row-bg" justify="center">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryUser.currentPage"
              :page-sizes="[20, 30, 40]"
              :page-size="queryUser.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              background
              :total="total"
              :disabled="loading">
          </el-pagination>
        </el-row>
        <!-- 分配角色弹框 -->
        <el-dialog
          title="分配角色"
          :visible.sync="dialogVisible"
          width="30%"
          top="30vh">
          <span class="dialog-info">用户名：{{ currentUserName }}</span>
          <span class="dialog-info">ID：{{ currentUserId }}</span>
          <el-select v-model="userRole" multiple placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allocRole">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
import { getUserPages, forbidUser, enableUser } from '@/services/user'
import { getAllRoles, allocateUserRoles, getUserRole } from '@/services/role'

export default {
  name: 'UserList',
  data () {
    return {
      // 查询用户
      queryUser: {
        phone: '',
        timeRange: [],
        startCreateTime: '',
        endCreateTime: '',
        currentPage: 1,
        pageSize: 20
      },
      // 用户展示
      userList: [],
      // 分配角色 options
      options: [],
      // 用户角色
      userRole: [],
      // 当前进行分配的用户
      currentUserId: null,
      currentUserName: '',
      // 时间选择器功能
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      total: 0,
      // 页面加载状态
      loading: false,
      // 分配角色弹框展示状态
      dialogVisible: false
    }
  },
  created () {
    this.loadUsers()
  },
  methods: {
    async loadUsers () {
      // 进入加载状态
      this.loading = true
      // 解构出时间段
      const { timeRange } = this.queryUser
      // 判断时间段 及是否有长度
      if (timeRange && timeRange.length) {
        // 满足，赋值给起始和终止时间
        this.queryUser.startCreateTime = timeRange[0]
        this.queryUser.endCreateTime = timeRange[1]
      } else {
        // 不满足，为空
        this.queryUser.startCreateTime = ''
        this.queryUser.endCreateTime = ''
      }
      // 请求用户列表
      const { data } = await getUserPages(this.queryUser)
      if (data.code === '000000') {
        // 展示到表格中
        this.userList = data.data.records
        this.total = data.data.total
      }
      // 加载完成
      this.loading = false
    },
    // 查询
    query () {
      this.queryUser.currentPage = 1
      this.loadUsers()
    },
    // 重置
    reSetQuery () {
      this.$refs.queryFrom.resetFields()
      this.loadUsers()
    },
    // 切换用户状态
    async handleForbidUser (row) {
      if (row.status === 'DISABLE') {
        const { data } = await enableUser(row.id)
        console.log(data);
      } else {
        const { data } = await forbidUser(row.id)
        console.log(data);
      }
      console.log(row);
    },
    // 分配角色,显示dialog
    async handleSelectRole (row) {
      // 保存当前分配用户的id
      this.currentUserId = row.id
      this.currentUserName = row.name
      this.dialogVisible = true
      // 展示角色列表
      const { data } = await getAllRoles()
      if (data.code === '000000') {
        this.options = data.data
      }
      // 展示已有角色
      const { data: userRole } = await getUserRole(row.id)
      if (userRole.code === '000000') {
        this.userRole = userRole.data.map(item => item.id)
      }
    },
    // 提交分配角色
    async allocRole () {
      const { data } = await allocateUserRoles({
        userId: this.currentUserId,
        roleIdList: this.userRole
      })
      if (data.code === '000000') {
        this.dialogVisible = false
        this.$message.success('分配角色成功')
      } else {
        this.$message.warning('分配角色失败')
      }
    },
    // 每页显示条数变化时触发
    handleSizeChange (val) {
      this.queryUser.pageSize = val
      // 显示条数变化，页码归1
      this.queryUser.currentPage = 1
      this.loadUsers()
    },
    // 当前页改变时触发
    handleCurrentChange (val) {
      this.queryUser.currentPage = val
      this.loadUsers()
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
.el-card-header{
  height: 78px;
}
.dialog-info{
  display: inline-block;
  margin: 0px 20px 20px 0px
}
</style>
