<template>
  <div v-loading="loading">
    <div
      v-show="!isEmpty && !loading"
      class="domain-list">
      <g-table
        ref="tableContent"
        class="domain-table-content"
        :columns="tableColumns"
        :multiple="false"
        :data="recordData"
        :data-total="total"
        :page-size="pageSize"
        border
        @size-change="pageSizeChange"
        @pagetion-num-change="pageCurrentChange">
        <template
          slot="appName"
          slot-scope="scope">
          <a 
            href="javascript: void(0)" 
            @click="seeApplyDetail(scope.row)">{{ scope.row.businessSystemName }}</a>
        </template>
        <template
          slot="channelIds"
          slot-scope="scope">
          <p>{{ scope.row.channelIds.toString() }}</p>
        </template>
        <template
          slot="action"
          slot-scope="scope">
          <a
            href="javascript: void(0)"
            @click="bondChannel(scope.row)">分配</a>
        </template>
      </g-table>
    </div>
    <no-info-component
      v-show="isEmpty && !loading"
      hint="您还没有添加过终端渠道哦！"
      :show-btn="false" />
    <el-dialog
      title="应用详情"
      class="send-record-manage-detail-dialog"
      width="500px"
      :close-on-click-modal="false"
      :visible.sync="detailDialogShow">
      <el-form
        label-width="150px">
        <el-form-item
          label="应用名称:">
          {{ appDetail.businessSystemName }}
        </el-form-item>
        <el-form-item
          label="AppId:">
          {{ appDetail.appId }}
        </el-form-item>
        <el-form-item
          label="使用者公司名称:">
          {{ appDetail.gsmc }}
        </el-form-item>
        <el-form-item
          label="联系人:">
          {{ appDetail.lxr }}
        </el-form-item>
        <el-form-item
          label="联系电话:">
          {{ appDetail.lxdh }}
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import GTable from '@/common/component/GTable';
  import NoInfoComponent from '@/views/control/components/noInfoComponent';

  export default {
    components: {
      GTable,
      NoInfoComponent
    },
    props: {
    },
    data() {
      return {
        // 表格的列配置参数
        tableConfig: {
          pagination: true,
          multiple: false,
          border: true
        },
        tableColumns: [
          {
            prop: 'businessSystemName',
            label: '应用名称',
            align: 'center',
            soltNmae: 'appName',
          },
          {
            prop: 'appId',
            label: 'APPID',
            align: 'center'
          },
          {
            prop: 'channelIds',
            label: '已分配终端渠道',
            align: 'center',
            soltNmae: 'channelIds',
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
        recordData: [],
        // 产品
        total: 0,
        pageSize: 10,
        pageNumber: 1,
        loading: false,
        detailDialogShow: false,
        appDetail: {}
      }
    },
    computed: {
      isEmpty() {
        // 判断非空要判断筛选值是否为空
        return !this.recordData.length
      }
    },
    created() {
      // 获取消息列表
      this.queryApplyChannelList();
    },
    methods: {
      // 获取渠道列表
      queryApplyChannelList() {
        this.loading = true;
        // 清空列表
        this.recordData = [];
        this.$http['queryApplyChannelList']({
          pageSize: this.pageSize,
          pageNum: this.pageNumber,
        })
          .then((resp) => {
            if (!resp) {
              return;
            }
            const { data, count } = resp;
            this.total = count;
            this.recordData = data;
          })
          .finally(() => {
            this.loading = false;
          })
      },
      // 编辑消息
      bondChannel(item) {
        this.$router.push({
          path: 'applicationTerminal/config',
          query: {
            regionId: item.regionId,
            name: item.businessSystemName
          }
        })
      },
      // pageSize修改
      pageSizeChange(size) {
        this.pageNumber = 1;
        this.pageSize = size;
        this.queryApplyChannelList();
      },
      pageCurrentChange(num) {
        if (typeof num !== 'number') {
          return;
        }
        this.pageNumber = num;
        this.queryApplyChannelList();
      },
      seeApplyDetail(data) {
        this.$http['queryApplyDetail']({
          appId: data.appId
        }).then((resp) => {
          this.appDetail = {
            ...resp,
            appId: data.appId,
            businessSystemName: data.businessSystemName
          };
          this.detailDialogShow = true;
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '~gui/style/theme/variables';
  .domain-list {
    .domain-filter-condition {
      width: 128px;
      margin-right: 16px;
    }
    .domain-table-content {
      margin-top: $SP-6;
      .domain-table-cell-content {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
</style>
