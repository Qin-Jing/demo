<template>
  <div class="template-manage-edit-detail">
    <el-alert
      v-if="templateInfo.auditFailedReason"
      :title="`模板审核失败原因：${templateInfo.auditFailedReason}`"
      type="error" />
    <div class="edit-source-template-info-content">
      <div class="edit-source-template-info-content-title edit-source-template-info-content-item">
        模板信息
      </div>
      <ul class="edit-source-template-info-content-list">
        <li class="edit-source-template-info-content-item w33 rb">
          所属应用：
          <span>{{ templateInfo.appName }}</span>
        </li>
        <li class="edit-source-template-info-content-item w33 rb">
          消息分组：
          <span>{{ templateInfo.messageGroupName }}</span>
        </li>
        <li class="edit-source-template-info-content-item w33">
          业务类型：
          <span>{{ templateInfo.superMessageName + templateInfo.messageName }}</span>
        </li>
        <li class="edit-source-template-info-content-item w33 rb">
          模板名称：
          <span>{{ templateInfo.templateName }}</span>
        </li>
        <li class="edit-source-template-info-content-item w33 rb">
          模板标识码：
          <span>{{ templateInfo.templateId }}</span>
        </li>
        <li class="edit-source-template-info-content-item w33">
          可发送时间段：
          <span>{{ getTime() }}</span>
        </li>
        <!-- <li class="edit-source-template-info-content-item w33 rb">
          存量消息发送策略：
          <span>{{ templateInfo.isBefore ? '按审核前' : '按审核后' }}</span>
        </li> -->
        <li class="edit-source-template-info-content-item full">
          期望开始生效时间：
          <span>{{ getEffectTime() }}</span>
        </li>
      </ul>
    </div>
    <div class="edit-source-detail-tabs">
      <el-tabs
        v-model="editableTabsValue">
        <el-tab-pane
          v-for="(item, index) in editableTabs"
          :key="index"
          :label="item.title"
          :name="item.name">
          <div
            v-for="(info, ItemIndex) in item.content"
            v-show="item.content && item.content.length > 0"
            :key="`item-${ItemIndex}`"
            class="edit-source-template-info-content">
            <!-- <div class="edit-source-template-info-content-title edit-source-template-info-content-item">
              {{ info.title }}
            </div> -->
            <ul class="edit-source-template-info-content-list">
              <li
                class="edit-source-template-info-content-item">
                <!-- :class="{'col-3': info.channel === 'SMS'}"> -->
                渠道类型：
                <span>{{ getChannel(info) }}</span>
              </li>
              <li
                class="edit-source-template-info-content-item">
                <!-- :class="{'col-3': info.channel === 'SMS'}"> -->
                终端渠道：
                <span>{{ getChannelIdName(info) }}</span>
              </li>
              <!-- <li
                v-if="info.channel === 'SMS'"
                class="edit-source-template-info-content-item col-3">
                审核状态：
                <span
                  class="template-manage-audit-state-sign"
                  :style="{backgroundColor: templateStateMap[info.auditStatus] && templateStateMap[info.auditStatus].color}" />
                <span>{{ templateStateMap[info.auditStatus] && templateStateMap[info.auditStatus].name }}</span>
              </li> -->
              <!-- <li
                v-if="info.channel === 'SMS' && info.auditStatus === '0'"
                class="edit-source-template-info-content-item full">
                模板审核失败原因：{{ info.auditFailedDetailReason }}
              </li> -->
              <li
                v-if="info.channel !== 'SMS'"
                class="edit-source-template-info-content-item full">
                模板标题：
                <span>{{ info.msgTitle }}</span>
              </li>
              <li class="edit-source-template-info-content-item full">
                模板内容：
                <span>{{ info.templateContent }}</span>
              </li>
            </ul>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import {
    modifyFormatterTime,
    transformChannelIdName,
    transformChannel,
    transformEffectTime
  } from '../../constant';

  export default {
    props: {
    },
    data() {
      return {
        editableTabsValue: '0',
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
        templateInfo: {}
      }
    },
    computed: {
      editableTabs() {
        const list = [];
        this.templateInfo.swjgs && this.templateInfo.swjgs.forEach((item, index) => {
          list.push({
            title: item.swjgMc,
            name: `${index}`,
            content: this.templateInfo.templates[item.swjgDm]
          })
        })
        return list
      }
    },
    created() {
      // 获取模板详情
      this.queryTemplateDetail();
    },
    methods: {
      // 获取模板详情
      queryTemplateDetail() {
        this.$http['queryTemplateDetail'](
          {
            ...this.$route.query
          }
        )
          .then((resp) => {
            if (!resp) {
              return;
            }
            this.templateInfo = resp;
          })
      },
      // 转换显示
      getChannel(info) {
        return transformChannel(info);
      },
      // 终端渠道显示
      getChannelIdName(info) {
        return transformChannelIdName(info);
      },
      // 修改流程 转换时间显示
      transformTime() {
        if (!this.templateInfo.pushBeginTime) {
          return '不限制';
        }

        const beginTime = modifyFormatterTime(this.templateInfo.pushBeginTime);
        const endTime = modifyFormatterTime(this.templateInfo.pushEndTime);
        return `${beginTime}-${endTime}`;
      },
      // 转换显示时间段
      getTime() {
        return this.transformTime();
      },
      // 期望开始生效时间 
      getEffectTime() {
        return transformEffectTime(this.templateInfo);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~gui/style/theme/variables';
  $content-border: 1px solid $CM-7;

  .template-manage-edit-detail {
    .edit-source-template-info-content {
      border: $content-border;
      border-bottom: none;
      color: $CN-4;
      & + .edit-source-template-info-content {
        margin-top: 20px;
      }
      .edit-source-template-info-content-item {
        border-bottom: $content-border;
        padding-left: $ST-7;
        @include P-1;
        line-height: $SH-12;
      }
      .edit-source-template-info-content-title {
        background-color: $CM-8;
        font-weight: bold;
      }
      .edit-source-template-info-content-list {
        li {
          display: inline-block;
          box-sizing: border-box;
          width: 50%;

          &.w33 {
            width: 33.333%;
          }
          &.w34 {
            width: 34%;
          }
          &.rb {
            border-right: $content-border;
          }
          // &:nth-of-type(odd) {
          //   border-right: $content-border;
          // }
          // &:last-of-type {
          //   border-bottom: none;
          // }
          span {
            color: $CN-2;
          }
        }
        .full {
          width: 100%;
        }
        .col-3 {
          width: 33.333%;
        }
      }
    }
    .edit-source-template-add-btn {
      margin-bottom: 20px;
    }
    .edit-source-detail-tabs {
      position: relative;
      margin-top: 20px;
      .el-tabs__nav-wrap {
        width: 500px;
      }
      .edit-source-detail-tabs-add-btn {
        position: absolute;
        left: 510px;
        top: 0;
        padding: 5px;
        border: 1px solid #B3B5BA;
        border-radius: 3px;
        line-height: 1;
        cursor: pointer;
      }
    }
    .el-dialog .el-dialog__body {
      min-height: 0;
    }
    .template-manage-audit-state-sign {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: 8px;
      border-radius: 50%;
    }
  }

</style>