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
                    <el-button :disabled="loading">重置</el-button>
                    <el-button type="primary" :disabled="loading">查询</el-button>
                </el-form-item>
            </el-form>
          </div>
          <el-table
          :data="courses"
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
              width="50">
                <template slot-scope="scope">
                    <el-tag type="success" effect="dark" size="mini" v-if="scope.row.status === 1"></el-tag>
                    <el-tag type="danger" effect="dark" size="mini" v-else></el-tag>
                    <!-- <span>{{ scope.row.status }}</span> -->
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                header-align="center"
                align="center"
                width="270"
              >
                <template slot-scope="scope">
                    <el-button
                    v-if="scope.row.status === 0"
                    @click="handleSelectRole(scope.row)"
                    type="success"
                    size="mini">
                    上架
                    </el-button>
                    <el-button
                    v-else
                    @click="handleSelectRole(scope.row)"
                    type="danger"
                    size="mini">
                    下架
                    </el-button>
                    <el-button
                    @click="handleSelectRole(scope.row)"
                    type="primary"
                    size="mini">
                    编辑
                    </el-button>
                    <el-button
                    @click="handleSelectRole(scope.row)"
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
import { getQueryCourses } from '@/services/course'

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
    async loadCourse () {
      this.loading = true
      const { data } = await getQueryCourses(this.queryForm)
      if (data.code === '000000') {
        this.courses = data.data.records
        this.total = data.data.total
      }
      this.loading = false
    },
    handleSizeChange (val) {
      this.queryForm.pageSize = val
      this.loadCourse()
    },
    handleCurrentChange (val) {
      this.queryForm.currentPage = val
      this.loadCourse()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card-header{
  height: 78px;
}
.el-tag{
    width: 20px;
    border-radius: 10px;
}
</style>
