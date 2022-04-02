export default {
  init(Vue, commonMixin) {
    Object.keys(commonMixin).forEach((key) => {
      Vue.mixin(commonMixin[key]);
    });
  }
};
