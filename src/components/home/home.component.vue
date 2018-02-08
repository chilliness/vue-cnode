<template>
  <div class="home-wrap">
    <header class="home-head">
      <i class="icon-menu" @click="isMark = !isMark"></i>
      <span>NodeJS论坛</span>
      <i class="icon-tip icon-bell" @click="$router.push({name: 'message'})" v-if="unreadNum">
        <i class="num">{{unreadNum}}</i>
      </i>
    </header>
    <nav class="home-nav">
      <a class="item" :class="{active: active == item.alias}" v-for="(item, index) of menus" :key="index" @click="onSelect(item)">{{item.name}}</a>
    </nav>
    <app-scroll class="home-main" :data="list" :pullDownRefresh="pullDownRefresh" :pullUpLoad="pullUpLoad" :isPullOver="isPullOver" :isLoading="isLoading" @scroll="onNowPos($event)" @refresh="onInitDate(true, {isRefresh: true})" @load="onInitDate(false, {isLoading: true})" ref="scroll">
      <ul class="home-list">
        <router-link tag="li" :to="{name: 'topic', params: {id: item.id}}" class="item" v-for="(item, index) of list" :key="index">
          <div class="avatar-box">
            <img class="avatar" width="40" height="40" v-lazy="item.author.avatar_url" alt="">
          </div>
          <dl class="text-box">
            <dt class="title">
              <i class="top" v-show="item.top">顶</i>
              <i class="good" v-show="item.good">精</i>
              <i>{{item.title}}</i>
            </dt>
            <dd class="other">
              <span class="num">{{item.reply_count + '/' + item.visit_count}}</span>
              <time class="time">{{onFormatTime(item.create_at)}}</time>
            </dd>
          </dl>
        </router-link>
      </ul>
    </app-scroll>
    <app-top :nowPos="nowPos" @top="onResetTop()"></app-top>
    <transition-group name="slide">
      <div class="home-mark" :key="0" v-show="isMark" @click="isMark = !isMark">
      </div>
      <div class="center-box" :key="1" v-show="isMark" @click.stop>
        <div class="avatar-box">
          <template v-if="logined == 1">
            <img width="60px" height="60" class="avatar" :src="user.avatar_url" :alt="user.loginname">
            <div class="name">{{user.loginname}}</div>
            <div class="score">{{'积分：' + user.loginname}}</div>
            <time class="time">{{'注册于：' + onFormatTime(user.create_at)}}</time>
            <a class="btn-logout" @click="onLogout()">登出</a>
          </template>
          <template v-else>
            <img width="60px" height="60" class="avatar" src="./default.jpg" alt="默认头像" @click="$router.push({name: 'login'})">
            <div class="tip">点击头像登录</div>
          </template>
        </div>
        <ul class="user-box" v-if="logined == 1">
          <li class="item" @click="$router.push({name: 'user', params: {loginname: user.loginname}})">
            <i class="icon-item icon-user-tie"></i>
            <span>个人中心</span>
          </li>
          <li class="item" @click="$router.push({name: 'topics'})">
            <i class="icon-item icon-quill"></i>
            <span>新建主题</span>
          </li>
          <li class="item" @click="$router.push({name: 'message'})">
            <i class="icon-item icon-bell"></i>
            <span>消息</span>
          </li>
        </ul>
      </div>
    </transition-group>
  </div>
</template>

<script>
import {
  resetTopMixin,
  resetLoadingMixin,
  formatTimeMixin
} from '@/common/js/mixin';

const LIMIT = 20;

