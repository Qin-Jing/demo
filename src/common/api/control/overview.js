export default {
  queryApplyQuantity: {
    url: '/statistics/message/getAllQuantity',
    method: 'GET',
    description: '获取累计发送量统计'
  },
  queryYesterdayQuantity: {
    url: '/statistics/message/getYesterdayQuantity',
    method: 'GET',
    description: '昨日累计发送统计次数'
  },
  queryMonthQuantity: {
    url: '/statistics/message/getMonthQuantity',
    method: 'GET',
    description: '当月累计发送统计次数'
  },
  queryYesterdayQuantityGruopAppid: {
    url: '/statistics/message/getYesterdayQuantityGruopAppid',
    method: 'GET',
    description: '昨日app发送量'
  },
  queryMonthQuantityGruopAppid: {
    url: '/statistics/message/getMonthQuantityGruopAppid',
    method: 'GET',
    description: '当月app发送量'
  },
  querySendNumberByTime: {
    url: '/statistics/message/getSendMessageQuantity',
    method: 'GET',
    description: '根据时间获取发送量统计'
  },
  queryUserAndAppNum: {
    url: '/statistics/message/getUserAndAppNum',
    method: 'GET',
    description: '获取使用的用户和应用数量'
  },
  queryTodayQuantity: {
    url: '/statistics/message/user/getYesterdayQuantity',
    method: 'GET',
    description: '用户今日累计发送统计次数'
  },
  queryUserYesterdayQuantityGruopAppid: {
    url: '/statistics/message/user/getYesterdayQuantityGruopAppid',
    method: 'GET',
    description: '用户昨日app发送量'
  },
  queryUserMonthQuantityGruopAppid: {
    url: '/statistics/message/user/getMonthQuantityGruopAppid',
    method: 'GET',
    description: '当月app发送量'
  },
  queryUserMonthQuantity: {
    url: '/statistics/message/user/getMonthQuantity',
    method: 'GET',
    description: '用户当月累计发送统计次数'
  },
  queryMonthChannelSendRank: {
    url: '/statistics/message/user/getMonthQuantityGruopChannel',
    method: 'GET',
    description: '用户当月渠道发送排名'
  },
  queryMonthQuantityGruopMessageType: {
    url: '/statistics/message/user/getMonthQuantityGruopMessageType',
    method: 'GET',
    description: '用户当月渠道发送排名'
  },
  queryUserSendNumberByTime: {
    url: '/statistics/message/user/getSendMessageQuantity',
    method: 'GET',
    description: '根据时间获取发送量统计'
  },
  queryUserActive: {
    url: '/overview/dynamic/query',
    method: 'POST',
    description: '查询用户的动态'
  },
  queryOverviewNotification: {
    url: '/statistics/bulletin/overview',
    method: 'POST',
    description: '查询通知公告信息'
  }
}