import event from './util';
import {Message} from 'element-ui';
import {
  SYSTEM_HTTP_RESPONSE_BUSINESS_ERROR,
  SYSTEM_HTTP_RESPONSE_NOT_LOGIN,
  SYSTEM_HTTP_RESPONSE_SYSTEM_ERROR
} from '../constant/event';

let timer = null;

export default {
  init(router) {
    event.on(SYSTEM_HTTP_RESPONSE_BUSINESS_ERROR, (content) => {
      if (!timer) {
        Message.closeAll();
        Message.error(content || '未返回有效数据');
        timer = setTimeout(() => {
          timer = null;
        }, 3000)
      }
    });
    event.on(SYSTEM_HTTP_RESPONSE_SYSTEM_ERROR, (content) => {
      if (!timer) {
        Message.closeAll();
        Message.error(`系统异常 - ${content}`);
        timer = setTimeout(() => {
          timer = null;
        }, 3000)
      }
    });
    event.on(SYSTEM_HTTP_RESPONSE_NOT_LOGIN, () => {
      // token失效后清除token
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      router.push('/login');
    });
  }
};
