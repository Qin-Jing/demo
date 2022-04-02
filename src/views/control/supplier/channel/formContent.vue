<template>
  <div class="channel-edit-form-content">
    <el-form
      ref="editMsgChannelForm"
      class="content-form"
      label-width="180px"
      :model="msgChannelInfo"
      :rules="msgChannelInfoRule">
      <el-form-item
        label="应用ID"
        prop="appid">
        <el-select v-model="msgChannelInfo.appid">
          <el-option
            v-for="item in appidList"
            :key="item"
            :label="item"
            :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item
        label="渠道类型"
        prop="channel">
        <el-input
          v-model="msgChannelInfo.channel"
          :maxlength="10" />
      </el-form-item>
      <el-form-item
        label="终端渠道ID"
        prop="channelIds">
        <el-tooltip
          class="item"
          effect="dark"
          content="一次可输入多条，使用','隔开。单条不可超过20个字符。"
          placement="top-start">
          <i class="iconfont icon-wenhao" />
        </el-tooltip>
        <el-input
          v-model="msgChannelInfo.channelIds"
          type="textarea"
          :maxlength="1024"
          :rows="5" />
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
        appidList: [],
        msgChannelInfoRule: {
          appid: [
            { required: true, message: '请选择应用ID', trigger: 'blur'},
          ],
          channel: [
            { required: true, message: '请输入渠道类型', trigger: 'blur'},
          ],
          channelIds: [
            {
              required: false,
              trigger: 'blur',
              validator: (rule, value, callback) => {
                if (value && !this.checkChannelIds(value)) {
                  callback(new Error('终端渠道ID格式不正确'));
                } else {
                  callback();
                }
              }
            },
          ]
        },
        configChannelXh: '', // 模板序号，用于判断编辑新增
        defaultForm: {
          appid: '',
          channel: '',
          channelIds: '', // 添加是数组
          channelId: '' // 编辑是字符串
        },
        msgChannelInfo: {}
      }
    },
    computed: {
      disableButton() {
        const info = this.msgChannelInfo;
        return !info.appid ||
          !info.channel;
      },
    },
    created() {
      this.getMsgChannelAppIdList();
      // 有模板序号就编辑
      this.configChannelXh = this.$route.query.configChannelXh;
      if (this.configChannelXh) {
        this.queryMsgChannelDateils(this.configChannelXh);
        return;
      }
      this.msgChannelInfo = this.defaultForm;
    },
    methods: {
      getMsgChannelAppIdList() {
        this.$http.getMsgChannelAppIdList()
          .then((list) => {
            if (!list || list.length === 0) {
              return;
            }
            this.appidList = list;
          })
      },
      queryMsgChannelDateils(configChannelXh) {
        this.$http.queryMsgChannelDateils({
          configChannelXh: +configChannelXh
        })
          .then((info) => {
            this.msgChannelInfo = info;
          })
      },
      checkChannelIds(value) {
        return !value.split(',').find(item => item.length > 20)
      },
      // 点击确定
      clickSubmit() {
        this.$refs.editMsgChannelForm.validate((valid) => {
          if (valid) {
            // 根据id判断编辑或者新增
            if (this.msgChannelInfo.configChannelXh) {
              // 编辑渠道
              this.editMsgChannel();
              return;
            }
            this.insertMsgChannel();
          }
        });
      },
      // 编辑渠道
      editMsgChannel() {
        this.$http.updateMsgChannelInfo(
          {
            ...this.msgChannelInfo
          }
        )
          .then(() => {
            this.$message.success('编辑成功');
            this.returnListPage();
          })
      },
      // 添加渠道
      insertMsgChannel() {
        this.$http.addMsgChannel({
          ...this.msgChannelInfo,
          channelIds: this.msgChannelInfo.channelIds.split(',')
        })
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
        this.$router.push('/control/supplier/channel')
      }
    }
  }
</script>

<style lang="scss" scope>
  .channel-edit-form-content {
    .content-form {
      width: 460px;
      margin: 0 auto;
    }
    .el-form > .el-form-item .el-form-item__label {
      padding-right: 32px;
    }
    .icon-wenhao {
      position: absolute;
      top: 0;
      left: -24px;
    }
  }
</style>
