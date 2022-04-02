<template>
  <div class="platform-overview-view">
    <overview-main>
      <template slot="left">
        <div class="message-center-visit-pie-chart-list clearfix">
          <app-visit-pie-chart
            class="message-center-visit-pie-chart"
            title="今日发送量"
            :visit-sum="applyYesterdayVisitSum"
            :data="applyYesterdayVisitData" />
          <app-visit-pie-chart
            class="message-center-visit-pie-chart"
            title="当月发送量" 
            :visit-sum="applyMonthVisitSum"
            :data="applyMonthVisitData" />
        </div>
        <app-visit-chart
          :data="applySendAllQuantity"
          :title="productChartTitle">
          <template
            slot="titleRight"
            class="app-visit-chart-right-filter-btn">
            <el-button-group>
              <el-button
                @click="clickTimeScopeBtn(1, 1)">
                近24小时
              </el-button>
              <el-button
                @click="clickTimeScopeBtn(7, 2)">
                近7天
              </el-button>
              <el-popover
                v-model="timeScopeVisible"
                placement="bottom"
                width="200"
                trigger="click">
                <el-form
                  ref="selectTime"
                  class="app-visit-chart-time-select"
                  label-width="40px"
                  :model="selectTime">
                  <el-form-item
                    label="从"
                    prop="startTime">
                    <el-date-picker
                      v-model="selectTime.startTime"
                      type="date"
                      placeholder="请选择日期"
                      format="yyyy.MM.dd"
                      :picker-options="startTimePickerOptions" />
                  </el-form-item>
                  <el-form-item
                    label="从"
                    prop="endTime">
                    <el-date-picker
                      v-model="selectTime.endTime"
                      type="date"
                      placeholder="请选择日期"
                      format="yyyy.MM.dd"
                      :picker-options="endTimePickerOptions" />
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="hideTimeScopeForm">
                      取消
                    </el-button>
                    <el-button
                      type="primary"
                      :disabled="btnDisabled"
                      @click="clickTimeScopeSubmitBtn">
                      提交
                    </el-button>
                  </el-form-item>
                </el-form>
                <el-button 
                  slot="reference"
                  class="chart-right-time-filter-btn">
                  {{ timeScopeBtnText || '选择日期' }}
                  <i class="iconfont icon-calendar" />
                </el-button>
              </el-popover>
              <el-dropdown @command="timeParticleClick">
                <el-button class="chart-right-time-span-btn">
                  时间颗粒度{{ timeParticle }}
                  <span
                    class="el-icon-arrow-down" />
                </el-button>
                <el-dropdown-menu
                  slot="dropdown"
                  class="chart-right-time-span-btn-drop">
                  <el-dropdown-item command="hour">
                    1小时
                  </el-dropdown-item>
                  <el-dropdown-item command="day">
                    1天
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button-group>
          </template>
        </app-visit-chart>
      </template>
      <template slot="right">
        <app-use-top
          :title="appUseTopTitle"
          :app-use-top-list="appUseTopList" />
        <app-use-top
          :title="appUseTopTitle"
          :app-use-top-list="appUseTopList" />
        <app-notification
          :notification-list="notificationList"
          :upgrade-notification-list="upgradeNotificationList" />
      </template>
    </overview-main>
  </div>
</template>

