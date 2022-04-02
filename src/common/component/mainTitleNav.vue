<template>
  <div class="main-title-nav">
    <span
      v-show="isHomePage"
      class="main-title-default">
      {{ title }}
    </span>
    <a
      v-show="!isHomePage"
      class="main-title-link"
      href="javascript:void(0)"
      @click="returnHomePage">
      <i class="iconfont icon-left" /> {{ title }}
    </a>
    <slot />
    <span class="nav-page-title">{{ pageTitle }}</span>
    <slot name="right" />
  </div>
</template>

<script>
  export default {
    model: {
      prop: 'value',
      event: 'return-home-page'
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      value: {
        type: Boolean,
        default: true
      },
      pageTitle: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        // isHomePage: true
      }
    },
    computed: {
      isHomePage() {
        return this.value;
      }
    },
    methods: {
      returnHomePage() {
        // 双向绑定事件
        // this.$emit('return-home-page', true);
        // 广播点击事件
        this.$emit('click');
      }
    }
  }
</script>

<style lang="scss">
  @import '~gui/style/theme/variables';

  $main-title-nav-height: 50px;

  .main-title-nav {
    position: relative;
    height: $main-title-nav-height;
    border-bottom: 1px solid #E3E4E8;
    padding-left: $ST-7;
    padding-right: $ST-7;
    line-height: 50px;
    .main-title-default {
      display: inline-block;
      position: relative;
      padding-left: 16px;
      white-space: nowrap;
      &:before {
        content: '';
        display: block;
        position: absolute;
        left: 0px;
        top: 18px;
        width: 4px;
        height: 16px;
        border-radius: 2px;
        background-color: $CB-6;
      }
    }
    .main-title-link {
      color: $CB-6
    }
    .nav-page-title {
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      @include H-5;
      line-height: 50px;
      font-weight: bold;
    }
  }
</style>
