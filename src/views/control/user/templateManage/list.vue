<template>
  <div v-loading="loading">
    <div
      v-show="!isEmpty && !loading"
      class="template-manage-list">
      <table-head-menu
        class="template-manage-list-menu"
        placeholder="模板名称/模板标识码"
        @search-click="clickSearchBtn">
        <template>
          <el-button
            type="primary"
            @click="addTemplate">
            新增
          </el-button>
          <!-- <el-button
            type="primary"
            :disabled="multipleBtnDisabled"
            @click="clickDeletetBtn">
            删除
          </el-button> -->
        </template>
        <span slot="right">
          <el-cascader
            v-model="appId"
            class="mr16"
            clearable
            :options="applyList"
            :props="{label: 'appName', value: 'appId'}"
            placeholder="请选择应用" />
        </span>
      </table-head-menu>
      <g-table
        ref="tableContent"
        class="template-table-content"
        :columns="tableColumns"
        :multiple="false"
        :data="templateDatas"
        :data-total="total"
        :page-size="pageSize"
        border
        @selection-change="getSelectNotify"
        @size-change="pageSizeChange"
        @pagetion-num-change="pageCurrentChange">
        <template
          slot="state"
          slot-scope="scope">
          <span 
            class="template-manage-audit-state-sign"
            :style="{backgroundColor: scope.row.auditStateColor}" />
          <span>{{ getStateName(scope.row.auditStatus) }}</span>
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
          slot="action"
          slot-scope="scope">
          <a
            href="javascript: void(0)"
            @click="clickSeeDetailBtn(scope.row)">详情</a>
          <!-- <a
            v-if="scope.row.auditStatus !== '0'"
            href="javascript: void(0)"
            @click="clickEditTemplateBtn(scope.row)">修改</a> -->
          <a
            v-if="scope.row.auditStatus === '2'"
            href="javascript: void(0)"
            @click="clickseeDetailAndEditBtn(scope.row, 'reEdit')">修改并发起审核</a>
          <a
            v-if="scope.row.auditStatus === '0'"
            href="javascript: void(0)"
            @click="clickseeDetailAndEditBtn(scope.row, 'edit')">查看原因并修改</a>
          <a
            href="javascript: void(0)"
            @click="clickDeletetBtn(scope.row)">删除</a>
        </template>
      </g-table>
    </div>
    <no-info-component
      v-show="isEmpty && !loading"
      hint="您还没有添加过消息模板哦！"
      @btn-click="addTemplate" />
  </div>
</template>

