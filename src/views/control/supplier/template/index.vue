<template>
  <div class="template-list">
    <main-title-nav
      v-model="isHomePage"
      title="消息模板管理"
      :page-title="notifyPageTitle"
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
        notifyInfo: {}
      }
    },
    computed: {
      isHomePage() {
        return this.$route.path  === '/control/supplier/template';
      },
      notifyPageTitle() {
        const route = this.$route;
        let title = '';
        const isHomePage = route.path === '/control/supplier/template';
        title = isHomePage ? '' : '新增消息模板';
        if (route.query.mbxh) {
          title = '修改消息模板';
        }
        return title;
      }
    },
    watch: {
    },
    created() {
    },
    methods: {
      returnHomePage() {
        this.$router.push('/control/supplier/template');
      }
    }
  }
</script>

<style lang="scss">

</style>
