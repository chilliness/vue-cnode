<template>
  <div class="user-wrap">
    <app-header>
      <span>用户中心</span>
    </app-header>
    <app-scroll class="user-main" :data="list" @scroll="onNowPos($event)" v-if="list.length" ref="scroll">
      <div class="user-box">
        <img width="60" height="60" class="avatar" v-lazy="user.avatar_url" :alt="user.loginname">
        <div class="author">{{user.loginname}}</div>
        <div class="score">{{'积分：' + user.score}}</div>
        <time class="time">{{'注册于：' + onFormatTime(user.create_at)}}</time>
      </div>
      <ul class="user-list user-topics" v-if="user.recent_topics && user.recent_topics.length">
        <li class="item-item caption">最近创建的话题</li>
        <li class="item-item item" v-if="index < 10" v-for="(item, index) of user.recent_topics" :key="index" @click="onLink(item)">
          <img width="40" height="40" class="avatar" v-lazy="item.author.avatar_url" :alt="item.author.loginname">
          <h2 class="title">{{item.title}}</h2>
        </li>
      </ul>
      <ul class="user-list user-replies" v-if="user.recent_replies && user.recent_replies.length">
        <li class="item-item caption">最近参与的话题</li>
        <li class="item-item item" v-if="index < 10" v-for="(item, index) of user.recent_replies" :key="index" @click="onLink(item)">
          <img width="40" height="40" class="avatar" v-lazy="item.author.avatar_url" :alt="item.author.loginname">
          <h2 class="title">{{item.title}}</h2>
        </li>
      </ul>
      <ul class="user-list user-collection" v-if="user2.length">
        <li class="item-item caption">收藏的话题</li>
        <li class="item-item item" v-if="index < 10" v-for="(item, index) of user2" :key="index" @click="onLink(item)">
          <img width="40" height="40" class="avatar" v-lazy="item.author.avatar_url" :alt="item.author.loginname">
          <h2 class="title">{{item.title}}</h2>
        </li>
      </ul>
      <div class="placeholder"></div>
    </app-scroll>
    <app-top :nowPos="nowPos" @top="onResetTop()"></app-top>
  </div>
</template>

<script>
import { resetTopMixin, formatTimeMixin } from '@/common/js/mixin';

export default {
  mixins: [resetTopMixin, formatTimeMixin],
  data() {
    return {
      user: {},
      user2: [],
      list: []
    };
  },
  created() {
    this.onInitData();
  },
  methods: {
    onInitData() {
      let _this = this;
      function user() {
        return _this.$http.get(_this.$api.user + _this.$route.params.loginname);
      }
      function topicCollect() {
        return _this.$http.get(
          _this.$api.topic_collect + _this.$route.params.loginname
        );
      }
      this.$http.all([user(), topicCollect()]).then(
        this.$http.spread((res1, res2) => {
          if (
            res1.success == this.$api.code &&
            res2.success == this.$api.code
          ) {
            this.user = res1.data;
            this.user2 = res2.data;
            this.list = [
              ...this.user.recent_topics,
              ...this.user.recent_replies,
              ...this.user2
            ];
            if (sessionStorage.logined == 1 && !sessionStorage.user) {
              sessionStorage.user = JSON.stringify(res1.data);
            }
          }
        })
      );
    },
    onLink(item) {
      this.$router.push({ name: 'topic', params: { id: item.id } });
    }
  }
};
</script>

<style lang="scss" scoped>
.user-wrap {
  .user-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 50px;
    font-size: 14px;
    line-height: 1.5;
    .avatar {
      flex: 0 0 60px;
      width: 60px;
      height: 60px;
    }
    .author {
      padding-top: 5px;
    }
  }
  .user-list {
    margin: 40px;
    box-shadow: 0 0 5px $bdcc;
    .item-item {
      display: flex;
      align-items: center;
      height: 50px;
      overflow: hidden;
      padding: 0 10px;
    }
    .item {
      height: 60px;
      border-top: 1px dashed $bdcc;
    }
    .title {
      flex: 1;
      padding-left: 10px;
      font-size: 14px;
      font-weight: bold;
      @include dot;
    }
  }
  .placeholder {
    height: 1px;
  }
}
</style>
