<template>
  <div class="business-config-content">
    <p class="business-title">
      业务域：{{ $route.query.name }}
    </p>
    <el-transfer
      v-model="relateValue"
      class="channel-transfer"
      :data="channelList"
      :titles="['未关联终端渠道', '已关联终端渠道']"
      :props="transferOption" />
    <div class="business-btn-list">
      <el-button
        type="primary"
        size="medium"
        @click="clickSubmit">
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
    },
    data() {
      return {
        channelList: [],
        transferOption: {
          key: 'channelId',
          label: 'channelIdName'
        },
        relateValue: [],
        oldRelateList: []
      };
    },
    computed: {
      regionId() {
        return this.$route.query.regionId
      },
      channelMap() {
        const data = {};
        this.channelList.forEach((item) => {
          data[item.channelId] = item;
        })
        return data;
      },
      // oldRelateMap() {
      //   const data = {};
      //   this.oldRelateList.forEach((item) => {
      //     data[item.channelId] = item;
      //   })
      //   return data;
      // }
    },
    created() {
      if (this.regionId) {
        this.queryRelateChannel();
        this.queryUnRelatedChannId();
      }
    },
    methods: {
      // 获取已关联终端渠道
      queryRelateChannel() {
        this.$http['queryRelateChannel'](
          {
            regionId: this.regionId
          }
        ).then((resp) => {
          if (!resp) {
            return;
          }
          this.channelList.push(...resp);
          // 已关联数据
          this.oldRelateList = resp.map((item) => item.channelId);
          this.relateValue = resp.map((item) => item.channelId);
        })
      },
      // 获取未关联终端渠道
      queryUnRelatedChannId() {
        this.$http['queryUnRelatedChannId'](
          {
            regionId: this.regionId
          }
        ).then((resp) => {
          this.channelList.push(...resp);
        })
      },
      // 点击确定
      clickSubmit() {
        const relateList = this.relateValue;
        const regionAndChannIdDTOS = [];
        const data = [...relateList, ...this.oldRelateList];
        const repeatValue = this.oldRelateList.filter((item) => relateList.includes(item));
        data.forEach((item) => {
          if (repeatValue.includes(item)){
            return;
          }
          const { appid, channelId, configChannelXh, channel, glbz } = this.channelMap[item];
          regionAndChannIdDTOS.push({
            appId: appid,
            channelId,
            configChannelXh,
            channel,
            glbz
          });
        });
        this.$http['updateRelateChannel']({
          regionAndChannIdDTOS,
          regionId: this.regionId
        }).then(() => {
          this.$message.success('更新成功');
          this.resetChannel();
        })
      },
      resetChannel() {
        this.channelList = [];
        this.queryRelateChannel();
        this.queryUnRelatedChannId();
      }
    }
  }
</script>

<style lang="scss" scope>
  .business-config-content {
    padding-left: 20px;
    .channel-transfer {
      .el-transfer-panel {
        border: 1px solid #dfe1e6;
        border-radius: 3px;
        width: 45%;
      }
      .el-transfer__buttons {
        padding: 0 3%;
      }
    }
    .business-title {
      margin: 20px 0;
    }
    .business-btn-list {
      text-align: center;
      width: 62px;
      margin: 50px auto 0;
      // padding-left: 30px
    }
    .el-transfer-panel__item {
      box-sizing: border-box;
      width: 92%;;
    }
  } 
</style>