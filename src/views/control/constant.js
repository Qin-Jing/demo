/**
 * 单页面最下角的按钮路由集合
 */
export const PAGE_HAS_BOTTOM = [
  '/control'
];

export const EDIT_BANNER_CONST_MAX_ADD_LIST_NUMBER = 6;

// 格式化时间
export function modifyFormatterTime(time) {
  // 保留两位小数 8.5 => 8.50 防止 8.5 拆分后小数是5 而不是50
  const point = `${(time / 3600).toFixed(2)}`;
  const arr = point.split('.');
  const hour = Number(arr[0]);
  const min = !Number(arr[1]) ? '00' : Number(arr[1]) * 0.6;
  return hour < 10 ? `0${hour}:${min}` : `${hour}:${min}`;
}
 
// 时间戳转为时间
function add0(m) { return m < 10 ? '0' + m : m }
export function timestampToTime(stamp) {
  if (!stamp) return '';
  const time = new Date(stamp);
  const y = time.getFullYear();
  const m = time.getMonth() + 1;
  const d = time.getDate();
  const h = time.getHours();
  const mm = time.getMinutes();
  // const s = time.getSeconds();
  // return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm);
}

// 转换显示终端渠道
export function transformChannelIdName(info) {
  return info.channelIdName ? `${info.channelIdName}(${info.channelId})` : info.channelId;
}

// 转换渠道类型
export function transformChannel(info, type = 'detail') {
  if (type === 'table') {
    return info.channelName ? `${info.channelName}` : info.channel;
  }
  return info.channelName ? `${info.channelName}(${info.channel})` : info.channel;
}

// 优先级
export const orderList = [
  {
    value: '1',
    label: '高'
  },
  {
    value: '2',
    label: '中'
  },
  {
    value: '3',
    label: '低'
  }
];

// 期望开始生效时间
export function transformEffectTime(info) {
  if (!info.activeTime) {
    return '立即生效';
  }
  return timestampToTime(info.activeTime);
}

// 生效时间转换 保存时
export function transActiveTime(time) {
  if (!time) return time;
  const splitTime = time.split(' ');
  if (splitTime[1].length < 3) return `${splitTime[0]} ${splitTime[1]}:00`;
  return time;
}