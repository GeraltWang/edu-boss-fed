<template>
  <div class="course-section">
      <el-page-header @back="$router.go(-1)">
          <span slot="content" class="header-content">
              <span>{{courseName}}</span>
              <el-button type="primary" @click="addSection">添加阶段</el-button>
          </span>
      </el-page-header>
      <el-card>
        <el-tree
        :data="courseSection"
        :props="defaultProps"
        draggable>
            <div class="inner" slot-scope="{ node, data}">
                <!-- 自定义插槽内容设置 -->
                <span>{{ node.label }}</span>
                <!-- 按钮结构 -->
                <span v-if="data.sectionName" class="sections">
                    <el-button type="warning" size="small" icon="el-icon-edit" @click="editSection">编辑</el-button>
                    <el-button type="primary" size="small" icon="el-icon-plus">添加课时</el-button>
                    <el-button size="small">{{data.status | status}}</el-button>
                </span>
                <span v-else>
                    <el-button size="small" icon="el-icon-edit">编辑</el-button>
                    <el-button size="small" icon="el-icon-upload">上传视频</el-button>
                    <el-button size="small">{{data.status | status}}</el-button>
                </span>
            </div>
        </el-tree>
      </el-card>
      <!-- 添加或编辑章节dialog -->
      <el-dialog
        title="章节信息"
        :visible.sync="dialogVisible"
        v-if="dialogVisible"
        width="50%"
        >
        <create-or-edit-section  :is-edit="isEdit"></create-or-edit-section>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { getSectionAndLesson } from '@/services/course-section'
import CreateOrEditSection from './components/CreateOrEditSection.vue'

export default {
  name: 'CourseSection',
  components: {
    CreateOrEditSection
  },
  props: {
    courseId: {
      type: [String, Number],
      required: true
    },
    courseName: {
      type: String
    }
  },
  data () {
    return {
      // 课程内容展示
      courseSection: [],
      // 树形组件标签设置
      defaultProps: {
        children: 'lessonDTOS',
        label (data) {
          return data.sectionName || data.theme
        }
      },
      dialogVisible: false,
      isEdit: false
    }
  },
  created () {
    this.loadSectionAndLesson()
  },
  methods: {
    async loadSectionAndLesson () {
      const { data } = await getSectionAndLesson(this.courseId)
      if (data.code === '000000') {
        this.courseSection = data.data
      }
      console.log(data);
    },
    addSection () {
      this.isEdit = false
      this.dialogVisible = true
    },
    editSection () {
      this.isEdit = true
      this.dialogVisible = true
    }
  },
  filters: {
    status (val) {
      if (val === 0) {
        return '已隐藏'
      }
      if (val === 1) {
        return '待更新'
      }
      return '已发布'
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-page-header{
  height: 50px;
  align-items: center;
  justify-content: space-between;
  .el-page-header__content{
    flex: 1;
    .header-content{
      display: flex;
      flex: 1;
      justify-content: space-between;
      align-items: center;
    }
  }
}
.inner{
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #f0f0f0;
}
::v-deep .el-tree-node__content{
    height: auto;
}
</style>
