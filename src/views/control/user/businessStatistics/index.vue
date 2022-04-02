<template>
  <div class="template-audit-content">
    <main-title-nav
      v-model="isHomePage"
      title="业务请求查询"
      @click="returnHomePage" />
    <main-content>
      <router-view />
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
      }
    },
    computed: {
      isHomePage() {
        return this.$route.path  === '/control/user/businessStatistics';
      },
      // templatePageTitle() {
      //   const route = this.$route;
      //   let title = '';
      //   const isHomePage = route.path === '/control/user/template';
      //   title = isHomePage ? '' : '新增模板';
      //   if (route.query.mbxh) {
      //     title = '修改模板';
      //   }
      //   return title;
      // }
    },
    watch: {
    },
    created() {
    },
    methods: {
      returnHomePage() {
        this.$router.push('/control/user/businessStatistics');
      }
    }
  }
</script>

<style lang="scss">

</style>
