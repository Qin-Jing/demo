<template>
  <el-form
    ref="editTemplateForm"
    class="edit-form"
    label-width="160px"
    :model="editTplForm"
    :rules="templateInfoRule"
    inline
    size="small">
    <el-form-item
      label="所属应用"
      prop="appid">
      <el-select
        v-model="editTplForm.appid"
        class="input-width">
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
        v-model="editTplForm.messageGroupCode"
        clearable
        class="input-width">
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
        v-model="editTplForm.messageType"
        class="input-width"
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
        v-model="editTplForm.templateName"
        class="input-width"
        placeholder="请输入模板名称"
        :maxlength="30" />
    </el-form-item>
    <el-form-item
      label="模板标识码"
      prop="templateId">
      <el-input
        v-model="editTplForm.templateId"
        class="input-width"
        placeholder="只允许输英文大写字母、数字、_"
        disabled
        :maxlength="50" />
    </el-form-item>
    <br>
    <el-form-item
      label="可发送时间段"
      prop="isRestrict">
      <el-radio-group v-model="editTplForm.isRestrict">
        <el-radio :label="false">
          不限制
        </el-radio>
        <el-radio :label="true">
          限制
        </el-radio>
      </el-radio-group>
      <div 
        v-show="editTplForm.isRestrict"
        class="ml20 time-content">
        <el-time-select
          v-model="editTplForm.pushBeginTime"
          class="mr10 time-width"
          placeholder="起始时间"
          :picker-options="{
            start: '08:00',
            step: '00:15',
            end: '20:00'
          }" />
        <el-time-select
          v-model="editTplForm.pushEndTime"
          class="time-width"
          placeholder="结束时间"
          :picker-options="{
            start: '08:00',
            step: '00:15',
            end: '20:00',
            minTime: editTplForm.pushBeginTime
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
      <el-radio-group v-model="editTplForm.isBefore">
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
            针对月度、季度、年度等固定周期间隔的发送场景，可能下一周期的模板内容需要做一下修改，<br>
            但是又希望提前将模板修改的事情在下一周期开始之前完成，那么可以将期望开始生效时间指定到下一周期的起始时间。
          </div>
          <i class="iconfont icon-wenhao" />
        </el-tooltip>
      </label>
      <el-radio-group v-model="editTplForm.isImmediatelyActive">
        <el-radio :label="true">
          立即生效
        </el-radio>
        <el-radio :label="false">
          指定时间生效
        </el-radio>
      </el-radio-group>
      <br>
      <el-date-picker
        v-show="!editTplForm.isImmediatelyActive"
        v-model="editTplForm.activeTime"
        type="datetime"
        format="yyyy-MM-dd HH:mm"
        value-format="yyyy-MM-dd HH"
        placeholder="选择日期时间" 
        :picker-options="{ disabledDate: begainDisableDate }" />
    </el-form-item>
  </el-form>
</template>

<script>
  import { templateIdRule } from '@/common/utils/validate';
  import { modifyFormatterTime } from '../../../constant';

  export default {
    name: 'EditTplForm',
    props: {
      templateInfo: {
        type: Object,
        default: () => {}
      },
      applyList: {
        type: Array,
        default: () => []
      }
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
        groupList: [],
        msgType: [],
        priorityProp: {
          value: 'messageType',
          label: 'messageTypeName',
          children: 'subMsgTypelist',
        },
        editTplForm: {
          appid: '',
          messageGroupCode: '',
          templateId: '',
          templateName: '', // 模板名称
          messageType: [],
          isRestrict: false,
          pushBeginTime: '08:00',
          pushEndTime: '20:00',
          // isBefore: false,
          isImmediatelyActive: true,
          activeTime: '',
          begainDisableDate: date => {
            return date.getTime() < Date.now() - 24 * 3600 * 1000;
          }
        },
      }
    },
    computed: {
      flatApplyList() {
        const list = []
        this.applyList.forEach(item => {
          list.push(...item.children)
        });
        return list;
      }
    },
    watch: {
      'editTplForm.appid'(v) {
        this.templateInfo.messageGroupCode = '';
        this.templateInfo.messageType = '';
        if (v) {
          this.getGroupList();
          this.queryTemplateMesType();
        }
      },
      'editTplForm.messageGroupCode'() {
        this.templateInfo.messageType = '';
        this.queryTemplateMesType();
      },
      templateInfo(v) {
        const val = JSON.parse(JSON.stringify(v));
        Object.keys(this.editTplForm).map(key => {
          if (key === 'isRestrict') {
            this.editTplForm[key] = val.pushBeginTime ? true : false;
          } else if (key === 'messageType') {
            this.editTplForm[key][0] = val.superMessageType;
            this.editTplForm[key][1] = val.messageType; 
          } else if (key === 'pushBeginTime') {
            this.editTplForm[key] = val[key] ? modifyFormatterTime(val[key]) : '08:00';
          } else if (key === 'pushEndTime') {
            this.editTplForm[key] = val[key] ? modifyFormatterTime(val[key]) : '20:00';
          } else {
            this.editTplForm[key] = val[key];
          }
        })

        console.log(this.editTplForm, 'editTplForm');
      }
    },
    created() {
      
    },
    methods: {
      // 获取消息分组list
      getGroupList() {
        this.$http['queryMessageGroup']({
          appid: this.editTplForm.appid
        }).then((res) => {
          this.groupList = res;
        });
      },
      // 获取业务类型级联菜单
      queryTemplateMesType() {
        if (!this.editTplForm.appid || !this.editTplForm.messageGroupCode) {
          this.msgType = [];
          this.formatMsgType = {};
          return
        }
        this.$http['queryTemplateMesType']({
          appid: this.editTplForm.appid,
          userTypeOriented: this.editTplForm.messageGroupCode
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
    }
  }
</script>

<style lang="scss" scoped>
  .edit-form {
    width: 900px;
    margin: 20px auto 0 auto;

    .input-width {
      width: 240px;
    }

    .time-content {
      float: right;

      .time-width {
        width: 100px;
      }
    }
  }
</style>