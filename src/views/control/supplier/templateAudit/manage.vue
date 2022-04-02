<template>
  <div class="business-handle-template-audit">
    <main-title-nav
      v-model="isHomePage"
      title="模板审批"
      :page-title="templatePageTitle"
      @click="returnHomePage" />
    <main-content>
      <router-view :apply-list="applyList" />
    </main-content>
  </div>
</template>

<script>
  import MainTitleNav from '@/common/component/mainTitleNav';
  import MainContent from '../../components/mainContent';
  export default {
    components: {
      MainTitleNav,
      MainContent
    },
    data() {
      return {
        applyList: []
      }
    },
    computed: {
      isHomePage() {
        return this.$route.path  === '/control/supplier/templateAudit';
      },
      templatePageTitle() {
        const route = this.$route;
        let title = '';
        const isHomePage = route.path === '/control/supplier/templateAudit';
        title = isHomePage ? '' : '模板详情';
        if (route.path === '/control/supplier/templateAudit/audit') {
          title = '模板审核';
        }
        if (route.query.isEdit === true) {
          title = '模板修改';
        }
        return title;
      }
    },
    created() {
      // 获取所属应用
      this.queryApplyList();
    },
    methods: {
      returnHomePage() {
        this.$router.push('/control/supplier/templateAudit');
      },
      queryApplyList() {
        this.$http['queryApplyList']()
          .then((resp) => {
            this.applyList = resp;
          })
      }
    }
  }
</script>

<style lang="scss">
  @import '~gui/style/theme/variables';
  $content-border: 1px solid $CM-7;

  .business-handle-template-audit {
    .business-handle-template-info-content {
      border: $content-border;
      color: $CN-4;
      & + .business-handle-template-info-content {
        margin-top: 20px;
      }
      .business-handle-template-info-content-item {
        border-bottom: $content-border;
        padding-left: $ST-7;
        @include P-1;
        line-height: $SH-12;
      }
      .business-handle-template-info-content-title {
        background-color: $CM-8;
        font-weight: bold;
      }
      .business-handle-template-info-content-list {
        li {
          display: inline-block;
          box-sizing: border-box;
          width: 50%;
          &:nth-of-type(odd) {
            border-right: $content-border;
          }
          &:last-of-type {
            border-bottom: none;
          }
          span {
            color: $CN-2;
          }
        }
        .full-line {
          width: 100%;
          border-right-width: 0;
        }
        .edit-item {
          padding-left: 0
        }
      }
      .channel-content-list-item {
        border-bottom: $content-border !important;
      }
    }
    .required {
      color: #FF6B08 !important;
    }
  }

</style>