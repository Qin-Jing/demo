<template>
  <div
    v-loading="loading"
    class="send-message-record-detail clearfix">
    <div class="send-message-record-detail-info">
      <el-form 
        :model="sendRecordInfo"
        size="mini"
        label-width="100px">
        <el-form-item label="批次号:">
          {{ sendRecordInfo.batchNumber }}
        </el-form-item>
        <el-form-item label="业务域:">
          {{ sendRecordInfo.appName }}
        </el-form-item>
        <el-form-item label="模板名称:">
          {{ $route.query.templateName }}
        </el-form-item>
        <el-form-item label="创建时间:">
          {{ sendRecordInfo.creatTime }}
        </el-form-item>
        <el-form-item label="状态:">
          {{ sendRecordInfo.msgStatus }}
        </el-form-item>
        <el-form-item label="结果:">
          <span :class="result === '全部成功'?'success':'error'">{{ result }}</span>
        </el-form-item>
        <el-form-item label="开始时间:">
          {{ sendRecordInfo.kssj }}
        </el-form-item>
        <el-form-item label="结束时间:">
          {{ sendRecordInfo.jssj }}
        </el-form-item>
      </el-form>
      <!-- <p>批次号: {{ sendRecordInfo.batchNumber }}</p>
      <p>业务域: {{ sendRecordInfo.appName }}</p>
      <p>模板名称: {{ $route.query.templateName }}</p>
      <p>创建时间: {{ sendRecordInfo.creatTime }}</p>
      <p>状态: {{ sendRecordInfo.msgStatus }}</p>
      <p>结果: <span :class="result === '全部成功'?'success':'error'">{{ result }}</span></p>
      <p>开始时间: {{ sendRecordInfo.kssj }}</p>
      <p>结束时间: {{ sendRecordInfo.jssj }}</p>
      <p>接收者类型: {{ sendRecordInfo.userChannelIdTypeName }}({{ sendRecordInfo.userChannelIdType }})</p> -->
    </div>
    <div class="send-message-record-detail-error-list">
      <div
        v-for="(channel, index) in channelList"
        :key="index">
        <div
          class="table-title"
          v-html="getChannelTitle(channel)" />
        <g-table
          ref="tableContent"
          class="business-statistics-content"
          :columns="tableColumns"
          :data="channel.messageDetailDTOList"
          :data-total="channel.failedQuantity"
          :multiple="false"
          :show-page="!!channel.failedQuantity"
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
  // import MainTitleNav from '@/common/component/mainTitleNav';
  export default {
    components: {
      GTable,
      // MainTitleNav
    },
    props: {
    },
    data() {
      return {
        loading: true,
        sendRecordInfo: {},
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
        channelList: [],
        hasSendAgain: false
      }
    },
    computed: {
      result(){
        let total = 0;
        let failCount = 0;
        this.channelList.forEach(item => {
          total =  total + item.successQuantity + item.failedQuantity;
          failCount += item.failedQuantity;
        });
        if(failCount / total === 1) {
          return '全部失败';
        } else if(failCount === 0) {
          return '全部成功';
        } else {
          return '部分失败';
        }
      }
    },
    created() {
      // 获取记录详情
      this.queryRecordDetail();
    },
    methods: {
      queryRecordDetail() {
        this.loading = true;
        this.$http['queryMessageRecordDetail']({
          recordId: this.$route.query.recordId
        }).then((resp) => {
          if (!resp) {
            return;
          }
          this.sendRecordInfo = Object.assign({}, resp);
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
        }).finally(() => {
          this.loading = false;
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
        var str = `${data.messageChannel}(共<span class="primary">${count}</span>条数据`;
        if(data.successQuantity) {
          str += `，<span class="success">${data.successQuantity}</span>条成功)`;
        }
        if(data.failedQuantity) {
          str += `，<span class="error">${data.failedQuantity}</span>条失败)`;
        }
        return str;
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

  .send-message-record-detail {
    .send-message-record-detail-info {
      float: left;
      width: 260px;
      border: 1px solid #ccc;
      padding: 20px 10px;
      p {
        line-height: 30px;
        word-break: break-all;
      }

      .el-form > .el-form-item {
        margin-bottom: 0px;
      }
    }
    .send-message-record-detail-error-list {
      margin-left: 320px;
      .action-btn-disable {
        color: #999;
        cursor: pointer;
      }
    }
    .primary {
      color: #409eff;
    }
    .success {
      color: #67c23a;
    }
    .error{
      color: #f56c6c;
    }
  }
  .table-title {
    display: inline-block;
    position: relative;
    padding-left: 16px;
    height: 50px;
    line-height: 50px;
    white-space: nowrap;
    border-bottom: 1px solid #E3E4E8;
    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 0px;
      top: 18px;
      width: 4px;
      height: 16px;
      border-radius: 2px;
      background-color: #428df5;
    }
  }
</style>