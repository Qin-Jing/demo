import Vue from 'vue';
import Router from 'vue-router';
// import store from './store'

Vue.use(Router);

/* eslint-disable */
let router;

// router.beforeEach((to, from, next) => {
//   store.commit('updateIsLoading', { isLoading: true });
//   next();
// });

export default {
  init(RouterConfig) {
    return router ? router : router = new Router({
      base: process.env.BASE_URL,
      routes: [
        ...RouterConfig
      ],
      scrollBehavior (to, from, savedPosition) {
        // 按前进后退不返回顶部
        if (savedPosition) {
          return savedPosition
        } else {
          // 返回顶部
          return { x: 0, y: 0 }
        }
      }
    });
  }
};
