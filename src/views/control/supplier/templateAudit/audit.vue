<template>
  <div class="business-handle-template-audit-content">
    <template-info 
      ref="refTplInfo"
      @query-template-success="queryTemplateInfo" />
    
    <div class="business-handle-template-info-content">
      <div class="business-handle-template-info-content-title business-handle-template-info-content-item">
        审核流程
      </div>
      <div
        class="business-handle-content">
        <el-timeline>
          <!-- v-if="notOnlySms"> -->
          <el-timeline-item
            v-for="(auditInfo, index) in auditFlow"
            :key="index"
            type="primary"
            color="#0bbd87">
            <p class="business-timeline-text">
              <span>审核者：{{ auditInfo.shrMc }}</span><br>
              <span>税务机关：{{ auditInfo.shrSwjgMc }}</span><br>
              <span>审核时间：{{ auditInfo.shrq }}</span><br>
              <span>
                审核结果：
                <span
                  class="template-manage-audit-state-sign"
                  :style="{backgroundColor: auditInfo.auditStateColor}" />
                {{ auditInfo.shbz }}
              </span><br>
              <!-- <span>申请原因：{{ auditInfo.sqsm }}</span><br> -->
              <span>审核意见：{{ auditInfo.shyj }}</span>
            </p>
          </el-timeline-item>
          <el-timeline-item
            type="primary"
            color="#0bbd87">
            <p class="business-timeline-text">
              <span>审核者：{{ baseInfo.userName }}</span><br>
              <span>税务机关：{{ baseInfo.swjgDm.swjgjc }}</span><br>
              <!-- <span>申请原因：{{ templateInfo.sqsm }}</span> -->
            </p>
            <div class="business-check-input">
              <label>审核意见：</label>
              <el-input
                v-model="aduitReason"
                type="textarea"
                :rows="3"
                maxlength="500"
                show-word-limit
                placeholder="请描述拒绝或者通过的原因" />
            </div>
          </el-timeline-item>
        </el-timeline>
        <!-- <p v-if="!notOnlySms">
          该模板只包含短信模板，需要先在短信平台进行短信文本的审核。请联系短信平台。
        </p> -->
      </div>
    </div>

    <!-- v-if="notOnlySms" -->
    <div
      class="tool-bar">
      <el-button
        type="primary"
        size="medium"
        @click="clickAgreeBtn">
        通过
      </el-button>
      <el-button
        size="medium"
        :disabled="disAgreeBtnDisable"
        @click="clickDisagreeBtn">
        拒绝
      </el-button>
    </div>
  </div>
</template>

<script>
  import templateInfo from './templateInfo';
  import moment from 'moment';
  export default {
    components: {
      templateInfo
    },
    data() {
      return {
        aduitReason: '',
        templateInfo: {},
        auditFlow: [],
        baseInfo: {
          swjgDm: {}
        },
        templateStateMap: {
          '1': {
            name: '待审核',
            color: '#FF6600'
          },
          '0': {
            name: '已拒绝',
            color: '#E63322'
          },
          '2': {
            name: '已通过',
            color: '#1DC254'
          },
          '3': {
            name: '待验证',
            color: '#FF6600'
          },
          '4': {
            name: '未同步',
            color: '#FF6600'
          }
        },
      }
    },
    computed: {
      disAgreeBtnDisable() {
        return !this.aduitReason
      },
      notOnlySms() {
        let notOnlySms = false;
        const template = this.templateInfo.templates || {};
        Object.values(template).forEach((item) => {
          item.forEach((temp) => {
            if (temp.channel !== 'SMS') {
              notOnlySms = true;
            }
          })
        })
        return notOnlySms;
      }
    },
    watch: {
    },
    created() {
      if (this.$route.query.templateId) {
        this.queryTempAuditRecord();
        this.queryUserBaseInfo();
      }
    },
    methods: {
      // 获取审核记录
      queryTempAuditRecord() {
        this.$http['queryTempAuditRecord'](
          {
            // mbxh: `${this.$route.query.mbxh}`,
            templateId: `${this.$route.query.templateId}`,
            appid: `${this.$route.query.appid}`
          }).then((resp) => {
          if (!resp || !resp.length) {
            return;
          }
          resp.forEach((item) => {
            const auditState = this.templateStateMap[item.shbz] || {};
            item.shbz = auditState.name;
            item.auditStateColor = auditState.color;
            item.shrq = item.shrq ? moment(item.shrq).format('YYYY-MM-DD HH:mm:ss') : '';
            this.auditFlow.push(item);
          })
        })
      },
      // 用户基本信息
      queryUserBaseInfo() {
        this.$http['queryUserBaseInfoByToken']().then((resp) => {
          if (!resp) {
            return;
          }
          this.baseInfo = resp;
        })
      },
      queryTemplateInfo(data) {
        this.templateInfo = data;
      },
      clickAgreeBtn() {
        this.auditTemplate('Y');
      },
      clickDisagreeBtn() {
        this.$confirm('是否拒绝该模板的申请？')
          .then(() => {
            // 拒绝
            this.auditTemplate('N');
          })
          .catch(() => {})
      },
      auditTemplate(auditType) {
        const info = this.templateInfo;
        const swjgSmsChannelDetails = this.$refs.refTplInfo.filterCheckedChannel();
        if (swjgSmsChannelDetails === 'fail') return false;
        this.$http['updateTempAuditRecord']({
          templateId: info.templateId,
          appid: info.appid,
          auditDesc: this.aduitReason,
          auditStatus: auditType,
          swjgSmsChannelDetails
        }).then(() => {
          this.$message.success('审核成功');
          // 返回列表页
          this.$router.go(-1);
        })
      }
    }
  }
</script>

<style lang="scss">
  .business-handle-template-audit-content {
    .business-handle-template-info-content {
      margin-top: 20px
    }
    .business-handle-template-channel-input {
      display: inline-block;
      width: calc(100% - 80px)
    }
    .business-handle-content {
      border: 1px solid #dfe1e6;
      padding: 20px;
      color: #666666;
    }
    .business-timeline-text {
      word-break: break-all;
      span {
        display: inline-block;
        margin-bottom: 10px;
        word-break: break-word;
      }
      .template-manage-audit-state-sign {
        display: inline-block;
        position: relative;
        top: 10px;
        width: 10px;
        height: 10px;
        margin-right: 8px;
        border-radius: 50%;
      }
    }
    .business-check-input {
      label {
        float: left;
      }
      .el-textarea {
        position: relative;
        top: -15px;
        width: calc(100% - 70px);
        margin-left: 70px;
      }
    }
  }
</style>