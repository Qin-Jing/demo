<template>
  <div
    class="apaas-header"
    :class="{ 'apaas-header-blue-theme': blueTheme }">
    <span
      class="apaas-header-title"
      @click="clickApaasHeaderTitle">
      <img src="@/assets/img/login/logo.png">
      <span class="apass-header-title">APaaS平台</span>
    </span>
    <span class="apaas-header-nav-list">
      <slot name="left" />
    </span>
    <span class="apaas-header-nav-right-list">
      <slot name="right" />
      <router-link
        v-if="!isLogin"
        to="/login">
        登录
      </router-link>
      <el-dropdown v-if="isLogin">
        <img
          v-if="!headerImage"
          src="@/assets/img/login/user.svg">
        <img
          v-else
          :src="headerImage">
        <span
          class="el-icon-arrow-down apaas-header-nav-login-dropdown" />
        <el-dropdown-menu
          slot="dropdown"
          split-button>
          <el-dropdown-item
            @click.native="goToAccuntConfig">
            <el-tooltip 
              class="apaas-header-nav-user-tooltip"
              placement="bottom">
              <div slot="content">{{ userName }}({{ baseInfoForm.jslxName }})</div>
              <p class="apaas-header-nav-user">
                {{ userName }}
                <span class="apaas-header-nav-user-role">
                  ({{ baseInfoForm.jslxName }})
                </span>
              </p>
            </el-tooltip>
            <span class="apaas-header-nav-user-tax">{{ taxOffice }}</span>
            
          </el-dropdown-item>
          <el-dropdown-item
            @click.native="loginOut">
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </span>
  </div>
</template>

<script>
  // import { debounce } from '@/common/utils/method';

  export default {
    props: {
      blueTheme: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        headerImage: '',
        userId: '',
        userName: '',
        taxOffice: '',
        baseInfoForm: {}
      }
    },
    computed: {
      isLogin() {
        return localStorage.getItem('authToken');
      }
    },
    watch: {
      $route() {
        // 获取用户基本信息
        // this.queryUserBaseInfo();
      }
    },
    created() {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      this.userId = userInfo.userId;
      this.userName = userInfo.userName;
      if (localStorage.getItem('userInfo')) {
        // 获取用户基本信息
        this.queryUserBaseInfo();
      }
    },
    methods: {
      // 登出
      loginOut() {
        this.$http['userLoginOut']()
          .finally(() => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
            this.$router.push('/login');
          })
      },
      // 获取用户基本信息
      queryUserBaseInfo() {
        this.$http['queryUserBaseInfo']({
          userId: this.userId
        }).then((resp) => {
          this.baseInfoForm = resp;
          this.taxOffice = resp.swjgDm && resp.swjgDm.swjgjc
          const headerImg = this.baseInfoForm.headIcon || {};
          this.headerImage = headerImg.zytpUrl;
        })
      },
      clickApaasHeaderTitle()  {
        this.$router.push('/');
      },
      goToAccuntConfig() {
        this.$router.push('/control/user/baseinfo');
      }
    }
  }
</script>

<style lang="scss">
  @import '~gui/style/theme/variables';
  .apaas-header {
    box-sizing: border-box;
    position: fixed;
    width: 100%;
    // min-width: 1200px;
    height: 52px;
    padding: 0 $ST-7;
    color: $CN-10;
    line-height: 52px;
    z-index: 10;
    transition: background-color .2s;
    .apaas-header-title {
      cursor: pointer;
    }
    img {
      vertical-align: middle;
      width: $SW-10;
      height: $SH-10;
      margin-top: -4px;
    }
    span {
      display: inline-block;
      height: 50px;
    }
    .apass-header-title {
      margin-left: $ST-5;
    }
    .apaas-header-nav-list {
      margin-left: 96px;
    }
    .apaas-header-nav-right-list {
      float: right;
      img {
        vertical-align: middle;
        width: $SW-10;
        height: $SH-10;
        border-radius: 50%;
      }
    }
    .apaas-header-nav-list a, .apaas-header-nav-right-list a {
      display: inline-block;
      height: 50px;
      padding-left: $ST-6;
      padding-right: $ST-6;
      color: $CN-10;
    }
    .apaas-header-nav-list .el-dropdown,
    .apaas-header-nav-right-list .el-dropdown {
      color: $CN-10;
    }
    .el-dropdown {
      font-size: 15px;
      .el-dropdown-link {
        padding-left: 16px;
        padding-right: 16px;
      }
    }
    .apaas-header-nav-login-dropdown {
      display: none;
    }
  }
  .el-dropdown-menu__item {
    .apaas-header-nav-user {
      max-width: 150px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .apaas-header-nav-user-role {
      color: #999999;
    }
    &:hover {
      .apaas-header-nav-user-role {
        color: #68a4f7;
      }
    }
    .apaas-header-nav-user-tax {
      color: #999999;
    }
  }

  .apaas-header-blue-theme {
    background-color: $CB-6;
    .apaas-header-nav-list a:hover, .apaas-header-nav-right-list a:hover {
      background-color: $CB-7;
    }
    a:hover {
      background-color: $CB-6;
    }
    .el-dropdown {
      font-size: 15px;
      .el-dropdown-link {
        padding-left: 16px;
        padding-right: 16px;
        &:hover {
          background-color: $CB-6;
        }
      }
    }
  }
  .apaas-header-nav-user-tooltip {
    z-index: 3000 !important;
  }
</style>
