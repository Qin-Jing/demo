<template>
  <div v-loading="loading">
    <div
      v-show="!isEmpty && !loading"
      class="template-list">
      <el-button
        type="primary"
        @click="addNotify">
        新增
      </el-button>
      <g-table
        ref="tableContent"
        class="template-table-content"
        :config="tableConfig"
        :columns="tableColumns"
        :multiple="false"
        :data="notifyData"
        :data-total="total"
        :page-size="pageSize"
        border
        @selection-change="getSelectNotify"
        @size-change="pageSizeChange"
        @pagetion-num-change="pageCurrentChange">
        <template
          slot="nr"
          slot-scope="scope">
          <!-- <p class="template-table-cell-content">
            {{ scope.row.nr }}
          </p> -->
          <el-popover
            placement="right"
            width="200"
            trigger="hover"
            transition=""
            :content="scope.row.nr">
            <p
              slot="reference"
              class="template-table-cell-content">
              {{ scope.row.nr }}
            </p>
          </el-popover>
        </template>
        <template
          slot="action"
          slot-scope="scope">
          <a
            href="javascript: void(0)"
            @click="editNotify(scope.row)">修改</a>
          <a
            href="javascript: void(0)"
            @click="confirmDeleteNotify(scope.row)">删除</a>
        </template>
      </g-table>
    </div>
    <no-info-component
      v-show="isEmpty && !loading"
      hint="您还没有添加过消息模板哦！"
      @btn-click="addNotify" />
  </div>
</template>

<script>
  import GTable from '@/common/component/GTable';
  import NoInfoComponent from '@/views/control/components/noInfoComponent';
  import moment from 'moment';

  export default {
    components: {
      GTable,
      NoInfoComponent
    },
    props: {
    },
    data() {
      return {
        searchValue: '',
        searchInfoType: '',
        // 表格的列配置参数
        tableConfig: {
          pagination: true,
          multiple: false,
          border: true
        },
        tableColumns: [
          {
            prop: 'appid',
            label: '应用ID',
            align: 'center'
          },
          {
            prop: 'templateId',
            label: '模板ID',
            align: 'center'
          },
          {
            prop: 'templateName',
            label: '模板名称',
            align: 'center'
          },
          {
            prop: 'channel',
            label: '渠道类型',
            align: 'center',
          },
          {
            prop: 'creatTime',
            label: '创建日期',
            align: 'center'
          },
          {
            prop: 'yxbz',
            label: '有效标志',
            align: 'center'
          },
          {
            prop: 'action',
            label: '操作',
            soltNmae: 'action',
            align: 'center',
            width: '150'
          }
        ],
        // 表格数据
        notifyData: [],
        // 当前选中的单元格信息
        selectNotificatioin: [],
        // 当前选择的公告信息
        notifySelect: [],
        // 产品
        productSelectValue: '-1',
        notifyTypeSelectValue: '-1',
        total: 0,
        pageSize: 10,
        pageNumber: 1,
        loading: false
      }
    },
    computed: {
      multipleBtnDisabled() {
        return !this.notifySelect.length
      },
      isEmpty() {
        // 判断非空要判断筛选值是否为空
        return !this.notifyData.length &&
          !this.searchValue &&
          !this.searchInfoType &&
          !this.productSelectValue &&
          !this.notifyTypeSelectValue
      },
      appid() {
        const infoStr = localStorage.getItem('productInfo');
        const info = JSON.parse(infoStr).appId;
        return info
      }
    },
    created() {
      // 获取消息列表
      this.queryMsgList();
    },
    methods: {
      searchNotify(data) {
        // 缓存查询数据
        this.searchValue = data.value || '';
        this.searchInfoType = data.type || '';
        this.queryMsgList();
      },
      // 获取消息模板列表
      queryMsgList() {
        this.loading = true;
        // 清空列表
        this.notifyData = [];
        this.$http['queryMsgTemplateList']({
          appid: this.appid
        })
          .then((resp) => {
            if (!resp) {
              return;
            }
            this.total = resp.length;
            this.notifyData = resp.map((item) => {
              // 参数格式化
              item.creatTime = moment(item.xgrq).format('YYYY-MM-DD');
              return item;
            });
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
          select = this.notifySelect;
        }
        this.$http['issueNotify'](
          {
            ids: select.map(item => item.id).join('、')
          }
        ).then(() => {
          this.$message.success('发布成功');
          this.queryMsgList();
        })
      },
      // 添加消息
      addNotify() {
        this.$router.push({
          path: 'template/formcontent',
        })
      },
      // 编辑消息
      editNotify(item) {
        this.$router.push({
          path: 'template/formcontent',
          query: {
            mbxh: item.mbxh
          }
        })
      },
      // 删除消息
      confirmDeleteNotify(item) {
        // 初始化确认文本和选中数据
        const confirmTxt = '删除后，该条消息模板将从系统中消失，且无法恢复。您是否确定删除？';
        this.$confirm(confirmTxt)
          .then(() => {
            // 删除消息
            this.deleteNotify(item);
          })
      },
      // 删除消息公告
      deleteNotify(item) {
        this.$http.deleteMsgTemplateInfo(
          {
            mbxh: item.mbxh
          }
        ).then(() => {
          this.$message.success('删除成功');
          this.queryMsgList();
        })
      },
      // 获取当前选中的消息公告列表
      getSelectNotify(selection) {
        this.notifySelect = selection;
      },
      // pageSize修改
      pageSizeChange(size) {
        this.pageNumber = 1;
        this.pageSize = size;
        this.queryMsgList();
      },
      pageCurrentChange(num) {
        if (typeof num !== 'number') {
          return;
        }
        this.pageNumber = num;
        this.queryMsgList();
      }
    }
  }
</script>

<style lang="scss">
  @import '~gui/style/theme/variables';
  .template-list {
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
    }
  }
</style>
