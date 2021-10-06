<template>
  <div class="menu-edit">
    <!-- 引入 -->
    <create-or-edit :isEdit="true"></create-or-edit>
  </div>
</template>
<script>
import CreateOrEdit from './components/CreateOrEdit'

export default {
  name: 'MenuEdit',
  components: {
    CreateOrEdit
  }
};
</script>
<style lang="scss" scoped>
</style>
