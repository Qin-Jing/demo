<template>
  <div class="message-record-sum-view clearfix">
    <div class="view-left-title">
      <img :src="logo">
      <p
        class="view-left-title-text"
        :class="[isOpen ? 'message-open' : 'message-close']">
        运行中
      </p>
    </div>
    <div class="view-right-content">
      <div v-if="isOpen">
        <!-- <p>
          <span class="view-right-content-time-sum">
            2400小时
          </span>
          <span class="view-right-content-time-hint">
            （连续运行）
          </span>
          <span class="view-right-content-time-prev">
            上次启动时间【2018-09-12 08:00:00】
          </span>
        </p> -->
        <div class="view-right-content-loading">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div class="view-right-content-info">
          累计发送
          <span class="info-num-hint">{{ visitNum }}</span>
          条消息，共服务
          <span class="info-num-hint">{{ useInfo.userCount }}</span>
          个用户，
          <span class="info-num-hint">{{ useInfo.appCount }}</span>
          个应用
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import closeLogo from '@/assets/img/overview/close.svg';
  import openLogo from '@/assets/img/overview/open.svg';
  export default {
    props: {
      visitNum: {
        type: [String, Number],
        default: '0'
      },
      useInfo: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        isOpen: true
      }
    },
    computed: {
      logo() {
        return this.isOpen ? openLogo : closeLogo;
      }
    }
  }
</script>

<style lang="scss">
  .message-record-sum-view {
    padding: 20px;
    background-color: #fff;
    .view-left-title {
      float: left;
      width: 48px;
      border-right: 1px solid #DFE1E6;
      padding: 4px 36px 4px 16px;
      text-align: center;
      img {
        width: 48px;
        height: 48px;
      }
      .view-left-title-text {
        margin-top: 6px;
        font-size: 14px;
        line-height: 20px;
      }
      .message-open {
        color: #428DF5;
      }
      .message-close {
        color: #666;
      }
    }
    .view-right-content {
      margin-left: 133px;
      .view-right-content-time-sum {
        font-size: 20px;
        font-weight: 600;
        line-height: 26px;
        color: #333;
      }
      .view-right-content-time-hint, .view-right-content-time-prev {
        font-size: 14px;
        line-height: 26px;
        color: #666;
      }
      .view-right-content-time-prev {
        margin-left: 6px;
      }
      .view-right-content-loading {
        span {
          display: inline-block;
          width: 16px;
          height: 3px;
          margin-right: 4px;
        }
        span:nth-child(odd) {
          background-color: #7BAFF8;
          animation: oddLoading 1s infinite;
        }
        span:nth-child(even) {
          background-color: #C6DDFC;
          animation: evenLoading 1s infinite;
        }
      }
      .view-right-content-info {
        margin-top: 18px;
        font-size: 16px;
        line-height: 22px;
        color: #333;
        .info-num-hint {
          color: #428DF5;
        }
      }
    }
  }
  @keyframes oddLoading {
    0% {background-color: #7BAFF8;}
    50% {background-color: #C6DDFC;}
    100% {background-color: #7BAFF8;}
  }
  @keyframes evenLoading {
    0% {background-color: #C6DDFC;}
    50% {background-color: #7BAFF8;}
    100% {background-color: #C6DDFC;}
  }
</style>