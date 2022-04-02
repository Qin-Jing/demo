<template>
  <div class="business-handle-template-info">
    <div
      class="business-handle-template-info-content">
      <div
        class="business-handle-template-info-content-title business-handle-template-info-content-item">
        用户信息
      </div>
      <ul
        class="business-handle-template-info-content-list">
        <li class="business-handle-template-info-content-item">
          使用者账号：
          <span>{{ templateInfo.xgrDm }}</span>
        </li>
        <li class="business-handle-template-info-content-item">
          使用者公司名称：
          <span>{{ templateInfo.gsmc }}</span>
        </li>
        <li class="business-handle-template-info-content-item full-line">
          所属税务机关：
          <span>{{ templateInfo.swjgmc }}</span>
        </li>
        <!-- <li class="business-handle-template-info-content-item">
          绑定手机：
          <span>{{ templateInfo.lxdh }}</span>
        </li> -->
        <li class="business-handle-template-info-content-item li-rigth-bottom item-no-border-bottom">
          联系人：
          <span>{{ templateInfo.lxrxm }}</span>
        </li>
        <li class="business-handle-template-info-content-item">
          联系电话：
          <span>{{ templateInfo.lxdh }}</span>
        </li>
      </ul>
    </div>
    <div class="business-handle-template-info-content">
      <div class="business-handle-template-info-content-title business-handle-template-info-content-item">
        模板信息
      </div>
      <ul class="business-handle-template-info-content-list">
        <li class="business-handle-template-info-content-item mini">
          所属应用：
          <span>{{ templateInfo.appName }}</span>
        </li>
        <li class="business-handle-template-info-content-item mini">
          消息分组：
          <span>{{ templateInfo.messageGroupName }}</span>
        </li>
        <li class="business-handle-template-info-content-item mini">
          业务类型：
          <span>{{ templateInfo.superMessageName }}-{{ templateInfo.messageName }}</span>
        </li>
        <li class="business-handle-template-info-content-item mini">
          模板名称：
          <span>{{ templateInfo.templateName }}</span>
        </li>
        <li class="business-handle-template-info-content-item mini">
          模板CODE：
          <span>{{ templateInfo.templateId }}</span>
        </li>
        <li class="business-handle-template-info-content-item mini">
          可发送时间段：
          <span>{{ getTime() }}</span>
        </li>
        <!-- <li class="business-handle-template-info-content-item mini">
          存量消息发送策略：
          <span>{{ templateInfo.isBefore ? '按审核前' : '按审核后' }}</span>
        </li> -->
        <li class="business-handle-template-info-content-item mini">
          期望开始生效时间：
          <span>{{ getEffectTime() }}</span>
        </li>
      </ul>
      <div
        v-for="(swjg, swjgIndex) in editableTabs"
        :key="swjgIndex">
        <div class="business-handle-template-info-content-title business-handle-template-info-content-item title-bg">
          {{ swjg.title }}
        </div>
        <ul 
          v-for="(template, templateIndex) in swjg.content"
          :key="templateIndex"
          class="business-handle-template-info-content-list">
          <li 
            class="business-handle-template-info-content-item">
            <!-- :class="{'mini': template.channel === 'SMS'}"> -->
            渠道类型：
            <span>{{ getChannel(template) }}</span>
          </li>
          <li
            class="business-handle-template-info-content-item li-rigth-bottom">
            <!-- :class="{'mini': template.channel === 'SMS'}"> -->
            终端渠道：
            <span>{{ getChannelIdName(template) }}</span>
          </li>
          <!-- <li
            v-if="template.channel === 'SMS'"
            class="business-handle-template-info-content-item"
            :class="{'mini': template.channel === 'SMS'}">
            审核状态：
            <span 
              class="template-manage-audit-state-sign"
              :style="{backgroundColor: templateStateMap[template.auditStatus] && templateStateMap[template.auditStatus].color}" />
            <span>{{ templateStateMap[template.auditStatus] && templateStateMap[template.auditStatus].name }}</span>
          </li> -->
          <li
            v-if="template.channel === 'SMS' && template.auditStatus === '0'"
            class="business-handle-template-info-content-item full-line item-border-bottom">
            审核意见：
            <span>{{ template.auditFailedDetailReason }}</span>
          </li>
          <li 
            v-if="template.channel !== 'SMS'"
            class="business-handle-template-info-content-item full-line item-border-bottom">
            模板标题：
            <span>{{ template.msgTitle }}</span>
          </li>
          <li class="business-handle-template-info-content-item full-line item-border-bottom">
            模板内容：
            <span>{{ template.templateContent }}</span>
          </li>
          <!-- 包含短信则显示 -->
          <template v-if="isShowSmsBind(swjg, templateIndex)">
            <!-- 是否已绑定 详情页 审核通过后且已绑定厂商 -->
            <template 
              v-if="isDetail || (isAudied && template.smsChannelDetailList && template.smsChannelDetailList.length)">
              <div class="business-handle-template-info-content-title business-handle-template-info-content-item">
                {{ '短信厂商模板绑定' }}
              </div>
              <div
                v-for="smsChannel of template.smsChannelDetailList"
                :key="smsChannel.smsChannelId">
                <li class="business-handle-template-info-content-item item-border-bottom">
                  短信通道：
                  <span>{{ smsChannel.smsChannelName }}</span>
                </li>
                <li class="business-handle-template-info-content-item item-border-bottom">
                  模板ID：
                  <span>{{ smsChannel.channelTemplateId }}</span>
                </li>
              </div>
            </template>
            <!-- 审核 or 拒绝 or 审核通过后新增模板 -->
            <template v-if="!isDetail && (!isAudied || (isAudied && !template.smsChannelDetailList.length))">
              <div class="business-handle-template-info-content-title business-handle-template-info-content-item">
                {{ '短信厂商模板绑定' }}
              </div>
              <ul class="business-handle-template-info-content-list">
                <div
                  v-for="(channel, index) in smsChannelList[swjg.swjgDm]"
                  :key="index">
                  <li class="business-handle-template-info-content-item item-border-bottom">
                    <el-checkbox
                      v-model="channel.isCheck"
                      @change="(val) => isCheckChange(val, channel, swjg.swjgDm)" />
                    短信通道：
                    <span>{{ channel.smsChannelName }}</span>
                  </li>
                  <li class="business-handle-template-info-content-item item-border-bottom">
                    模板ID：
                    <el-input
                      v-model="channel.channelTemplateId"
                      :disabled="channel.disabled"
                      class="business-handle-template-channel-input" 
                      @input="isInputChange" />
                  </li>
                </div>
              </ul>
            </template>
          </template>
        </ul>
      </div>
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
      isDetail: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
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
        templateInfo: {},
        userInfo: {},
        templateChannelList: [],
        isAudied: false, // 是否已审核通过的再审核
      }
    },
    computed: {
      editableTabs() {
        const list = [];
        this.templateInfo.swjgs && this.templateInfo.swjgs.forEach((item, index) => {
          list.push({
            title: item.swjgMc,
            name: `${index}`,
            swjgDm: item.swjgDm, // 税务机关代码
            content: this.templateInfo.templates[item.swjgDm]
          })
        })
        return list
      },
      // 税务机关 列表
      swjgList() {
        return this.templateInfo.swjgs;
      },
      // 税务机关模板 列表
      swjgTemplates() {
        return this.templateInfo.templates;
      },
      smsChannelList() {
        const map = {};
        this.templateInfo.swjgs && this.templateInfo.swjgs.forEach((item) => {
          map[item.swjgDm] = [];
          this.templateChannelList.forEach(tplChannel => {
            map[item.swjgDm].push({
              swjgDm: item.swjgDm, // 税务机关代码
              channelTemplateId: this.getChannelInfo(item.swjgDm, tplChannel, 'tplId'),
              smsChannelName: this.getChannelInfo(item.swjgDm, tplChannel, 'smsName'),
              smsChannelId: this.getChannelInfo(item.swjgDm, tplChannel, 'smsId'),
              isCheck: this.getChannelInfo(item.swjgDm, tplChannel, 'check'),
              disabled: tplChannel.sybz === 'N' ? true : false
            })
          })
        });
        return map;
      }
    },
    created() {
      if (this.$route.query.templateId) {
        // 获取模板详情
        this.queryTemplateDetail().then((id) => {
          this.queryUserInfo(id);
          this.queryTemplateChannel();
        });
      }
    },
    methods: {
      // 模板id...
      getChannelInfo(dm, channel, type) {
        const currTpls = this.templateInfo.templates[dm];
        // 找到包含短信的 template
        const filterSmsList = 
          currTpls.filter(tpl => tpl.smsChannelDetailList && tpl.smsChannelDetailList.length);
        // 已经保存的短信厂商绑定
        const smsSavedBinds = filterSmsList.length && filterSmsList[0].smsChannelDetailList || [];
        const filterArr = 
          smsSavedBinds.find(item => item.smsChannelId === channel.dm);
        if (type === 'tplId') {
          const id = filterArr ? filterArr.channelTemplateId : channel.value;
          return id;
        } else if (type === 'smsId') {
          const id = filterArr ? filterArr.smsChannelId : channel.dm;
          return id;
        } else if (type === 'smsName') {
          const name = filterArr ? filterArr.smsChannelName : channel.mc;
          return name;
        } else if (type === 'check') {
          const flag = 
            filterArr ? true :
            smsSavedBinds.length ? 
              this.channelSaved(smsSavedBinds, channel.dm) :
              channel.sybz === 'N' ? true : false;
          // const flag = 
          //   filterArr ? true : channel.sybz === 'N' ? false : true;
          return flag;
        }
      },
      // 渠道是否已保存
      channelSaved(arr, dm) {
        return arr.find(item => item.smsChannelId === dm);
      },
      // 强制更新 响应式
      isCheckChange(val, channel, dm) {
        // 至少选中一个
        const { length } = this.smsChannelList[dm].filter(item => item.isCheck);
        if (length < 1) {
          this.$message.warning('至少选择一个');
          channel.isCheck = true;
        }
        this.$forceUpdate();
      },
      // 输入框 input
      isInputChange() {
        this.$forceUpdate();
      },
      // 判断是否包含短信通道
      hasSmsChannel() {
        const templates = this.templateInfo.templates;

        const hasArr = []
        Object.keys(templates).forEach(key => {
          const finded = templates[key].find(item => item.channel === 'SMS');
          finded && hasArr.push(finded)
        })
        return hasArr.length ? true : false;
      },
      // 父组件调用 筛选已勾选渠道
      filterCheckedChannel() {
        if (!this.hasSmsChannel()) {
          return {};
        }

        const cloneList = JSON.parse(JSON.stringify(this.smsChannelList));
        const isChannelIdArr = [];
        Object.keys(cloneList).forEach(key => {
          cloneList[key] = cloneList[key].filter(item => item.isCheck);
          const finded = cloneList[key].find(item => !item.disabled && item.isCheck && !item.channelTemplateId);
          finded && isChannelIdArr.push(finded);
        })

        if (isChannelIdArr.length) {
          this.$message.warning('请确保勾选项已输入模板ID');
          return 'fail';
        }

        return cloneList;
      },
      queryTemplateDetail() {
        return new Promise((resolve, reject) => {
          this.$http['queryTemplateDetail'](
            {
              ...this.$route.query
            }
          ).then((resp) => {
            if (!resp) {
              reject();
              return;
            }
            this.templateInfo = resp;
            this.isAudied = resp.smsChannelIsActive;
            // const auditState = this.templateStateMap[resp.auditStatus] || {};
            // this.templateInfo.auditState = auditState.name;
            // this.templateInfo.auditStateColor = auditState.color;
            this.$emit('query-template-success', resp);
            resolve(resp.lrrDm)
          }).catch(() => {
            reject();
          })
        })
      },
      queryUserInfo(id) {
        this.$http['queryUserBaseInfo'](
          {
            userId: id,
          },
          {
            baseURL: '/pi/web/',
          }
        )
          .then((resp) => {
            this.userInfo = resp;
          });
      },
      // 获取模板通道
      queryTemplateChannel() {
        this.$http['queryTemplateChannel']()
          .then((resp) => {
            if (!resp) {
              return;
            }
            this.templateChannelList = resp;
          })
          .catch(() => {
            this.templateChannelList = [];
          })
      },
      // 是否显示 短信厂商绑定
      isShowSmsBind(swjg, index) {
        // const finded = swjg.content && 
        //   swjg.content.find(sw => sw.channel === 'SMS')
        // const hasSmsChannelList = finded && finded.smsChannelDetailList && finded.smsChannelDetailList.length;
        return swjg.content && 
          swjg.content.some(sw => sw.channel === 'SMS') && 
          index === swjg.content.length - 1;
        // return hasSmsChannelList && 
        //   index === swjg.content.length - 1;
      },
      // 转换显示
      getChannel(info) {
        return transformChannel(info);
      },
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

<style lang="scss">
  @import '~gui/style/theme/variables';
  $content-border: 1px solid $CM-7;

  .business-handle-template-info {
    .business-handle-template-info-content {
      border: $content-border;
      color: $CN-4;
      & + .business-handle-template-info-content {
        margin-top: 20px;
      }
      .business-handle-template-info-content-item {
        list-style: none;
        border-bottom: $content-border;
        padding-left: $ST-7;
        @include P-1;
        line-height: $SH-12;
      }
      .business-handle-template-info-content-title {
        background-color: $CM-8;
        font-weight: bold;
      }

      .title-bg {
        background-color: $CB-2;
      }

      .business-handle-template-info-content-list {
        li {
          display: inline-block;
          box-sizing: border-box;
          width: 50%;
          border-right: $content-border;
          &:nth-of-type(odd) {
            border-right: $content-border;
          }
          &:last-of-type {
            border-bottom: none;
          }

          &:nth-of-type(3n) {
            border-right: none;
          }
          span {
            color: $CN-2;
          }
          &.mini {
            width: 33.3333%;
          }
          &.li-rigth-bottom {
            border-right: $content-border;
          }
        }
        .full-line {
          width: 100%;
          border-right-width: 0;
        }
        .item-border-bottom {
          border-bottom: $content-border !important;
        }
        .item-rigth-bottom {
          border-right: $content-border;
        }
        .edit-item {
          padding-left: 0
        }
        .template-manage-audit-state-sign {
          display: inline-block;
          position: relative;
          width: 10px;
          height: 10px;
          margin-right: 8px;
          border-radius: 50%;
        }
      }
      .channel-content-list-item {
        border-bottom: $content-border !important;
      }
    }
    .item-no-border-bottom {
      border-bottom: 0px !important;
    }
  }
</style>