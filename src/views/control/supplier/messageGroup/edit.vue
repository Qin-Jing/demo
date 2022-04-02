<template>
  <el-form
    label-position="right"
    label-width="140px"
    label-suffix="："
    :rules="formRules"
    :model="form">
    <el-form-item
      label="消息分组"
      prop="messageGroupName">
      <el-input
        v-model.trim="form.messageGroupName"
        :maxlength="50" />
    </el-form-item>
    <el-form-item
      label="消息分组标识码"
      prop="messageGroupCode">
      <el-input
        v-model.trim="form.messageGroupCode"
        :maxlength="50" />
    </el-form-item>
    <el-form-item label="备注">
      <el-input
        v-model.trim="form.description"
        :maxlength="100"
        type="textarea" />
    </el-form-item>
  </el-form>
</template>

<script>
  import http from '@/core/service/http';
  export default {
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
      this.formRules = {
        messageGroupName: [{required: true, message: '请输入消息分组名称', trigger: 'blur'}, {
          validator: (rule, val, cb) => {
            http({
              url: 'configmessagegroup/check/message/group',
              data: {
                messageGroupName: val,
                msgGroupId: this.form.msgGroupId
              },
              method: 'POST'
            }).then(res => {
              if(!res) {
                cb('消息分组名称已经被使用')
              } else {
                cb();
              }
            });
          }, trigger: 'blur'
        }],
        messageGroupCode: [{required: true, message: '请输入消息分组标识码', trigger: 'blur'}, {
          validator: (rule, val, cb) => {
            if(!/^[a-zA-Z][a-zA-Z-_]*$/.test(val)){
              return cb('只能包含英文字母、-和_，且必须以英文字母开头');
            } else {
              http({
                url: 'configmessagegroup/check/message/group',
                data: {
                  messageGroupCode: val,
                  msgGroupId: this.form.msgGroupId
                },
                method: 'POST'
              }).then(res => {
                if(!res) {
                  cb('消息分组标识码已经被使用')
                } else {
                  cb();
                }
              });
            }
          }, trigger: 'blur'
        }],
      }
      this.form = JSON.parse(JSON.stringify(this.row));
      if(this.id) {
        this.getDetail();
      }
    },
    methods: {
      getValue(){
        const form = {
          messageGroupName: this.form.messageGroupName,
          messageGroupCode: this.form.messageGroupCode,
          description: this.form.description
        }
        if(this.row.messageGroupCode) {
          form.msgGroupId = this.form.msgGroupId;
        }
        return form;
      }
    }
  }
</script>
