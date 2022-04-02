export const DATA_DICTIONARY = {
  DATA_NOTIFY_TYPE_CONSTANT: 'tzgglx', // 通知公告类型数据字典查询类型
  DATA_OFFICE_CLASS_CONSTANT: 'swjgjj', // 税务机关数据字典查询类型
  DATA_INTEGRATION_CONFIG_TYPE_CONSTANT: 'cpjcfs', // 产品集成方式列表字典查询类型
  DATA_PRODUCT_TYPE_LIST_CONSTANT: 'cpzt', // 产品状态列表字典查询类型
  DATA_COMPANY_TYPE_LIST_CONSTANT: 'gs', // 公司列表字典查询类型
  DATA_NOTIFICATION_TYPE_LIST_CONSTANT: 'tzgglx', // 通知公告类型字典查询
}

export const USER_ROLE_TYPE = {
  PLATFORM_MANAGE: '1',
  PRODUCT_SUPPLIER: '2',
  PRODUCT_USER_MANAGE: '3',
  PRODUCT_USER: '4'
}

export const USER_STATE_REQUEST_TIME_OUT = 60000;

export const ECHARTS_LINE_OPTION = {
  title: {
    text: ''
  },
  tooltip: {
    trigger: 'axis'
  },
  color: [
    '#DB4D4D',
    '#FF751A',
    '#FFCC00',
    '#61D487',
    '#7BAFF8',
    '#7F5EC2'
  ],
  legend: {
    data: [],
    left: 0,
    // itemHeight: 20
    // padding: [0, 10, 100, 10]
  },
  grid: {
    left: '3%',
    right: '4%',
    top: '70',
    bottom: '15%',
    containLabel: true
  },
  toolbox: {
    feature: {
      restore: {
        iconStyle: {}
      }
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: 'value'
  },
  dataZoom: [
    {
      show: true,
      realtime: true,
      start: 35,
      end: 85,
      height: 20
    },
    {
      type: 'inside',
      realtime: true,
      start: 35,
      end: 85
    }
  ],
  series: []
}

export const ECHARTS_LINE_AREA_COLOR_LIST = [
  '#efb3b3',
  '#ffd1b3',
  '#FFefb3',
  '#61d487',
  '#c6ddfc',
  '#c8bae5'
]