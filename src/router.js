import Vue from 'vue';
import Router from 'vue-router';
import session from '@/utils/storage';
import Home from '@/pages/home';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/topic/:id',
      name: 'topic',
      component: () => import('@/pages/topic')
    },
    {
      path: '/user/:name',
      name: 'user',
      component: () => import('@/pages/user')
    },
    {
      path: '/collect/:name',
      name: 'collect',
      meta: { auth: true },
      component: () => import('@/pages/collect')
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
});

router.beforeEach((to, from, next) => {
  // 此处做权限拦截
  if (to.meta.auth && !session.get('isLogin', 0)) {
    return next({ name: 'home' });
  }
  next();
});

export default router;
