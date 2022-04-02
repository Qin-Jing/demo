<template>
  <div class="login-container">
    <div class="login-header">
      <div class="login-header-content">
        <img src="@/assets/img/login/policelogo.svg">
        <span>Apaas平台</span>
        <span class="login-page-title">用户登录</span>
        <div
          class="login-header-link-home-page"
          @click="goToHomePage">
          平台首页
        </div>
      </div>
    </div>
    <div class="login-main">
      <div class="login-main-content">
        <div class="login-form">
          <p>登录</p>
          <el-form
            ref="loginForm"
            label-position="right"
            :model="loginForm"
            :rules="loginRules"
            @keyup.enter.native="loginValidate">
            <el-form-item
              prop="account">
              <el-input
                v-model="loginForm.account"
                :disabled="disableLogin"
                placeholder="手机号/证件号码/登录名" />
            </el-form-item>
            <el-form-item
              prop="psd">
              <el-input
                v-model="loginForm.psd"
                type="password"
                :disabled="disableLogin"
                placeholder="密码" />
            </el-form-item>
            <el-form-item
              v-if="showVerifyImg"
              prop="captcha"
              class="login-verify-form-item">
              <el-input
                v-model="loginForm.captcha"
                :disabled="disableLogin"
                placeholder="验证码" />
              <img
                class="login-verify-img"
                :src="serviceImgSrc"
                @click="queryVerifyImg">
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :disabled="disableLogin"
                :loading="disableLogin"
                @click="loginValidate">
                登录
              </el-button>
            </el-form-item>
          </el-form>
          <div class="login-footer-menu">
            <!-- <a href="javascript: void(0)">忘记密码</a>
            <a
              href="javascript: void(0)"
              @click="clickRegisterBtn">
              立即注册
            </a> -->
          </div>
        </div>
      </div>
    </div>
    <div class="login-footer">
      <footer-content />
    </div>
  </div>
</template>
<script>
  import FooterContent from '@/common/component/footer';

  export default {
    components: {
      FooterContent
    },
    data() {
      return {
        disableLogin: false,
        showVerifyImg: true,
        loginForm: {
          account: '',
          psd: '',
          captcha: '',
          captchaId: ''
        },
        serviceImgSrc: '',
        loginRules: {
          account: [
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error('请输入账号'));
                  return;
                }
                callback();
              },
              trigger: 'blur'
            }
          ],
          psd: [
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error('请输入密码'));
                  return;
                }
                callback();
              },
              trigger: 'blur'
            }
          ],
          captcha: [
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error('请输入验证码'));
                  return;
                }
                callback();
              },
              trigger: 'blur'
            }
          ]
        }
      }
    },
    created() {
      this.queryVerifyImg();
    },
    methods: {
      /**
       * 登录校验
       */
      loginValidate() {
        this.disableLogin = true;
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            // localStorage.setItem('authToken', 'b303d9b8bc41459825fe9055a7893909');
            this.login();
          } else {
            this.disableLogin = false;
            return false
          }
        })
      },
      /**
       * 登录
       */
      login() {
        const { account: userName, psd: mm, captcha: captchaText, captchaId } = this.loginForm
        this.$http['userLogin']({
          userName,
          mm,
          captchaText,
          captchaId,
          device: 'NORMAL',
          oauthAuth: null
        }).then((resp) => {
          // 保存token和基本信息
          localStorage.setItem('authToken', resp.token);
          resp.jslxDm = `${resp.jslxDm}`
          localStorage.setItem('userInfo', JSON.stringify(resp));
          // 如果路由有重定向地址，不经过router，直接跳转页面
          if (resp.redirectUrl) {
            location.href = decodeURIComponent(resp.redirectUrl);
            return;
          }
          // 路由返回到之前想查看的页面，如果没有则跳到门户页
          const historyUrl = this.$route.query.historyUrl;
          const pathQuery = this.$route.query.pathQuery;
          // 根据historyUrl跳转到上一个页面，没有跳到首页
          const nextUrl = historyUrl ? decodeURIComponent(historyUrl) : '/control';
          this.$router.push({
            path: nextUrl,
            query: pathQuery ? JSON.parse(this.$route.query.pathQuery) : {}
          });
        }).finally(() => {
          this.disableLogin = false;
          // 重新查询新验证码
          this.queryVerifyImg();
        })
      },
      /**
       * 获取图像验证码
       */
      queryVerifyImg() {
        this.$http['queryVerifyImg']()
          .then((resp) => {
            // 验证码参数为空，则隐藏验证码
            if (!resp) {
              this.showVerifyImg = false
              return;
            }
            // 保存验证码id
            this.loginForm.captchaId = resp.captchaId;
            // 验证码图片base64码添加前缀
            this.serviceImgSrc = `data:image/jpg;base64,${resp.image}`;
          })
      },
      // 跳转到门户页
      goToHomePage() {
        this.$router.push('/homepage')
      },
      // 点击注册按钮
      clickRegisterBtn() {
        // 提示暂未提供
        this.$confirm('平台注册尚在开发中，暂未提供注册入口，请联系各省局分配账号', '提示', {
          showCancelButton: false,
        })
      }
    }
  }
