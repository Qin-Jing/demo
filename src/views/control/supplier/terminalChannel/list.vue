<template>
  <div v-loading="loading">
    <div
      v-show="!isEmpty && !loading"
      class="channel-list clearfix">
      <div class="channel-fiter-content">
        <label>渠道类型：</label>
        <el-select
          v-model="channelType"
          class="channel-filter-condition"
          size="small"
          @change="queryTerminalChannelList">
          <el-option
            v-for="(item, index) in formatChannelList"
            :key="index"
            :label="item.channel"
            :value="item.id" />
        </el-select>
      </div>
      <g-table
        ref="tableContent"
        class="channel-table-content"
        :columns="tableColumns"
        :multiple="false"
        :data="tableData"
        :data-total="total"
        :page-size="pageSize"
        :show-page="false"
        border
        @size-change="pageSizeChange"
        @pagetion-num-change="pageCurrentChange">
        <template
          slot="action"
          slot-scope="scope">
          <a
            href="javascript: void(0)"
            @click="seeDetail(scope.row)">查看详细</a>
        </template>
      </g-table>
    </div>
    <no-info-component
      v-show="isEmpty && !loading"
      :show-btn="false"
      hint="您还没有添加过终端渠道管理哦！" />
    <el-dialog
      title="终端渠道详情"
      class="send-record-manage-detail-dialog"
      width="500px"
      :close-on-click-modal="false"
      :visible.sync="detailDialogShow">
      <el-form
        label-width="150px">
        <el-form-item
          label="终端渠道:">
          {{ channelDetail.channelIdName }}
        </el-form-item>
        <el-form-item
          label="标识码:">
          {{ channelDetail.channelId }}
        </el-form-item>
        <el-form-item
          label="渠道类型:">
          {{ channelDetail.channelName }}
        </el-form-item>
        <el-form-item
          label="创建时间:">
          {{ channelDetail.createTime }}
        </el-form-item>
        <el-form-item
          label="说明:">
          {{ channelDetail.description }}
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
        tableColumns: [
          {
            prop: 'channelIdName',
            label: '终端渠道',
            align: 'center'
          },
          {
            prop: 'channelId',
            label: '标识码',
            align: 'center'
          },
          {
            prop: 'channelName',
            label: '渠道类型',
            align: 'center'
          },
          {
            prop: 'createTime',
            label: '创建时间',
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
        tableData: [{}],
        // 产品
        total: 0,
        pageSize: 10,
        pageNumber: 1,
        loading: false,
        detailDialogShow: false,
        channelDetail: {},
        channelTypeList: [],
        channelType: ''
      }
    },
    computed: {
      isEmpty() {
        // 判断非空要判断筛选值是否为空
        return !this.tableData.length && !this.channelType
      },
      formatChannelList() {
        return [
          {
            channel: '全部',
            id: ''
          },
          ...this.channelTypeList
        ]
      }
    },
    created() {
      const channel = this.$route.query.type;
      if (channel) {
        this.channelType = channel;
      }
      // 获取终端渠道管理列表
      this.queryTerminalChannelList();
      // 获取渠道类型列表
      this.queryChannelTypeList();
    },
    methods: {
      // 获取渠道列表
      queryTerminalChannelList() {
        this.loading = true;
        // 清空列表
        this.tableData = [];
        this.$http.queryTerminalChannelList({
          channel: this.channelType
        })
          .then((resp) => {
            if (!resp) {
              return;
            }
            // this.total = resp.length;
            this.tableData = resp;
          })
          .finally(() => {
            this.loading = false;
          })
      },
      // 获取渠道类型列表
      queryChannelTypeList() {
        this.$http.queryChannelTypeList()
          .then((resp) => {
            if (!resp) {
              return;
            }
            this.channelTypeList = resp.map((item) => {
              return {
                channel: item.channelName,
                id: item.channel,
              }
            });
          })
      },
      // 编辑消息
      seeDetail(data) {
        this.detailDialogShow = true;
        this.channelDetail = data;
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
  .channel-list {
    .channel-fiter-content {
      text-align: right;
    }
    .channel-filter-condition {
      width: 128px;
      margin-right: 16px;
    }
    .channel-table-content {
      margin-top: $SP-6;
      .channel-table-cell-content {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
</style>
