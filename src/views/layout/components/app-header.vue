<template>
  <div class="app-header">
    <!-- 左侧面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 右侧用户信息 -->
    <el-dropdown>
      <span class="el-dropdown-link">
          <!-- 用户头像 -->
        <el-avatar size="medium" :src="userInfo.portrait || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"></el-avatar>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          {{ userInfo.userName }}
        </el-dropdown-item>
        <el-dropdown-item divided>登出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
// 引入获取用户信息接口
import { getUserInfo } from '@/services/user'

export default {
  name: 'AppHeader',
  created () {
    // 加载用户信息
    // 生命周期钩子中不建议直接书写逻辑代码，不利于后期维护
    this.loadUserInfo()
  },
  data () {
    return {
      // 用户信息
      userInfo: {}
    };
  },
  methods: {
    async loadUserInfo () {
      const { data } = await getUserInfo()
      this.userInfo = data.content
    }
  }
};
</script>
<style lang="scss" scoped>
.app-header {
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
}
</style>
