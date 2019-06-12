import Vue from 'vue';
import Vuex from 'vuex';
import session from '@/utils/storage';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: session.get('isLogin', 0),
    user: session.get('user', {})
  },
  mutations: {
    $handleLogin(state, num) {
      state.isLogin = session.set('isLogin', num);
      !num && session.clear();
    },
    $handleUser(state, obj) {
      state.user = session.set('user', obj);
    }
  }
});
