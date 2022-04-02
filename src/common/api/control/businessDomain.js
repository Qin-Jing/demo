export default {
  queryBusinessDomain: {
    url: '/configChannel/queryRegionChannId',
    method: 'GET',
    description: '获取业务域列表'
  },
  queryRelateChannel: {
    url: '/configChannel/queryRelatedChannId',
    method: 'GET',
    description: '获取已关联终端渠道'
  },
  queryUnRelatedChannId: {
    url: '/configChannel/queryUnRelatedChannId',
    method: 'GET',
    description: '获取未关联终端渠道'
  },
  updateRelateChannel: {
    url: '/configChannel/associateRegionAndChannId',
    method: 'POST',
    description: '更新关联终端渠道'
  }
}