<template>
  <div class="app-aside">
    <router-link class="logo" to="/course">
      <img src="http://eduboss.lagou.com/edu-boss-fed/assets/img/logo.e8b9190b.png" alt="LagouEdu">
      <h1>Edu Boss</h1>
    </router-link>
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#f8f9fb"
      text-color="#303113"
      active-text-color="#fcba05"
      unique-opened
      router
    >
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-lock"></i>
          <span>权限管理</span>
        </template>
        <el-menu-item index='/role'>
          <i class="el-icon-setting"></i>
          <span>角色列表</span>
        </el-menu-item>
        <el-menu-item index='/menu'>
          <i class="el-icon-setting"></i>
          <span>菜单列表</span>
        </el-menu-item>
        <el-menu-item index='/resource'>
          <i class="el-icon-setting"></i>
          <span>资源列表</span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="/course">
        <i class="el-icon-film"></i>
        <span slot="title">课程管理</span>
      </el-menu-item>
      <el-menu-item index="/user">
        <i class="el-icon-user"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>广告管理</span>
        </template>
        <el-menu-item index='/advert'>
          <i class="el-icon-document"></i>
          <span>广告列表</span>
        </el-menu-item>
        <el-menu-item index='/advert-space'>
          <i class="el-icon-document"></i>
          <span>广告位列表</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: 'AppAside',
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
<style lang="scss" scoped>
.app-aside {
  height: 100%;
  .logo {
    display: flex;
    height: 60px;
    justify-content: center;
    align-items: center;
    color: #495057;
    line-height: 50px;
    text-decoration: none;
    text-align: center;
    img {
      margin: 10px;
      width: 30px;
    }
    h1 {
      display: inline-block;
      margin: 0;
      width: 95px;
      overflow: hidden;
      font-size: 20px;
      white-space: nowrap;
    }
  }
  .el-menu {
    max-height: 100%;
    border-right: 0 none;
  }
}
</style>
