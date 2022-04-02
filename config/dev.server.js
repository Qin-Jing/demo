module.exports = {
  port: 9002,
  proxy: {
    '/mc/web/': {
      target: 'http://47.98.251.34:23000'
      // target: 'http://10.200.8.123:8080' // xzl
      // target: 'http://10.199.150.126' // 服务器
      // target: 'http://10.204.130.142:8081' // lpy
      // target: 'http://10.204.130.131:8172' //zhj
      // target: 'http://10.200.9.89:8090' //zhb
      // target: 'http://10.200.8.82' //md
      // target: 'http://10.200.116.37:8080'
    },
    '/sms/web/': {
      // target: 'http://10.199.150.126' // 服务器
      target: 'http://47.98.251.34:23000'
    },
    '/pi/web/': {
      target: 'http://47.98.251.34:23000'
      // target: 'http://10.200.8.82' //md
      // target: 'http://10.200.116.37:8080'
      // target: 'http://10.199.150.126' // 服务器
    }
  },
  overlay: {
    warnings: true,
    errors: true
  }
};