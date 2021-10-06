<template>
  <div class="menu-create-or-edit">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ isEdit ? '编辑菜单' : '添加菜单' }}</span>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="菜单名称" prop="name">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="href">
            <el-input v-model="form.href"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId">
            <el-select v-model="form.parentId" placeholder="请选择上级菜单">
            <!-- 无上级菜单 -->
            <el-option label="无上级菜单" :value="-1"></el-option>
            <!-- 有上级菜单 -->
            <el-option
                v-for="item in parentMenuList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
            <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="前端图标" prop="icon">
            <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="shown">
            <el-radio-group v-model="form.shown">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
            <el-input-number v-model="form.orderNum" :min="0" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">{{ isEdit ? '完成编辑' : '立即创建' }}</el-button>
            <el-button v-if="!isEdit" @click="resetForm">重置</el-button>
        </el-form-item>
        </el-form>
    </el-card>
  </div>
</template>
<script>
import { getEditMenuInfo, createOrUpdateMenu } from '@/services/menu.js'

export default {
  name: 'CreateOrEdit',
  // 通过props接收父组件传值，判断是新增还是编辑
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      parentMenuList: [],
      form: {
        name: '',
        href: '',
        parentId: -1,
        icon: '',
        description: '',
        shown: false,
        orderNum: 0
      },
      // 表单校验规则
      rules: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '描述不能为空', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '前端图标不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 加载上级菜单信息
    this.getParentMenu()
  },
  methods: {
    async onSubmit () {
      try {
        // 1.表单验证
        await this.$refs.form.validate()
        // 2.发送请求
        const { data } = await createOrUpdateMenu(this.form)
        if (data.code === '000000') {
          this.$message.success('新增菜单成功')
          this.$router.push({ name: 'menu' })
        }
        console.log(data);
      } catch (error) {
        this.$message.warning('提交失败')
        console.log(error);
      }
    },
    async getParentMenu () {
      // 检测是否存在路由参数 id ,并进行对应处理
      const id = this.$route.params.id || -1
      // 请求上级菜单数据
      console.log(this.$route.params.id);
      const { data } = await getEditMenuInfo(id)
      if (data.code === '000000') {
        // 保存上级菜单数据
        this.parentMenuList = data.data.parentMenuList
        // 检测是编辑，还是新增，如果是编辑则将该菜单的数据(menuInfo)更新给 form
        if (data.data.menuInfo) {
          this.form = data.data.menuInfo
        }
      }
      console.log(data);
    },
    resetForm () {
      this.$refs.form.resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
