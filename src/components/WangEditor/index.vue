<template>
  <div class="wang-editor" ref="editor"></div>
</template>

<script>
import E from 'wangeditor'

export default {
  name: 'WangEditor',
  props: {
    value: {
      type: String,
      default: ''
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
      editor.create()
      editor.txt.html(this.value)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
