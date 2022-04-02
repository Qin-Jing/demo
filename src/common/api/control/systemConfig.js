export default {
  queryTerminalChannelList: {
    url: '/configChannel/query',
    method: 'GET',
    description: '获取终端渠道列表'
  },
  queryChannelTypeList: {
    url: '/configChannelType/query',
    method: 'GET',
    description: '获取终端渠道列表'
  },
  queryTerminalChannelDetail: {
    url: '/configChannel/select',
    method: 'GET',
    description: '获取终端渠道详情'
  },
  queryApplyChannelList: {
    url: '/configRegion/queryRegionDetail',
    method: 'GET',
    description: '应用渠道分配查询'
  },
  queryApplyDetail: {
    url: 'maintain/appListController/findUserAppDetails',
    method: 'GET',
    description: '应用详情查询'
  },
  queryBusinessTypeList: {
    url: '/messageTypeManager/getMsgTypeCascade',
    method: 'POST',
    description: '应用详情查询'
  },
  addBusinessType: {
    url: '/messageTypeManager/addMessageType',
    method: 'POST',
    description: '业务类型添加'
  },
  editBusinessType: {
    url: '/messageTypeManager/editMessageType',
    method: 'POST',
    description: '业务类型修改'
  },
  deleteBusinessType: {
    url: '/messageTypeManager/deleteMessageType',
    method: 'POST',
    description: '业务类型删除'
  },
  checkTypeCodeRepeat: {
    url: '/messageTypeManager/validateMessageType',
    method: 'POST',
    description: '检验业务类型编码重复'
  },
  msgTypeSort: {
    url: '/messageTypeManager/MsgType/sort',
    method: 'POST',
    description: '业务类型排序'
  }
}
