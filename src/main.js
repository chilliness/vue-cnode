import Vue from 'vue';
import axios from 'axios';
import BScroll from 'better-scroll';
import VueLazyload from 'vue-lazyload';
import moment from 'moment';
import qs from 'qs';
import App from './App';
import router from './router';
import api from './api';
import TopComponent from '@/base/top';
import ScrollComponent from '@/base/scroll';
import LoadingComponent from '@/base/loading';
import HeaderComponent from '@/base/header';

import './common/scss/index.scss';

Vue.config.productionTip = false;
Vue.use(TopComponent);
Vue.use(ScrollComponent);
Vue.use(LoadingComponent);
Vue.use(HeaderComponent);
Vue.use(VueLazyload, {
  loading: require('@/common/img/default.jpg'),
  error: require('@/common/img/default.jpg')
});

// axios请求拦截器
axios.interceptors.request.use((req) => {
  if (req.method.toLowerCase() == 'post') {
    req.data = qs.stringify(req.data);
  }
  return req;
});

// axios响应拦截器
axios.interceptors.response.use((res) => {
  // 此处可以配置响应拦截设置
  return res.data;
});
moment.locale('zh-cn');
Vue.prototype.$http = axios;
Vue.prototype.$BScroll = BScroll;
Vue.prototype.$api = api;
Vue.prototype.$moment = moment;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
