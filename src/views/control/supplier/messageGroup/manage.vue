<template>
  <div>
    <main-title-nav
      v-model="isHomePage"
      :page-title="templatePageTitle"
      title="消息分组"
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
        return this.$route.path  === '/control/supplier/messageGroup/list';
      },
      templatePageTitle() {
        const route = this.$route;
        let title = '';
        if (route.path === '/control/supplier/messageGroup/channel') {
          title = '终端渠道关联';
        }
        if (route.path === '/control/supplier/messageGroup/app') {
          title = '应用关联';
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
        this.$router.push('./list');
      }
    }
  }
</script>
