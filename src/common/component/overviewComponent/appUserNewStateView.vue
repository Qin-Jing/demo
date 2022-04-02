<template>
  <div class="overview-component-app-user-state">
    <main-title-nav
      :title="title" />
    <div class="app-user-state-main">
      <div class="app-user-state-content">
        <el-timeline>
          <el-timeline-item
            v-for="(stateInfo, index) in activeInfoList"
            :key="index"
            placement="top"
            :type="`primary`"
            :timestamp="stateInfo.startTime">
            {{ stateInfo.userName }}{{ stateInfo.content }}
          </el-timeline-item>
        </el-timeline>
      </div>
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
      activeInfoList: {
        type: Array,
        default: () => {
          return []
        }
      },
      title: {
        type: String,
        default: '动态'
      }
    },
    created() {
      // console.log(this.stateInfoList);
    }
  }
</script>

<style lang="scss">
  .overview-component-app-user-state {
    max-height: 390px;
    margin-top: 12px;
    background-color: #fff;
    overflow: hidden;
    .app-user-state-main {
      height: 340px;
      padding-right: 2px;
      .app-user-state-content {
        height: 320px;
        padding: 20px 20px 0;
        overflow: auto;
        &::-webkit-scrollbar-track {
          background-color: #fff;
        }
      } 
    }
  }
</style>
