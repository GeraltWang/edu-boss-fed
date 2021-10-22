<template>
  <div>
    <el-container>
      <el-aside width="200">
        <app-aside :value="value"></app-aside>
      </el-aside>
      <el-container>
        <el-header>
          <app-header @expand="value=$event"></app-header>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import AppAside from './components/app-aside.vue';
import AppHeader from './components/app-header.vue';
export default {
  name: 'Layout',
  data () {
    return {
      value: null
    }
  },
  components: {
    AppAside,
    AppHeader
  }
};
</script>
<style lang="scss" scoped>
.el-container {
  height: 100vh;
  min-width: 980px;
}
.el-aside {
  background-color: #F8F9FB;
}

.el-header {
  background-color: #fff;
}

.el-main {
  background-color: #e9eef3;
}
</style>
