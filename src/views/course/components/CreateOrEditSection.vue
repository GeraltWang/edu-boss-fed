<template>
  <div class="create-or-edit-section">
      <span>{{ isEdit }}</span>
      <el-form label-position="left" label-width="70px">
          <el-form-item label="课程名称">
              <el-input></el-input>
          </el-form-item>
          <el-form-item label="章节名称">
              <el-input></el-input>
          </el-form-item>
          <el-form-item label="章节描述">
              <el-input type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="章节排序">
              <el-input type="number">
                  <template slot="append">数字控制排序，数字越大越靠后</template>
              </el-input>
          </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
  name: 'CreateOrEditSection',
  props: {
    isEdit: {
      type: Boolean
    }
  },
  mounted () {
    if (this.isEdit) {
      console.log(1);
    } else {
      console.log(0);
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
