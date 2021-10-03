<template>
  <div class="login">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="top">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="isLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { login } from '@/services/user'

export default {
  name: 'LoginIndex',
  data () {
    return {
      // 表单数据对象
      form: {
        phone: '',
        password: ''
      },
      // 表单校验规则
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度为6 - 18位', trigger: 'blur' }
        ]
      },
      // 点击登录后按钮变为加载状态true，默认为false
      isLogin: false
    };
  },
  methods: {
    async onSubmit () {
      try {
        // 1.表单校验
        await this.$refs.form.validate()
        // 2.发送请求,解构方式接受返回数据中的data
        this.isLogin = true
        // 登录请求已封装至services/user中
        const { data } = await login(this.form)
        this.isLogin = false
        // 3.响应数据处理
        if (data.state === 1) {
          this.$notify.success({
            title: '登录成功',
            message: `${data.message}`,
            offset: 60
          });
          // 将用户信息存储到store.state.user 中
          this.$store.commit('setUser', data.content)
          this.$router.push(this.$route.query.redirect || '/')
        } else {
          this.$notify.error({
            title: '登录失败',
            message: `${data.message}`,
            offset: 60
          });
        }
        console.log(data);
      } catch (error) {
        console.log('未通过');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .login {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-form {
      width: 360px;
      padding: 40px;
      background-color: #fff;
      border-radius: 10px;
      .el-button {
        width: 100%;
      }
    }
  }
</style>
