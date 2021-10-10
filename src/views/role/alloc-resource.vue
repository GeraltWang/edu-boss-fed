<template>
    <div class="alloc-resource">
        <el-card>
          <div slot="header">
            <el-descriptions title="角色信息">
              <el-descriptions-item label="名称">{{name}}</el-descriptions-item>
              <el-descriptions-item label="ID">{{roleId}}</el-descriptions-item>
            </el-descriptions>
          </div>
          <el-tree
          ref="resources"
          :data="resources"
          :props="defaultProps"
          node-key="id"
          show-checkbox
          default-expand-all
          :default-checked-keys="checkedRes">
          </el-tree>
          <div class="button-group">
            <el-button
            size="medium"
            icon="el-icon-refresh"
            @click="onReset">清空
            </el-button>
            <el-button
            type="primary"
            size="medium"
            icon="el-icon-folder-checked"
            @click="onSave"
            >保存
            </el-button>
        </div>
        </el-card>
    </div>
</template>
<script>
import { getRoleResources, allocateRoleResources } from '@/services/resource'

export default {
  name: 'AllocResource',
  props: {
    roleId: {
      type: [Number, String],
      required: true
    },
    name: {
      type: String
    }
  },
  data () {
    return {
      resources: [],
      defaultProps: {
        children: 'resourceList',
        label: 'name'
      },
      checkedRes: []
    }
  },
  created () {
    this.loadRoleResources()
  },
  methods: {
    async loadRoleResources () {
      const { data } = await getRoleResources(this.roleId)
      if (data.code === '000000') {
        // 树形控件渲染
        this.getCheckedResources(data.data)
        this.resources = data.data
      }
      console.log(data.data);
    },
    getCheckedResources (res) {
      // 遍历数据，将所有拥有子节点的 node 排除，对子节点列表进行筛选
      res.forEach(list => {
        // selected为false 未选中直接return
        if (!list.selected) {
          return
        }
        // 检测是否存在子节点
        if (list.resourceList) {
          return this.getCheckedResources(list.resourceList)
        }
        // 选中，但没有子节点，存储id即可
        this.checkedRes = [...this.checkedRes, list.id]
      });
      console.log(this.checkedRes, 1);
    },
    // 保存资源
    async onSave () {
      const { data } = await allocateRoleResources({
        roleId: this.roleId,
        resourceIdList: this.$refs.resources.getCheckedKeys()
      })
      if (data.code === '000000') {
        this.$router.push({ name: 'role' })
        this.$message.success('角色资源分配成功')
      }
    },
    // 重置资源
    onReset () {
      this.$refs.resources.setCheckedKeys([])
    }
  }
}
</script>
<style lang="scss" scoped>
.button-group{
  margin: 20px;
  text-align: center;
}
</style>