<script>
  import OverviewMain from '@/common/component/overviewComponent/overviewMain';
  import AppUseTop from '@/common/component/overviewComponent/appUseTopView';
  import AppVisitPieChart from '@/common/component/overviewComponent/appVisitPieChartView';
  import AppVisitChart from '@/common/component/overviewComponent/appVisitChartView';
  import AppNotification from '@/common/component/overviewComponent/appNotificatinoView';
  import { USER_ROLE_TYPE } from '@/common/constant';
  import moment from 'moment';

  export default {
    components: {
      OverviewMain,
      AppUseTop,
      AppVisitChart,
      AppNotification,
      AppVisitPieChart
    },
    data() {
      const self = this;
      return {
        userProductList: [],
        appServiceList: [],
        appUseTopList: [],
        userActiveInfo: [],
        notificationList: [],
        upgradeNotificationList: [],
        productUseChartData: {},
        productUseStartTime: '',
        productUseEndTime: '',
        productUseTimeType: 'hour',
        // 时间范围起止文本
        selectTime: {
          startTime: moment('2019-08-21').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment('2019-08-21').subtract(2).format('YYYY-MM-DD HH:mm:ss')
        },
        // 时间颗粒度按钮文本
        timeParticle: '：1小时',
        // 时间颗粒度下拉框
        timeScopeVisible: false,
        // 时间范围按钮文本
        timeScopeBtnText: '',
        // 获取产品调用量统计图表开始时间
        startTimePickerOptions: {
          disabledDate(time) {
            if (self.selectTime.endTime) {
              return time.getTime() > self.selectTime.endTime.getTime();
            }
            return time.getTime() > Date.now();
          }
        },
        // 获取产品调用量统计图表结束时间
        endTimePickerOptions: {
          disabledDate(time) {
            if (self.selectTime.startTime) {
              return time.getTime() < self.selectTime.startTime.getTime();
            }
            return time.getTime() > Date.now();
          }
        },
        // 角色类型代码常量
        USER_ROLE_TYPE,
        queryDynamicTimer: null,
        // productChartTitle: '产品的服务调用量'
        activeName: 'first',
        userApplyList: '',
        selectAppId: '',
        // 新参数
        applyQuantityNum: '',
        applyYesterdayVisitSum: '',
        applyMonthVisitSum: '',
        applyYesterdayVisitData: [],
        applyMonthVisitData: [],
        applySendAllQuantity: {},
        applyUseInfo: {}
      }
    },
    computed: {
      btnDisabled() {
        const startTime = this.selectTime.startTime;
        const endTime = this.selectTime.endTime;
        return !!(startTime && !endTime || !startTime && endTime)
      },
      productChartTitle() {
        return '产品服务调用统计'
      },
      productServiveNumTitle() {
        return '今日产品服务能力（次）'
      },
      appUseTopTitle() {
        return '今日应用TOP5（次）'
      }
    },
    created() {
      // 获取累计发送量统计
      this.queryApplyQuantity();
      // 获取昨日发送量统计
      this.queryYesterdayQuantity();
      // 获取当月发送量统计
      this.queryMonthQuantity();
      // 获取昨日各应用的发送量统计
      this.queryYesterdayQuantityGruopAppid();
      // 获取当月各应用的发送量统计
      this.queryMonthQuantityGruopAppid();
      // 获取产品服务调用量
      this.querySendNumberByTime();
      // 获取用户和应用的数量
      this.queryUserAndAppNum();
      // this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
      // // 查询当日累计服务调用TOP5（次）
      // if (!this.isProductUser) {
      //   this.queryOverviewAppInfo();
      // } else {
      //   // 获取用户应用列表
      //   this.queryUserApplyList();
      // }
      // // 查询日累计服务次数
      // this.queryOverviewProductInfo();
      // // 获取产品调用量统计
      // this.queryProductUseNum();
      // // 获取产品通知公告
      // this.queryAllNotification();
      // // 获取通知公告类型
      // this.queryUpgradeNotification();
      // // 获取用户动态(非供应商)
      // if (!this.isProductSupplier && !this.isProductUser) {
      //   this.queryUserActive();
      // }
      // // 获取用户可查看的产品
      // this.queryProductListByUserRole();
    },
    methods: {
      // 获取发送统计总量
      queryApplyQuantity() {
        this.$http['queryApplyQuantity']()
          .then((resp) => {
            if (!resp) {
              return;
            }
            this.applyQuantityNum = resp;
          })
      },
      // 获取昨日发送量统计
      queryYesterdayQuantity() {
        this.$http['queryYesterdayQuantity']()
          .then((resp) => {
            if (!resp) {
              return;
            }
            this.applyYesterdayVisitSum = resp;
          })
      },
      // 获取当月发送量统计
      queryMonthQuantity() {
        this.$http['queryMonthQuantity']()
          .then((resp) => {
            if (!resp) {
              return;
            }
            this.applyMonthVisitSum = resp;
          })
      },
      // 获取昨日各应用访问量
      queryYesterdayQuantityGruopAppid() {
        this.$http['queryYesterdayQuantityGruopAppid']()
          .then((resp) => {
            if (!resp) {
              return;
            }
            this.applyYesterdayVisitData = resp;
            this.appUseTopList = resp.map((item, index) => {
              if (index < 4) {
                return {
                  zdycs: item.name,
                  appName: item.quantity
                }
              }
            })
          })
      },
      // 获取当月各应用访问量
      queryMonthQuantityGruopAppid() {
        this.$http['queryMonthQuantityGruopAppid']()
          .then((resp) => {
            if (!resp) {
              return;
            }
            this.applyMonthVisitData = resp;
          })
      },
      querySendNumberByTime() {
        this.$http['querySendNumberByTime']({
          kssj: this.selectTime.startTime,
          jssj: this.selectTime.endTime,
          timeType: this.productUseTimeType
        })
          .then((resp) => {
            if (!resp) {
              return;
            }
            this.applySendAllQuantity = resp;
          })
      },
      queryUserAndAppNum() {
        this.$http['queryUserAndAppNum']()
          .then((resp) => {
            if (!resp) {
              return;
            }
            this.applyUseInfo = resp;
          })
      },
      // 获取产品通知公告
      queryAllNotification() {
        this.queryNotifyList().then((res) => {
          this.notificationList = res;
        })
      },
      queryNotifyList(type = '') {
        return new Promise((resolve, reject) => {
          this.$http['queryOverviewNotification']({
            cpggType: type,
          }).then((resp) => {
            if (!resp) {
              reject();
            }
            resolve(resp);
          })
        })
      },
      queryUpgradeNotification() {
        // 先获取通知公告类型
        this.queryNotifyList(0).then((res) => {
          this.upgradeNotificationList = res;
        })
      },
      // 修改起止时间
      selectProductUseStatisticsTime(start, end) {
        this.productUseStartTime = start || '';
        this.productUseEndTime = end || '';
        this.querySendNumberByTime();
      },
      // 修改时间颗粒度
      selectProductUseStatisticsTimeType(type) {
        this.productUseTimeType = type;
        this.querySendNumberByTime();
      },
      // 时间颗粒度选择
      timeParticleClick(value) {
        this.timeParticle = `：${value === 'hour' ? '1小时' : '1天'}`;
        this.selectProductUseStatisticsTimeType(value);
      },
      // 时间范围选择
      clickTimeScopeSubmitBtn() {
        const timeObj = this.selectTime;
        this.hideTimeScopeForm();
        if (!timeObj.startTime || !timeObj.endTime) {
          this.timeScopeBtnText = '';
          this.selectProductUseStatisticsTime();
          return;
        }
        this.timeScopeBtnText = `${moment(timeObj.startTime).format('YYYYMMDD')}-${moment(timeObj.endTime).format('YYYYMMDD')}`;
        this.selectProductUseStatisticsTime(this.timeFormat(timeObj.startTime), this.timeFormat(timeObj.endTime));
      },
      // 隐藏时间范围
      hideTimeScopeForm() {
        this.timeScopeVisible = false
      },
      clickTimeScopeBtn(time, type = 1) {
        this.timeParticle = `：${type === 1 ? '1小时' : '1天'}`;
        this.productUseTimeType = type === 1 ? 'hour' : 'day';
        const nowTime = moment();
        const earlierTime = moment().subtract(time, 'days');
        this.selectProductUseStatisticsTime(this.timeFormat(earlierTime), this.timeFormat(nowTime));
      },
      timeFormat(time) {
        return moment(time).format('YYYY-MM-DD HH:mm:ss');
      },
      // 获取用户应用列表
      queryUserApplyList() {
        this.loading = true;
        this.$http['queryUserApplyList']({
          pageSize: 100000,
        }).then((resp) => {
          if (!resp) {
            return;
          }
          this.userApplyList = resp.data;
          this.activeName = this.userApplyList[0] ? this.userApplyList[0].appId : '';
          this.selectAppId = this.activeName;
          this.querySendNumberByTime();
        }).finally(() => {
          this.loading = false;
        })
      },
      handleProductClick(apply) {
        this.selectAppId = apply.name;
        this.querySendNumberByTime();
      }
    }
  }
