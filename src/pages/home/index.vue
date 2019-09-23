<template>
  <div class="home-wrap">
    <Header isHome @emitToggle="handleToggleLoginBar(true)">NodeJS论坛</Header>
    <ul class="nav-list">
      <li class="item-box" v-for="(item, index) in menus" :key="index" @click="handleChangeTab(item.alias, index)">{{item.text}}</li>
      <li class="line" :style="{left: form.active.index * 20 + '%'}"></li>
    </ul>
    <Scroll :isHome="true" :pullDownRefresh="pullDownRefresh" :pullUpLoad="pullUpLoad" :data="form.list" @emitRefresh="handleFetchData(true)" @emitLoad="handleFetchData" ref="scrollRef">
      <ul class="list-box">
        <li class="item-box" v-for="(item, index) in form.list" :key="index" @click="$router.push({name: 'topic', params: {id: item.id}})">
          <div class="avatar-box">
            <img class="avatar" :src="item.author.avatar_url" alt="头像" />
          </div>
          <div class="content">
            <div class="title">{{item.title}}</div>
            <div class="other">
              <div class="num">{{item.reply_count + '/' + item.visit_count}}</div>
              <div class="time">{{handleFormatTime(item.last_reply_at)}}</div>
            </div>
          </div>
          <i class="tag" v-if="item.top">置顶</i>
          <i class="tag good" v-else-if="item.good">精华</i>
        </li>
      </ul>
    </Scroll>
    <div class="login-bar" :class="{active: loginBarFlag}">
      <div class="login-box">
        <div class="user-bar">
          <div class="avatar-box" @click="handleLogin">
            <img class="avatar" :src="_user.avatar_url" alt="头像" />
          </div>
          <div class="text">{{_user.loginname || '点击头像登录'}}</div>
        </div>
        <ul class="other" v-if="_user.loginname">
          <li class="item" @click="handleLink('user')">用户详情</li>
          <li class="item" @click="handleLink('collect')">用户收藏</li>
          <li class="item" @click="handleLogout">退出登录</li>
        </ul>
      </div>
      <div class="bg-box" @click="handleToggleLoginBar(false)"></div>
    </div>
    <Loading isHome v-if="isLoading"></Loading>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      form: {
        list: [],
        page: 1,
        size: 20,
        active: { tab: 'all', index: 0 }
      },
      menus: [
        { text: '全部', alias: 'all' },
        { text: '精华', alias: 'good' },
        { text: '分享', alias: 'share' },
        { text: '问答', alias: 'ask' },
        { text: '招聘', alias: 'job' }
      ],
      pullDownRefresh: {
        threshold: 60,
        stop: 60,
        txt: '刷新成功'
      },
      pullUpLoad: {
        threshold: 0,
        txt: {
          more: '加载数据',
          noMore: '我是有底线的'
        }
      },
      isAjax: false,
      isLoading: true,
      loginBarFlag: false,
      avatar: require('./img/avatar.jpg')
    };
  },
  computed: {
    _user() {
      let obj = this.$store.state.user;
      if (!obj.avatar_url) {
        obj.avatar_url = this.avatar;
      }
      return obj;
    }
  },
  mounted() {
    this.handleFetchData();
  },
  methods: {
    handleFormatTime(time) {
      return this.$moment(time, 'YYYYMMDD')
        .fromNow()
        .replace(/\s/g, '');
    },
    handleChangeTab(tab, index) {
      if (!this.isAjax) {
        this.isLoading = true;
        this.form.active = { tab, index };
        this.handleFetchData(true);
      }
    },
    handleToggleLoginBar(bool) {
      this.loginBarFlag = bool;
    },
    handleLink(name) {
      this.handleToggleLoginBar(false);
      this.$router.push({ name, params: { name: this._user.loginname } });
    },
    handleLogout() {
      this.handleToggleLoginBar(false);
      this.$confirm({
        msg: '你确定要退出登录吗？',
        confirm: () => {
          this.$store.commit('$handleUser', {});
          this.$store.commit('$handleLogin', 0);
        }
      });
    },
    async handleFetchData(isRefresh = false) {
      if (this.isAjax) {
        return;
      }

      if (isRefresh) {
        this.form.page = 1;
        this.$refs.scrollRef.handleScrollTo();
      }

      try {
        this.isAjax = true;
        let res = await this.$http({
          url: `${this.$api.topicList}?page=${this.form.page}&limit=${this.form.size}&tab=${this.form.active.tab}`
        });
        this.isAjax = false;

        if (res.success) {
          if (isRefresh) {
            this.form.list = res.data;
            this.$refs.scrollRef.handleFinshPullDown();
          } else {
            this.form.list.push(...res.data);
            this.$refs.scrollRef.handleFinshPullUp(!res.data.length);
          }
          this.isLoading = false;
          this.form.page++;
        } else {
          this.$toast({ msg: res.error_msg });
          if (isRefresh) {
            this.$refs.scrollRef.handleFinshPullDown(this.$api.msg);
          }
        }
      } catch (e) {
        this.isAjax = false;
        this.$toast({ msg: this.$api.msg });
        if (isRefresh) {
          this.$refs.scrollRef.handleFinshPullDown(this.$api.msg);
        }
      }
    },
    async handleLogin() {
      if (this.isAjax || this._user.loginname) {
        return;
      }

      try {
        this.isAjax = true;
        let res = await this.$http({ url: this.$api.login, data: {} });
        this.isAjax = false;

        if (res.success) {
          this.$store.commit('$handleUser', res);
          this.$store.commit('$handleLogin', 1);
        } else {
          this.$toast({ msg: res.error_msg });
        }
      } catch (e) {
        this.isAjax = false;
        this.$toast({ msg: this.$api.msg });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.home-wrap {
  height: 100vh;
  font-size: 14px;
  .nav-list {
    position: relative;
    @include frow(space-between, stretch);
    height: 44px;
    margin-top: 1px;
    color: $fswhite;
    background: $bg00a;
    .item-box {
      @include frow();
      flex: 1;
    }
    .line {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 20%;
      height: 5px;
      transition: 0.2s;
      background: $bge43;
    }
  }
  .list-box {
    .item-box {
      position: relative;
      @include frow(space-between);
      padding: 15px 10px;
      &:nth-of-type(n + 2) {
        border-top: 1px dashed $bdccc;
      }
      &:last-child {
        border-bottom: 1px dashed $bdccc;
      }
      .avatar-box {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
        background: url(./img/avatar.jpg) no-repeat center;
        background-size: contain;
        .avatar {
          width: 100%;
          height: 100%;
        }
      }
      .content {
        flex: 1;
        margin-left: 10px;
        overflow: hidden;
        .title {
          padding-right: 1em;
          font-size: 16px;
          font-weight: bold;
          @include dot();
        }
        .other {
          @include frow(space-between);
          margin-top: 10px;
          font-size: 12px;
        }
      }
      .tag {
        position: absolute;
        right: 0;
        top: -1px;
        width: 1em;
        padding: 3px;
        font-size: 12px;
        line-height: 1.2;
        color: $fswhite;
        background: $bge43;
        &.good {
          background: $bg00a;
        }
      }
    }
  }
  .login-bar {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    @include frow(space-between, stretch);
    transform: translateX(-100%);
    &.active {
      transform: translateX(0);
      transition: 0.3s ease-in;
    }
    .login-box {
      $width: 140px;
      width: $width;
      color: $fswhite;
      background: $bgwhite;
      .user-bar {
        @include fcol();
        width: 100%;
        height: $width;
        background: $bg00a;
        .avatar-box {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
          .avatar {
            width: 100%;
            height: 100%;
          }
        }
        .text {
          margin-top: 10px;
        }
      }
      .other {
        .item {
          @include frow();
          height: 52px;
          color: $fs005;
          border-bottom: 1px dashed $bdccc;
        }
      }
    }
    .bg-box {
      flex: 1;
      backdrop-filter: blur(10px);
      background: rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
