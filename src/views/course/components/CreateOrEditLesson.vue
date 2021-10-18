<template>
  <div class="create-or-edit-lesson">
      <!-- <span>{{ isEdit }}</span> -->
      <el-form label-position="right" label-width="110px" :model="lessonForm" :rules="rules" ref="lessonForm">
          <el-form-item label="课程名称" prop="courseName">
              <el-input v-model="lessonForm.courseName" disabled></el-input>
          </el-form-item>
          <el-form-item label="章节名称" prop="sectionName">
              <el-input v-model="lessonForm.sectionName" disabled></el-input>
          </el-form-item>
          <el-form-item label="课时名称" prop="theme">
              <el-input v-model="lessonForm.theme"></el-input>
          </el-form-item>
          <el-form-item label="时长"  prop="duration">
              <el-input type="number" v-model="lessonForm.duration">
                  <template slot="append">分钟</template>
              </el-input>
          </el-form-item>
          <el-form-item label="是否开放试听" prop="isFree">
              <el-switch
                v-model="lessonForm.isFree"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
          </el-form-item>
          <el-form-item label="课时排序">
              <el-input type="number" v-model="lessonForm.orderNum">
                  <template slot="append">数字控制排序，数字越大越靠后</template>
              </el-input>
          </el-form-item>
          <el-row class="btn-group">
            <el-button @click="$emit('close-dialog', false)">取消</el-button>
            <el-button type="primary" @click="saveOrUpdate">确定</el-button>
          </el-row>
      </el-form>
  </div>
</template>

<script>
import { saveOrUpdateLesson, getByLessonId } from '@/services/course-lesson'
import { getBySectionId } from '@/services/course-section'

export default {
  name: 'CreateOrEditLesson',
  props: {
    isEdit: {
      type: Boolean
    },
    courseName: {
      type: String
    },
    courseId: {
      type: [String, Number]
    },
    sectionName: {
      type: String
    },
    sectionId: {
      type: [String, Number]
    },
    lessonId: {
      type: [String, Number]
    }
  },
  data () {
    return {
      lessonForm: {
        courseName: '',
        courseId: null,
        theme: '',
        duration: 0,
        isFree: false,
        orderNum: 0
      },
      rules: {
        courseName: [
          { required: true, message: '课程名称不能为空', trigger: 'blur' }
        ],
        sectionName: [
          { required: true, message: '章节名称不能为空', trigger: 'blur' }
        ],
        theme: [
          { required: true, message: '课时名称不能为空', trigger: 'blur' }
        ],
        duration: [
          { required: true, message: '课时时长不能为空', trigger: 'blur' }
        ],
        isFree: [
          { required: true, message: '请设置试听权限', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    if (this.isEdit) {
      console.log(this.lessonId);
      this.loadLessonForm()
    } else {
      this.lessonForm.courseName = this.courseName
      this.lessonForm.courseId = this.courseId
      this.lessonForm.sectionName = this.sectionName
      this.lessonForm.sectionId = this.sectionId
    }
  },
  methods: {
    async loadLessonForm () {
      const { data } = await getByLessonId(this.lessonId)
      const data2 = await getBySectionId(this.sectionId)
      if (data.code === '000000') {
        this.lessonForm = data.data
        this.lessonForm.duration = data.data.duration || 0
        this.lessonForm.sectionName = data2.data.data.sectionName
      }
      this.lessonForm.courseName = this.courseName
      this.lessonForm.courseId = this.courseId
      this.lessonForm.sectionId = this.sectionId
      console.log(this.lessonForm);
    },
    // 保存或更新课时
    async saveOrUpdate () {
      try {
        await this.$refs.lessonForm.validate()
        const { data } = await saveOrUpdateLesson(this.lessonForm)
        if (data.code === '000000') {
          console.log(data);
          this.$emit('close-dialog-refresh')
          this.$message.success(`${this.isEdit ? '修改课时成功' : '添加课时成功'}`)
        }
      } catch (error) {
        this.$message.error(`${this.isEdit ? '修改课时失败' : '添加课时失败'}`)
        console.log(error);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form{
  padding: 0 30px;
}
.btn-group{
  display: flex;
  justify-content: center;
  margin: 10px 0;
}
</style>
