<template>
  <div class="course-list">
      <el-card>
          <div slot="header" class="el-card-header">
              <el-form
                :inline="true"
                ref="form"
                label-position="top"
                :model="queryForm"
                size="small">
                <el-form-item label="课程名称" prop="courseName">
                    <el-input v-model="queryForm.courseName" placeholder="请输入" clearable=""></el-input>
                </el-form-item>
                <el-form-item label="课程状态" prop="status">
                    <el-select v-model="queryForm.status" clearable>
                        <el-option label="全部" value=""></el-option>
                        <el-option label="上架" value="1"></el-option>
                        <el-option label="下架" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="操作">
                    <el-button :disabled="loading" @click="resetQuery">重置</el-button>
                    <el-button type="primary" :disabled="loading" @click="queryCourse">查询</el-button>
                </el-form-item>
                <el-form-item label="新增" class="btn-add">
                  <el-button type="primary" icon="el-icon-plus" @click="$router.push({ name: 'course-create' })">新建课程</el-button>
                </el-form-item>
            </el-form>
          </div>
          <el-table
          :data="courses"
          ref="courses"
          border
          show-header
          max-height="1000px"
          v-loading="loading">
              <el-table-column
              prop="id"
              label="ID"
              header-align="center"
              align="center"
              width="60">
              </el-table-column>
              <el-table-column
              prop="courseName"
              label="课程名称"
              header-align="center"
              align="center"
              width="250">
              </el-table-column>
              <el-table-column
              prop="price"
              label="价格"
              header-align="center"
              align="center">
              </el-table-column>
              <el-table-column
              prop="sortNum"
              label="排序"
              header-align="center"
              align="center">
              </el-table-column>
              <el-table-column
              label="状态"
              header-align="center"
              align="center"
              width="80">
                <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.status"
                      @change="changeCourseState(scope.row)"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      :active-value="1"
                      :inactive-value="0"
                      :disabled="scope.row.isStatusChanging">
                    </el-switch>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                header-align="center"
                align="center"
                width="200"
              >
                <template slot-scope="scope">
                    <el-button
                    @click="editCourse(scope.row)"
                    type="primary"
                    size="mini">
                    编辑
                    </el-button>
                    <el-button
                    @click="manageCourse(scope.row)"
                    size="mini">
                    内容管理
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
              :current-page="queryForm.currentPage"
              :page-sizes="[20, 50, 100]"
              :page-size="queryForm.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              background
              :total="total"
              :disabled="loading">
          </el-pagination>
      </el-row>
  </div>
</template>
<script>
import { getQueryCourses, changeState } from '@/services/course'

export default {
  name: 'CourseList',
  data () {
    return {
      // 查询表单
      queryForm: {
        courseName: '',
        status: '',
        currentPage: 1,
        pageSize: 20
      },
      // 课程列表
      courses: [],
      // 课程数目
      total: 0,
      // 列表加载状态
      loading: false
    }
  },
  created () {
    this.loadCourse()
  },
  methods: {
    // 请求课程列表
    async loadCourse () {
      this.loading = true
      const { data } = await getQueryCourses(this.queryForm)
      if (data.code === '000000') {
        // 添加一条数据，判断加载状态
        data.data.records.forEach(item => {
          item.isStatusChanging = false
        })
        this.courses = data.data.records
        this.total = data.data.total
      }
      this.loading = false
    },
    // 根据名称，状态筛选课程
    queryCourse () {
      this.loadCourse()
    },
    // 重置筛选
    resetQuery () {
      this.$refs.form.resetFields()
      this.loadCourse()
    },
    // 课程上下架
    changeCourseState (row) {
      row.isStatusChanging = true
      const msg = row.status === 1 ? '上架' : '下架'
      this.$confirm(`此操作将${msg}该课程, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await changeState(row.id, row.status)
        if (data.code === '000000') {
          this.$message.success(`${row.status === 1 ? '课程上架成功' : '课程下架成功'}`)
        }
      }).catch(() => {
        this.$message.danger('操作失败');
      }).finally(() => {
        row.isStatusChanging = false
        this.loadCourse()
      });
    },
    // 编辑课程
    editCourse (row) {
      this.$router.push({ name: 'course-edit', params: { courseId: row.id } })
    },
    // 管理课程内容
    manageCourse (row) {
      this.$router.push({ name: 'course-section', params: { courseId: row.id, courseName: row.courseName } })
    },
    // 切换显示条数
    handleSizeChange (val) {
      this.queryForm.currentPage = 1
      this.queryForm.pageSize = val
      this.loadCourse()
    },
    // 翻页
    handleCurrentChange (val) {
      this.queryForm.currentPage = val
      this.loadCourse()
      this.$refs.courses.bodyWrapper.scrollTop = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card-header{
  height: 78px;
  .btn-add{
    float: right;
  }
}
</style>
