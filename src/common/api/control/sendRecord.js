export default {
  queryAllApplyList: {
    url: '/record/getAllSyzApp',
    method: 'GET',
    description: '获取全部应用信息'
  },
  queryTemplateListRecord: {
    url: '/record/getTemplate',
    method: 'GET',
    description: '获取应用对应模板'
  },
  queryMessageRecordList: {
    url: '/record/getMessageRecord',
    method: 'POST',
    description: '获取消息记录列表'
  },
  queryMessageRecordDetail: {
    url: '/record/getMessageRecordDetail',
    method: 'GET',
    description: '获取消息记录详情'
  },
  queryMessageRecordChannelList: {
    url: 'record/getFailMssage',
    method: 'GET',
    description: '获取模板下某渠道的发送失败数据'
  },
  sendAgainMessage: {
    url: '/record/retransmit',
    method: 'GET',
    description: '获取模板下某渠道的发送失败数据'
  }
}