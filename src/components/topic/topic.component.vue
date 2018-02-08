<template>
  <div class="topic-wrap">
    <app-header>
      <span>详情</span>
    </app-header>
    <app-scroll class="topic-main" @scroll="onNowPos($event)" v-if="content.create_at" ref="scroll">
      <aside class="author-bar">
        <div class="avatar-box">
          <img class="avatar" width="40" height="40" v-lazy="content.author && content.author.avatar_url" :alt="content.author && content.author.loginname" @click="onLinkUser(content)">
          <div class="collect-bar" v-if="logined == 1" @click="onToggleCollection(content.is_collect)">
            <i class="icon-collect icon-rss2" :class="{on: content.is_collect}"></i>
            <span class="author">{{content.is_collect ? '已收藏' : '未收藏'}}</span>
          </div>
        </div>
        <div class="time-box">
          <time class="time">{{'发表于' + onFormatTime(content.create_at)}}</time>
          <dl class="interactive">
            <dt class="reply">
              <i class="icon-bubbles"></i>
              <span>{{content.reply_count}}</span>
            </dt>
            <dd class="visit">
              <i class="icon-eye"></i>
              <span>{{content.visit_count}}</span>
            </dd>
          </dl>
        </div>
      </aside>
      <h1 class="topic-title">{{content.title}}</h1>
      <article class="article" v-html="content.content"></article>
      <aside class="comments-box">
        <h3 class="caption">{{'共有条' + content.reply_count + '留言'}}</h3>
        <ol class="list" v-if="content.reply_count">
          <li class="item" v-for="(item, index) of content.replies" :key="index">
            <div class="item-item">
              <div class="avatar-box" @click="onLinkUser(item)">
                <img width="40" height="40" class="avatar" v-lazy="item.author.avatar_url" alt="">
                <span class="floor">{{++index + '楼'}}</span>
              </div>
              <div class="reply-box">
                <dl class="user">
                  <span class="name">{{item.author.loginname == content.author.loginname ? '楼主' : item.author.loginname}}</span>
                  <time class="time">{{onFormatTime(content.create_at)}}</time>
                </dl>
                <div class="reply" v-html="item.content"></div>
                <div class="love-box">
                  <span class="reply-text" @click="onCheckLogin(item)">回复</span>
                  <span class="love" @click="onToggleLove(item)">
                    <i class="icon-vimeo2" :class="{'icon-love': item.is_uped}"></i>
                    <span class="num">{{item.ups.length}}</span>
                  </span>
                </div>
              </div>
            </div>
            <transition-group name="slide">
              <div class="login-box" :key="0" v-show="item.logined && logined != 1">
                <a class="login" @click="onLogin()">点击登录</a>
              </div>
              <div class="reply-bar" :key="1" v-show="item.logined && logined == 1">
                <div class="reply-form">
                  <input class="text" type="text" v-once :value="`@${item.author.loginname} `">
                  <div class="line"></div>
                  <a class="btn-reply" @click="onReply(item, $event)">回复</a>
                </div>
              </div>
            </transition-group>
            <div class="border"></div>
          </li>
        </ol>
        <div class="login-box" v-if="logined != 1">
          <a class="login" @click="onLogin()">点击登录</a>
        </div>
        <div class="reply-bar" v-else>
          <div class="reply-form">
            <input class="text" type="text" placeholder="请输入回复内容">
            <div class="line"></div>
            <a class="btn-reply" @click="onReply(content, $event)">回复</a>
          </div>
        </div>
      </aside>
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
      content: {},
      id: this.$route.params.id,
      logined: sessionStorage.logined,
      accesstoken: sessionStorage.accesstoken
    };
  },
  created() {
    this.onInitData();
    this.onMarkOne();
  },
  methods: {
    onInitData() {
      let params = {};
      if (this.logined == 1) {
        params.accesstoken = this.accesstoken;
      }
      this.$http
        .get(this.$api.topic + this.id, { params })
        .then(res => {
          if (res.success == this.$api.code) {
            this.content = res.data;

            this.content.replies.forEach(item => {
              this.$set(item, 'logined', false);
            });
          }
        })
        .catch(err => console.log(err));
    },
    onCheckLogin(obj) {
      if (obj.logined) {
        obj.logined = false;
      } else {
        this.content.replies.forEach(item => {
          if (item.id == obj.id) {
            obj.logined = true;
          } else {
            item.logined = false;
          }
        });
      }
    },
    onReply(obj, ev) {
      let content = ev.target.parentNode.querySelector('.text').value;
      let options = { accesstoken: this.accesstoken, content };
      if (!content.replace(/^\s|\s$/g, '').length) {
        return;
      }

      if (!obj.author_id) {
        // 官方api介绍的reply_id字段，我看到的值都为null，不知道是不是官方写的有问题
        options.reply_id = obj.reply_id;
      }

      this.$http
        .post(`${this.$api.replies}${this.content.id}/replies`, options)
        .then(res => {
          if (res.success == this.$api.code) {
            content = '';
            this.onInitData();
          }
        });
    },
    onToggleLove(obj) {
      if (this.logined != 1) {
        this.onCheckLogin(obj);
        return;
      }
      // 官方规定自己不能给自己点赞
      if (obj.author.loginname == JSON.parse(sessionStorage.user).loginname) {
        return;
      }
      this.$http
        .post(`${this.$api.ups}${obj.id}/ups`, {
          accesstoken: this.accesstoken
        })
        .then(res => {
          if (res.success == this.$api.code) {
            (obj.is_uped = !obj.is_uped) ? obj.ups.push(1) : obj.ups.pop();
          }
        });
    },
    onLinkUser(obj) {
      this.$router.push({
        name: 'user',
        params: { loginname: obj.author.loginname }
      });
    },
    onLogin() {
      this.$router.push({ name: 'login' });
    },
    onMarkOne() {
      let id = this.$route.query.id;
      let accesstoken = this.accesstoken;
      if (this.logined == 1 && accesstoken && id) {
        this.$http.post(this.$api.mark_one + id, { accesstoken });
      }
    },
    onToggleCollection(bool) {
      let api;
      if (bool) {
        api = this.$api.de_collect;
      } else {
        api = this.$api.collect;
      }

      this.$http
        .post(api, {
          accesstoken: this.accesstoken,
          topic_id: this.id
        })
        .then(res => {
          if (res.success == this.$api.code) {
            this.content.is_collect = !bool;
          }
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style lang="scss" scoped>
.topic-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .author-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    padding: 0 10px;
    font-size: 14px;
    border-bottom: 1px dashed $bdcc;
    box-sizing: border-box;
    .avatar-box {
      display: flex;
      align-items: center;
    }
    .collect-bar {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      margin-left: 10px;
    }
    .icon-collect {
      padding-bottom: 5px;
      font-size: 20px;
      &.on {
        color: $fscc;
      }
    }
    .time-box {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 60%;
    }
    .time {
      text-align: right;
    }
    .interactive {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    .visit {
      padding-left: 10px;
    }
  }
  .topic-title {
    line-height: 1.5;
    text-align: center;
    padding: 10px;
    font-size: 18px;
    font-weight: bolder;
    border-bottom: 1px solid $bdcc;
  }
  .comments-box {
    .caption {
      line-height: 2;
      margin: 0.5em 1em 0.5em 0;
      padding-left: 0.5em;
      font-size: 16px;
      font-weight: bold;
      border-left: 5px solid $bd04;
    }
    .item-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      padding: 10px 0;
    }
    .border {
      border-bottom: 1px dashed $bdcc;
    }
    .avatar-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 0 0 60px;
      width: 60px;
    }
    .floor {
      padding-top: 10px;
    }
    .reply-box {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding-right: 10px;
    }
    .user {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .name {
      color: $fscc;
    }
    .love-box {
      text-align: right;
      padding-top: 5px;
    }
    .reply-text,
    .love {
      padding: 10px 0 10px 10px;
    }
    .icon-love {
      color: $fscc;
    }
    .login-box {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 110px;
    }
    .login {
      padding: 10px;
      color: $fs04;
    }
    .reply-bar {
      height: 110px;
    }
    .reply-form {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 260px;
      margin: 0 auto;
    }
    .text {
      display: flex;
      align-items: center;
      font-size: 16px;
      width: 100%;
      height: 40px;
      border-bottom: 1px solid $bdcc;
    }
    .text:focus + .line {
      transform: scaleX(1);
    }
    .line {
      position: absolute;
      left: 0;
      right: 0;
      top: 40px;
      border-bottom: 1px solid $bd04;
      transform: scaleX(0);
      transition: 0.3s;
    }
    .btn-reply {
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 14px;
      color: $fsff;
      border-radius: 3px;
      background: $bg22;
    }
  }
}

.slide-enter-active {
  animation: anim-height 0.3s;
}

.slide-leave-active {
  animation: anim-height 0.3s reverse;
}

@keyframes anim-height {
  0% {
    height: 0;
    opacity: 0;
  }
  100% {
    height: 110px;
    opacity: 1;
  }
}
</style>
