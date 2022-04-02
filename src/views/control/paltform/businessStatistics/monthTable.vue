<template>
  <div class="month-statement">
    <main-title-nav
      title="月报表" />
    <main-content>
      <el-form
        :inline="true"
        :model="filterForm"
        class="month-statement-filter-form">
        <el-form-item
          class="day-statement-filter-form-itme"
          label="所属应用：">
          <!-- <el-select
            v-model="filterForm.appId"
            size="small">
            <el-option
              v-for="(item, index) in formatApplyList"
              :key="index"
              :label="item.appName"
              :value="item.appId" />
          </el-select> -->
          <el-cascader
            v-model="filterForm.appId"
            placeholder="请选择"
            size="small"
            :options="formatApplyList"
            :props="priorityProp"
            filterable
            clearable />
        </el-form-item>
        <el-form-item
          class="day-statement-filter-form-itme"
          label="模板：">
          <el-select
            v-model="filterForm.tempId"
            clearable
            size="small">
            <el-option
              v-for="(item, index) in formatTemplateList"
              :key="index"
              :label="item.templateName"
              :value="item.templateId" />
          </el-select>
        </el-form-item>
        <el-form-item
          class="day-statement-filter-form-itme"
          label="业务类型：">
          <el-cascader
            v-model="filterForm.msgTypeList"
            placeholder="请选择"
            size="small"
            :options="formatTypeList"
            :props="messageTypeProp"
            filterable
            clearable />
        </el-form-item>
        <el-form-item>
          <el-radio-group
            v-model="timeType"
            size="small">
            <el-radio-button
              label="上一年" 
              @click.native="selectMonth(1)" />
            <el-radio-button
              label="本年"
              @click.native="selectMonth(0)" />
            <el-radio-button
              label="自定义"
              @click.native="changeCustom" />
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="isCustom">
          <el-date-picker
            v-model="kssjTime"
            size="small"
            type="month"
            placeholder="开始日期"
            :picker-options="startTimeOptions" />
          -
          <el-date-picker
            v-model="jssjTime"
            size="small"
            type="month"
            placeholder="结束日期"
            :picker-options="endTimeOptions" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            @click="clickSearchBtn">
            搜索
          </el-button>
        </el-form-item>
      </el-form>
      <g-table
        ref="tableContent"
        class="user-message-table-content"
        :columns="tableColumns"
        :multiple="false"
        :data="tableDatas"
        :data-total="total"
        :page-size="pageSize"
        border
        @size-change="pageSizeChange"
        @pagetion-num-change="pageCurrentChange" />
    </main-content>
  </div>
</template>