</script>

<style lang="scss">
  .platform-overview-view {
    background-color: transparent !important;
    // .platform-overview-view-content {
    //   margin-top: 20px;
    //   .platform-overview-view-content-left {
    //     float: left;
    //     width: 67%;
    //     min-width: 705px;
    //   }
    //   .platform-overview-view-content-right {
    //     box-sizing: border-box;
    //     margin-left: 67%;
    //     padding-left: 12px;
    //     width: 33%;
    //     min-width: 347px;
    //   }
    // }
    .user-right-product-select-btn {
      max-width: 450px;
      .el-tabs__header {
        border: none;
        margin-bottom: 0px;
        .el-tabs__item {
          padding-bottom: 12px;
        }
      }
      .el-tabs__content {
        height: 0;
      }
    }
    .chart-right-time-filter-btn {
      border-radius: 0;
      i {
        font-size: 14px;
      }
    }
    .message-center-visit-pie-chart-list {
      .message-center-visit-pie-chart {
        float: left;
        width: calc(50% - 6px);
        background-color: #fff;
        & + div {
          margin-left: 12px;
        }
      }
    }
    .chart-right-time-span-btn {
      width: 172px;
      border-left: 1px solid #c4c6cc !important;
      margin-left: -1px;
    }
    .overview-component-app-visit-chart {
      margin-top: 12px;
    }
    .overview-component-app-notification {
      margin-top: 12px;
    }
    .app-visit-chart-title-right-menu, .app-visit-chart-content {
      .el-button {
        vertical-align: top;
        &:focus, &:hover {
          border-color: #428DF5;
          background-color: #fff;
          color: #428DF5;
        }
      }
      .el-button-group {
        padding-top: 9px;
        .el-button:not(:first-child):not(:last-child) {
          border-radius: 0px;
        }
        .el-button {
          float: initial;
        }
      }
      .el-dropdown {
        top: -1px;
        height: 34px;
        border-left: 1px; 
        .el-button  {
          height: 34px;
        }
      }
    }
  }
  .app-visit-chart-time-select {
    .el-date-editor {
      width: 100% !important;
    }
  }
  .chart-right-time-span-btn-drop {
    width: 172px;
  }
</style>
