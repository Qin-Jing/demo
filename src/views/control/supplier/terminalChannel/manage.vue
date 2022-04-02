<template>
  <div class="channel-list">
    <main-title-nav
      title="终端渠道管理" />
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
    },
    watch: {
    },
    created() {
    },
    methods: {
    }
  }
</script>

<style lang="scss">

</style>
