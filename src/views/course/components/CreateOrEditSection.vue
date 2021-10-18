<template>
  <div class="create-or-edit-section">
      <!-- <span>{{ isEdit }}</span> -->
      <el-form label-position="right" label-width="90px" :model="sectionForm" :rules="rules" ref="sectionForm">
          <el-form-item label="课程名称" prop="courseName">
              <el-input v-model="sectionForm.courseName" disabled></el-input>
          </el-form-item>
          <el-form-item label="章节名称" prop="sectionName">
              <el-input v-model="sectionForm.sectionName"></el-input>
          </el-form-item>
          <el-form-item label="章节描述">
              <el-input type="textarea" v-model="sectionForm.description"></el-input>
          </el-form-item>
          <el-form-item label="章节排序">
              <el-input type="number" v-model="sectionForm.orderNum">
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
import { getBySectionId, saveOrUpdateSection } from '@/services/course-section'

export default {
  name: 'CreateOrEditSection',
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
    sectionId: {
      type: [String, Number]
    }
  },
  data () {
    return {
      sectionForm: {
        courseName: '',
        courseId: null
      },
      rules: {
        courseName: [
          { required: true, message: '课程名称不能为空', trigger: 'blur' }
        ],
        sectionName: [
          { required: true, message: '章节名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    if (this.isEdit) {
      console.log(this.sectionId);
      this.loadSectionForm()
    } else {
      this.sectionForm.courseName = this.courseName
      this.sectionForm.courseId = this.courseId
    }
  },
  methods: {
    async loadSectionForm () {
      const { data } = await getBySectionId(this.sectionId)
      if (data.code === '000000') {
        this.sectionForm = data.data
      }
      this.sectionForm.courseName = this.courseName
      console.log(this.sectionForm);
    },
    // 保存或更新章节
    async saveOrUpdate () {
      try {
        await this.$refs.sectionForm.validate()
        const { data } = await saveOrUpdateSection(this.sectionForm)
        if (data.code === '000000') {
          console.log(data);
          this.$emit('close-dialog-refresh')
          this.$message.success(`${this.isEdit ? '修改成功' : '添加成功'}`)
        }
      } catch (error) {
        this.$message.error(`${this.isEdit ? '修改失败' : '添加失败'}`)
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
