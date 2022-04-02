// 手机号格式校验
const phoneNumberRule = (val) => {
  if (val) {
    val = val.replace(/[ ]/g, '');
  }
  const pattern = /^1[0-9]{10}$/;
  return pattern.test(val);
}

// 账号格式校验
const accountRule = (val) => {
  const pattern = /^[a-zA-Z\d_]+$/;
  const patternNum = /^.{6,20}$/;
  const hasChinese = /[\u0391-\uFFE5]/g.test(val);
  return (
    accountStartRule(val)
    && pattern.test(val)
    && patternNum.test(val)
    && !hasChinese
  );
}

const accountStartRule = (val) => {
  // 英文字母起头
  const patternNum = /^[a-zA-Z]+/;
  return patternNum.test(val);
}

const passwordFormatRule = (val) => {
  // 必须包含英文字母、数字、下划线两种或以上
  const pattern = /^(?![a-zA-Z]+$)(?!\d+$)\S+$/;
  // 只能英文字母、数字、下划线
  // const pattern = /^[a-zA-Z\d_]+$/;
  return pattern.test(val);
}

const passwordNumRule = (val) => {
  const pattern = /^.{6,18}$/;
  return pattern.test(val);
}

// 密码格式校验
const passwordRule = (val) => {
  const hasChinese = /[\u0391-\uFFE5]/g.test(val);
  return (
    // passwordStartRule(val)
    passwordFormatRule(val)
    && passwordNumRule(val)
    && !hasChinese
  );
}

// 固定电话格式校验
const telephoneRule = (val) => {
  // 前面0开头的四位区号，中间7到8位的号码，末尾三位以上的分机号（分机号不强制校验）
  const pattern = /(0\d{3})-\d{7,8}(-(\d{3,}))?$/;
  return pattern.test(val);
}

// 超链接文本格式校验
const urlRule = (val) => {
  /* eslint-disable*/
  const pattern = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
  return pattern.test(val);
}

// APPID格式校验
const appIdRule = (val) => {
  const pattern = /(^[a-zA-Z]{1,30}$)|(^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{1,30}$)/;
  return pattern.test(val);
}

const templateIdRule = (val) => {
  // 只能英文字母、数字、下划线
  const pattern = /^[a-zA-Z\d_]+$/;
  return pattern.test(val);
}

export {
  phoneNumberRule,
  accountStartRule,
  passwordFormatRule,
  passwordNumRule,
  passwordRule,
  accountRule,
  telephoneRule,
  urlRule,
  appIdRule,
  templateIdRule
}