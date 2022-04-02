export default {
  queryTemplateInfoList: {
    url: '/maintain/msgTemplateNew/queryMsgConfigTempListNew',
    method: 'POST',
    description: '模板列表信息查询'
  },
  queryTemplateAuditList: {
    url: '/maintain/msgTemplateNew/queryMsgTemplateAuditListNew',
    method: 'POST',
    description: '模板列表审核信息查询'
  },
  addTemplate: {
    url: '/maintain/msgTemplateNew/addBatchMsgTemPlate',
    method: 'POST',
    description: '批量新增模板'
  },
  queryTemplateDetail: {
    url: '/maintain/msgTemplateNew/queryMsgConfigTemplateDetails',
    method: 'POST',
    description: '查询模板详情'
  },
  queryTemplateChannelList: {
    url: '/configChannelType/messagegroup/query',
    method: 'GET',
    description: '查询终端渠道配置列表信息'
  },
  updateTemplate: {
    url: '/maintain/msgTemplateNew/editMsgTemplate',
    method: 'POST',
    description: '批量修改模板'
  },
  // 审核通过后 重新发起审核
  reUpdateTemplate: {
    url: '/maintain/msgTemplateNew/editPassMsgTemplate',
    method: 'POST',
    description: '审核通过后 重新发起审核'
  },
  deleteTemplate: {
    url: '/maintain/msgTemplateNew/deleteConfigTemplateNew',
    method: 'POST',
    description: '删除模板'
  },
  queryTempAuditRecord: {
    url: '/maintain/msgTemplateNew/queryMsgTemplateAuditList',
    method: 'POST',
    description: '获取模板审核记录'
  },
  updateTempAuditRecord: {
    url: '/maintain/msgTemplateNew/msgTemplateAudit',
    method: 'POST',
    description: '模板审核'
  },
  queryTemplateById: {
    url: '/maintain/msgTemplateNew/queryTemplateByAppidAndTemplateid',
    method: 'POST',
    description: '根据appid和模板id获取模板信息'
  },
  queryTemplateApplyCascade: {
    url: '/maintain/appListController/findAppListCascade',
    method: 'POST',
    description: '模板管理页面的二级级联接口'
  },
  queryTemplateMesType: {
    url: '/messageTypeManager/getMsgTypeCascade',
    method: 'POST',
    description: '模板管理页面的业务类型二级级联接口'
  },
  queryMessageGroup: {
    url: '/configmessagegroup/distinct/query',
    method: 'POST',
    description: '根据appid去重查询业务域'
  },
  queryTemplateChannel: {
    url: '/SmsTemplate/getTemplateChannelList',
    method: 'POST',
    baseURL: '/sms/web',
    description: '获取全量模版通道'
  },
}