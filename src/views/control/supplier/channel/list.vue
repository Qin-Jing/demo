<template>
  <div v-loading="loading">
    <div
      v-show="!isEmpty && !loading"
      class="channel-list">
      <!-- <el-button
        type="primary"
        @click="addRecord">
        新增
      </el-button> -->
      <g-table
        ref="tableContent"
        class="channel-table-content"
        :config="tableConfig"
        :columns="tableColumns"
        :multiple="false"
        :data="recordData"
        :data-total="total"
        :page-size="pageSize"
        :show-page="false"
        border
        @selection-change="getSelectRecord"
        @size-change="pageSizeChange"
        @pagetion-num-change="pageCurrentChange">
        <template
          slot="nr"
          slot-scope="scope">
          <!-- <p class="channel-table-cell-content">
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
              class="channel-table-cell-content">
              {{ scope.row.nr }}
            </p>
          </el-popover>
        </template>
        <template
          slot="action"
          slot-scope="scope">
          <a
            href="javascript: void(0)"
            @click="editRecord(scope.row)">修改</a>
          <a
            href="javascript: void(0)"
            @click="confirmDeleteRecord(scope.row)">删除</a>
        </template>
      </g-table>
    </div>
    <no-info-component
      v-show="isEmpty && !loading"
      hint="您还没有添加过渠道哦！"
      @btn-click="addRecord" />
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
            prop: 'configChannelXh',
            label: '记录序号',
            align: 'center'
          },
          {
            prop: 'appid',
            label: '应用ID',
            align: 'center'
          },
          {
            prop: 'channelName',
            label: '渠道类型',
            align: 'center'
          },
          {
            prop: 'channelId',
            label: '终端渠道ID',
            align: 'center'
          },
          // {
          //   prop: 'action',
          //   label: '操作',
          //   soltNmae: 'action',
          //   align: 'center',
          //   width: '150'
          // }
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
        this.$http.queryMsgChannelList()
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
      // 添加消息
      addRecord() {
        this.$router.push({
          path: 'channel/formcontent',
        })
      },
      // 编辑消息
      editRecord(item) {
        this.$router.push({
          path: 'channel/formcontent',
          query: {
            configChannelXh: item.configChannelXh
          }
        })
      },
      // 删除消息
      confirmDeleteRecord(item) {
        // 初始化确认文本和选中数据
        const confirmTxt = '删除后，该条渠道将从系统中消失，且无法恢复。您是否确定删除？';
        this.$confirm(confirmTxt)
          .then(() => {
            // 删除消息
            this.deleteRecord(item);
          })
      },
      // 删除消息公告
      deleteRecord(item) {
        this.$http.deleteMsgChannelInfo(
          {
            configChannelXh: item.configChannelXh
          }
        ).then(() => {
          this.$message.success('删除成功');
          this.queryMsgList();
        })
      },
      // 获取当前选中的消息公告列表
      getSelectRecord(selection) {
        this.recordSelect = selection;
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
