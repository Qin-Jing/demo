<template>
  <div class="template-edit-form-content">
    <el-form
      ref="editMsgTemplateForm"
      class="content-form"
      label-width="180px"
      :model="MsgTemplateInfo"
      :rules="MsgTemplateInfoRule">
      <el-form-item
        label="应用ID"
        prop="appid">
        <el-select v-model="MsgTemplateInfo.appid">
          <el-option
            v-for="item in appIdList"
            :key="item"
            :label="item"
            :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item
        label="模板ID"
        prop="templateId">
        <el-input
          v-model="MsgTemplateInfo.templateId"
          :maxlength="50" />
      </el-form-item>
      <el-form-item
        label="模板名称"
        prop="templateName">
        <el-input
          v-model="MsgTemplateInfo.templateName"
          :maxlength="256" />
      </el-form-item>
      <el-form-item
        label="模板内容"
        prop="templateContent">
        <el-input
          v-model="MsgTemplateInfo.templateContent"
          type="textarea"
          :maxlength="256"
          :rows="5" />
      </el-form-item>
      <el-form-item
        label="税务机关代码"
        prop="swjgDm">
        <el-input
          v-model="MsgTemplateInfo.swjgDm"
          :maxlength="256" />
      </el-form-item>
      <el-form-item
        label="终端渠道ID"
        prop="channelId">
        <el-input
          v-model="MsgTemplateInfo.channelId"
          :maxlength="50" />
      </el-form-item>
    </el-form>
    
    <div class="tool-bar">
      <el-button
        type="primary"
        size="medium"
        :disabled="disableButton"
        @click="clickSubmit">
        确定
      </el-button>
      <el-button
        size="medium"
        @click="clickCancel">
        取消
      </el-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
    },
    data() {
      return {
        appIdList: [],
        MsgTemplateInfoRule: {
          templateId: [
            { required: true, message: '请输入模板ID', trigger: 'blur' },
          ],
          templateName: [
            { required: true, message: '请输入模板名称', trigger: 'blur' },
          ],
          templateContent: [
            { required: true, message: '请输入模板内容', trigger: 'blur' },
          ],
          appid: [
            { required: true, message: '请输入appid', trigger: 'blur' },
          ],
          swjgDm: [
            { required: true, message: '请输入税务机关代码', trigger: 'blur' },
          ],
          channelId: [
            { required: true, message: '终端渠道ID', trigger: 'blur' },
          ]
        },
        mbxh: '', // 模板序号，用于判断编辑新增
        defaultForm: {
          swjgDm: '00000000000',
          templateId: '',
          templateName: '', // 模板名称
          templateContent: '',
          appid: '',
          channel: 'APP',
          yxbz: 'Y',
          lrrDm: '10086',
          xgrDm: '',
          channelId: ''
        },
        MsgTemplateInfo: {}
      }
    },
    computed: {
      disableButton() {
        const info = this.MsgTemplateInfo;
        return !info.templateId ||
          !info.templateName ||
          !info.templateContent ||
          !info.appid ||
          !info.swjgDm ||
          !info.channelId;
      },
    },
    created() {
      this.getMsgChannelAppIdList();
      this.mbxh = this.$route.query.mbxh;
      if (this.mbxh) {
        this.queryMsgTemplateDateils(this.mbxh);
        return;
      }
      this.MsgTemplateInfo = this.defaultForm;
    },
    methods: {
      getMsgChannelAppIdList() {
        this.$http.getMsgChannelAppIdList()
          .then((list) => {
            if (!list || list.length === 0) {
              return;
            }
            this.appIdList = list;
          })
      },
      queryMsgTemplateDateils(mbxh) {
        this.$http.queryMsgTemplateDateils({
          mbxh: +mbxh
        })
          .then((info) => {
            this.MsgTemplateInfo = info;
          })
      },
      // 点击确定
      clickSubmit() {
        this.$refs.editMsgTemplateForm.validate((valid) => {
          if (valid) {
            // 根据id判断编辑或者新增
            if (this.MsgTemplateInfo.mbxh) {
              // 编辑消息模板
              this.editMsgTemplate();
              return;
            }
            this.insertMsgTemplate();
          }
        });
      },
      // 编辑消息模板
      editMsgTemplate() {
        this.$http.updateMsgTemplateInfo(
          {
            ...this.MsgTemplateInfo,
            xgrDm: '10086',
          }
        )
          .then(() => {
            this.$message.success('编辑成功');
            this.returnListPage();
          })
      },
      // 添加消息模板
      insertMsgTemplate() {
        this.$http.addMsgTemplate(
          this.MsgTemplateInfo
        )
          .then(() => {
            this.$message.success('添加成功');
            this.returnListPage();
          })
      },
      // 点击取消
      clickCancel() {
        this.returnListPage();
      },
      // 返回列表页
      returnListPage() {
        this.$router.push('/control/supplier/template')
      }
    }
  }
</script>

<style lang="scss" scope>
  .template-edit-form-content {
    .content-form {
      width: 460px;
      margin: 0 auto;
    }
  }
</style>
