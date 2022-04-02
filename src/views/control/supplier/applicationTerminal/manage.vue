<template>
  <div class="business-domain-list">
    <main-title-nav
      v-model="isHomePage"
      title="应用终端渠道分配"
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
        return this.$route.path  === '/control/supplier/applicationTerminal';
      },
      notifyPageTitle() {
        let title = '';
        title = this.isHomePage ? '' : '终端渠道分配';
        return title;
      }
    },
    watch: {
    },
    created() {
    },
    methods: {
      returnHomePage() {
        this.$router.push('/control/supplier/applicationTerminal');
      }
    }
  }
</script>

<style lang="scss">

</style>
