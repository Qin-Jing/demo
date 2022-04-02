<template>
  <div class="box">
    <div class="header">
      <label class="label">
        消息分组：
      </label>{{ row.messageGroupName }}
    </div>
    <el-transfer
      v-model="value"
      :props="props"
      :titles="title"
      :data="data" />
    <div class="btn-list">
      <el-button
        type="primary"
        @click="save">
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
  import http from '@/core/service/http';
  export default {
    data() {
      return {
        title: ['未关联终端渠道', '已关联终端渠道'],
        detailUrl: 'relevancemessagegroupchannel/list',
        saveUrl: 'relevancemessagegroupchannel/update',
        data: [],
        value: [],
        row: {},
        props: {
          key: 'channelId',
          label: 'channelIdName'
        },
        key: 'newChannelList'
      }
    },
    created() {
      this.row = this.$route.query;
      this.getDetail();
    },
    methods: {
      getDetail(){
        http({
          url: this.detailUrl,
          data: {
            messageGroupCode: this.row.messageGroupCode,
          },
          method: 'POST'
        }).then(res => {
          this.data = res.allAssociatedList;
          this.value = res.associatedList.map(item => item[this.props.key]);
        });
      },
      save(){
        const data = {
          messageGroupCode: this.row.messageGroupCode,
          [this.key]: this.data.filter(item => this.value.includes(item[this.props.key])).map(item => ({
            [this.props.key]: item[this.props.key]
          }))
        }
        http({
          url: this.saveUrl,
          data,
          method: 'POST'
        }).then(() => {
          this.$message.success('保存成功');
          this.$router.push('./list');
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
.box {
  width: 690px;
  .header {
    margin-bottom: 20px;
    font-size: 14px;
    .label {
      color: #aaaaaa;
    }
  }
}
.btn-list {
  text-align: center;
  margin-top: 20px;
}
 /deep/ .el-transfer-panel {
   width: 300px;
   .el-transfer-panel__item {
     display: block;
   }
 }
</style>
