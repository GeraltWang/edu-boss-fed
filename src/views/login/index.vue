<template>
  <div class="login">
    <el-form ref="form" :model="form" label-width="80px" label-position="top">
      <el-form-item label="账号">
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.passWord" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'LoginIndex',
  data () {
    return {
      form: {
        userName: '',
        passWord: ''
      }
    };
  },
  methods: {
    onSubmit () {}
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
