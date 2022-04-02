<template>
  <div
    class="business-request-detail">
    <div class="business-request-detail-info">
      <p>批次号: {{ sendRecordInfo.requestId }}</p>
      <p>业务域: {{ sendRecordInfo.appName }}</p>
      <p>模板名称: {{ $route.query.templateName }}</p>
      <p>创建时间: {{ sendRecordInfo.creatTime }}</p>
      <p>状态: {{ sendRecordInfo.msgStatus }}</p>
      <p>结果: {{ sendRecordInfo.result }}</p>
      <p>开始时间: {{ sendRecordInfo.kssj }}</p>
      <p>结束时间: {{ sendRecordInfo.jssj }}</p>
      <p>接收者类型: {{ sendRecordInfo.userChannelIdType }}</p>
    </div>
    <div class="business-request-detail-error-list">
      <div
        v-for="(channel, index) in channelList"
        :key="index">
        <main-title-nav
          :title="getChannelTitle(channel)" />
        <g-table
          ref="tableContent"
          class="business-statistics-content"
          :columns="tableColumns"
          :data="channel.messageDetailDTOList"
          :data-total="channel.failedQuantity"
          :multiple="false"
          :page-sizes="[10]"
          border
          @pagetion-num-change="(num) => pageCurrentChange(num, channel)">
          <template
            slot="action"
            slot-scope="scope">
            <a
              href="javascript: void(0)"
              :class="{ 'action-btn-disable': scope.row.retrySurplusTime || hasSendAgain }"
              @click="!scope.row.retrySurplusTime && !hasSendAgain && clickRetryBtn(scope.row, 60, channel)">
              {{ scope.row.retrySurplusTime ? `${scope.row.retrySurplusTime}s` : '手动重发' }}</a>
          </template>
        </g-table>
      </div>
    </div>
  </div>
</template>

<script>
  import GTable from '@/common/component/GTable';
  import MainTitleNav from '@/common/component/mainTitleNav';
  export default {
    components: {
      GTable,
      MainTitleNav
    },
    props: {
    },
    data() {
      return {
        sendRecordInfo: {
          pch: 'R0001',
          ywy: '电税域',
          mbmc: '12W申报',
          swjgmc: '四川税务局',
          cjrq: '2019-06-29 10:00:00',
          zt: '已发送',
          jg: '待发送',
          kssj: '2019-06-29 10:00:00',
          jssj: '2019-06-29 11:00:00',
          jszlx: '社会信用代码'
        },
        tableColumns: [
          {
            prop: 'userIdentifier',
            label: '接收号码',
            align: 'center'
          },
          {
            prop: 'sendTime',
            label: '发送时间',
            align: 'center'
          },
          {
            prop: 'msgStatus',
            label: '状态',
            align: 'center'
          },
          {
            prop: 'retransmit',
            label: '重试次数',
            align: 'center',
          },
          {
            prop: 'action',
            label: '操作',
            soltNmae: 'action',
            align: 'center',
            width: '100'
          }
        ],
        NSRWebDatas: [
          {
            receivePhone: '330273XXXXXXXXXXXX',
            sendTime: '2019.07.01 10:00:00',
            state: '失败',
            retryNumber: '2',
            retrySurplusTime: 0
          }
        ],
        NSRAppDatas: [
          {
            receivePhone: '330273XXXXXXXXXXXX',
            sendTime: '2019.07.01 10:00:00',
            state: '失败',
            retryNumber: '2',
            retrySurplusTime: 0
          }
        ],
        SMSDatas: [
          {
            receivePhone: '330273XXXXXXXXXXXX',
            sendTime: '2019.07.01 10:00:00',
            state: '失败',
            retryNumber: '2',
            retrySurplusTime: 0
          }
        ],
        channelList: [{}],
        hasSendAgain: false
      }
    },
    computed: {

    },
    created() {
      // 获取记录详情
      this.queryRecordDetail();
    },
    methods: {
      queryRecordDetail() {
        this.$http['queryMessageRecordDetail']({
          recordId: this.$route.query.recordId
        }).then((resp) => {
          if (!resp) {
            return;
          }
          this.sendRecordInfo = resp;
          const channelList = resp.channelRecordDetailDTOList || []
          this.channelList = channelList.map((channel) => {
            const messageList = channel.messageDetailDTOList || [];
            if (messageList) {
              channel.messageDetailDTOList = messageList.map((message) => {
                return {
                  ...message,
                  retrySurplusTime: 0,
                  isSuccess: false
                }
              })
            }
            return {
              ...channel,
              pageNum: 1
            };
          });
        })
      },
      // 重新发送60s倒计时，time定义用于区分初始化倒计时
      clickRetryBtn(row, time = 0, channel) {
        this.hasSendAgain = true;
        this.$http['sendAgainMessage']({
          recordId: this.$route.query.recordId,
          pushId: row.pushId
        }).then(() => {
          row.isSuccess = true;
          // 重新获取数据，当前页刷新 channel.pageNum
          this.$message.success('重新发送成功');
          this.pageCurrentChange(channel.pageNum, channel);
        })
        this.countDownTime(row, time);
      },
      // 倒计时
      countDownTime(row, time) {
        let surplusTime = row.retrySurplusTime || time;
        // 发送成功标志
        if (row.isSuccess) {
          surplusTime = 0
        }
        let timer = null;
        // 倒计时为0  直接清空计时器
        // if (!surplusTime && timer) {
        //   clearTimeout(timer);
        //   return;
        // }
        timer = setTimeout(() => {
          if (surplusTime > 0) {
            row.retrySurplusTime = --surplusTime;
            this.countDownTime(row);
            return;
          }
          clearTimeout(timer);
          this.hasSendAgain = false;
        }, 1000);
      },
      getChannelTitle(data) {
        const count = data.successQuantity + data.failedQuantity;
        return `${data.messageChannel}(共${count}条数据，${data.failedQuantity}条失败)`
      },
      // 某渠道下失败数据表格page修改
      pageCurrentChange(num, data) {
        // 保存当前页数，用于发送后重新获取数据
        this.hasSendAgain = false;
        data.pageNum = num;
        this.$http['queryMessageRecordChannelList']({
          recordId: this.$route.query.recordId,
          pageNum: num,
          pageSize: 10,
          channelId: data.messageChannel
        }).then((resp) => {
          if (!resp) {
            return;
          }
          data.messageDetailDTOList = null;
          // 渠道更新表格
          data.messageDetailDTOList = resp.map((data) => {
            return {
              ...data,
              retrySurplusTime: 0,
              isSuccess: false
            }
          });
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '~gui/style/theme/variables';

  .business-request-detail {
    .business-request-detail-info {
      float: left;
      width: 260px;
      border: 1px solid #ccc;
      padding: 20px;
      p {
        line-height: 30px;
        word-break: break-all;
      }
    }
    .business-request-detail-error-list {
      margin-left: 320px;
      .action-btn-disable {
        color: #999;
        cursor: pointer;
      }
    }
  }
</style>