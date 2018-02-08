<template>
  <div class="message-wrap">
    <header class="message-head">
      <i class="icon-back icon-undo2" @click="$router.back()"></i>
      <span>消息中心</span>
    </header>
    <nav class="message-nav">
      <a class="item" :class="{active: !active}" @click="onToggleNav(false)">{{'未读消息：' + unreadList.length}}</a>
      <a class="item" :class="{active: active}" @click="onToggleNav(true)">{{'已读消息：' + readList.length}}</a>
    </nav>
    <app-scroll class="message-main" :data="list" @scroll="onNowPos($event)" ref="scroll">
      <ul class="home-list">
        <router-link tag="li" :to="{name: 'topic', params: {id: item.topic.id}, query: {id: item.id}}" class="item" v-for="(item, index) of list" :key="index">
          <div class="avatar-box">
            <img class="avatar" width="40" height="40" v-lazy="item.author.avatar_url" alt="">
          </div>
          <dl class="text-box">
            <dt class="title">{{item.topic.title}}</dt>
            <dd class="other">
              <span class="name">{{'回复人：' + item.author.loginname}}</span>
              <time class="time">{{onFormatTime(item.create_at)}}</time>
            </dd>
          </dl>
        </router-link>
      </ul>
      <div class="btn-box">
        <a class="btn-read" v-if="!active && unreadList.length" @click="onClearUnread()">清空未读消息</a>
        <a class="btn-tip" v-else-if="(!active && !unreadList.length) || (active && !readList.length)">此处毫无生机。。。</a>
      </div>
    </app-scroll>
    <app-top :nowPos="nowPos" @top="onResetTop()"></app-top>
  </div>
</template>

<script>
import {
  resetTopMixin,
  resetLoadingMixin,
  formatTimeMixin
} from '@/common/js/mixin';

export default {
  mixins: [resetTopMixin, resetLoadingMixin, formatTimeMixin],
  data() {
    return {
      readList: [],
      unreadList: [],
      active: false,
      isAjax: false
    };
  },
  computed: {
    list() {
      return this.active ? this.readList : this.unreadList;
    }
  },
  created() {
    this.onInitData();
  },
  methods: {
    onInitData() {
      this.$http
        .get(this.$api.messages, {
          params: {
            accesstoken: sessionStorage.accesstoken
          }
        })
        .then(res => {
          if (res.success == this.$api.code) {
            this.readList = res.data.has_read_messages;
            this.unreadList = res.data.hasnot_read_messages;
          }
        });
    },
    onToggleNav(bool) {
      this.active = bool;
      this.onResetTop();
    },
    onClearUnread() {
      if (confirm('你确定要清空未读消息?')) {
        this.$http
          .post(this.$api.mark_all, {
            accesstoken: sessionStorage.accesstoken
          })
          .then(res => {
            if (res.success == this.$api.code) {
              this.onInitData();
            }
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.message-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .message-head {
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
    .icon-back {
      position: absolute;
      left: 10px;
      top: 50%;
      font-size: 24px;
      transform: translate3d(0, -50%, 0);
    }
  }
  .message-nav {
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
  .message-main {
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
    .other {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
    }
    .btn-box {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 60px;
      font-size: 14px;
    }
    .btn-read {
      padding: 10px 20px;
      border-radius: 3px;
      background: $bg22;
      color: $fsff;
    }
    .btn-tip {
      color: $fs04;
    }
  }
}
</style>
