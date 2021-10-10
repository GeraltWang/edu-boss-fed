<template>
    <div class="create-or-edit">
        <!-- 新增表单 -->
        <el-form v-if="!isEdit" :model="role" label-position="right" label-width="80px" size="small">
            <el-form-item label="角色名称:">
                <el-input v-model="role.name"></el-input>
            </el-form-item>
            <el-form-item label="角色编码:">
                <el-input v-model="role.code"></el-input>
            </el-form-item>
            <el-form-item label="描述:">
                <el-input v-model="role.description" type="textarea" :autosize="{ minRows: 4}"></el-input>
            </el-form-item>
        </el-form>
        <!-- 编辑表单 -->
        <el-form v-else :model="editRole" label-position="right" label-width="80px" size="small">
            <el-form-item label="角色名称:">
                <el-input v-model="editRole.name"></el-input>
            </el-form-item>
            <el-form-item label="角色编码:">
                <el-input v-model="editRole.code"></el-input>
            </el-form-item>
            <el-form-item label="描述:">
                <el-input v-model="editRole.description" type="textarea" :autosize="{ minRows: 4}"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="onCancel">取 消</el-button>
            <el-button type="primary" @click="onSubmit">确 定</el-button>
        </div>
    </div>
</template>
<script>
import { createOrUpdateRole } from '@/services/role.js'

export default {
  name: 'CreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    editRole: {
      type: Object
    }
  },
  data () {
    return {
      // 新增角色表单
      role: {
        name: '',
        code: '',
        description: ''
      }
    }
  },
  methods: {
    // async loadRoleInfo () {
    //   const { data } = await queryById(this.editRoleId)
    //   if (data.code === '000000') {
    //     this.role = data.data
    //   }
    //   console.log(data.data);
    // },
    async onSubmit () {
      // 判断时编辑还是新增
      if (!this.isEdit) {
        // 新增传this.role
        const { data } = await createOrUpdateRole(this.role)
        if (data.code === '000000') {
          // 关闭提示框，子组件向父组件传递状态
          this.$emit('success')
          // 提示添加成功
          this.$message.success('添加成功')
          // 清空表单
          this.role = {}
        }
      } else {
        // 编辑传props里的this.editRole
        const { data } = await createOrUpdateRole(this.editRole)
        if (data.code === '000000') {
          // 关闭提示框，子组件向父组件传递状态
          this.$emit('success')
          // 提示添加成功
          this.$message.success('编辑成功')
          // 清空表单
          // this.role = {}
        }
      }
    },
    onCancel () {
      // 清空表单
      this.role = {}
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form{
    width: 70%;
}
</style>
