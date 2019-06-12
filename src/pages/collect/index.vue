<template>
  <div class="collect-wrap">
    <Header>收藏</Header>
    <Scroll :data="list">
      <div class="content">
        <div class="user-bar">
          <div class="avatar-box">
            <img class="avatar" :src="_user.avatar_url" alt="头像">
          </div>
          <div class="text name">{{_user.loginname}}</div>
          <div class="text num">{{'收藏了' + list.length + '话题'}}</div>
        </div>
        <div class="topic-box">
          <h2 class="caption">收藏的话题</h2>
          <ul class="list-box" v-if="list.length">
            <li class="item-box" v-for="(item, index) in list" :key="index" @click="$router.push({name: 'topic', params: {id: item.id}})">
              <div class="avatar-box">
                <img class="avatar" :src="item.author.avatar_url" alt="头像">
              </div>
              <div class="desc-box">
                <h3 class="title">{{item.title}}</h3>
                <div class="time">{{item.author.loginname + '发表于' + handleFormatTime(item.last_reply_at)}}</div>
              </div>
            </li>
          </ul>
          <div class="nothing-box" v-else>这个家伙很懒，什么也没留下</div>
        </div>
      </div>
    </Scroll>
    <Loading v-if="isLoading"></Loading>
  </div>
</template>

<script>
export default {
  name: 'Collect',
  data() {
    return {
      list: [],
      isAjax: false,
      isLoading: true
    };
  },
  computed: {
    _user() {
      return this.$store.state.user;
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
    async handleFetchData() {
      if (this.isAjax) {
        return;
      }

      try {
        this.isAjax = true;
        let res = await this.$http({
          url: `${this.$api.collectList}/${this.$route.params.name}`
        });
        this.isAjax = false;

        if (res.success) {
          this.isLoading = false;
          this.list = res.data;
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
.collect-wrap {
  height: 100vh;
  font-size: 14px;
  .content {
    padding: 20px 0;
    .user-bar {
      @include fcol();
      width: calc(100vw - 40px);
      height: 170px;
      margin: 0 auto;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
      .avatar-box {
        width: 60px;
        height: 60px;
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
      .text {
        margin-top: 10px;
      }
    }
    .topic-box {
      width: calc(100vw - 40px);
      margin: 20px auto 0;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
      .caption {
        @include frow();
        height: 40px;
        padding-left: 10px;
        font-size: 16px;
      }
      .item-box {
        @include frow(space-between);
        padding: 15px 10px;
        border-top: 1px dashed $bdccc;
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
        .desc-box {
          flex: 1;
          margin-left: 10px;
          overflow: hidden;
          .title {
            @include dot();
            font-size: 14px;
            font-weight: bold;
          }
          .time {
            font-size: 12px;
            margin-top: 10px;
          }
        }
      }
      .nothing-box {
        @include frow();
        height: 100px;
        border-top: 1px dashed $bdccc;
      }
    }
  }
}
</style>
