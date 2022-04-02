<template>
  <div class="template-edit-form-content">
    <el-form
      ref="editTemplateForm"
      class="content-form"
      label-width="180px"
      :model="templateInfo"
      :rules="templateInfoRule">
      <el-form-item
        label="所属应用"
        prop="appid">
        <el-select v-model="templateInfo.appid">
          <el-option
            v-for="(item, index) in flatApplyList"
            :key="index"
            :label="item.appName"
            :value="item.appId" />
        </el-select>
      </el-form-item>
      <el-form-item
        label="消息分组"
        prop="appid">
        <el-select
          v-model="templateInfo.userTypeOriented"
          clearable>
          <el-option
            v-for="(item) in groupList"
            :key="item.messageGroupCode"
            :label="item.messageGroupName"
            :value="item.messageGroupCode" />
        </el-select>
      </el-form-item>
      <el-form-item
        label="业务类型"
        prop="messageType">
        <el-cascader
          v-model="templateInfo.messageType"
          placeholder="请选择"
          :options="msgType"
          :props="priorityProp"
          filterable
          clearable />
      </el-form-item>
      <el-form-item
        label="模板名称"
        prop="templateName">
        <el-input
          v-model="templateInfo.templateName"
          placeholder="请输入模板名称"
          :maxlength="30" />
      </el-form-item>
      <el-form-item
        label="模板标识码"
        prop="templateId">
        <el-input
          v-model="templateInfo.templateId"
          placeholder="只允许输英文大写字母、数字、_"
          :maxlength="50" />
      </el-form-item>
      <el-form-item
        label="可发送时间段"
        prop="isRestrict">
        <el-radio-group v-model="templateInfo.isRestrict">
          <el-radio :label="false">
            不限制
          </el-radio>
          <el-radio :label="true">
            限制
          </el-radio>
        </el-radio-group>
        <br>
        <div v-show="templateInfo.isRestrict">
          <el-time-select
            v-model="templateInfo.pushBeginTime"
            class="mr10 time-width"
            placeholder="起始时间"
            :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '20:00',
              maxTime: templateInfo.pushEndTime
            }" />
          <el-time-select
            v-model="templateInfo.pushEndTime"
            class="time-width"
            placeholder="结束时间"
            :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '20:00',
              minTime: templateInfo.pushBeginTime
            }" />
        </div>
      </el-form-item>
      <!-- <el-form-item 
        label="存量消息发送策略"
        prop="isBefore">
        <label slot="label">
          存量消息发送策略
          <el-tooltip
            class="item"
            placement="top-start">
            <div slot="content">
              针对已通过的模板再次提交审核，在审核通过前累计的待发送消息，如果“按审核前”，<br>
              则累计的待发送消息按照审核后通过前的模板内容发送消息，<br>
              如果“按审核后”，则累计的待发送消息立即按照审核通过后的模板内容就行发送。<br>
              如果是新创建的模板，一般还没有累计的待发送消息，建议选择“按审核后”。
            </div>
            <i class="iconfont icon-wenhao" />
          </el-tooltip>
        </label>
        <el-radio-group v-model="templateInfo.isBefore">
          <el-radio :label="false">
            按审核前
          </el-radio>
          <el-radio :label="true">
            按审核后
          </el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item 
        label="期望开始生效时间"
        prop="isImmediatelyActive">
        <label slot="label">
          期望开始生效时间
          <el-tooltip
            class="item"
            placement="top-start">
            <div slot="content">
              针对月度、季度、年度等固定周期间隔的发送场景，<br>
              可能下一周期的模板内容需要做一下修改，<br>
              但是又希望提前将模板修改的事情在下一周期开始之前完成，<br>
              那么可以将期望开始生效时间指定到下一周期的起始时间。
            </div>
            <i class="iconfont icon-wenhao" />
          </el-tooltip>
        </label>
        <el-radio-group v-model="templateInfo.isImmediatelyActive">
          <el-radio :label="true">
            立即生效
          </el-radio>
          <el-radio :label="false">
            指定时间生效
          </el-radio>
        </el-radio-group>
        <br>
        <el-date-picker
          v-show="!templateInfo.isImmediatelyActive"
          v-model="templateInfo.activeTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH"
          placeholder="选择日期时间" 
          :picker-options="{ disabledDate: begainDisableDate }" />
      </el-form-item>
    </el-form>
    
    <div class="tool-bar">
      <el-button
        type="primary"
        size="medium"
        :disabled="disableButton"
        @click="clickSubmit">
        下一步
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
  import { templateIdRule } from '@/common/utils/validate';
  import {
    transActiveTime
  } from '../../../constant.js';
  export default {
    props: {
      applyList: {
        type: Array,
        default: () => []
      },
    },
    data() {
      const self = this;
      const validateId = (rule, value, callback) => {
        if (!value) {
          return callback();
        }
        if (!templateIdRule(value)) {
          return callback(new Error('只允许输英文大写字母、数字、_'));
        }
        const form = self.templateInfo;
        // 如果appid没有填写，等appid填写后再校验
        if (!form.appid) {
          callback();
          return;
        }
        this.$http['queryTemplateById']({
          appid: form.appid,
          templateId: value
        }).then((resp) => {
          if (resp.length) {
            return callback(new Error('当前模板标识码已存在，请修改后提交'));
          }
          callback();
        }).catch(() => {
          callback();
        })
        // callback();
      }
      return {
        templateInfoRule: {
          appid: [
            { required: true, message: '请选择所属应用', trigger: 'blur' },
          ],
          templateId: [
            { required: true, message: '请输入模板ID', trigger: 'blur' },
            { validator: validateId, trigger: 'blur' }
          ],
          templateName: [
            { required: true, message: '请输入模板名称', trigger: 'blur' },
          ],
          messageType: [
            { required: true, message: '请输入业务类型', trigger: 'blur' },
          ],
          isRestrict: [
            { required: true, message: '请选择', trigger: 'blur' },
          ],
          // isBefore: [
          //   { required: true, message: '请选择', trigger: 'blur' },
          // ],
          isImmediatelyActive: [
            { required: true, message: '请选择', trigger: 'blur' },
          ]
        },
        mbxh: '', // 模板序号，用于判断编辑新增
        defaultForm: {
          appid: '',
          userTypeOriented: '',
          templateId: '',
          templateName: '', // 模板名称
          messageType: [],
          isRestrict: false,
          // isBefore: false,
          isImmediatelyActive: true,
          activeTime: '',
          pushBeginTime: '08:00',
          pushEndTime: '20:00'
        },
        templateInfo: {},
        groupList: [],
        msgType: [],
        priorityProp: {
          value: 'messageType',
          label: 'messageTypeName',
          children: 'subMsgTypelist',
        },
        begainDisableDate: date => {
          return date.getTime() < Date.now() - 24 * 3600 * 1000;
        }
      }
    },
    computed: {
      disableButton() {
        const info = this.templateInfo;
        const commonFlag = 
          !info.templateId ||
          !info.templateName ||
          !info.messageType.length || 
          !info.appid ||
          !info.userTypeOriented;
        
        if (info.isRestrict && !info.isImmediatelyActive) {
          return commonFlag || 
            !info.pushBeginTime || !info.pushEndTime ||
            !info.activeTime;
        }
        if (!info.isImmediatelyActive) {
          return commonFlag || 
            !info.activeTime;
        }
        if (info.isRestrict) {
          return commonFlag || 
            !info.pushBeginTime || !info.pushEndTime;
        }
        
        return commonFlag;
      },
      flatApplyList(){
        const list = []
        this.applyList.forEach(item => {
          list.push(...item.children)
        });
        return list;
      }
    },
    watch: {
      'templateInfo.appid'(v) {
        this.templateInfo.userTypeOriented = '';
        this.templateInfo.messageType = '';
        if (v) {
          this.getGroupList();
          this.queryTemplateMesType();
        }
      },
      'templateInfo.userTypeOriented'() {
        this.templateInfo.messageType = '';
        this.queryTemplateMesType();
      }
    },
    created() {
      // this.mbxh = this.$route.query.mbxh;
      // if (this.mbxh) {
      //   this.queryTemplateDateils(this.mbxh);
      //   return;
      // }
      this.templateInfo = this.defaultForm;
      // 业务类型
      // this.queryTemplateMesType();
    },
    methods: {
      // 获取消息分组list
      getGroupList() {
        this.$http['queryMessageGroup']({
          appid: this.templateInfo.appid
        }).then((res) => {
          this.groupList = res;
        });
      },
      // 获取业务类型级联菜单
      queryTemplateMesType() {
        if (!this.templateInfo.appid || !this.templateInfo.userTypeOriented) {
          this.msgType = [];
          this.formatMsgType = {};
          return
        }
        this.$http['queryTemplateMesType']({
          appid: this.templateInfo.appid,
          userTypeOriented: this.templateInfo.userTypeOriented
        }).then((resp) => {
          if (!resp.length) {
            return;
          }
          this.msgType = resp;
          this.formatMsgType = this.formatMsgTypeFn(resp);
        })
      },
      formatMsgTypeFn(data = []) {
        let typeMap = {};
        data.reduce((acc, cur) => {
          if (cur.subMsgTypelist && cur.subMsgTypelist.length) {
            typeMap = {
              ...typeMap,
              ...this.formatMsgTypeFn(cur.subMsgTypelist)
            }
          }
          typeMap[cur.messageType] = cur.messageTypeName;
        }, {});

        return typeMap;
      },
      // 点击下一步
      clickSubmit() {
        console.log(12);
        this.$refs.editTemplateForm.validate((valid) => {
          if (valid) {
            // 前往下一步模板渠道
            this.goToNextStep();
          }
        });
      },
      // 前往模板渠道
      goToNextStep() {
        console.log(2222);
        const appInfo = this.flatApplyList.find((item) => {
          return item.appid === this.templateInfo.appid
        });
        const appName = appInfo && appInfo.appName;
        const messageTypeList = this.templateInfo.messageType;
        const messageBigTypeName = this.formatMsgType[messageTypeList[0]];
        const superMessageType = messageTypeList[0];
        const messageType = messageTypeList[1];
        const messageSmallTypeName = this.formatMsgType[messageType];
        const messageGroupCode = this.templateInfo.userTypeOriented;
        const messageGroupName = this.groupList.find(item => item.messageGroupCode === messageGroupCode).messageGroupName
        this.$router.push({
          path: 'editTemplateSource',
          query: {
            appName,
            messageSmallTypeName,
            messageBigTypeName,
            ...this.templateInfo,
            superMessageType,
            messageType,
            messageGroupCode,
            messageGroupName,
            isRestrict: this.templateInfo.isRestrict,
            // isBefore: this.templateInfo.isBefore,
            isImmediatelyActive: this.templateInfo.isImmediatelyActive,
            activeTime: this.transActiveTime(),
            pushBeginTime: this.templateInfo.pushBeginTime,
            pushEndTime: this.templateInfo.pushEndTime
          }
        })
      },
      // 点击取消
      clickCancel() {
        this.$confirm('取消后，当前填写数据将被清空，是否继续')
          .then(() => {
            // 删除消息
            this.returnListPage();
          })
      },
      // 返回列表页
      returnListPage() {
        this.$router.push('/control/user/templateManage')
      },
      // 转换生效时间 
      transActiveTime() {
        return transActiveTime(this.templateInfo.activeTime);
      }
    }
  }
</script>

<style lang="scss" scope>
  .template-edit-form-content {
    .content-form {
      width: 460px;
      margin: 20px auto;
    }

    .time-width {
      width: 45%;
    }
  }
</style>
