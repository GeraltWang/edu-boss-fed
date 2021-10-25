<template>
  <div class="course-create-or-edit">
    <el-card>
        <!-- 步骤条 -->
      <div slot="header">
        <el-steps :active="activeStep" simple>
          <el-step
            v-for="(step, index) in steps"
            :key="step.id"
            :title="step.title"
            :icon="step.icon"
            @click.native="activeStep = index"
          >
          </el-step>
        </el-steps>
      </div>
      <el-form :model="course" label-position="top" label-width="100px">
        <!-- 基础信息 -->
        <div v-show="activeStep === 0">
          <el-form-item label="课程名称">
            <el-input
            v-model="course.courseName"
            maxlength="50"
            show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="课程简介">
            <el-input
            v-model="course.brief"
            maxlength="100"
            show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="课程概述">
            <el-input
            style="width: 45%;min-width: 300px;margin-right: 46px"
            placeholder="概述1"
            v-model="course.previewFirstField">
            </el-input>
            <el-input
            style="width: 45%;min-width: 300px"
            placeholder="概述2"
            v-model="course.previewSecondField">
            </el-input>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input
            v-model="course.teacherDTO.teacherName"
            maxlength="50"
            show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input
            v-model="course.teacherDTO.description"
            maxlength="100"
            show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="课程排序">
            <el-input-number
            v-model="course.sortNum"
            controls-position="right">
            </el-input-number>
          </el-form-item>
        </div>
        <!-- 课程封面 -->
        <div v-show="activeStep === 1">
          <!-- 封装为图片上传组件 -->
          <course-image
          label="课程封面"
          :limit="3"
          v-model="course.courseListImg">
          </course-image>
          <course-image
          label="解锁封面"
          :limit="3"
          v-model="course.courseImgUrl">
          </course-image>
        </div>
        <!-- 销售信息 -->
        <div v-show="activeStep === 2">
          <el-form-item label="售卖价格">
            <el-input type="number" :min="0" v-model="course.discounts" placeholder="请输入内容">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input type="number" :min="0" v-model="course.price" placeholder="请输入内容">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input type="number" :min="0" v-model="course.sales" placeholder="请输入内容">
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input
              v-model="course.discountsTag"
              placeholder="请输入内容"
              maxlength="4"
              show-word-limit
            ></el-input>
          </el-form-item>
        </div>
        <!-- 秒杀信息 -->
        <div v-show="activeStep === 3">
          <el-form-item label="限时秒杀开关">
            <el-switch
              v-model="course.activityCourse"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
            <template v-if="course.activityCourse">
              <el-row type="flex">
                <el-form-item label="开始时间" class="begin-time">
                  <el-date-picker
                    v-model="course.activityCourseDTO.beginTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    clearable
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                  <el-date-picker
                    v-model="course.activityCourseDTO.endTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    clearable
                  >
                  </el-date-picker>
                </el-form-item>
              </el-row>
              <el-form-item label="秒杀价">
                <el-input v-model="course.activityCourseDTO.amount" type="number" :min="0">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="秒杀库存">
                <el-input v-model="course.activityCourseDTO.stock" type="number" :min="0">
                  <template slot="append">个</template>
                </el-input>
              </el-form-item>
            </template>
          </el-form-item>
        </div>
        <!-- 课程详情 -->
        <div v-show="activeStep === 4">
          <el-form-item label="课程详情">
            <wang-editor v-model="course.courseDescriptionMarkDown"></wang-editor>
          </el-form-item>
          <el-form-item label="上架状态">
            <el-switch
            v-model="course.status"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <el-form-item class="form-btn">
            <el-button v-if="activeStep>0" type="warning" icon="el-icon-back" @click="activeStep--"> 上一步 </el-button>
            <el-button type="primary" icon="el-icon-receiving" @click="saveOrUpdate">保存</el-button>
          </el-form-item>
        </div>
        <el-form-item v-if="activeStep !== steps.length - 1" class="form-btn">
          <el-button v-if="activeStep>0" type="warning" icon="el-icon-back" @click="activeStep--"> 上一步 </el-button>
          <el-button type="primary" icon="el-icon-right" @click="activeStep++"> 下一步 </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import CourseImage from './CourseImage.vue'
import { getCourseById, saveOrUpdateCourse } from '@/services/course'
import WangEditor from '@/components/WangEditor'

export default {
  name: 'CourseCreateOrEdit',
  components: {
    CourseImage,
    WangEditor
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: [String, Number]
    }
  },
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
      // 当前进行的步骤
      activeStep: 0,
      // 新增课程
      course: {
        // id: 0,
        courseName: '',
        brief: '',
        teacherDTO: {
          // id: 0,
          // courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        // 课程详情内容
        courseDescriptionMarkDown: '',
        price: 0,
        discounts: 0,
        priceTag: '',
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        // 课程封面地址
        courseListImg: '',
        // 解锁封面地址
        courseImgUrl: '',
        sortNum: 0,
        previewFirstField: '',
        previewSecondField: '',
        // 上架状态
        status: 0,
        sales: 0,
        // 秒杀状态
        activityCourse: false,
        // 秒杀信息
        activityCourseDTO: {
          // id: 0,
          courseId: 0,
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        },
        autoOnlineTime: ''
      }
    };
  },
  created () {
    // 检测是编辑还是创建
    if (this.isEdit) {
      this.loadEditCourse()
    }
  },
  methods: {
    // 加载编辑课程信息
    async loadEditCourse () {
      const { data } = await getCourseById(this.courseId)
      if (data.code === '000000') {
        // 判断课程是否开启秒杀，如果未开启秒杀则需要初始化数据
        if (!data.data.activityCourse) {
          data.data.activityCourseDTO = {
            courseId: 0,
            beginTime: '',
            endTime: '',
            amount: 0,
            stock: 0
          }
        }
        this.course = data.data
      }
    },
    // 保存
    async saveOrUpdate () {
      const { data } = await saveOrUpdateCourse(this.course)
      // console.log(data);
      if (data.code === '000000') {
        this.$message.success(`${this.isEdit ? '修改课程成功' : '添加课程成功'}`)
        this.$router.push({ name: 'course' })
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-step {
  cursor: pointer;
}
.begin-time{
  margin-right: 20px;
}
.form-btn{
  text-align: center;
}
</style>