<script>
  import moment from 'moment';
  import MainTitleNav from '@/common/component/mainTitleNav';
  import GTable from '@/common/component/GTable';
  import MainContent from '../../components/mainContent';

  export default {
    components: {
      MainContent,
      MainTitleNav,
      GTable
    },
    data() {
      const self = this;
      return {
        filterForm: {
          appId: ['', ''],
          tempId: '',
          msgTypeList: ['', ''],
          kssj: '',
          jssj: '',
        },
        kssjTime: moment().startOf('year'),
        jssjTime: moment().endOf('year'),
        tableColumns: [
          {
            prop: 'statisticsTime',
            label: '发送月份',
            align: 'center'
          },
          {
            prop: 'appName',
            label: '所属应用',
            align: 'center'
          },
          {
            prop: 'templateIdName',
            label: '模板',
            align: 'center'
          },
          {
            prop: 'messageBigTypeName',
            label: '业务大类',
            align: 'center'
          },
          {
            prop: 'messageSmallTypeName',
            label: '业务小类',
            align: 'center'
          },
          {
            prop: 'channelName',
            label: '推送渠道',
            align: 'center'
          },
          {
            prop: 'quantity',
            label: '发送(条)',
            align: 'center'
          },
          // {
          //   prop: 'state',
          //   label: '失败(条)',
          //   align: 'center'
          // },
          // {
          //   prop: 'action',
          //   label: '已读(条)',
          //   align: 'center'
          // }
        ],
        // 表格数据
        tableDatas: [],
        // 产品
        total: 0,
        pageSize: 10,
        pageNumber: 1,
        startTimeOptions: {
          disabledDate(time) {
            const endTime = self.jssjTime;
            if (endTime) {
              return moment(time).format('x') < moment(endTime).subtract(12, 'month').format('x')
                || moment(time).format('x') > moment(endTime).format('x')
            }
            // return false;
          }
        },
        endTimeOptions: {
          disabledDate(time) {
            const startTime = self.kssjTime;
            if (startTime) {
              return moment(time).format('x') > moment(startTime).add(12, 'month').format('x')
                || moment(time).format('x') < moment(startTime).format('x')
            }
            // return false;
          }
        },
        timeType: '本年',
        applyList: [],
        tempList: [],
        typeList: [],
        formatTemplateList: [],
        formatTypeList: [],
        priorityProp: {
          value: 'appId',
          label: 'appName'
        },
        messageTypeProp: {
          value: 'messageType',
          label: 'messageTypeName',
          children: 'subMsgTypelist'
        }
      }
    },
    computed: {
      isCustom() {
        return this.timeType === '自定义'
      },
      formatApplyList() {
        return this.applyList
      }
    },
    watch: {
      'filterForm.appId'(value) {
        const appId = value[1] || '';
        let templateList = []
        this.filterForm.tempId = '';
        this.filterForm.msgTypeList = ['', ''];
        if(!appId) { // 带入全部
          for(const key in this.tempList) {
            templateList = templateList.concat(this.tempList[key])
          }
          this.formatTypeList = this.typeList;
        }else {
          if(this.tempList[appId]) {
            templateList.push(...this.tempList[appId])
          }
          this.formatTypeList = this.typeList.filter((item) => {
            return item.appId === appId;
          })
        }
       
        this.formatTemplateList = templateList;
      }
    },
    created() {
      // 获取应用列表
      this.queryApplyListByUser().then(() => {
        // 月报列表
        this.queryMonthStatisticList();
      });
      // 获取模板列表
      this.queryTemplateList();
      // 消息类型列表
      this.queryMessageTypeList();
    },
    methods: {
      queryApplyListByUser() {
        return new Promise((resolve) => {
          this.$http['queryAllApplyList']()
            .then((resp) => {
              if (!resp) {
                resolve();
              }
              for(const key in resp) {
                if(resp[key]) {
                  this.applyList.push({
                    appId: key,
                    appName: key,
                    children: resp[key]
                  })
                }
              }
              resolve();
            })
        })
      },
      // 获取模板列表
      queryTemplateList() {
        this.$http['queryTemplateList']()
          .then((resp) => {
            this.tempList = resp;
            for(const key in this.tempList) {
              this.formatTemplateList = this.formatTemplateList.concat(this.tempList[key]);
            }
          })
      },
      // 获取模板列表
      queryMessageTypeList() {
        this.$http['queryMsgTypeCascader']()
          .then((resp) => {
            this.formatTypeList = this.typeList = resp;
          })
      },
      clickSearchBtn() {
        this.$refs['tableContent'].reload();
      },
      // 获取月报列表
      queryMonthStatisticList() {
        const filter = this.filterForm;
        filter.kssj = moment(this.kssjTime).format('YYYYMM');
        filter.jssj = moment(this.jssjTime).format('YYYYMM');
        this.$http['queryMonthStatisticList']({
          ...filter,
          appId: filter.appId[1] || '',
          msgTypeList: [filter.msgTypeList[1]] || [],
          pageSize: this.pageSize,
          pageNum: this.pageNumber,
        })
          .then((resp) => {
            this.tableDatas = resp.reportResponseDTOList || [];
            this.total = resp.count || 0;
          })
      },
      // 修改每页数量
      pageSizeChange(size) {
        this.pageNumber = 1;
        this.pageSize = size;
        this.queryMonthStatisticList();
      },
      pageCurrentChange(num) {
        this.pageNumber = Number(num);
        this.queryMonthStatisticList();
      },
      // 计算月份日期
      selectMonth(num) {
        const filterForm = this.filterForm;
        this.kssjTime = moment().subtract(num, 'years').startOf('year').format('YYYY-MM');
        this.jssjTime = moment().subtract(num, 'years').endOf('year').format('YYYY-MM');
        console.log(filterForm);
      },
      changeCustom() {
        this.kssjTime = '';
        this.jssjTime = '';
      }
    }
  }
</script>

<style lang="scss">
  .month-statement {
    .month-statement-filter-form {
      .month-statement-filter-form-itme {
        .el-form-item__content {
          width: 120px;
        }
      }
      .el-radio-group {
        vertical-align: inherit;
      }
      .el-button {
        height: 32px;
      }
    }
  }
</style>