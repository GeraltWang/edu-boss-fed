<template>
  <div class="wang-editor" ref="editor"></div>
</template>

<script>
import E from 'wangeditor'
import { uploadCourseImage } from '@/services/course'

export default {
  name: 'WangEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      editor: null,
      // 用于判断编辑的数据是否加载完毕
      loaded: false
    }
  },
  mounted () {
    // 富文本编辑器初始化
    this.editorInit()
  },
  methods: {
    editorInit () {
      const editor = new E(this.$refs.editor)
      // 创建编辑器实例之前进行事件设置
      editor.config.onchange = (val) => {
        this.$emit('input', val)
      }
      // 配置自定义上传图片功能
      editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
        const fd = new FormData()
        fd.append('file', resultFiles[0])
        const { data } = await uploadCourseImage(fd)
        if (data.code === '000000') {
          // 通过 insertImgFn 回传给富文本编辑器，进行显示
          insertImgFn(data.data.name)
        }
      }
      editor.create()
      editor.txt.html(this.value)
      this.editor = editor
    }
  },
  watch: {
    value () {
      if (this.loaded === false) {
        this.editor.txt.html(this.value)
      }
      this.loaded = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
