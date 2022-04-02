<template>
  <div class="no-info-container">
    <div class="no-info-main">
      <img src="@/assets/contentEmpty.png">
      <p class="no-info-main-text">
        {{ hint }}
      </p>
      <el-button
        v-show="showBtn"
        type="primary"
        @click="click">
        {{ btnTxt }}
      </el-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      hint: {
        type: String,
        default: ''
      },
      btnTxt: {
        type: String,
        default: '添加'
      },
      showBtn: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      click() {
        this.$emit('btn-click')
      }
    }
  }
</script>

<style lang="scss">
  @import '~gui/style/theme/variables';
  .no-info-container {
    position: relative;
    height: 100%;
    min-height: 400px;
    .no-info-main {
      width: 300px;
      height: 200px;
      position: absolute;
      margin: auto;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      .no-info-main-text {
        margin-top: $SP-5;
        margin-bottom: $SP-10;
      }
    }
  }
</style>
