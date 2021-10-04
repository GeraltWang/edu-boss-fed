<template>
  <div class="menu-create">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>添加菜单</span>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="菜单名称" prop="name">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="href">
            <el-input v-model="form.href"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
            <el-select v-model="form.parentId" placeholder="请选择上级菜单">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="描述">
            <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="前端图标">
            <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
            <el-radio-group v-model="form.shown">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
            <el-input-number v-model="form.orderNum" :min="0" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button>取消</el-button>
        </el-form-item>
        </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'MenuCreate',
  data () {
    return {
      form: {
        name: '',
        href: '',
        parentId: '',
        icon: '',
        description: '',
        shown: false,
        orderNum: 0
      },
      // 表单校验规则
      rules: {
        name: [
          { required: true, message: '请输菜单名称', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        href: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度为6 - 18位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!');
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
