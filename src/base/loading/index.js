import LoadingComponent from './loading.component.vue';

export default {
  install(Vue) {
    Vue.component('app-loading', LoadingComponent);
  }
};
