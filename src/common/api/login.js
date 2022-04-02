export default {
  queryVerifyImg: {
    url: '/captcha/getCaotcha',
    method: 'POST',
    description: '获取图像验证码',
    baseURL: '/pi/web'
  },
  userLogin: {
    url: '/login',
    method: 'POST',
    description: '登录',
    baseURL: '/pi/web'
  },
  userLoginOut: {
    url: '/logout',
    method: 'GET',
    description: '登出',
    baseURL: '/pi/web'
  }
}