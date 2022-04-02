<template>
  <div class="business-handle-template-audit-list">
    <table-head-menu
      class="template-audit-search-content"
      placeholder="模板名称/模板CODE"
      @search-click="clickFilterBtn">
      <span slot="right">
        <label>所属应用：</label>
        <el-cascader
          v-model="appId"
          class="template-audit-condition"
          placeholder="请选择"
          :options="applyList"
          :props="priorityProp"
          filterable
          clearable />
        <label>审核状态：</label>
        <el-select
          v-model="auditStatus"
          placeholder="审核状态"
          class="template-audit-condition">
          <el-option
            v-for="item in templateStateList"
            :key="item.code"
            :label="item.name"
            :value="item.code" />
        </el-select>
      </span>
    </table-head-menu>
    <g-table
      ref="tableContent"
      v-loading="loading"
      class="template-audit-table-content"
      :columns="tableColumns"
      :data="tableData"
      :data-total="total"
      :multiple="false"
      border
      @selection-change="getSelectRow"
      @size-change="pageSizeChange"
      @pagetion-num-change="pageCurrentChange">
      <template
        slot="lrrMc"
        slot-scope="scope">
        <span>{{ getLrrMc(scope.row) }}</span>
      </template>
      <template
        slot="channel"
        slot-scope="scope">
        <el-checkbox-group
          v-model="scope.row.channelList"
          disabled>
          <el-checkbox label="WEB" />
          <el-checkbox label="APP" />
          <el-checkbox label="SMS" />
          <!-- <el-checkbox label="SMS">
            SMS
            <el-tooltip
              class="item"
              effect="dark"
              content="短信模板请前往短信中心管理后台进行审核。"
              placement="top-start">
              <i class="iconfont icon-wenhao" />
            </el-tooltip>
          </el-checkbox> -->
        </el-checkbox-group>
      </template>
      <template
        slot="xgrq"
        slot-scope="scope">
        <span>{{ moment(scope.row.xgrq).format('YYYY-MM-DD HH:mm:ss') }}</span>
      </template>
      <template
        slot="auditState"
        slot-scope="scope">
        <span 
          class="template-manage-audit-state-sign"
          :style="{backgroundColor: scope.row.auditStateColor}" />
        <span>{{ scope.row.auditState }}</span>
      </template>
      <template
        slot="action"
        slot-scope="scope">
        <a
          v-if="scope.row.auditStatus === TEMPLATE_MANAGE_AUDIT_STATUS.RESOLVE_STATUS ||
            scope.row.auditStatus === TEMPLATE_MANAGE_AUDIT_STATUS.REJECT_STATUS"
          href="javascript: void(0)"
          @click="clickSeeDetailBtn(scope.row)">详情</a>
        <a
          v-if="scope.row.auditStatus === TEMPLATE_MANAGE_AUDIT_STATUS.PENDING_STATUS"
          class="template-audit-audit-btn"
          href="javascript: void(0)"
          @click="clickAuditBtn(scope.row)">
          <span
            v-if="scope.row.createDay === today"
            class="template-audit-now-day-sign">NEW</span>
          审核
        </a>
      </template>
    </g-table>
  </div>
</template>

