<template>
  <div class="app-header">
    <!-- 左侧面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: item.path }" v-for="item in breadcrumbList" :key="item.name">
        {{item.meta.breadcrumb}}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 右侧用户信息 -->
    <el-dropdown>
      <span class="el-dropdown-link">
          <!-- 用户头像 -->
        <el-avatar :size="30" :src="userInfo.portrait || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"></el-avatar>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          {{ userInfo.userName }}
        </el-dropdown-item>
        <el-dropdown-item divided @click.native="logOut">注销</el-dropdown-item>
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
    // 加载用户信息
    async loadUserInfo () {
      const { data } = await getUserInfo()
      this.userInfo = data.content
    },
    // 注销登录
    logOut () {
      this.$confirm('您即将注销, 是否继续?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除store中的用户信息
        this.$store.commit('setUser', null)
        // 跳转登录页
        this.$router.push('/login')
        this.$message({
          type: 'success',
          message: '注销成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    }
  },
  computed: {
    breadcrumbList () {
      return this.$route.matched
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
