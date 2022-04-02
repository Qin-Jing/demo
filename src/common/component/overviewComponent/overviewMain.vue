<template>
  <div class="overview-view-main">
    <overview-title-view />
    <div class="overview-view-content clearfix">
      <div class="overview-view-content-left">
        <slot name="left" />
      </div>
      <div class="overview-view-content-right">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<script>
  import OverviewTitleView from '@/common/component/overviewComponent/titleView';
  export default {
    components: {
      OverviewTitleView
    },
  }
</script>

<style lang="scss">
  .overview-view-main {
    background-color: transparent !important;
    padding-top: 20px;
    .overview-view-content {
      margin-top: 20px;
      margin-bottom: 20px;
      .overview-view-content-left {
        float: left;
        width: 70%;
        min-width: 638px;
      }
      .overview-view-content-right {
        box-sizing: border-box;
        margin-left: 70%;
        padding-left: 12px;
        width: 30%; 
        min-width: 250px;
      }
    }
  }
</style>
