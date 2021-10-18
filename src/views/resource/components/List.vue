<template>
    <div class="resource-list">
      <el-card>
        <!-- 顶部查询表单 -->
        <div slot="header" class="clearfix">
          <el-form :inline="true" :model="form" ref="form">
              <el-form-item label="资源名称" prop="name">
                  <el-input size="small" v-model="form.name" clearable></el-input>
              </el-form-item>
              <el-form-item label="资源路径" prop="url">
                  <el-input size="small" v-model="form.url" clearable></el-input>
              </el-form-item>
              <el-form-item label="资源分类" prop="categoryId">
                <el-select size="small" v-model="form.categoryId" placeholder="全部" clearable>
                    <el-option v-for="item in resourceCategory" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="button-group">
                  <el-button type="primary" icon="el-icon-search" size="small" @click="onQuery" :disabled="loading">查询</el-button>
                  <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
              </el-form-item>
          </el-form>
        </div>
        <div>
          <!-- 资源列表 -->
          <el-table
            :data="resources"
            v-loading="loading"
            border
            show-header
            max-height="800"
            style="width: 100%">
            <el-table-column
            type="index"
            header-align="center"
            align="center"
            label="序号"
            width="50">
            </el-table-column>
            <el-table-column
            prop="id"
            label="资源编号"
            header-align="center"
            align="center"
            width="80">
            </el-table-column>
            <el-table-column
            prop="name"
            label="资源名称"
            header-align="center"
            align="center">
            </el-table-column>
            <el-table-column
            prop="url"
            label="资源路径"
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
            </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <!-- 分页组件 -->
      <el-row type="flex" class="row-bg" justify="center">
         <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="form.current"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="form.size"
            layout="total, sizes, prev, pager, next, jumper"
            background
            :total="total"
            :disabled="loading">
         </el-pagination>
      </el-row>
    </div>
</template>

<script>
import { getResourcePages, getAllCategories } from '@/services/resource.js'

export default {
  name: 'ResourceList',
  data () {
    return {
      // 顶部筛选表单数据，数据和底部分页共用
      form: {
        current: 1,
        size: 10,
        name: '',
        url: '',
        categoryId: ''
      },
      // 筛选表单 select 中的选项
      resourceCategory: [],
      // 资源列表数据
      resources: [],
      // 资源总条数
      total: 0,
      // 资源列表加载状态
      loading: false
    }
  },
  created () {
    // 加载资源列表
    this.loadResources()
    // 加载资源分类
    this.loadAllCategories()
  },
  methods: {
    // 加载资源列表，传空对象可加载前十条
    async loadResources () {
      this.loading = true
      const { data } = await getResourcePages(this.form)
      console.log(data);
      if (data.code === '000000') {
        this.resources = data.data.records
        this.total = data.data.total
      }
      this.loading = false
    },
    // 加载资源分类
    async loadAllCategories () {
      const { data } = await getAllCategories()
      if (data.code === '000000') {
        this.resourceCategory = data.data
      }
      console.log(data);
    },
    // 顶部筛选表单查询
    onQuery () {
      // 删选前，将页码变为1
      this.form.current = 1
      this.loadResources()
    },
    // 重置查询表单
    resetQuery () {
      this.$refs.form.resetFields()
    },
    // 编辑资源
    handleEdit (index, row) {
      console.log(index, row);
    },
    // 删除资源
    handleDelete (index, row) {
      console.log(index, row);
    },
    // 每页显示条数变化时触发
    handleSizeChange (val) {
      this.form.size = val
      // 显示条数变化，页码归1
      this.form.current = 1
      this.loadResources()
    },
    // 当前页改变时触发
    handleCurrentChange (val) {
      this.form.current = val
      this.loadResources()
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
.el-form{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
