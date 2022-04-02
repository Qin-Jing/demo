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
        :show-page="false"
        border
        @size-change="pageSizeChange"
        @pagetion-num-change="pageCurrentChange">
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
            @click="bondChannel(scope.row)">关联终端渠道</a>
        </template>
      </g-table>
    </div>
    <no-info-component
      v-show="isEmpty && !loading"
      hint="您还没有添加过业务域哦！"
      :show-btn="false" />
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
        // 表格的列配置参数
        tableConfig: {
          pagination: true,
          multiple: false,
          border: true
        },
        tableColumns: [
          {
            prop: 'businessSystemName',
            label: '业务域',
            align: 'center'
          },
          {
            prop: 'channelIds',
            label: '包含的终端渠道',
            align: 'center',
            soltNmae: 'channelIds',
          },
          {
            prop: 'desc',
            label: '描述',
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
        recordData: [],
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
        return !this.recordData.length
      }
    },
    created() {
      // 获取消息列表
      this.queryMsgList();
    },
    methods: {
      // 获取渠道列表
      queryMsgList() {
        this.loading = true;
        // 清空列表
        this.recordData = [];
        this.$http['queryBusinessDomain']()
          .then((resp) => {
            if (!resp) {
              return;
            }
            this.total = resp.length;
            this.recordData = resp.map((item) => {
              // 参数格式化
              item.creatTime = moment(item.xgrq).format('YYYY-MM-DD');
              return item;
            });
          })
          .finally(() => {
            this.loading = false;
          })
      },
      // 编辑消息
      bondChannel(item) {
        this.$router.push({
          path: 'businessDomain/config',
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
