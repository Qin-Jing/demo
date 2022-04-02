import http from './http';

window.axios = http;

export default {
  // ...apis
  init(Vue, urls) {
    const apis = {};
    Object.keys(urls).forEach((key) => {
      const orginalOption = urls[key];
      apis[key] = (data, options) => {
        const method = (orginalOption.method || 'GET').toUpperCase();
        options = Object.assign({}, options, orginalOption);
        switch (method) {
        case 'POST':
          options.data = data;
          break;
        case 'GET':
          options.params = data || {};
          break;
        }
        return http.request(options);
      };
    });
    Vue.prototype.$http = apis;
  }
};
