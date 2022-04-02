<template>
  <div class="overview-component-app-notification">
    <el-tabs
      v-model="activeView">
      <el-tab-pane
        label="公告" 
        name="notice">
        <ul class="app-notification-list">
          <li
            v-for="(notification, index) in notificationList"
            :key="index"
            class="app-notification-detail"
            @click="clickNotification(notification)">
            <p class="app-notification-detail-title">
              【{{ notification.cpggTypeName }}】{{ notification.title }}
            </p>
            <p class="app-notification-detail-time">
              {{ notification.fbrq }}
            </p>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane
        label="升级通知" 
        name="upgrade">
        <ul class="app-notification-list">
          <li
            v-for="(notification, index) in upgradeNotificationList"
            :key="index"
            class="app-notification-detail"
            @click="clickNotification(notification)">
            <p class="app-notification-detail-title">
              【{{ notification.cpggTypeName }}】{{ notification.title }}
            </p>
            <p class="app-notification-detail-time">
              {{ notification.fbrq }}
            </p>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
    <span
      class="notification-see-more-btn"
      @click="clickSeeMoreBtn">
      查看更多<i class="iconfont icon-more" />
    </span>
  </div>
</template>

<script>
  import { USER_ROLE_TYPE } from '@/common/constant';
  export default {
    props: {
      notificationList: {
        type: Array,
        default: () => {
          return []
        }
      },
      upgradeNotificationList: {
        type: Array,
        default: () => {
          return []
        }
      },
      role: {
        type: String,
        default: () => {
          return '1'
        }
      }
    },
    data() {
      return {
        activeView: 'notice'
      }
    },
    methods: {
      clickSeeMoreBtn() {
        // 产品供应商跳转到通知公告列表页
        if (this.role === USER_ROLE_TYPE.PRODUCT_SUPPLIER) {
          this.$router.push({
            path: '/control/supplier/notification'
          })
          return;
        }
        // 其他角色到通知公告详情页
        this.$router.push({
          path: '/homepage/notification?id=&type='
        })
      },
      clickNotification(data) {
        this.$router.push({
          path: '/homepage/notification/detail',
          query: {
            id: data.id
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .overview-component-app-notification {
    position: relative;
    padding-top: 18px;
    background-color: #fff;
    .el-tabs__header {
      padding: 0 20px;
    }
    .el-tabs__content {
      height: 340px;
      .app-notification-list {
        list-style: none;
        max-width: 100%;
        padding: 0 20px;
        .app-notification-detail {
          display: inline-block;
          width: 100%;
          font-size: 14px;
          line-height: 20px;
          cursor: pointer;
          &:hover {
            .app-notification-detail-title {
              color: #428DF5;
            }
          }
          .app-notification-detail-title {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .app-notification-detail-time {
            margin-top: 8px;
            color: #999;
          }
        }
        li + li {
          margin-top: 20px;
        }
      }
    }
    .notification-see-more-btn {
      position: absolute;
      top: 23px;
      right: 23px;
      font-size: 14px;
      line-height: 20px;
      color: #999;
      cursor: pointer;
      i {
        position: relative;
        left: 2px;
        top: -1px;
        font-size: 12px;
      }
    }
  }
</style>
