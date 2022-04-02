export default {
  queryDayStatisticList: {
    url: '/statistics/message/report/getDayReportQuantity',
    method: 'POST',
    description: '日报表查询'
  },
  queryMonthStatisticList: {
    url: '/statistics/message/report/getMonthReportQuantity',
    method: 'POST',
    description: '月报表查询'
  },
  queryTemplateList: {
    url: '/statistics/msgTemplateManager/queryMsgTemplateList',
    method: 'POST',
    description: '模板下拉弹出框'
  },
  queryMessageTypeList: {
    url: '/statistics/msgTypeManager/findMsgTypeList',
    method: 'POST',
    description: '消息类型下拉框查询'
  },
  queryApplyListByUser: {
    url: '/statistics/message/applist/getAppList',
    method: 'POST',
    description: '应用列表查询'
  }
}