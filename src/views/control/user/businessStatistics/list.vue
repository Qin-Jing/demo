<template>
  <div v-loading="loading">
    <div
      class="business-statistics-manage-list">
      <el-form
        label-suffix="："
        :inline="true">
        <el-form-item label="应用">
          <el-cascader
            v-model="appId"
            clearable
            :options="applyList"
            size="small"
            :props="{label: 'appName', value: 'appId'}"
            placeholder="请选择应用" />
        </el-form-item>
        <el-form-item label="模板">
          <el-select
            v-model="templateId"
            clearable
            size="small"
            placeholder="请选择模板">
            <el-option
              v-for="(item, index) in templateList"
              :key="index"
              :label="item.templateName"
              :value="item.templateId" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="msgStatus"
            clearable
            size="small"
            placeholder="请选择请求状态">
            <el-option
              v-for="item in stateList"
              :key="item.code"
              :label="item.name"
              :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="filterDateRange"
            unlink-panels
            size="small"
            style="width: 230px;"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item label="业务流水号">
          <el-input
            v-model.trim="searchValue"
            clearable
            placeholder="请输入业务流水号"
            size="small"
            @keyup.enter.native="search" />
        </el-form-item>
        <el-form-item label="批次号">
          <el-input
            v-model.trim="batchNumber"
            clearable
            placeholder="请输入批次号"
            size="small"
            @keyup.enter.native="search" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            @click="search">
            搜索
          </el-button>
        </el-form-item>
      </el-form>
      <g-table
        ref="tableContent"
        :columns="tableColumns"
        :multiple="false"
        :data="recordDatas"
        :data-total="total"
        :page-size="pageSize"
        :span-method="statisticsTableMerge"
        :page-sizes="[10]"
        border
        @selection-change="getSelectNotify"
        @size-change="pageSizeChange"
        @pagetion-num-change="pageCurrentChange">
        <template
          slot="action"
          slot-scope="scope">
          <a
            href="javascript: void(0)"
            @click="clickSeeDetailBtn(scope.row)">明细</a>
        </template>
      </g-table>
    </div>
  </div>
</template>

<script>
  import GTable from '@/common/component/GTable';
  import moment from 'moment';
  export default {
    components: {
      GTable,
    },
    props: {
    },
    data() {
      return {
        searchValue: '',
        batchNum: '',
        tableColumns: [
          {
            prop: 'batchNumber',
            label: '批次号',
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'requestId',
            label: '业务流水号',
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'template',
            label: '模板',
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'creatTime',
            label: '创建日期',
            align: 'center',
            width: '180'
          },
          {
            prop: 'expectedTime',
            label: '预计发送时间',
            align: 'center',
            width: '180'
          },
          {
            prop: 'msgStatus',
            label: '状态',
            align: 'center'
          },
          {
            prop: 'action',
            label: '操作',
            soltNmae: 'action',
            align: 'center',
            width: '100'
          }
        ],
        // 表格数据
        recordDatas: [
        ],
        // 当前选择的公告信息
        selectTemplate: [],
        applyList: [],
        templateList: [],
        templateId: null,
        batchNumber: null,
        stateList: [
          {
            code: '03',
            name: '已发送'
          },
          {
            code: '01',
            name: '待发送'
          }
        ],
        appId: [],
        msgStatus: null,
        filterDateRange: [moment().subtract(2, 'month'), moment()],
        total: 0,
        pageSize: 10,
        pageNumber: 1,
        loading: false
      }
    },
    computed: {
    },
    watch: {
      appId: {
        immediate: true,
        handler(val){
          this.templateId = null;
          this.queryTemplateList(val[val.length - 1])
        }
      }
    },
    created() {
      // 获取消息列表
      this.querySendRecord();
      // 获取应用列表
      this.queryAllApplyList();
    },
    methods: {
      // 获取应用列表
      queryAllApplyList() {
        this.applyList = [];
        this.$http['queryAllApplyList']()
          .then((resp) => {
            if (!resp) {
              return;
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
          })
      },
      // 选择app
      queryTemplateList(appId) {
        this.templateId = null;
        this.$http['queryTemplateListRecord']({
          appId: appId || ''
        })
          .then((resp) => {
            if (!resp) {
              return;
            }
            this.templateList = resp;
          })
      },
      clickSearchBtn(data) {
        // 缓存查询数据
        this.searchValue = data.value || null;
        this.querySendRecord();
      },
      search() {
        this.$refs['tableContent'].reload();
      },
      // 获取消息模板列表
      querySendRecord() {
        this.loading = true;
        // 清空列表
        this.recordDatas = [];
        const appId = this.appId.length ? this.appId[this.appId.length - 1] : null;
        const params = {
          jssj: this.filterDateRange ? moment(this.filterDateRange[1]).format('YYYY-MM-DD') : null,
          kssj: this.filterDateRange ? moment(this.filterDateRange[0]).format('YYYY-MM-DD') : null,
          templateId: this.templateId || null,
          msgStatus: this.msgStatus || null,
          requestId: this.searchValue,
          appId,
          batchNumber: this.batchNumber,
          pageNum: this.pageNumber,
          pageSize: this.pageSize
        }
        this.$http['queryMessageRecordList'](params)
          .then((resp) => {
            if (!resp) {
              return;
            }
            this.total = resp.count;
            // 数据格式化
            this.recordDatas = this.getFormatRecord(resp.data || []);
          })
          .finally(() => {
            this.loading = false;
          })
      },
      // 格式化发送记录列表
      getFormatRecord(data = []) {
        const formatData = [];
        data.forEach((item) => {
          if (!item.recordDTOList || !item.recordDTOList.length) {
            formatData.push({
              ...item,
              num: 1,
              result: '-'
            });
            return;
          }
          formatData.push(...item.recordDTOList.map((recordItem, index) => {
            let recordNum = 0
            if (index === 0) {
              recordNum = item.recordDTOList.length;
            }
            return {
              ...item,
              ...recordItem,
              num: recordNum,
              result: `${recordItem.successQuantity}成功，${recordItem.failedQuantity}失败`
            }
          }))
        })
        return formatData;
      },
      // 查看详情
      clickSeeDetailBtn(data) {
        this.$router.push({
          path: 'businessStatistics/detail',
          query: {
            recordId: data.recordId,
            templateName: data.template
          }
        });
      },
      // 获取当前选中的消息公告列表
      getSelectNotify(selection) {
        this.selectTemplate = selection;
      },
      // pageSize修改
      pageSizeChange(size) {
        this.pageNumber = 1;
        this.pageSize = size;
        this.querySendRecord();
      },
      pageCurrentChange(num) {
        if (typeof num !== 'number') {
          return;
        }
        this.pageNumber = num;
        this.querySendRecord();
      },
      // 日期变更
      dateChange() {
        this.querySendRecord();
      },
      /**
       * 表格合并
       */
      statisticsTableMerge({ row, columnIndex }) {
        if (columnIndex !== 5 && columnIndex !== 6) {
          if (row.num) {
            return {
              rowspan: row.num,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~gui/style/theme/variables';
  .el-table {
    margin-top: $SP-6;
  }
  .el-form {
    /deep/ .el-form-item__label {
      padding-right: 0;
    }
  }
  
</style>
