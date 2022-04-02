<template>
  <div v-loading="loading">
    <div
      v-show="!isEmpty && !loading"
      class="channel-list">
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
            @click="goToChannelManage(scope.row)">查看终端渠道</a>
        </template>
      </g-table>
    </div>
    <no-info-component
      v-show="isEmpty && !loading"
      :show-btn="false"
      hint="您还没有添加过渠道类型哦！" />
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
            prop: 'channelName',
            label: '渠道类型',
            align: 'center'
          },
          {
            prop: 'description',
            label: '描述',
            align: 'center'
          },
          {
            prop: 'channelIdNamesStr',
            label: '包含的终端渠道',
            align: 'center'
          },
          // {
          //   prop: 'channelId',
          //   label: '终端渠道ID',
          //   align: 'center'
          // },
          {
            prop: 'createTime',
            label: '创建日期',
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
        tableData: [],
        // 产品
        total: 0,
        pageSize: 10,
        pageNumber: 1,
        loading: false
      }
    },
    computed: {
      isEmpty() {
        // 判断非空要判断筛选值是否为空
        return !this.tableData.length
      }
    },
    created() {
      // 获取渠道类型列表
      this.queryChannelTypeList();
    },
    methods: {
      // 获取渠道类型列表
      queryChannelTypeList() {
        this.$http.queryChannelTypeList()
          .then((resp) => {
            if (!resp) {
              return;
            }
            this.tableData = resp.map((item) => {
              item.channelIdNamesStr = item.channelIdNames.join(',');
              return item;
            });
          })
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
      },
      goToChannelManage(data) {
        this.$router.push({
          path: '/control/supplier/terminalChannel',
          query: {
            type: data.channel
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '~gui/style/theme/variables';
  .channel-list {
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
