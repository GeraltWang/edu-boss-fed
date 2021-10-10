<template>
    <div class="alloc-menu">
      <el-card>
        <div slot="header" class="clearfix">
          <el-descriptions title="角色信息">
            <el-descriptions-item label="名称">{{name}}</el-descriptions-item>
            <el-descriptions-item label="ID">{{roleId}}</el-descriptions-item>
          </el-descriptions>
        </div>
        <el-tree
        ref="menu"
        :data="menu"
        :props="defaultProps"
        node-key="id"
        show-checkbox
        default-expand-all
        :default-checked-keys="checkedMenu">
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
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu'

export default {
  name: 'AllocMenu',
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
      menu: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedMenu: []
    }
  },
  created () {
    // 加载所有菜单，用于结构展示
    this.loadMenuNodeList()
    // 加载当前角色拥有的菜单
    this.loadRoleMenus()
  },
  methods: {
    // 加载所有菜单，用于结构展示
    async loadMenuNodeList () {
      const { data } = await getMenuNodeList()
      if (data.code === '000000') {
        this.menu = data.data
        console.log(this.menu);
      }
    },
    // 加载当前角色拥有的菜单
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      if (data.code === '000000') {
        this.getCheckedMenus(data.data)
      }
    },
    // 获取角色拥有的菜单，并存储菜单id
    getCheckedMenus (menus) {
      // 遍历数据，将所有拥有子节点的 node 排除，对子节点列表进行筛选
      menus.forEach(menu => {
        // selected为false 未选中直接return
        if (!menu.selected) {
          return
        }
        // 检测是否存在子节点
        if (menu.subMenuList) {
          return this.getCheckedMenus(menu.subMenuList)
        }
        // 选中，但没有子节点，存储id即可
        this.checkedMenu = [...this.checkedMenu, menu.id]
      });
    },
    // 保存菜单
    async onSave () {
      const { data } = await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList: this.$refs.menu.getCheckedKeys()
      })
      if (data.code === '000000') {
        this.$router.push({ name: 'role' })
        this.$message.success('角色菜单分配成功')
      }
    },
    // 重置选中菜单
    onReset () {
      this.$refs.menu.setCheckedKeys([])
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
