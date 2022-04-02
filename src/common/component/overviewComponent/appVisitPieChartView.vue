<template>
  <div class="app-visit-pie-chart-view">
    <main-title-nav
      :title="title">
      <template slot="right">
        <div class="pie-chart-view-title-right">
          {{ visitSum }}
        </div>
      </template>
    </main-title-nav>
    <div class="app-visit-pie-chart-content">
      <div
        :id="id"
        class="app-visit-pie-charts" />
      <div class="app-visit-info-table">
        <div class="app-visit-info-theader">
          <span class="table-item app-visit-info-name">名称</span>
          <span class="table-item app-visit-info-num">总量</span>
          <span class="table-item app-visit-info-rate">占比</span>
        </div>
        <div class="app-visit-info-tbody">
          <p
            v-for="(app, index) in data"
            :key="index"
            class="app-visit-info-tbody-part">
            <span class="table-item app-visit-info-name">
              <span class="table-legend" />{{ app.name }}
            </span>
            <span class="table-item app-visit-info-num">
              {{ app.quantity }}
            </span>
            <span class="table-item app-visit-info-rate">
              {{ queryAppVisitRate(app.quantity) }}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import MainTitleNav from '@/common/component/mainTitleNav';
  import echarts from 'echarts';

  export default {
    components: {
      MainTitleNav
    },
    props: {
      title: {
        type: String,
        default: '今日发送量'
      },
      visitSum: {
        type: [String, Number],
        default: '0'
      },
      data: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        chart: null,
        id: `appVisitPieCharts${Math.random()}`
      }
    },
    computed: {
      dataSum() {
        let sum = 0;
        this.data.forEach((item) => {
          sum += Number(item.quantity);
        })
        return sum;
      }
    },
    watch: {
      data() {
        this.drawCharts();
      }
    },
    created() {
      
    },
    mounted(){
      // 绘制图表
      this.drawCharts();
      window.addEventListener('resize', this.drawCharts, false);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.drawCharts, false);
    },
    methods: {
      drawCharts() {
        //基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(document.getElementById(this.id));
        // 绘制图表
        this.chart.setOption( {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            // orient: 'vertical',
            x: 'left',
            data: this.data.map((item) => {
              return item.name
            }),
            // ['账户中心', '三方支付', '消息中心', '短信平台'],
            show: false
            // formatter: 'Legend {name}'
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['50%', '70%'],
              // avoidLabelOverlap: false,
              label: {
                normal: {
                  show: true,
                  // position: 'inner'
                },
                // emphasis: {
                //   show: true,
                //   textStyle: {
                //     fontSize: '30',
                //     fontWeight: 'bold'
                //   }
                // }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: this.data.map((item) => {
                return {
                  name: item.name,
                  value: item.quantity
                }
              })
              // [
              //   {value: 335, name: '账户中心'},
              //   {value: 310, name: '三方支付'},
              //   {value: 234, name: '消息中心'},
              //   {value: 1548, name: '短信平台'}
              // ]
            }
          ]
        });
      },
      queryAppVisitRate(val) {
        return `${Math.round(val / this.dataSum * 100)}%`
      }
    }
  }
</script>

<style lang="scss">
  .app-visit-pie-chart-view {
    background-color: #fff;
    .pie-chart-view-title-right {
      float: right;
    }
    .app-visit-pie-chart-content {
      padding: 20px;
    }
    .app-visit-pie-charts {
      height: 300px;
    }
    .app-visit-info-table {
      font-size: 12px;
      line-height: 16px;
      color: #666;
      .app-visit-info-theader {
        padding: 14px 4px;
        border-bottom: 1px solid #DFE1E6;
      }
      .app-visit-info-tbody {
        padding: 0 4px;
        .app-visit-info-tbody-part {
          margin-top: 12px;
        }
        .table-legend {
          display: inline-block;
          width: 8px;
          height: 8px;
          margin-right: 8px;
          border-radius: 50%;
          background-color: #234221
        }
      }
      .table-item {
        display: inline-block;
      }
      .app-visit-info-name, .app-visit-info-num {
        width: 40%;
      }
      .app-visit-info-rate {
        width: 20%;
      }
    }
  }
</style>