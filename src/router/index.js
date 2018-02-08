import Vue from 'vue';
import Router from 'vue-router';
import HomeComponent from '@/components/home/home.component';
import TopicComponent from '@/components/topic/topic.component';
import UserComponent from '@/components/user/user.component';
import LoginComponent from '@/components/login/login.component';
import MessageComponent from '@/components/message/message.component';
import TopicsComponent from '@/components/topics/topics.component';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeComponent
    },
    {
      path: '/topic/:id',
      name: 'topic',
      component: TopicComponent
    },
    {
      path: '/user/:loginname',
      name: 'user',
      component: UserComponent
    },
    {
      path: '/login',
      name: 'login',
      component: LoginComponent
    },
    {
      path: '/message',
      name: 'message',
      component: MessageComponent
    },
    {
      path: '/topics',
      name: 'topics',
      component: TopicsComponent
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
});

router.beforeEach((to, from, next) => {
  if ((to.name == 'message' || to.name == 'topics') && (sessionStorage.logined != 1)) {
    next({
      name: 'login',
      replace: true
    });
  }
  next();
});

export default router;
