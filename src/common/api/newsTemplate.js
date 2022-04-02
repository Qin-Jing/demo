export default {
  queryMsgTemplateList: {
    url: '/msgTemplate/queryAppidtMsgTemplate',
    method: 'POST',
    description: '根据appid查询所有模板'
  },
  addMsgTemplate: {
    url: '/msgTemplate/addMsgTemPlate',
    method: 'POST',
    description: '模板新增'
  },
  queryMsgTemplateDateils: {
    url: '/msgTemplate/queryMbxhMsgTemplate',
    method: 'POST',
    description: '查询模板详情'
  },
  updateMsgTemplateInfo: {
    url: '/msgTemplate/editMsgTemplate',
    method: 'POST',
    description: '修改模板详情'
  },
  deleteMsgTemplateInfo: {
    url: '/msgTemplate/deleteMsgTemplate',
    method: 'POST',
    description: '删除消息模板'
  }
}
