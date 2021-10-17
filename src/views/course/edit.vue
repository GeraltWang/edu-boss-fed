<template>
  <div class="course-edit">
      <create-or-edit
      is-edit
      :course-id="courseId">
      </create-or-edit>
  </div>
</template>

<script>
import CreateOrEdit from './components/CreateOrEdit.vue'

export default {
  name: 'CourseEdit',
  components: {
    CreateOrEdit
  },
  props: {
    courseId: {
      type: [Number, String],
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
