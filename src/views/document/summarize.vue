<template>
  <div class="apaas-short-message-summarize">
    <p class="title">
      产品概述
      <a class="see-product-link">
        查看产品
        <i class="iconfont icon-more" />
      </a>
    </p>
    <p class="content">
      产品简介产品简介产品简介产品简介短信服务（Short Message Service）
      为用户提供的一种通信服务的能力。支持向国内和国际快速发送验证码、短
      信通知和推广短信，服务范围覆盖全球200多个国家和地区。国内短信支持三网合一专属通道
    </p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        
      }
    }
  }
</script>

<style lang="scss">
  @import '~gui/style/theme/variables';
  .apaas-short-message-summarize {
    .title {
      margin-bottom: $SP-5;
      @include H-4;
      .see-product-link {
        color: $CFL-1;
        @include H-5;
        i {
          font-size: 14px;
        }
        &:hover {
          color: $CFL-1;
        }
      }
    }
    .content {
      @include P-1;
      color: $CN-4;
    }
  }
</style>