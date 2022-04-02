<template>
  <div class="channel-list">
    <main-title-nav
      v-model="isHomePage"
      title="渠道管理"
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
        return this.$route.path  === '/control/supplier/channel';
      },
      notifyPageTitle() {
        const route = this.$route;
        let title = '';
        const isHomePage = route.path === '/control/supplier/channel';
        title = isHomePage ? '' : '新增渠道';
        if (route.query.mbxh) {
          title = '修改渠道';
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
        this.$router.push('/control/supplier/channel');
      }
    }
  }
</script>

<style lang="scss">

</style>
