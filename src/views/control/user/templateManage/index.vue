<template>
  <div class="template-manage-content">
    <main-title-nav
      v-model="isHomePage"
      title="模板管理"
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
      MainContent,
      MainTitleNav
    },
    data() {
      return {
        applyList: []
      }
    },
    computed: {
      isHomePage() {
        return this.$route.path  === '/control/user/templateManage';
      },
      templatePageTitle() {
        const route = this.$route;
        let title = '';
        const isHomePage = route.path === '/control/user/templateManage';
        title = isHomePage ? '' : '新增模板';
        if (route.query.isEdit) {
          title = '修改模板';
        }
        if (route.path === '/control/user/templateManage/detail') {
          title = '模板详情';
        }
        return title;
      }
    },
    watch: {
    },
    created() {
      // 获取应用列表信息
      this.queryApplyList()
    },
    methods: {
      // 返回首页
      returnHomePage() {
        this.$router.push('/control/user/templateManage');
      },
      // 获取应用列表
      queryApplyList() {
        return new Promise((resolve) => {
          this.$http['queryAllApplyList']()
            .then((resp) => {
              if (!resp) {
                resolve();
              }
              for(const key in resp) {
                if(resp[key]) {
                  this.applyList.push({
                    appId: key,
                    appName: key,
                    children: resp[key]
                  })
                }
              }
              resolve();
            })
        })
      },
    }
  }
</script>

<style lang="scss">

</style>
