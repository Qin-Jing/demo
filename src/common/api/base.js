export default {
  queryDataDictionary: {
    url: '/dict/query/list',
    method: 'GET',
    description: '数据字典接口'
  },
  uploadFile: {
    url: '/file/uploadFile',
    method: 'POST',
    description: '上传图片'
  },
  queryFileUrl: {
    url: '/file/query',
    method: 'GET',
    description: '查询图片'
  },
  checkDictionaryTypeRepeat: {
    url: '/dict/check/name',
    method: 'GET',
    description: '检查数据字典是否重复'
  },
  addDictionaryData: {
    url: '/dict/insert',
    method: 'POST',
    description: '新增字典'
  },
  updateDictionaryData: {
    url: '/dict/update',
    method: 'POST',
    description: '修改字典'
  },
  deleteDictionaryData: {
    url: '/dict/delete',
    method: 'GET',
    description: '删除字典'
  },
  queryMenuByUserRole: {
    url: '/auth/menu',
    method: 'POST',
    description: '根据角色查询菜单'
  },
  queryTaxOfficeList: {
    url: '/swjg/query/list',
    method: 'GET',
    description: '查询税务机关代码'
  },
  queryTaxOfficeListByUser: {
    url: 'swjg/query',
    method: 'GET',
    description: '根据用户token查询税务机关'
  },
  checkUserRouterAuthor: {
    url: '/auth/check/menu',
    method: 'GET',
    description: '查询用户是否有跳转该路由的权限'
  },
  queryApplyList: {
    url: '/maintain/appListController/findAppList',
    method: 'POST',
    description: '应用列表查询'
  },
  queryTaxOfficeInfoList: {
    url: '/maintain/swjgListController/findSwjgInfo',
    method: 'POST',
    description: '应用列表查询'
  },
  queryUserBaseInfoByToken: {
    url: 'user/baseInfo/token/query',
    method: 'POST',
    description: '查询用户基本信息',
    baseURL: '/pi/web/',
  },
  queryUserBaseInfo: {
    url: '/user/baseInfo/query',
    method: 'POST',
    description: '查询用户基本信息'
  },
  queryApplyCascader: {
    url: '/statistics/message/applist/getApplistByGs',
    method: 'POST',
    description: '查询应用的二级级联菜单'
  },
  queryMsgTypeCascader: {
    url: '/statistics/msgTypeManager/findMsgTypeCascadeList',
    method: 'POST',
    description: '查询业务类型的二级级联菜单'
  }
}