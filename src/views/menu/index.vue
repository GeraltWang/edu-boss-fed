<template>
  <div class="menu">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button size="medium" @click="$router.push({ name: 'menu-create' })">添加菜单</el-button>
      </div>
      <!-- 菜单表格区域 -->
      <el-table
      :data="tableData"
      border
      max-height="570"
      style="width: 100%">
      <el-table-column
        fixed
        type="index"
        label="编号"
        header-align="center"
        align="center"
        width="60">
      </el-table-column>
      <el-table-column
        prop="name"
        label="菜单名称"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="level"
        label="菜单级数"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="icon"
        label="前端图标"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="orderNum"
        label="排序"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        header-align="center"
        align="center">
        <template slot-scope="scope">
        <el-button @click="handleEdit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
        <el-button @click="handleDelete(scope.$index, scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
  </div>
</template>
<script>
import { getAllMenus, deleteMenu } from '@/services/menu'

export default {
  name: 'MenuIndex',
  data () {
    return {
      // 菜单列表数据
      tableData: []
    }
  },
  created () {
    this.loadMenus()
  },
  methods: {
    // 请求所有菜单
    async loadMenus () {
      const { data } = await getAllMenus()
      if (data.code === '000000') {
        this.tableData = data.data
      }
    },
    // 编辑菜单
    handleEdit (index, row) {
      console.log(index, row);
      // 跳转编辑页面
      this.$router.push({ name: 'menu-edit', params: { id: row.id } })
    },
    // 删除菜单
    handleDelete (index, row) {
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 发送删除请求
          const { data } = await deleteMenu(row.id)
          if (data.code === '000000') {
            this.$message.success('删除成功!');
            // 更新菜单列表
            this.loadMenus()
          }
        })
        .catch(() => {
          this.$message.info('已取消删除');
        });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
