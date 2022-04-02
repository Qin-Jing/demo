<script>
  import channel from './channel';
  export default {
    extends: channel,
    data() {
      return {
        title: ['未关联应用', '已关联应用'],
        detailUrl: 'relevancemessagegroupapp/list',
        saveUrl: 'relevancemessagegroupapp/update',
        props: {
          key: 'appid',
          label: 'appName'
        },
        key: 'newAppList'
      }
    }
  }
</script>
