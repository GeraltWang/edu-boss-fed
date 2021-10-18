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
                    <el-button type="warning" size="small" icon="el-icon-edit" @click.stop="editSection(data)">编辑</el-button>
                    <el-button type="primary" size="small" icon="el-icon-plus" @click.stop="addLesson(data)">添加课时</el-button>
                    <el-button size="small" @click.stop="changeSectionStatus(data)">{{data.status | status}}</el-button>
                </span>
                <span v-else>
                    <el-button size="small" icon="el-icon-edit" @click="editLesson(data, node)">编辑</el-button>
                    <el-button size="small" icon="el-icon-upload">上传视频</el-button>
                    <el-button size="small" @click.stop="changeSectionStatus(data)">{{data.status | status}}</el-button>
                </span>
            </div>
        </el-tree>
      </el-card>
      <!-- 添加或编辑章节dialog -->
      <el-dialog
        title="章节信息"
        :visible.sync="dialogVisible"
        lock-scroll
        v-if="dialogVisible"
        width="50%"
        >
        <!-- 引入组件 -->
        <create-or-edit-section
        :is-edit="isEdit"
        :course-name="courseName"
        :course-id="courseId"
        :section-id="sectionId"
        @close-dialog="dialogVisible = $event"
        @close-dialog-refresh="createOrUpdateDone">
        </create-or-edit-section>
      </el-dialog>
      <!-- 更改章节或课时状态dialog -->
      <el-dialog
        title="提示"
        :visible.sync="statusDialogVisible"
        width="30%">
        <span>当前状态：{{sectionForm.status | status}}</span>
        <el-form :model="sectionForm">
          <el-form-item label="状态变更为：">
            <el-select v-model="sectionForm.status">
              <el-option label="已隐藏" :value="0"></el-option>
              <el-option label="待更新" :value="1"></el-option>
              <el-option label="已发布" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="statusDialogVisible = false">取 消</el-button>
          <el-button v-if="isSection" type="primary" @click="setSectionStatus">确 定</el-button>
          <el-button v-else type="primary" @click="setLessonStatus">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加或编辑课时dialog -->
      <el-dialog
        title="课时信息"
        :visible.sync="lessonDialogVisible"
        lock-scroll
        v-if="lessonDialogVisible"
        width="50%"
        >
        <!-- 引入组件 -->
        <create-or-edit-lesson
        :is-edit="isEdit"
        :course-name="courseName"
        :course-id="courseId"
        :section-id="sectionId"
        :section-name="sectionName"
        :lesson-id="lessonId"
        @close-dialog="lessonDialogVisible = $event"
        @close-dialog-refresh="lessonCreateOrUpdateDone">
        </create-or-edit-lesson>
      </el-dialog>
  </div>
</template>

<script>
import { getSectionAndLesson, saveOrUpdateSection } from '@/services/course-section'
import { saveOrUpdateLesson } from '@/services/course-lesson'
import CreateOrEditSection from './components/CreateOrEditSection.vue'
import CreateOrEditLesson from './components/CreateOrEditLesson.vue'

export default {
  name: 'CourseSection',
  components: {
    CreateOrEditSection,
    CreateOrEditLesson
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
      isEdit: false,
      sectionId: null,
      lessonId: null,
      sectionName: '',
      // 用于变更章节和课时状态
      statusDialogVisible: false,
      sectionForm: {
        id: null,
        status: null
      },
      // 用于判断要更改状态的是章节还是课时
      isSection: true,
      lessonDialogVisible: false
    }
  },
  created () {
    this.loadSectionAndLesson()
  },
  methods: {
    // 加载章节和课程
    async loadSectionAndLesson () {
      const { data } = await getSectionAndLesson(this.courseId)
      if (data.code === '000000') {
        this.courseSection = data.data
      }
      console.log(data);
    },
    // 添加章节
    addSection () {
      this.isEdit = false
      this.dialogVisible = true
    },
    // 编辑章节
    editSection (row) {
      this.isEdit = true
      this.sectionId = row.id
      this.dialogVisible = true
      console.log(row);
    },
    // 完成添加或编辑
    createOrUpdateDone () {
      this.dialogVisible = false
      this.loadSectionAndLesson()
    },
    // 添加课时
    addLesson (row) {
      this.isEdit = false
      this.sectionName = row.sectionName
      this.sectionId = row.id
      this.lessonDialogVisible = true
    },
    // 编辑课时
    editLesson (row, node) {
      this.isEdit = true
      this.sectionId = row.sectionId
      this.lessonId = row.id
      this.lessonDialogVisible = true
      console.log(row, 'row');
      console.log(node, 'node');
    },
    // 完成课时添加或编辑
    lessonCreateOrUpdateDone () {
      this.lessonDialogVisible = false
      this.loadSectionAndLesson()
    },
    // 显示隐藏章节状态变更dialog
    changeSectionStatus (row) {
      if (row.sectionName) {
        this.isSection = true
      } else {
        this.isSection = false
      }
      console.log(this.isSection);
      this.statusDialogVisible = true
      this.sectionForm.id = row.id
      this.sectionForm.status = row.status
      console.log(this.sectionForm);
    },
    // 章节状态变更
    async setSectionStatus () {
      const { data } = await saveOrUpdateSection(this.sectionForm)
      if (data.code === '000000') {
        console.log(data);
        this.statusDialogVisible = false
        this.loadSectionAndLesson()
        this.$message.success('章节状态变更成功')
      }
    },
    // 课时状态变更
    async setLessonStatus () {
      const { data } = await saveOrUpdateLesson(this.sectionForm)
      if (data.code === '000000') {
        console.log(data);
        this.statusDialogVisible = false
        this.loadSectionAndLesson()
        this.$message.success('课时状态变更成功')
      }
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
