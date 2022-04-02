export default {
  queryMsgChannelList: {
    url: '/configChannel/query',
    method: 'GET',
    description: '查询终端渠道配置列表信息'
  },
  getMsgChannelAppIdList: {
    url: '/configChannel/loadAppId',
    method: 'GET',
    description: '新增终端渠道配置页，前置加载当前可选appId'
  },
  addMsgChannel: {
    url: '/configChannel/add',
    method: 'POST',
    description: '新增终端渠道配置信息'
  },
  queryMsgChannelDateils: {
    url: '/configChannel/select',
    method: 'GET',
    description: '查询单个终端渠道配置信息'
  },
  updateMsgChannelInfo: {
    url: '/configChannel/update',
    method: 'POST',
    description: '修改终端渠道配置信息'
  },
  deleteMsgChannelInfo: {
    url: '/configChannel/delete',
    method: 'GET',
    description: '删除终端渠道配置信息'
  },
  bondBusinessChannel: {
    url: '/configChannel/associateRegionAndChannId',
    method: 'POST',
    description: '关联终端渠道业务域'
  },
  queryBondChannelList: {
    url: '/configChannel/queryRelatedChannId',
    method: 'POST',
    description: '获取已关联终端渠道'
  },
  queryNotBondChannelList: {
    url: '/configChannel/queryRelatedChannId',
    method: 'POST',
    description: '获取已关联终端渠道'
  }
}
