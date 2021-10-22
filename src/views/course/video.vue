<template>
  <div class="course-video">
      <el-card>
          <div slot="header">
            <el-descriptions title="信息">
              <el-descriptions-item label="课程">{{ courseName }}</el-descriptions-item>
              <el-descriptions-item label="课时">{{ theme }}</el-descriptions-item>
            </el-descriptions>
          </div>
          <el-form>
              <el-form-item label="视频上传">
                  <input type="file" ref="video-file"/>
              </el-form-item>
              <el-form-item label="视频上传进度" v-if="videoUploadPercent !== 0">
                <el-progress :percentage="videoUploadPercent" :status="videoS"></el-progress>
              </el-form-item>
              <el-form-item label="视频转码进度" v-if="UploadSucceed">
                <el-progress :percentage="videoTranscodePercent"></el-progress>
              </el-form-item>
              <el-form-item label="封面上传">
                  <input type="file" ref="img-file"/>
              </el-form-item>
              <el-form-item label="封面上传进度" v-if="imgUploadPercent !== 0">
                <el-progress :percentage="imgUploadPercent" :status="imgS"></el-progress>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="startUpload">开始上传</el-button>
                  <el-button @click="$router.push({ name: 'course-section', params: { courseId, courseName } })">返回</el-button>
              </el-form-item>
          </el-form>
      </el-card>
  </div>
</template>

<script>
import {
  aliyunImagUploadAddressAdnAuth,
  aliyunVideoUploadAddressAdnAuth,
  aliyunTransCode,
  aliyunTransCodePercent
} from '@/services/aliyun-upload'

export default {
  name: 'CourseVideo',
  props: {
    courseName: {
      type: String
    },
    courseId: {
      type: [String, Number],
      required: true
    },
    theme: {
      type: String
    },
    lessonId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      // 图片上传后的地址，用于视频上传凭证请求
      imageURL: '',
      // 上传实例
      uploader: null,
      // 上传视频的ID
      videoId: null,
      // 上传状态
      imgUploadPercent: 0,
      imgS: 'warning',
      videoUploadPercent: 0,
      videoS: 'warning',
      UploadSucceed: false,
      transcodeSucceed: false,
      videoTranscodePercent: 0
    }
  },
  created () {
    this.initUploader()
  },
  methods: {
    initUploader () {
      this.uploader = new window.AliyunUpload.Vod({
        // userID，必填，只需有值即可。
        userId: '1618139964448548',
        // 上传到视频点播的地域，默认值为'cn-shanghai'，//eu-central-1，ap-southeast-1
        region: '',
        // 分片大小默认1 MB，不能小于100 KB
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async uploadInfo => {
          console.log('上传开始', uploadInfo);
          let uploadAddressAndAuth = null
          // 检测时图片还是视频
          if (uploadInfo.isImage) {
            // 图片处理
            const { data } = await aliyunImagUploadAddressAdnAuth()
            if (data.code === '000000') {
              console.log(data);
              uploadAddressAndAuth = data.data
              this.imageURL = uploadAddressAndAuth.imageURL
            }
          } else {
            // 视频处理
            const { data } = await aliyunVideoUploadAddressAdnAuth({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageURL
            })
            if (data.code === '000000') {
              uploadAddressAndAuth = data.data
              this.videoId = data.data.videoId
            }
          }
          // 设置凭证与地址
          this.uploader.setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
          )
          // 上传开始执行
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo) {
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
        },
        // 文件上传进度，单位：字节
        onUploadProgress: (uploadInfo, totalSize, loadedPercent) => {
          if (!uploadInfo.isImage) {
            this.videoUploadPercent = Math.floor(loadedPercent * 100)
          } else {
            this.imgUploadPercent = Math.floor(loadedPercent * 100)
          }
        },
        // 上传凭证或STS token超时
        onUploadTokenExpired: function (uploadInfo) {
        },
        // 全部文件上传结束
        onUploadEnd: async uploadInfo => {
          this.imgS = 'success'
          this.videoS = 'success'
          this.UploadSucceed = true
          // 发送视频转码请求
          const { data } = await aliyunTransCode({
            lessonId: this.lessonId,
            coverImageUrl: this.imageURL,
            fileId: this.videoId,
            fileName: this.$refs['video-file'].files[0].name
          })
          if (data.code === '000000') {
            // 轮询转码进度
            const timer = setInterval(async () => {
              const { data } = await aliyunTransCodePercent(this.lessonId)
              if (data.code === '000000') {
                this.videoTranscodePercent = data.data
                if (data.data === 100) {
                  this.transcodeSucceed = true
                  this.$message.success('视频转码完成')
                  clearInterval(timer)
                }
              }
            }, 1000)
          }
        }
      });
    },
    startUpload () {
      // 上传前重置
      this.imgUploadPercent = 0
      this.imgS = 'warning'
      this.videoUploadPercent = 0
      this.videoS = 'warning'
      this.UploadSucceed = false
      this.transcodeSucceed = false
      this.videoTranscodePercent = 0
      // 拿到文件
      const videoFile = this.$refs['video-file'].files[0]
      const imgFile = this.$refs['img-file'].files[0]
      console.log(videoFile, imgFile);
      const uploader = this.uploader
      uploader.addFile(imgFile)
      uploader.addFile(videoFile)
      // 开始上传
      uploader.startUpload()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-progress{
  width: 40%;
}
</style>