<script>
  import TableHeadMenu from '@/common/component/tableHeadMenu';
  import GTable from '@/common/component/GTable';
  import moment from 'moment';

  const TEMPLATE_MANAGE_AUDIT_STATUS = {
    PENDING_STATUS: '1',
    RESOLVE_STATUS: '2',
    REJECT_STATUS: '0',
  }

  export default {
    components: {
      GTable,
      TableHeadMenu
    },
    data() {
      return {
        TEMPLATE_MANAGE_AUDIT_STATUS,
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
        templateStateList: [
          {
            name: '全部（审核状态）',
            code: ''
          },
          {
            name: '待审核',
            code: '1'
          },
          {
            name: '已拒绝',
            code: '0'
          },
          {
            name: '已通过',
            code: '2'
          },
        ],
        tableColumns: [
          {
            prop: 'lrrMc',
            label: '使用者',
            align: 'center',
            soltNmae: 'lrrMc',
            sortable: true,
            width: '180'
          },
          {
            prop: 'appName',
            label: '所属应用',
            align: 'center',
            sortable: true
          },
          {
            prop: 'templateName',
            label: '模板名称',
            align: 'center',
            sortable: true
          },
          {
            prop: 'templateId',
            label: '模板CODE',
            align: 'center',
            sortable: true
          },
          {
            prop: 'auditState',
            label: '审核状态',
            align: 'center',
            soltNmae: 'auditState',
            sortable: true
          },
          {
            prop: 'channelList',
            label: '可用发送渠道',
            align: 'left',
            soltNmae: 'channel',
            width: '260'
          },
          {
            prop: 'xgrq',
            label: '申请日期',
            align: 'center',
            soltNmae: 'xgrq',
            sortable: true
          },
          {
            prop: 'action',
            label: '操作',
            align: 'center',
            soltNmae: 'action',
            width: 100
          }
        ],
        tableData: [],
        total: 0,
        pageNumber: 0,
        pageSize: 10,
        productSelectValue: '',
        templateSelect: [],
        isCheck: true,
        templateName: '',
        appId: [],
        auditStatus: '',
        today: moment().format('YYYY-MM-DD'),
        priorityProp: {
          value: 'appId',
          label: 'appName'
        },
        applyList: [],
        loading: false
      }
    },
    computed: {
      // app映射表
      appNameMap() {
        const map = {};
        this.applyList.forEach((item) => {
          map[item.dm] = item.mc
        });
        return map;
      },
    },
    created() {
      // 获取模板列表
      this.queryTemplateList();
      // 获取应用级联菜单
      this.queryTemplateApplyCascade();
    },
    methods: {
      moment,
      // 模板列表
      queryTemplateList() {
        this.loading = true;
        this.$http['queryTemplateAuditList']({
          appid: this.appId ? this.appId[1] : '',
          auditStatus: this.auditStatus,
          template: this.templateName,
          pageNum: this.pageNumber,
          pageSize: this.pageSize
        })
          .then((resp) => {
            this.loading = false;
            if (!resp) {
              return;
            }
            const { data, count } = resp;
            this.total = count || 0;
            this.tableData = data ? data.map((item) => {
              item.xgrqDay = item.xgrq ? moment(item.xgrq).format('YYYY-MM-DD') : '';
              const auditState = this.templateStateMap[item.auditStatus] || {};
              item.channelList = [];
              Object.entries(item.channelStatusMap).forEach((channel) => {
                if (channel[1] === '2') {
                  item.channelList.push(channel[0])
                }
              });
              item.auditState = auditState.name;
              item.auditStateColor = auditState.color;
              return item;
            }) : [];
          })
          .catch(() => {
            this.loading = false;
          })
      },
      // 获取模板级联菜单
      queryTemplateApplyCascade() {
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
      clickSeeDetailBtn(data) {
        this.$router.push({
          path: 'templateAudit/detail',
          query: {
            templateId: data.templateId,
            appid: data.appid,
            mbxh: data.mbxh
          }
        })
      },
      clickAuditBtn(data) {
        this.$router.push({
          path: 'templateAudit/audit',
          query: {
            templateId: data.templateId,
            appid: data.appid,
            mbxh: data.mbxh
          }
        })
      },
      clickEditBtn(data) {
        this.$router.push({
          path: 'templateAudit/audit',
          query: {
            templateId: data.templateId,
            appid: data.appid,
            mbxh: data.mbxh
          }
        })
      },
      clickFilterBtn(data) {
        this.templateName = data.value;
        this.$refs['tableContent'].reload();
        // this.queryTemplateList();
      },
      // pageSize修改
      pageSizeChange(size) {
        // 返回第一页
        this.pageNumber = 1;
        this.pageSize = size;
        // 重新获取账号列表
        this.queryTemplateList();
      },
      // 获取选中
      getSelectRow(selection) {
        this.templateSelect = selection;
      },
      pageCurrentChange(num) {
        this.pageNumber = num;
        // 重新获取账号列表
        this.queryTemplateList();
      },
      getLrrMc(row) {
        const lrrMc = row.lrrMc;
        const gsmc = row.gsmc;
        if (lrrMc && gsmc) {
          return `${row.lrrMc}(${row.gsmc})`;
        } else if (lrrMc && !gsmc) {
          return lrrMc
        } else if (!lrrMc && gsmc) {
          return gsmc
        } else {
          return ''
        }
      }
    }
  }
</script>

<style lang="scss">
  .business-handle-template-audit-list {
    .template-audit-table-content {
      margin-top: 20px;
      .template-manage-audit-state-sign {
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-right: 8px;
        border-radius: 50%;
      }
    }
    .template-audit-search-content {
      .table-header-menu-search-menu {
        width: 300px;
      }
    }
    .template-audit-condition {
      width: 160px;
      margin-right: 16px;
    }
    .template-audit-audit-btn {
      .template-audit-now-day-sign {
        position: absolute;
        left: 30px;
        color: red
      }
    }

  }
</style>