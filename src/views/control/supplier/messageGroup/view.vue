<template>
  <el-form
    label-position="center"
    label-width="140px"
    label-suffix="："
    :model="form">
    <el-form-item
      label="消息分组"
      prop="messageGroupName">
      {{ form.messageGroupName }}
    </el-form-item>
    <el-form-item
      label="消息分组标识码"
      prop="messageGroupCode">
      {{ form.messageGroupCode }}
    </el-form-item>
    <el-form-item label="备注">
      {{ form.description }}
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'MsgGroupView',
    components: {
     
    },
    props: {
      row: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        form: {
          messageGroupName: '',
          messageGroupCode: '',
          description: ''
        }
      }
    },
    created() {
      this.form = JSON.parse(JSON.stringify(this.row));
    },
    methods: {

    }
  }
</script>