<script>
  import GTable from '@/common/component/GTable';
  import NoInfoComponent from '@/views/control/components/noInfoComponent';
  import TableHeadMenu from '@/common/component/tableHeadMenu';
  import moment from 'moment';

  export default {
    components: {
      GTable,
      NoInfoComponent,
      TableHeadMenu
    },
    filters: {
    },
    props: {
      applyList: {
        type: Array,
        default: () => []
      },
    },
    data() {
      return {
        searchValue: '',
        searchInfoType: '',
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
        tableColumns: [
          {
            prop: 'templateName',
            label: '模板名称',
            align: 'center',
            sortable: true
          },
          {
            prop: 'templateId',
            label: '模板标识码',
            align: 'center',
            sortable: true
          },
          {
            prop: 'appName',
            label: '所属应用',
            align: 'center',
            sortable: true
          },
          {
            prop: 'auditStatus',
            label: '审核状态',
            align: 'center',
            soltNmae: 'state',
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
            soltNmae: 'action',
            align: 'center',
            width: '250'
          }
        ],
        // 表格数据
        templateDatas: [],
        // 当前选择的公告信息
        selectTemplate: [],
        // 产品
        productSelectValue: '-1',
        notifyTypeSelectValue: '-1',
        total: 0,
        pageSize: 10,
        pageNumber: 1,
        loading: false,
        appId: [],
        appList: [],
      }
    },
    computed: {
      multipleBtnDisabled() {
        return !this.selectTemplate.length
      },
      isEmpty() {
        // 判断非空要判断筛选值是否为空
        return !this.templateDatas.length &&
          !this.searchValue &&
          !this.searchInfoType &&
          !this.productSelectValue &&
          !this.notifyTypeSelectValue
      }
    },
    created() {
      // 获取消息列表
      this.queryTemplateList();
    },
    methods: {
      moment,
      clickSearchBtn(data) {
        // 缓存查询数据
        this.searchValue = data.value || '';
        this.searchInfoType = data.type || '';
        this.$refs['tableContent'].reload();
      },
      // 获取消息模板列表
      queryTemplateList() {
        this.loading = true;
        // 清空列表
        this.templateDatas = [];
        this.$http['queryTemplateInfoList'](
          {
            appid: this.appId[this.appId.length - 1],
            template: this.searchValue,
            pageNum: this.pageNumber,
            pageSize: this.pageSize
          }
        )
          .then((resp) => {
            if (!resp) {
              return;
            }
            const { data, count } = resp;
            this.total = count || 0;
            this.templateDatas = data ? data.map((item) => {
              const auditState = this.templateStateMap[item.auditStatus] || {};
              item.channelList = [];
              Object.entries(item.channelStatusMap).forEach((channel) => {
                if (channel[1] === '2') {
                  item.channelList.push(channel[0])
                }
              });
              // item.auditState = auditState.name;
              item.auditStateColor = auditState.color;
              return item;
            }) : [];
          })
          .finally(() => {
            this.loading = false;
          })
      },
      // 确认是否发布
      issueNotify(data) {
        let select = data && [data.row];
        // 没有参数，获取表格勾选信息
        if (!data) {
          select = this.selectTemplate;
        }
        this.$http['issueNotify'](
          {
            ids: select.map(item => item.id).join('、')
          }
        ).then(() => {
          this.$message.success('发布成功');
          this.queryTemplateList();
        })
      },
      // 查看详情
      clickSeeDetailBtn(data) {
        this.$router.push({
          path: 'templateManage/detail',
          query: {
            templateId: data.templateId,
            appid: data.appid
          }
        });
      },
      // 添加消息
      addTemplate() {
        this.$router.push({
          path: 'templateManage/editTemplateName',
        })
      },
      // 编辑消息
      clickEditTemplateBtn(item) {
        this.$router.push({
          path: 'templateManage/editTemplateSource',
          query: {
            templateId: item.templateId,
            appid: item.appid,
            isEdit: true
          }
        })
      },
      // 查看原因并修改 修改并发起审核
      clickseeDetailAndEditBtn(item, type = 'edit') {
        this.$router.push({
          path: 'templateManage/editTemplateSource',
          query: {
            templateId: item.templateId,
            appid: item.appid,
            isEdit: true,
            type
          }
        })
      },
      // 删除消息
      clickDeletetBtn(item) {
        // 初始化确认文本和选中数据
        const confirmTxt = '删除模板之后无法继续使用该模板发送消息，您是否确定删除？';
        this.$confirm(confirmTxt)
          .then(() => {
            // 删除消息
            this.deleteNotify(item);
          })
      },
      // 删除消息公告
      deleteNotify(item) {
        this.$http['deleteTemplate']({
          templateId: item.templateId,
          appid: item.appid
        }).then(() => {
          this.$message.success('删除成功');
          this.queryTemplateList();
        })
      },
      // 获取当前选中的消息公告列表
      getSelectNotify(selection) {
        this.selectTemplate = selection;
      },
      // pageSize修改
      pageSizeChange(size) {
        this.pageNumber = 1;
        this.pageSize = size;
        this.queryTemplateList();
      },
      pageCurrentChange(num) {
        if (typeof num !== 'number') {
          return;
        }
        this.pageNumber = num;
        this.queryTemplateList();
      },
      // 转换状态对应的名字
      getStateName(statu) {
        return this.templateStateMap[statu].name;
      }
    }
  }
</script>

<style lang="scss">
  @import '~gui/style/theme/variables';
  .template-manage-list {
    .template-filter-condition {
      width: 128px;
      margin-right: 16px;
    }
    .template-table-content {
      margin-top: $SP-6;
      .template-table-cell-content {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .template-manage-audit-state-sign {
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-right: 8px;
        border-radius: 50%;
      }
    }
    .template-manage-list-menu {
      .mr16 {
        width: 180px;
        margin-right: 16px;
      }
    }
  }
</style>
