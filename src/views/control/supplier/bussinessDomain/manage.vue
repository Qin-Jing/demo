<template>
  <div class="business-domain-list">
    <main-title-nav
      v-model="isHomePage"
      title="业务域管理"
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
        return this.$route.path  === '/control/supplier/businessDomain';
      },
      notifyPageTitle() {
        let title = '';
        title = this.isHomePage ? '' : '关联终端渠道';
        return title;
      }
    },
    watch: {
    },
    created() {
    },
    methods: {
      returnHomePage() {
        this.$router.push('/control/supplier/businessDomain');
      }
    }
  }
</script>

<style lang="scss">

</style>
