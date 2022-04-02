<template>
  <div class="template-manage-edit-source">
    <el-alert
      v-if="templateInfo.auditFailedReason"
      :title="`模板审核失败原因：${templateInfo.auditFailedReason}`"
      type="error" />
    <div class="edit-source-template-info-content">
      <div class="edit-source-template-info-content-title edit-source-template-info-content-item">
        模板信息
      </div>
      <ul class="edit-source-template-info-content-list">
        <li class="edit-source-template-info-content-item">
          所属应用：
          <span>{{ templateBaseInfo.appid }}</span>
        </li>
        <li class="edit-source-template-info-content-item">
          消息分组：
          <span>{{ templateBaseInfo.messageGroupName }}</span>
        </li>
        <li class="edit-source-template-info-content-item">
          业务类型：
          <span>{{ templateBaseInfo.messageBigTypeName }}-{{ templateBaseInfo.messageSmallTypeName }}</span>
        </li>
        <li class="edit-source-template-info-content-item">
          模板名称：
          <span>{{ templateBaseInfo.templateName }}</span>
        </li>
        <li class="edit-source-template-info-content-item">
          模板标识码：
          <span>{{ templateBaseInfo.templateId }}</span>
        </li>
        <li class="edit-source-template-info-content-item">
          可发送时间段：
          <span v-if="!isEdit">{{ getTime() }}</span>
          <template v-else>
            <el-radio-group
              v-model="templateBaseInfo.isRestrict">
              <el-radio :label="false">
                不限制
              </el-radio>
              <el-radio :label="true">
                限制
              </el-radio>
            </el-radio-group>
            <template v-if="templateBaseInfo.isRestrict">
              <el-time-select
                v-model="templateBaseInfo.pushBeginTime"
                class="mr10 ml10 time-width"
                placeholder="起始时间"
                size="mini"
                :picker-options="{
                  start: '08:00',
                  step: '00:15',
                  end: '20:00',
                  maxTime: templateBaseInfo.pushEndTime
                }" />
              <el-time-select
                v-model="templateBaseInfo.pushEndTime"
                class="time-width"
                placeholder="结束时间"
                size="mini"
                :picker-options="{
                  start: '08:00',
                  step: '00:15',
                  end: '20:00',
                  minTime: templateBaseInfo.pushBeginTime
                }" />
            </template>
          </template>
        </li>
        <!-- <li class="edit-source-template-info-content-item bb-none">
          存量消息发送策略：
          <span v-if="!isEdit">{{ templateBaseInfo.isBefore ? '按审核前' : '按审核后' }}</span>
          <template v-else>
            <el-radio-group
              v-model="templateBaseInfo.isBefore">
              <el-radio :label="false">
                按审核前
              </el-radio>
              <el-radio :label="true">
                按审核后
              </el-radio>
            </el-radio-group>
          </template>
        </li> -->
        <li class="edit-source-template-info-content-item info-content-full">
          期望开始生效时间：
          <span v-if="!isEdit">{{ templateBaseInfo.activeTime || '立即生效' }}</span>
          <template v-else>
            <el-radio-group
              v-model="templateBaseInfo.isImmediatelyActive">
              <el-radio :label="true">
                立即生效
              </el-radio>
              <el-radio :label="false">
                指定时间生效
              </el-radio>
            </el-radio-group>
            <el-date-picker
              v-show="!templateBaseInfo.isImmediatelyActive"
              v-model="templateBaseInfo.activeTime"
              class="mr10 ml10"
              type="datetime"
              size="mini"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH"
              placeholder="选择日期时间"
              :picker-options="{ disabledDate: begainDisableDate }" />
          </template>
        </li>
      </ul>
      <!-- <template v-else>
        <edit-tpl-form 
          ref="editTplForm"
          :template-info="templateInfo"
          :apply-list="applyList" />
      </template> -->
    </div>
    <div class="edit-source-detail-tabs">
      <el-tabs
        v-model="editableTabsValue"
        :closable="editableTabs.length > 1"
        @tab-remove="removeTab">
        <el-tab-pane
          v-for="(item, index) in editableTabs"
          :key="index"
          :label="item.title"
          :name="item.name">
          <el-button
            v-show="item.content && item.content.length > 0"
            class="edit-source-template-add-btn"
            size="medium"
            @click="clickAddTemplateBtn(item)">
            添加一条
          </el-button>
          <el-form 
            :ref="`form-${editableTabsValue}`"
            :model="item"
            inline
            label-width="150px">
            <div
              v-for="(info, ItemIndex) in item.content"
              v-show="item.content && item.content.length > 0 && info.action !== '3'"
              :key="`item${ItemIndex}`"
              class="edit-source-template-info-content">
              <el-alert
                v-if="info.channel === 'SMS' && info.auditFailedReason"
                :title="info.auditFailedReason"
                type="error" />
              <i
                class="el-icon-delete icon-del"
                @click="clickDelTemplateBtn(item, ItemIndex)" />
              <el-form-item
                label="渠道类型："
                class="col-3">
                <span>{{ getChannel(info) }}</span>
              </el-form-item>
              <el-form-item
                label="终端渠道："
                class="col-6">
                <span>{{ getChannelIdName(info) }}</span>
              </el-form-item>
              <!-- <el-form-item
                v-if="info.channel === 'SMS' && info.auditStatus === '0'"
                label="模板审核失败原因："
                class="col-3">
                <span>{{ info.auditFailedDetailReason }}</span>
              </el-form-item> -->
              <br>
              <el-form-item
                v-if="info.channel !== 'SMS'"
                label="模板标题："
                :prop="`content.${ItemIndex}.msgTitle`"
                :rules="getRules()">
                <template v-if="info.channel === 'APP'">
                  <el-input
                    v-model="info.msgTitle"
                    class="form-item-width"
                    type="textarea"
                    show-word-limit
                    placeholder="请输入模板标题"
                    :maxlength="32" />
                  <p class="tips">
                    移动推送(手机Push消息)最大支持32位。如果超出，请稍后修改终端渠道的标题，超出部分将被系统截断
                  </p>
                </template>
                <template v-else>
                  <el-input
                    v-model="info.msgTitle"
                    class="form-item-width"
                    type="textarea"
                    show-word-limit
                    :maxlength="200" />
                </template>
              </el-form-item>
              <br>
              <el-form-item 
                label="模板内容："
                :prop="`content.${ItemIndex}.templateContent`"
                :rules="getRules()">
                <el-input
                  v-model="info.templateContent"
                  class="form-item-width"
                  type="textarea"
                  show-word-limit
                  :maxlength="500" />
              </el-form-item>
            </div>
          </el-form>
          <no-info-component
            v-show="!item.content || (item.content && item.content.length <= 0)"
            btn-txt="添加渠道模板"
            @btn-click="clickAddTemplateBtn(item)" />
        </el-tab-pane>
      </el-tabs>
      <div
        class="edit-source-detail-tabs-add-btn"
        @click="addTab">
        +
      </div>
    </div>
    <el-dialog
      title="添加税局模板"
      class="add-tax-office-template-dialog"
      width="400px"
      :close-on-click-modal="false"
      :visible.sync="addTaxTemplateDialog">
      <el-form
        ref="templateTypeForm"
        :model="templateTypeForm"
        label-width="100px">
        <el-form-item
          label="税务机关"
          prop="templateType">
          <el-select v-model="templateTypeForm.templateType">
            <el-option
              v-for="(item, index) in templateTypeList"
              :key="index"
              :label="item.swjgMc"
              :value="item.swjgDm" />
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="addTaxTemplateDialog = false">
          暂不添加
        </el-button>
        <el-button
          type="primary"
          @click="clickDialogConfirmBtn">
          确认添加
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      width="600px"
      :close-on-click-modal="false"
      :visible.sync="errListDialog">
      <p 
        v-for="(item, index) in errMessageList"
        :key="index">
        {{ item }}
      </p>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button
          type="primary"
          @click="errListDialog = false">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="添加渠道模板"
      class="add-source-template-dialog"
      width="600px"
      :close-on-click-modal="false"
      :visible.sync="addSourceTemplateDialog">
      <el-form
        ref="templateChannelForm"
        :model="templateForm"
        :rules="templateChannelRule"
        label-width="100px">
        <el-form-item
          v-show="!isEditTemplate"
          label="渠道类型"
          prop="source">
          <el-cascader
            v-model="templateForm.source"
            :options="templateSourceList"
            :props="sourceProps"
            clearable
            collapse-tags />
        </el-form-item>
        <el-form-item
          v-show="isEditTemplate"
          label="渠道类型">
          {{ templateForm.channel }}
        </el-form-item>
        <el-form-item
          v-show="isEditTemplate"
          label="终端渠道">
          {{ templateForm.channelId }}
        </el-form-item>
        <el-form-item
          v-if="bShowMsgTitle"
          label="模板标题"
          prop="msgTitle">
          <el-input
            v-model="templateForm.msgTitle"
            type="textarea"
            show-word-limit
            placeholder="请输入模板标题"
            :maxlength="200" />
        </el-form-item>
        <el-form-item
          label="模板内容"
          prop="templateContent">
          <el-input
            v-model="templateForm.templateContent"
            type="textarea"
            show-word-limit
            :maxlength="500" />
        </el-form-item>
        <el-form-item
          label="">
          <p>已输入{{ templateForm.templateContent.length }}个字，最多可输入500个字</p>
          <p>1.长度不超过500字。单条短信超过70字后，按67字/条分多条计费</p>
          <p>2.营销类短信，请在短信内容后面增加“回T退订”</p>
          <p>3.短信模板内容不能含有【】符号</p>
          <p>4.不能发送房产、移民、贷款、政治、色情暴力等违法短信 详情>></p>
          <p>模板示例：{${code}为您的登录验证码，请于${minutes}分钟内填写。如非本人操作，请忽略本短信。（其中${}为可自定义的内容，{}里面是参数名称）</p>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="clickCancelTemplateResourceBtn">
          取消
        </el-button>
        <el-button
          type="primary"
          :disabled="disableButton"
          @click="clickSaveTemplateResourceBtn">
          保存
        </el-button>
      </div>
    </el-dialog>
    <div class="tool-bar">
      <el-button
        type="primary"
        size="medium"
        :disabled="submitDisable"
        @click="clickSubmitBtn">
        {{ !isEdit ? '提交审核' : '重新提交审核' }}
      </el-button>
      <el-button
        size="medium"
        @click="clickCancelBtn">
        取消
      </el-button>
    </div>
  </div>
</template>

<script>
  import NoInfoComponent from '@/views/control/components/noInfoComponent';
  import {
    modifyFormatterTime,
    transformChannelIdName,
    transformChannel,
    timestampToTime,
    transActiveTime
  } from '../../../constant';
  // import editTplForm from './editTplForm';

  export default {
    components: {
      NoInfoComponent,
      // editTplForm
    },
    props: {
      applyList: {
        type: Array,
        default: () => []
      },
    },
    data() {
      return {
        editableTabsValue: '00000000000',
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
        editableTabs: [
          {
            title: '总局模板',
            name: '00000000000',
            content: []
          }
        ],
        tabIndex: 1,
        addTaxTemplateDialog: false,
        templateTypeForm: {
          templateType: ''
        },
        templateTypeList: [],
        addSourceTemplateDialog: false,
        templateForm: {
          source: '',
          msgTitle: '',
          templateContent: ''
        },
        templateChannelRule: {
          source: [
            { required: true, message: '渠道类型不能为空', trigger: 'blur' },
          ],
          msgTitle: [
            { required: true, message: '模板标题不能为空', trigger: 'blur' },
          ],
          templateContent: [
            { required: true, message: '模板内容不能为空', trigger: 'blur' },
          ],
        },
        sourceProps: {
          multiple: true
        },
        templateSourceList: [],
        editData: {},
        selectTemplateIndex: -1,
        templateInfo: {},
        isEditTemplate: false,
        channelListMap: {},
        sourceList: [],
        errListDialog: false,
        errMessageList: [],
        deleteTabs: [], // 已删除tabs
        // commitEditableTabs: [] // 提交审核tabs
        templateBaseInfo: {
          appid: '',
          templateId: '',
          templateName: '', // 模板名称
          messageBigTypeName: '',
          messageSmallTypeName: '',
          messageGroupCode: '',
          messageGroupName: '',
          pushBeginTime: '',
          pushEndTime: '',
          isRestrict: false,
          // isBefore: false,
          isImmediatelyActive: true,
          activeTime: ''
        },
        begainDisableDate: date => {
          return date.getTime() < Date.now() - 24 * 3600 * 1000;
        }
      }
    },
    computed: {
      // 是否显示模板标题输入框
      bShowMsgTitle() {
        const source = this.templateForm.source;
        return source.length === 1 && source[0].includes('SMS') ? false : true;
      },
      submitDisable() {
        let isDisable = true;
        this.editableTabs.forEach((item) => {
          isDisable = item.content.length === 0
        })
        return isDisable;
      },
      disableButton() {
        const info = this.templateForm;
        if (this.bShowMsgTitle) {
          return !info.templateContent || !info.msgTitle ||
            !this.isEditTemplate && !info.source.length ||
            this.isEditTemplate && (!info.channel || !info.channelId)
        } else {
          return !info.templateContent ||
            !this.isEditTemplate && !info.source.length ||
            this.isEditTemplate && (!info.channel || !info.channelId)
        }
      },
      // 是否编辑标识
      isEdit() {
        return this.$route.query.isEdit;
      },
      // 审核通过后重新发起审核
      isReEdit() {
        return this.$route.query.type === 'reEdit';
      }
    },
    watch: {
      templateInfo() {
        const list = [];
        this.templateInfo.swjgs && this.templateInfo.swjgs.forEach((item) => {
          list.push({
            title: item.swjgMc,
            name: item.swjgDm,
            mbxh: item.mbxh,
            content: this.templateInfo.templates[item.swjgDm]
          })
          // 已选择的渠道id
          this.channelListMap[item.swjgDm] = [...this.templateInfo.templates[item.swjgDm].map(item => item.channelId)]
        })
        this.editableTabs = list;
        if (list.length > 0) {
          this.editableTabsValue = list[0].name
        }
      }
    },
    created() {
      if (this.isEdit) {
        // 获取模板详情
        this.queryTemplateDetail()
          .then(() => {
            // 获取渠道信息
            this.queryTemplateChannelList();
          });
      } else {
        this.setTplBaseInfo(this.$route.query);
        // 获取渠道信息
        this.queryTemplateChannelList();
      }

      // 获取税务机关
      this.queryTaxOfficeInfoList();
    },
    methods: {
      // 设置 templateBaseInfo
      setTplBaseInfo(info) {
        if (!this.isEdit) {
          this.templateBaseInfo = info;
          return;
        }
        this.templateBaseInfo.appid = this.templateInfo.appid;
        this.templateBaseInfo.templateId = this.templateInfo.templateId;
        this.templateBaseInfo.templateName = this.templateInfo.templateName; // 模板名称
        this.templateBaseInfo.messageBigTypeName = this.templateInfo.superMessageName;
        this.templateBaseInfo.messageSmallTypeName = this.templateInfo.messageName;
        this.templateBaseInfo.messageGroupCode = this.templateInfo.messageGroupCode;
        this.templateBaseInfo.messageGroupName = this.templateInfo.messageGroupName;
        this.templateBaseInfo.pushBeginTime = 
          this.templateInfo.pushBeginTime ? modifyFormatterTime(this.templateInfo.pushBeginTime) : '08:00';
        this.templateBaseInfo.pushEndTime = 
          this.templateInfo.pushEndTime ? modifyFormatterTime(this.templateInfo.pushEndTime) : '20:00';
        this.templateBaseInfo.isRestrict = this.templateInfo.pushBeginTime ? true : false;
        this.templateBaseInfo.isImmediatelyActive = this.templateInfo.activeTime ? false : true;
        this.templateBaseInfo.activeTime = timestampToTime(this.templateInfo.activeTime);
      },
      // 获取税务机关
      queryTaxOfficeInfoList() {
        this.$http['queryTaxOfficeInfoList']()
          .then((resp) => {
            if (!resp) {
              return;
            }
            this.templateTypeList = resp;
          })
      },
      // 获取模板详情
      queryTemplateDetail() {
        return this.$http['queryTemplateDetail'](
          {
            ...this.$route.query
          }
        )
          .then((resp) => {
            if (!resp) {
              return;
            }
            this.templateInfo = resp;
            this.setTplBaseInfo();
          })
      },
      // 添加tabs
      addTab() {
        this.addTaxTemplateDialog = true
      },
      removeTab(targetName) {
        const tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        this.deleteTabs = tabs.filter(tab => tab.name === targetName);
        this.deleteTabs.forEach((item) => {
          if(item.name === targetName) {
            item.content.forEach((items) => {
              items.action = '3'
            })
          }
        })
      },
      // 点击添加税局模板确定按钮
      clickDialogConfirmBtn() {
        const taxId = this.templateTypeForm.templateType;
        if (this.editableTabs.find(item => item.name === taxId)) {
          this.$message.error('该税务局已存在');
          return;
        }
        // const newTabName = `${++this.tabIndex}`;
        const tabName = this.templateTypeList.find((item) => {
          return item.swjgDm === taxId;
        }).swjgMc
        this.editableTabs.push({
          title: tabName,
          name: taxId,
          content: []
        });
        // this.channelListMap[taxId] = [];
        this.editableTabsValue = taxId;
        this.addTaxTemplateDialog = false;
      },
      // 点击添加模板按钮
      clickAddTemplateBtn(data) {
        // 获取格式化的渠道信息
        this.templateSourceList = this.getFormatChannelList(this.sourceList);
        this.editData = data;
        this.templateForm = {
          source: [],
          msgTitle: '',
          templateContent: '',
          action: '1'
        }
        this.isEditTemplate = false;
        this.addSourceTemplateDialog = true;
        this.selectTemplateIndex = -1;
        const channelForm = this.$refs['templateChannelForm'];
        channelForm && channelForm.resetFields();
      },
      // 点击取消渠道模板
      clickCancelTemplateResourceBtn() {
        this.addSourceTemplateDialog = false;
      },
      // 保存模板
      clickSaveTemplateResourceBtn() {
        this.$refs['templateChannelForm'].validate((valid) => {
          if (valid) {
            const contentList = []
            this.templateForm.source.forEach((item) => {
              contentList.push({
                title: this.editData.title,
                channel: item[0],
                channelId: item[1],
                channelIdName: this.transformChannelNameById(item[1]),
                channelName: this.transformChannelName(item[0]),
                templateContent: this.templateForm.templateContent,
                msgTitle: this.templateForm.msgTitle,
                yxbz: 'Y',
                mbxh: this.templateForm.mbxh,
                action: this.templateForm.action
              })
              // 已选择的渠道id
              this.channelListMap[this.editableTabsValue].push(item[1]);
            })
            if (this.selectTemplateIndex < 0) {
              this.editData.content.push(...contentList);
            } else {
              this.editData.content.splice(this.selectTemplateIndex, 1, ...contentList);
            }
            // this.editData.content
            this.addSourceTemplateDialog = false;
          }
        });
      },
      // 通过 channelId 转换 channelIdName
      transformChannelNameById(id) {
        const finded = this.sourceList.find(itm => itm.channelId === id);
        if (finded) {
          return finded.channelIdName;
        }
        return '';
      },
      // 获取终端渠道列表
      queryTemplateChannelList() {
        this.$http['queryTemplateChannelList']({
          messageGroupCode: this.templateBaseInfo.messageGroupCode
        })
          .then((resp) => {
            if (!resp) {
              return;
            }
            this.sourceList = resp;
            // 获取格式化的渠道信息
            this.templateSourceList = this.getFormatChannelList(resp);
          })
      },
      // 格式化终端渠道
      getFormatChannelList(data) {
        const channelData = {};
        data.forEach((item) => {
          const channel = item.channel;
          this.channelListMap[this.editableTabsValue] = this.channelListMap[this.editableTabsValue] || [];
          if (!this.channelListMap[this.editableTabsValue].includes(item.channelId)) {
            // 判断对象值
            if (!channelData[channel]) {
              channelData[channel] = []
            }
            channelData[channel].push({
              value: item.channelId,
              // label: `${item.channelIdName}(${item.channelId})`,
              label: `${item.channelIdName}`
            })
          }
        })
        const channelList = [];
        Object.entries(channelData).forEach((item) => {
          channelList.push({
            value: item[0],
            label: this.transformChannelName(item[0]),
            children: item[1]
          })
        })
        return channelList;
      },
      // 通过 channel 转为 channelName 展示
      transformChannelName(channel) {
        const finded = this.sourceList.find(itm => itm.channel === channel);
        if (finded) {
          return finded.channelName;
        }
        return channel;
      },
      // 点击提交按钮
      clickSubmitBtn() {
        const templateList = [];
        this.editableTabs.forEach((item) => {
          if (item.content.length) {
            item.content.forEach((templateInfo) => {
              templateList.push({
                ...templateInfo,
                swjgDm: item.name,
                title: item.title
              })
            })
          }
        })
        this.deleteTabs.forEach((item) => {
          if (item.content && item.content.length) {
            item.content.forEach((items) => {
              if (!items.mbxh) {
                return;
              }
              templateList.push({
                ...items,
                swjgDm: item.name
              });
            })

          }
        }
        )

        if (!this.checkTmpInfo(templateList)) return false;
        // 编辑模板
        this.editTemplate(templateList);
      },
      // 校验数据合法性
      checkTmpInfo(list) {
        // 模板标题校验 短信不校验标题
        const findMsgTitle = list.find(content => content.channel !== 'SMS' && !content.msgTitle);
        if (findMsgTitle) {
          const tip = findMsgTitle.title ? `【${findMsgTitle.title}】` : '';
          this.$message.warning(`${tip}模板标题不能为空！`)
          return false;
        }

        // 模板内容校验
        const findContent = list.find(content => !content.templateContent);
        if (findContent) {
          const tip = findContent.title ? `【${findContent.title}】` : '';
          this.$message.warning(`${tip}模板内容不能为空！`)
          return false;
        }

        // 模板名称校验
        const findTitle = list.find(title => title.channel === 'APP' && title.msgTitle.length > 32);
        if (findTitle) {
          const tip = findTitle.title ? `【${findTitle.title}】` : '';
          this.$message.warning(`${tip}模板标题长度应小于32个字符！`)
          return false;
        }

        return true;
      },
      // 编辑模板
      editTemplate(data) {
        if (this.isEdit) {
          // 更新模板
          this.updateTemplate(data);
          return;
        }
        // 新增模板
        this.addTemplate(data);
      },
      // 格式化时间格式
      formatterTime(time) {
        const timeArr = time.split(':');
        const hour = Number(timeArr[0]);
        const min = Number(timeArr[1]);
        return (hour + min / 60) * 3600;
      },
      transformBaseInfo(info) {
        // 重新审核流程 不需要转换时间段
        // if (this.isEdit) {
        //   return info;
        // }
        if (!info.isRestrict) {
          info.pushBeginTime = null;
          info.pushEndTime = null;
        } else {
          info.pushBeginTime = this.formatterTime(info.pushBeginTime);
          info.pushEndTime = this.formatterTime(info.pushEndTime);
        }

        // 生效时间转换
        if (info.isImmediatelyActive) {
          info.activeTime = null;
        } else {
          const time = transActiveTime(info.activeTime);
          // 兼容 safari
          info.activeTime = new Date(time.replace(/-/g, '/')).getTime();
        }

        return info;
      },
      // 批量新增模板
      addTemplate(data) {
        let baseInfoBackup = JSON.parse(JSON.stringify(this.templateBaseInfo));
        baseInfoBackup = this.transformBaseInfo(baseInfoBackup);
        this.$http['addTemplate']({
          ...baseInfoBackup,
          messageTemplateDetails: data
        })
          .then((resp) => {
            if (resp && resp.length) {
              this.errMessageList = resp.map((item) => {
                return item.smsErrMessage
              });
              this.errListDialog = true;
              return;
            }
            this.$message.success('提交成功');
            this.returnListPage();
          })
      },
      // 查看 修改 发起审核
      updateTemplate(data) {
        let baseInfoBackup = JSON.parse(JSON.stringify(this.templateBaseInfo));
        baseInfoBackup = this.transformBaseInfo(baseInfoBackup);
        const api = this.isReEdit ? 'reUpdateTemplate' : 'updateTemplate';
        this.$http[api]({
          ...baseInfoBackup,
          messageType: this.templateInfo.messageType,
          messageTemplateDetails: data
        })
          .then((resp) => {
            if (resp && resp.length) {
              this.errMessageList = resp.map((item) => {
                return item.smsErrMessage
              });
              this.errListDialog = true;
              return;
            }
            this.$message.success('修改成功');
            this.returnListPage();
          })
      },
      clickCancelBtn() {
        this.$confirm('取消后，当前填写数据将被清空，是否继续')
          .then(() => {
            this.returnListPage();
          })
          .catch(() => {})
      },
      // 返回列表页
      returnListPage() {
        this.$router.push('/control/user/templateManage')
      },
      // 修改模板
      clickEditTemplateBtn(data, index) {
        this.selectTemplateIndex = index;
        this.addSourceTemplateDialog = true;
        const channelForm = this.$refs['templateChannelForm'];
        channelForm && channelForm.resetFields();
        this.isEditTemplate = true;
        this.templateForm = {
          source: [[data.content[index].channel, data.content[index].channelId]],
          channel: data.content[index].channel,
          channelId: data.content[index].channelId,
          mbxh: data.content[index].mbxh,
          templateContent: data.content[index].templateContent,
          msgTitle: data.content[index].msgTitle,
          action: '2'
        }
        this.editData = data;
      },
      // 删除模板
      clickDelTemplateBtn(data, index) {
        this.$confirm('是否删除该条模板')
          .then(() => {
            this.channelListMap[this.editableTabsValue] =
              this.channelListMap[this.editableTabsValue].filter(item => item !== data.content[index].channelId);
            if (this.isEdit) {
              this.$set(data.content[index], 'action', '3');
              return;
            }
            data.content.splice(index, 1);
          })
          .catch(() => {})
      },
      // 转换显示
      getChannel(info) {
        return transformChannel(info);
      },
      getChannelIdName(info) {
        return transformChannelIdName(info);
      },
      getRules() {
        return [
          {
            required: true, message: '请输入', trigger: 'blur'
          }
        ];
      },
      // 修改流程 转换时间显示
      transformTime() {
        if (!this.templateBaseInfo.isRestrict) {
          return '不限制';
        }

        const beginTime = modifyFormatterTime(this.templateBaseInfo.pushBeginTime);
        const endTime = modifyFormatterTime(this.templateBaseInfo.pushEndTime);
        return `${beginTime}-${endTime}`;
      },
      // 获取发送时间段
      getTime() {
        if (!this.isEdit) {
          return this.templateBaseInfo.isRestrict 
            ? `${this.templateBaseInfo.pushBeginTime}-${this.templateBaseInfo.pushEndTime}` 
            : '不限制'
        }
        return this.transformTime();
      }
    }
  }
</script>

<style lang="scss">
  @import '~gui/style/theme/variables';
  $content-border: 1px solid $CM-7;

  .template-manage-edit-source {
    .edit-source-template-info-content {
      border: $content-border;
      color: $CN-4;
      & + .edit-source-template-info-content {
        margin-top: 20px;
      }
      .edit-source-template-info-content-item {
        border-bottom: $content-border;
        padding-left: $ST-7;
        @include P-1;
        line-height: $SH-12;
        &.info-content-full {
          width: 100%;
          border-right: none !important;
        }
      }
      .edit-source-template-info-content-title {
        background-color: $CM-8;
        font-weight: bold;
        .edit-source-template-info-content-title-left-menu {
          float: right;
          a {
            margin-right: 20px;
            color: #428df5
          }
        }
      }
      .edit-source-template-info-content-list {
        li {
          display: inline-block;
          box-sizing: border-box;
          width: 50%;
          &:nth-of-type(odd) {
            border-right: $content-border;
          }
          &:last-of-type {
            border-bottom: none;
          }
          span {
            color: $CN-2;
          }
          &.li-rigth-bottom {
            border-right: $content-border;
          }
        }
      }
      .col-3 {
        width: 33.333%;
      }
      .col-6 {
        width: 60%;
      }
      .form-item-width {
        width: 400px;
      }
      .bb-none {
        border-bottom: none;
      }
      .icon-del {
        float: right;
        margin-right: 10px;
        margin-top: 10px;
        color: #409EFF;
        cursor: pointer;
        font-size: 20px;
      }

      .tips {
        color: red;
        font-size: 12px;
      }

      .time-width {
        width: 100px;
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
      .el-tabs__header {
        height: 34px;
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