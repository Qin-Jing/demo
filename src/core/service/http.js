import axios from 'axios';
import system from '../utils/system';
import event from '../event/util';
import {
  SYSTEM_HTTP_RESPONSE_BUSINESS_ERROR,
  SYSTEM_HTTP_RESPONSE_SYSTEM_ERROR,
  SYSTEM_HTTP_RESPONSE_NOT_LOGIN
} from '../constant/event';

const instance = axios.create({
  baseURL: system.getBaseUrl(),
  timeout: 10000,
});

// // eslint-disable-next-line
// document.cookie = '_uab_collina=158711042107873643222672;'
// // eslint-disable-next-line
// document.cookie = 'JSESSIONID=375B363695800F46CF4A2F5B9CFC1F6A'
// // eslint-disable-next-line

instance.interceptors.request.use((config) => {
  /* eslint-disable */
  if ('get' === config.method && undefined === config.cache || false === config.cache) {
    config.params._ = Date.now();
  }
  // 请求头添加token
  // config.headers.Authorization = localStorage.getItem('authToken') || '';
  return config;
}, (error) => {
  return Promise.reject(error);
});

instance.interceptors.response.use(response => {
  const {data, config} = response;
  const {type, code, message} = data || {};
  if (code === 'success' || code === 'SUCCESS') {
    return Promise.resolve(data.data, data);
  } else {
    if (code === 'NOTLOGIN') {
      event.emit(SYSTEM_HTTP_RESPONSE_NOT_LOGIN);
      return Promise.reject(data);
    }
    if (config.notify !== false) {
      event.emit(SYSTEM_HTTP_RESPONSE_BUSINESS_ERROR, message);
    }
  }
  return Promise.reject(data);
}, error => {
  const {config} = error;
  if (config.notify !== false) {
    event.emit(SYSTEM_HTTP_RESPONSE_SYSTEM_ERROR, `系统异常 - ${error.message}`);
  }
  return Promise.reject(error);
});

export default instance;
