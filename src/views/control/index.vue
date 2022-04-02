<template>
  <div class="console-container">
    <!-- 防止浏览器自动带入账号密码 -->
    <div style="position: absolute; top: -100000px;">
      <input>
      <input type="password">
    </div>
    <el-container>
      <el-aside 
        v-if="!isMenuConfig"
        class="console-left-menu">
        <nav-menu
          title="消息中心"
          :menu-list="menuList"
          :default-active="active" />
      </el-aside>
      <el-container :class="{'has-bottom': PAGE_HAS_BOTTOM.includes($route.path)}">
        <el-main
          v-loading="isLoading"
          :class="{ 'form-content-main' : isFormContent }">
          <div class="container-content">
            <keep-alive :exclude="$route.meta.exclude">
              <router-view v-if="$route.meta.keepAlive" />
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive" />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  import NavMenu from 'gui/components/NavMenu';
  import { PAGE_HAS_BOTTOM } from './constant';

  export default {
    components: {
      NavMenu,
    },
    data() {
      return {
        menuList: [],
        PAGE_HAS_BOTTOM,
        userInfo: {
          name: ''
        },
        configList: [],
        contentMarginLeft: '150px',
        flatMenuList: [],
        isMenuConfig: true,
      }
    },
    computed: {
      isFormContent() {
        const value = this.$route;
        return value.path.includes('formcontent') ||
          value.path.includes('advertising/manage') ||
          value.path.includes('managetaxaccount') ||
          value.path.includes('templateManage/editTemplateName') ||
          value.path.includes('templateManage/editTemplateSource')
      },
      active() {
        return this.$route.path
      }
      // isMenuConfig() {
      //   // 是否菜单配置
      //   return JSON.parse(localStorage.getItem('productInfo')).isMenuConfig === 'true';
      // }
    },
    created() {
      // 路由参数保存到localstrong
      if (this.$route.query.appId) {
        localStorage.setItem('productInfo', JSON.stringify(this.$route.query));
      } else if(window.parent.document.getElementById('J_documentIframe')) {
        const src = window.parent.document.getElementById('J_documentIframe').attributes['src'].value; 
        const theRequest = {};
        if(src.indexOf('?') > -1) {
          const strs = src.split('?')[1].split('&');
          strs.forEach(str => {
            const strArr = str.split('=');
            theRequest[strArr[0]] = strArr[1].trim();
          })
          const url = src.split('?')[0].split('#')[1];
          this.$router.push(url);
        }
        localStorage.setItem('productInfo', JSON.stringify(theRequest));
      }
      this.isMenuConfig = JSON.parse(localStorage.getItem('productInfo')).isMenuConfig === 'true'
      this.queryMenuByUserRole();
    },
    methods: {
      // 根据用户权限获取路由
      queryMenuByUserRole() {
        this.$http['queryMenuByUserRole'](
          {
            // jslxDm: this.userBaseInfo.jslxDm
            cpId: JSON.parse(localStorage.getItem('productInfo')).appId
          },
          {
            baseURL: '/pi/web/',
          }
        )
          .then((resp) => {
            // 菜单列表
            this.menuList = this.getFormatMenuList(resp);
            // 平铺菜单列表
            this.flatMenuList = this.getFlatMenuList(resp);
          });
      },
      // 菜单栏格式化
      getFormatMenuList(data) {
        const menuList = data.reduce((acc, cur) => {
          // 深度格式化
          if (cur.childrens && cur.childrens.length) {
            cur.children = this.getFormatMenuList(cur.childrens);
          }
          acc.push({
            router: cur.menuUrl || '',
            title: cur.menuName,
            children: cur.children
          })
          return acc;
        }, []);
        return menuList;
      },
      getFlatMenuList(data) {
        const menuList = data.reduce((acc, cur) => {
          acc.push(cur);
          if (cur.childrens && cur.childrens.length) {
            acc.push(...cur.childrens);
          }
          return acc;
        }, []);
        return menuList;
      },
    },
    beforeRouteUpdate(to, from, next) {
      next();
    }
  }
</script>

<style lang="scss">
  @import '~gui/style/theme/variables';

  .console-container {
    min-width: 1200px;
    height: 100%;
    .console-header {
      padding: 0 20px !important;
      background-color: $CFL-1 !important;
      color: $CN-10;
      span {
        display: inline-block;
      }
      .title-text {
        @include H-5;
      }
    }
    .el-container {
      height: 100%;
    }
    .el-container .el-main {
      display: block;
      margin-top: 0;
      margin-bottom: 0;
      padding: 52px 20px 0;
      .container-content {
        display: block;
        padding: 0;
        background-color: transparent;
        > div {
          min-height: 100vh;
          padding: 0;
          background-color: #fff;
        }
        .main-content {
          flex: 1;
        }
      }
    }
    .form-content-main {
      margin-bottom: 68px !important;
    }
    .main-content {
      .el-loading-parent--relative {
        min-height: 200px;
      }
    }
    .el-dropdown-link {
      cursor: pointer;
    }
  }
</style>
