import Vue from 'vue';
import qs from 'qs';
import axios from 'axios';
import moment from 'moment';
import BScroll from 'better-scroll';
import App from './App';
import router from './router';
import store from './store';
import api from './utils/api';
import GobleToast from './components/toast';
import GobleConfirm from './components/confirm';
import Scroll from './components/scroll';
import Header from './components/header';
import Loading from './components/loading';
import './common/scss/index.scss';

Vue.config.productionTip = false;
moment.locale('zh-cn');
Vue.use(GobleToast);
Vue.use(GobleConfirm);
Vue.use(Scroll);
Vue.use(Header);
Vue.use(Loading);

// axios请求拦截器
axios.interceptors.request.use(req => {
  if (req.data) {
    req.method = 'post';
    req.data.accesstoken = 'cdede16e-538e-4827-871d-008f3bfa384d';
    req.data = qs.stringify(req.data);
  }
  return req;
});
// axios响应拦截器
axios.interceptors.response.use(res => res.data);

Vue.prototype.$http = axios;
Vue.prototype.$moment = moment;
Vue.prototype.$BScroll = BScroll;
Vue.prototype.$api = api;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
