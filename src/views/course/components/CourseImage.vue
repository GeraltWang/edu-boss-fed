<template>
  <div class="course-image">
      <el-form-item :label="label">
            <!-- 上传进度条 -->
            <el-progress
            v-if="uploading"
            type="circle"
            :width="178"
            :percentage="percentage"
            :status="percentage === 100 ? 'success' : undefined">
            </el-progress>
            <!-- upload组件 -->
            <el-upload
            v-else
            class="avatar-uploader"
            action=""
            show-file-list
            :before-upload="beforeImageUpload"
            :http-request="uploadImg"
            >
                <!-- img 为预览图片 -->
                <img v-if="value" :src="value" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div class="el-upload__tip" slot="tip">接受jpg/png文件，且不超过{{ limit }}MB</div>
            </el-upload>
      </el-form-item>
  </div>
</template>

<script>
import { uploadCourseImage } from '@/services/course'

export default {
  name: 'CourseImage',
  props: {
    value: {
      type: String
    },
    label: {
      type: String
    },
    limit: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      // 上传状态
      uploading: false,
      percentage: 0
    }
  },
  methods: {
    // 上传图片,option 为上传的相关信息
    // option.file 为上传文件的信息
    async uploadImg (option) {
      // 后端要求使用 FormData 对象处理
      const fd = new FormData()
      fd.append('file', option.file)
      this.uploading = true
      // 上传开始
      const { data } = await uploadCourseImage(fd, event => {
        this.percentage = Math.floor(event.loaded / event.total * 100)
      })
      console.log(data);
      if (data.code === '000000') {
        this.$emit('input', data.data.name)
        this.uploading = false
        // 上传成功后，进度归零
        this.percentage = 0
        this.$$message.success('上传成功')
      }
    },
    // 上传前回调
    beforeImageUpload (file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png'
      const isLt = file.size / 1024 / 1024 < this.limit
      if (!isJPG) {
        this.$message.error('图片需为 JPG/PNG 格式!')
      }
      if (!isLt) {
        this.$message.error(`上传头像图片大小不能超过 ${this.limit}MB!`)
      }
      return isJPG && isLt;
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
