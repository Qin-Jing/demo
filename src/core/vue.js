import Vue from 'vue';
import App from './App.vue';
import store from './vuex';
import RouterBuilder from './router';
import MixinBuilder from './mixin';
import ServiceBuilder from './service';
import ElementBuilder from './element';
import EventBuilder from './event';

import 'es6-promise-always';

export default {
  create(common) {

    Vue.config.productionTip = false;

    ElementBuilder.init(Vue);
    MixinBuilder.init(Vue, common.mixin);
    ServiceBuilder.init(Vue, common.urls);

    const router = RouterBuilder.init(common.router);
    EventBuilder.init(router);

    window.Vue = Vue;

    new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App)
    });

  }
};