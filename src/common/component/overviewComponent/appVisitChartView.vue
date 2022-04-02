<template>
  <div class="overview-component-app-visit-chart">
    <main-title-nav
      :title="title">
      <span
        slot="right" 
        class="app-visit-chart-title-right-menu">
        <slot name="titleRight" />
      </span>
    </main-title-nav>
    <div class="app-visit-chart-content">
      <div class="app-visit-chart-content-top-menu">
        <slot name="menu" />
      </div>
      <div
        id="appVisitCharts"
        class="app-visit-charts" />
    </div>
  </div>
</template>

<script>
  import MainTitleNav from '@/common/component/mainTitleNav';
  import echarts from 'echarts';
  import { ECHARTS_LINE_OPTION, ECHARTS_LINE_AREA_COLOR_LIST } from '@/common/constant'

  export default {
    components: {
      MainTitleNav
    },
    props: {
      data: {
        type: Object,
        default: () => {
          return {}
        }
      },
      title: {
        type: String,
        default: '终端渠道发送量'
      }
    },
    data() {
      return {
        chart: null,
        option: ECHARTS_LINE_OPTION,
      }
    },
    computed: {
      btnDisabled() {
        return !this.selectTime.startTime || !this.selectTime.endTime
      }
    },
    watch: {
      data() {
        // 格式化数据
        this.formatOption();
        this.drawCharts();
      }
    },
    mounted(){
      // 格式化数据
      this.formatOption();
      // 绘制图表
      this.drawCharts();
      window.addEventListener('resize', this.drawCharts, false);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.drawCharts, false);
    },
    methods: {
      formatOption() {
        this.option.legend.data = this.data.name || [];
        this.option.xAxis.data = this.data.xdata ? this.data.xdata.data : [];
        this.option.series = this.data.ydata ? this.data.ydata.data.map((data, index) => {
          return {
            name: this.data.name[index],
            type: 'line',
            stack: '总量',
            areaStyle: {
              color: ECHARTS_LINE_AREA_COLOR_LIST[index]
            },
            lineStyle: {
              width: 1
            },
            data
          }
        }) : [];
      },
      drawCharts() {
        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(document.getElementById('appVisitCharts'));
        // 绘制图表
        this.chart.setOption(this.option);
      },
    }
  }
</script>

<style lang="scss">
  .overview-component-app-visit-chart {
    background-color: #fff;
    .app-visit-chart-content {
      padding: 20px;
    }
    .app-visit-charts {
      height: 300px;
    }
    .app-visit-chart-title-right-menu {
      float: right;
    }
    .app-visit-chart-content-top-menu {
      margin-bottom: 20px;
    }
  }
</style>
