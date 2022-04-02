<template>
  <div class="overview-component-title">
    <h3 class="overview-component-title-now-hint">
      今日
    </h3>
    <p class="overview-component-title-salutatory">
      {{ salutatoryText }}
    </p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        salutatoryText: ''
      }
    },
    created() {
      // 获取当前日期的提示语
      this.salutatoryText = this.returnSalutatoryText();
    },
    methods: {
      returnSalutatoryText() {
        const date = new Date();
        // 获取年份
        const year = date.getFullYear();
        // 获取月份
        const month = date.getMonth() + 1;
        // 获取日期
        const day = date.getDate();
        // 获取星期
        const week = this.returnChineseWeek(date.getDay());
        return `${year}年${month}月${day}日${week}，欢迎回到消息中心。`
      },
      returnChineseWeek(num) {
        let week = '';
        switch(num) {
          case 1:
            week = '星期一';
            break;
          case 2:
            week = '星期二';
            break;
          case 3:
            week = '星期三';
            break;
          case 4:
            week = '星期四';
            break;
          case 5:
            week = '星期五';
            break;
          case 6:
            week = '星期六';
            break;
          case 7:
            week = '星期天';
            break;
        }
        return week;
      }
    }
  }
</script>

<style lang="scss">
  .overview-component-title {
    padding-left: 20px;
    padding-right: 20px;
    .overview-component-title-now-hint {
      font-size: 32px;
      line-height: 38px;
    }
    .overview-component-title-salutatory {
      margin-top: 12px;
      font-size: 16px;
      line-height: 22px;
      color: #666;
    }
  }
</style>
