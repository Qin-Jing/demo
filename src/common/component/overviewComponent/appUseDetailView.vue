<template>
  <div class="overview-component-app-user-detail">
    <main-title-nav
      title="消息中心使用概览">
      <span
        slot="right"
        class="app-user-detail-title-right">
        <span
          class="app-user-detail-toggle-btn"
          @click="clickTogglePrevBtn">
          <i class="iconfont icon-left" />
        </span>
        <span
          class="app-user-detail-toggle-btn"
          @click="clickToggleNextBtn">
          <i class="iconfont icon-enter" />
        </span>
      </span>
    </main-title-nav>
    <div
      ref="useDetailView"
      class="app-use-detail-content">
      <div
        class="app-use-detail-list"
        :style="{
          width: `${appDetailListWidth}px`,
          left: `${appDetailListPosition}px`
        }">
        <div
          v-for="(appUserDetail, index) in appUserDetailList"
          :id="`appUseDetail${index}`"
          :key="index"
          class="app-use-detail-item"
          height="300"
          :style="{ width: `${contentWidth}px` }" />
      </div>
    </div>
  </div>
</template>

<script>
  import MainTitleNav from '@/common/component/mainTitleNav';
  import echarts from 'echarts'
  export default {
    components: {
      MainTitleNav
    },
    data() {
      return {
        appUserDetailList: [
          {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              x: 'left',
              data: ['账户中心', '三方支付', '消息中心', '短信平台']
            },
            series: [
              {
                name: '访问来源',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: true,
                    position: 'inner'
                  },
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: '30',
                      fontWeight: 'bold'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [
                  {value: 335, name: '账户中心'},
                  {value: 310, name: '三方支付'},
                  {value: 234, name: '消息中心'},
                  {value: 1548, name: '短信平台'}
                ]
              }
            ]
          },
          {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              x: 'left',
              data: ['账户中心', '三方支付', '消息中心', '短信平台']
            },
            series: [
              {
                name: '访问来源',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: true,
                    position: 'inner'
                  },
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: '30',
                      fontWeight: 'bold'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [
                  {value: 335, name: '账户中心'},
                  {value: 310, name: '三方支付'},
                  {value: 234, name: '消息中心'},
                  {value: 1548, name: '短信平台'}
                ]
              }
            ]
          },
        ],
        appDetailListWidth: 0,
        contentWidth: 0,
        appDetailListPosition: 0
      }
    },
    watch: {
      contentWidth(val) {
        const length = this.appUserDetailList.length;
        this.appDetailListWidth = val * length;
      }
    },
    mounted() {
      this.contentWidth = this.$refs['useDetailView'].clientWidth;
      // 绘制图表
      this.$nextTick(() => {
        this.drawCharts();
      })
    },
    methods: {
      drawCharts() {
        // 基于准备好的dom，初始化echarts实例
        this.appUserDetailList.forEach((detail, index) => {
          const myChart = echarts.init(document.getElementById(`appUseDetail${index}`));
          // 绘制图表
          myChart.setOption(detail)
        })
      },
      clickTogglePrevBtn() {
        this.moveDetailList(this.contentWidth);
      },
      clickToggleNextBtn() {
        this.moveDetailList(-this.contentWidth);
      },
      moveDetailList(num) {
        const maxLeft = -this.appDetailListWidth + this.contentWidth;
        let left = this.appDetailListPosition;
        left += num;
        if (left < maxLeft) {
          left = maxLeft
        }
        if (left > 0) {
          left = 0;
        }
        this.appDetailListPosition = left;
      }
    }
  }
</script>

<style lang="scss">
  .overview-component-app-user-detail {
    background-color: #fff; 
    .app-user-detail-title-right {
      float: right;
      .app-user-detail-toggle-btn {
        display: inline-block;
        width: 28px;
        height: 28px;
        border: 1px solid #c4c6cc;
        border-radius: 3px;
        font-size: 12px;
        text-align: center;
        line-height: 28px;
        color: #c4c6cc;
        cursor: pointer;
        + span {
          margin-left: 12px;
        }
      }
    }
    .app-use-detail-content {
      height: 360px;
      overflow: hidden;
      .app-use-detail-list {
        position: relative;
        height: 300px;
        transition: left 1s;
      }
      .app-use-detail-item {
        display: inline-block;
        height: 300px;
      }
    }
  }
</style>
