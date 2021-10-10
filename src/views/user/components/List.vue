<template>
    <div class="user-list">
        <el-card>
            <div slot="header">
                <el-form
                :inline="true"
                :model="queryUser"
                ref="queryFrom"
                size="small"
                label-position="top">
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="queryUser.phone" size="small" clearable></el-input>
                </el-form-item>
                <el-form-item label="注册时间" prop="timeRange">
                    <el-date-picker
                    v-model="queryUser.timeRange"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="">
                    <el-button>重置</el-button>
                    <el-button type="primary">查询</el-button>
                </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script>
export default {
  name: 'UserList',
  data () {
    return {
      queryUser: {
        phone: '',
        timeRange: ''
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
