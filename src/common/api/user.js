export default {
  authLogin: {
    url: '/login/authLogin',
    method: 'POST',
    description: '用户登录'
  },
  getUserInfo: {
    url: '/user/getUserInfo',
    method: 'GET',
    description: '获取当前登录者信息'
  },
  logout: {
    url: '/logout',
    method: 'POST',
    description: '退出登录'
  }
};
