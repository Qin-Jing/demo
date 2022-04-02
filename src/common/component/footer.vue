<template>
  <div class="footer-main">
    <p>
      关于我们
      <span class="login-footer-text-cut-line">|</span>
      法律声明及隐私政策
      <span class="login-footer-text-cut-line">|</span>
      联系我们
    </p>
    <p>
      <span class="login-footer-text-title">友情链接：</span>
      个税大厅
      <span class="login-footer-text-cut-line">|</span>
      个税申报
    </p>
    <!-- <p>
      <span>@2019-2019 xxx.com 版权所有ICP备案：折A1-23122323</span>
      <span>浙公网备案 XXXXXXXXXXXXXXXX号X</span>
    </p> -->
    <!-- <div class="footer-main-logo">
      <img src="@/assets/img/login/policelogo.svg">
      <span>浙江工商管理</span>
      <img src="@/assets/img/login/businesslogo.svg">
      <span>浙江公安</span>
    </div> -->
  </div>
</template>

<style lang="scss">
  @import '~gui/style/theme/variables';
  .footer-main {
    position: relative;
    width: 1200px;
    margin: 0 auto;
    padding-top: 50px;
    padding-bottom: 50px;
    p {
      margin-bottom: $SP-5;
      @include P-1;
      span {
        display: inline-block;
      }
      .login-footer-text-cut-line {
        margin-left: $ST-6;
        margin-right: $ST-6;
      }
      .login-footer-text-title {
        margin-right: $ST-6;
      }
    }
    .footer-main-logo {
      position: absolute;
      bottom: 62px;
      right: 0;
      span {
        display: inline-block;
        width: 50px;
        font-size: 12px;
        text-align: center;
        vertical-align: middle;
        & ~ span {
          line-height: 33px
        }
      }
      img {
        vertical-align: middle;
        margin-left: 20px;
        margin-right: 12px;
      }
    }
  }
</style>
