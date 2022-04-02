import mixin from './mixin';
import router from './router';
import urls from './api';

import ElementUiBuilder from './element';

export default {
  init() {
    ElementUiBuilder.init();
  },
  config: {
    mixin,
    router,
    urls
  }
};
