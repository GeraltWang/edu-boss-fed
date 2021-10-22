<template>
  <div class="app-header">
    <div class="app-header-left">
      <el-button type="text" @click="expand"><i :class="fold"></i></el-button>
      <!-- 左侧面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: item.path }" v-for="item in breadcrumbList" :key="item.name">
          {{item.meta.breadcrumb}}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
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
      userInfo: {},
      isFold: false,
      fold: 'el-icon-s-fold'
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
    },
    // 折叠菜单栏
    expand () {
      if (!this.isFold) {
        this.isFold = !this.isFold
        this.fold = 'el-icon-s-unfold'
        this.$emit('expand', this.isFold)
      } else {
        this.isFold = !this.isFold
        this.fold = 'el-icon-s-fold'
        this.$emit('expand', this.isFold)
      }
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
  .app-header-left{
    flex: 1;
    display: flex;
    align-items: center;
    .el-button{
      margin-right: 20px;
      font-size: 20px;
    }
  }
}
</style>
