import Vue from 'vue';
import Router from 'vue-router';
import session from '@/utils/storage';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/(home)?',
      name: 'home',
      component: () => import('@/pages/home')
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
      name: 'notFound',
      component: () => import('@/pages/notFound')
    }
  ]
});

router.beforeEach((to, from, next) => {
  // 解决路由切换confirm组件仍然显示bug
  if (to.path !== from.path && document.querySelector('.confirm-wrap')) {
    return next(false);
  }
  // 此处做权限拦截
  if (to.meta.auth && !session.get('isLogin', 0)) {
    return next({ name: 'home' });
  }
  next();
});

export default router;