export default {
  mixins: [resetTopMixin, resetLoadingMixin, formatTimeMixin],
  data() {
    return {
      active: sessionStorage.active || 'all',
      menus: [
        { name: '全部', alias: 'all' },
        { name: '精华', alias: 'good' },
        { name: '分享', alias: 'share' },
        { name: '问答', alias: 'ask' },
        { name: '招聘', alias: 'job' }
      ],
      list: [],
      page: 1,
      limit: LIMIT,
      isPullOver: false,
      isLoading: {
        loadFlag: false,
        refreshFlag: true
      },
      isAjax: false,
      isMark: false,
      logined: sessionStorage.logined,
      user: JSON.parse(sessionStorage.user || '{}'),
      unreadNum: 0
    };
  },
  mounted() {
    this.onUnreadCount();
    this.onInitDate();
  },
  methods: {
    onSelect(item) {
      this.active = sessionStorage.active = item.alias;
      // 置顶
      this.onResetTop();
      // 重新加载数据
      this.onInitDate(true);
    },
    onInitDate(bool, options = {}) {
      if (this.isAjax) {
        return;
      }

      this.isAjax = true;

      // 是否是刷新操作
      bool && (this.page = 1) && (this.isPullOver = false);

      if (this.isPullOver) {
        return;
      }

      this.isLoading.loadFlag = this.isLoading.refreshFlag = true;
      let params = { page: this.page, limit: this.limit };

      if (this.active != 'all') {
        params.tab = this.active;
      }

      this.$http
        .get(this.$api.topics, { params })
        .then(res => {
          if (res.success == this.$api.code) {
            if (this.page++ == 1) {
              this.list.length = 0;
            }
            // 当前分类是否还有数据 | (此处判断并不完善，介于api没有提供额外参数，所以只能这样做)
            this.isPullOver = res.data.length != LIMIT;
            this.list = this.list.concat(res.data);

            options.isRefresh && this.$refs.scroll.onFnishPullDown();
            options.isLoading && this.$refs.scroll.onFnishPullUp();
          }
          this.isAjax = false;
        })
        .catch(() => (this.isAjax = false));
    },
    onLogout() {
      if (confirm('你确定要退出登录?')) {
        this.logined = sessionStorage.logined = 0;
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('accesstoken');
        this.isMark = false;
      }
    },
    onUnreadCount() {
      let accesstoken = sessionStorage.accesstoken;
      if (this.logined == 1 && accesstoken) {
        this.$http
          .get(this.$api.count, {
            params: {
              accesstoken
            }
          })
          .then(res => {
            if (res.success == this.$api.code) {
              this.unreadNum = res.data;
            }
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.home-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .home-head {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    font-size: 18px;
    color: $fsff;
    background: $bg22;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px;
    .icon-menu,
    .icon-tip,
    .num {
      position: absolute;
      top: 50%;
      transform: translate3d(0, -50%, 0);
    }
    .icon-menu {
      left: 15px;
      font-size: 26px;
    }
    .icon-tip {
      right: 15px;
      font-size: 22px;
    }
    .num {
      right: -8px;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      font-size: 12px;
      border-radius: 50%;
      transform: translate3d(0, -90%, 0);
      background: $bgfc;
    }
  }
  .home-nav {
    display: flex;
    justify-content: space-between;
    height: 44px;
    font-size: 14px;
    color: $fsff;
    background: $bg22;
    overflow: hidden;
    .item {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      height: 100%;
      opacity: 0.8;
      &:after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 4px;
        transform: scaleX(0);
        background: $bge3;
      }
      &.active {
        opacity: 1;
        &:after {
          transition: 0.5s;
          transform: scaleX(1);
        }
      }
    }
  }
  .home-main {
    top: 94px;
    .item {
      display: flex;
      align-items: center;
      height: 80px;
      padding: 10px;
      border-bottom: 1px dashed $bdcc;
      box-sizing: border-box;
    }
    .avatar-box {
      flex: 0 0 50px;
      width: 50px;
    }
    .text-box {
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      flex: 1;
      height: 100%;
      overflow: hidden;
    }
    .title {
      font-size: 16px;
      font-weight: bold;
      @include dot;
    }
    .top {
      color: $fs0b;
      margin-right: 5px;
    }
    .good {
      color: $fscc;
      margin-right: 5px;
    }
    .other {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
    }
  }
  .home-mark {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 8;
    background: rgba(0, 0, 0, 0.5);
  }
  .center-box {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 200px;
    z-index: 9;
    background: $bgff;
    .avatar-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 80px 0 30px;
      font-size: 14px;
      color: $fsff;
      background: $bg22;
    }
    .avatar {
      flex: 0 0 60px;
      width: 60px;
      height: 60px;
    }
    .tip,
    .name,
    .score,
    .time {
      margin-top: 10px;
    }
    .btn-logout {
      margin-top: 15px;
      padding: 10px 20px;
      border-radius: 3px;
      background: $bgfc;
    }
    .item {
      display: flex;
      align-items: center;
      height: 44px;
      margin-bottom: 1px;
      font-size: 16px;
      color: $fs04;
      background: $bgf6;
    }
    .icon-item {
      padding: 0 10px;
    }
  }
}

.slide-enter-active,
.slide-leave-active {
  &.home-mark,
  &.center-box {
    transition: 0.3s;
  }
}

.slide-enter,
.slide-leave-to {
  &.home-mark {
    opacity: 0;
  }
  &.center-box {
    transform: translate3d(-100%, 0, 0);
  }
}
</style>
