<template>
  <div>
    <template-info :is-detail="true" />
    <div class="business-handle-template-info-content">
      <div class="business-handle-template-info-content-title business-handle-template-info-content-item">
        审核流程
      </div>
      <div class="business-handle-content">
        <el-timeline>
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
        </el-timeline>
      </div>
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
        templateChannelList: [],
        auditFlow: [],
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
    created() {
      if (this.$route.query.templateId) {
        // 获取模板渠道
        // this.queryTemplateChannel();
        this.queryTempAuditRecord();
      }
    },
    methods: {
      // 获取审核记录
      queryTempAuditRecord() {
        this.$http['queryTempAuditRecord'](
          {
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
      // 获取模板渠道
      queryTemplateChannel() {
        this.$http['queryTemplateChannel'](
          {
            ...this.$route.query
          }).then((resp) => {
          if (!resp) {
            return;
          }
          this.templateChannelList = resp.map((item) => {
            return {
              ...item,
              isCheck: item.xzbz ? true : false
            }
          });
        })
      },
    }
  }
</script>

<style lang="scss">
  .business-handle-template-info-content {
    margin-top: 20px;
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
  }
</style>