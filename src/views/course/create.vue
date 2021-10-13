<template>
  <div class="course-create">
      <el-card>
          <div slot="header">
            <el-steps :active="activeStep" simple>
              <el-step
              v-for="step in steps"
              :key="step.id"
              :title="step.title"
              :icon="step.icon">
              </el-step>
            </el-steps>
          </div>
          <el-form>
              <div v-show="activeStep === 0">基本信息</div>
              <div v-show="activeStep === 1">课程封面</div>
              <div v-show="activeStep === 2">销售信息</div>
              <div v-show="activeStep === 3">秒杀信息</div>
              <div v-show="activeStep === 4">
                  课程详情
                  <el-form-item>
                      <el-button type="primary" icon="el-icon-receiving">保存</el-button>
                  </el-form-item>
              </div>
              <el-form-item v-if="activeStep !== steps.length - 1">
                  <el-button
                  type="primary"
                  icon="el-icon-right">
                  下一步
                  </el-button>
              </el-form-item>
          </el-form>
      </el-card>
  </div>
</template>

<script>
export default {
  name: 'CourseCreate',
  data () {
    return {
      // 步骤条信息
      steps: [
        { id: 1, title: '基本信息', icon: 'el-icon-s-home' },
        { id: 2, title: '课程封面', icon: 'el-icon-picture' },
        { id: 3, title: '销售信息', icon: 'el-icon-s-marketing' },
        { id: 4, title: '秒杀信息', icon: 'el-icon-time' },
        { id: 5, title: '课程详情', icon: 'el-icon-document' }
      ],
      activeStep: 0
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
