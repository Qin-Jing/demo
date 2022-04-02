<template>
  <div class="template-manage-content">
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
  import MainContent from '../../../components/mainContent';

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
        return this.$route.path  === '/control/paltform/businessRequest';
      }
    },
    watch: {
    },
    created() {
    },
    methods: {
      returnHomePage() {
        this.$router.push('/control/paltform/businessRequest');
      }
    }
  }
</script>

<style lang="scss">

</style>