</script>
<style lang="scss">
  @import '~gui/style/theme/variables';
  .login-container {
    min-width: 1200px;
    .login-header {
      position: absolute;
      z-index: 10;
      width: 100%;
      height: 50px;
      .login-header-content {
        width: 1200px;
        margin: 0 auto;
        line-height: 50px;
        color: $CN-10;
        span {
          display: inline-block;
          margin-left: 12px;
          margin-right: 12px;
          @include H-4;
        }
        .login-page-title {
          position: relative;
          @include H-5;
          &:before {
            content: '';
            position: absolute;
            left: -12px;
            bottom: 3px;
            width: 1px;
            height: $SH-6;
            border-left: 1px solid $CN-10
          }
        }
        .login-header-link-home-page {
          float: right;
          @include P-1;
          line-height: 50px;
          cursor: pointer;
        }
        img {
          vertical-align: middle;
        }
      }
    }
    .login-main {
      height: 695px;
      background: linear-gradient(#130854, 60%, #16398D);
      .login-main-content {
        position: relative;
        width: 1200px;
        height: 100%;
        margin: 0 auto;
        background-image: url('~@/assets/img/login/loginbg.png');
        background-repeat: no-repeat;
        background-position: left center;
        .login-form {
          box-sizing: border-box;
          position: absolute;
          top: 17.5%;
          right: 46px;
          width: 384px;
          height: 345px;
          border-radius: 3px;
          padding: $SP-9 $ST-10;
          background-color: $CN-10;
          p {
            margin-bottom: 30px;
            @include H-5;
          }
          .login-verify-form-item {
            .el-input {
              width: 190px;
              margin-right: $ST-6;
            }
            .login-verify-img {
              float: right;
              width: 103px;
              height: 40px;
              // border: 1px solid $CM-5;
              border-radius: $C-1;
            }
          }
          .el-form > .el-form-item .el-form-item__content .el-input--medium .el-input__inner {
            height: 40px !important;
          }
          button {
            width: 100%;
            height: 40px;
            // margin-bottom: 20px;
          }
          .login-footer-menu {
            box-sizing: border-box;
            position: absolute;
            width: 100%;
            left: 0;
            bottom: 0;
            border-bottom-left-radius: 3px;
            border-bottom-right-radius: 3px;
            padding: 0 $ST-10;
            background-color: $CB-1;
            @include P-2;
            line-height: 49px;
            text-align: right;
            a {
              margin-left: $ST-7;
              color: $CFL-1;
            }
          }
        }
      }
    }
    .login-footer {
      height: 180px;
      color: $CN-6;
    }
  }

</style>
