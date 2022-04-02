<template>
  <div class="overview-component-app-use-top-view">
    <main-title-nav
      :title="title" />
    <div class="app-use-top-content">
      <ul class="app-use-top-list">
        <li
          v-for="(list, index) in appUseTopList"
          :key="index"
          class="app-use-top-detail">
          <span class="app-use-top-detail-app-name">
            {{ list.appName }}
          </span>
          <span class="app-use-top-detail-app-num">
            {{ list.zdycs }}
          </span>
          <div class="app-use-top-detail-ratio">
            <div
              class="app-use-top-detail-ratio-bg"
              :style="returnRatio(list)" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import MainTitleNav from '@/common/component/mainTitleNav';
  export default {
    components: {
      MainTitleNav
    },
    props: {
      appUseTopList: {
        type: Array,
        default: () => {
          return []
        } 
      },
      title: {
        type: String,
        default: '当日累计服务调用TOP5（次）'
      }
    },
    computed: {
      maxNum() {
        // 调用数量最多的数字提高10%作为总数
        let maxUseNum = 0;
        this.appUseTopList.forEach((app) => {
          maxUseNum = Math.max(maxUseNum, app.zdycs);
        })
        return maxUseNum * 1.1
      }
    },
    methods: {
      // 返回比例
      returnRatio(data) {
        return {
          width: `${Math.round(data.zdycs / this.maxNum * 100)}%`
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '~gui/style/theme/variables';
  .overview-component-app-use-top-view {
    background-color: #fff;
    .app-use-top-content {
      padding: 20px 20px 12px;
      .app-use-top-list {
        list-style: none;
        .app-use-top-detail {
          display: inline-block;
          width: 100%;
          margin-bottom: 22px;
          font-size: 12px;
          line-height: 18px;
          .app-use-top-detail-app-name {
            color: #666;
          }
          .app-use-top-detail-app-num {
            float: right;
          }
          .app-use-top-detail-ratio {
            height: 12px;
            margin-top: 8px;
            border-radius: 6px;
            background: #E9EBF0;
            .app-use-top-detail-ratio-bg {
              height: 12px;
              background: $CB-5;
              border-radius: 6px;
            }
          }
        }
      }
    }
  }
</style>
