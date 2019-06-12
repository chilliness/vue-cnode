<template>
  <div class="topic-wrap">
    <Header>{{title}}</Header>
    <Scroll observeDOM :data="[article]" @scroll="handleUpdateTitle">
      <div class="content-box">
        <h2 class="title">{{article.title}}</h2>
        <div class="user-bar" v-if="article.author">
          <div class="user-box">
            <div class="avatar-box">
              <img class="avatar" :src="article.author.avatar_url" alt="头像">
            </div>
            <dl class="other">
              <dt class="name">{{article.author.loginname}}</dt>
              <dt class="time">{{'发表于' + handleFormatTime(article.create_at)}}</dt>
            </dl>
          </div>
          <div class="view-box">
            <i class="iconfont icon-view"></i>
            <span class="text">{{article.visit_count + '次'}}</span>
          </div>
          <img class="tag" :src="top" alt="置顶" v-if="article.top">
          <img class="tag" :src="good" alt="精华" v-else-if="article.good">
        </div>
        <div v-html="article.content"></div>
      </div>
      <div class="reply-box" v-if="article.replies">
        <h3 class="title" ref="message">{{'共有' + article.replies.length +'条留言'}}</h3>
        <ul class="list-box" v-if="article.replies.length">
          <li class="item-box" v-for="(item, index) in article.replies" :key="index">
            <div class="user-box" @click="$router.push({name: 'user', params: {name: item.author.loginname}})">
              <div class="avatar-box">
                <img class="avatar" :src="item.author.avatar_url" alt="头像">
                <span class="tag" v-if="item.author.loginname === article.author.loginname">楼主</span>
              </div>
              <div class="floor">{{(index + 1) + '楼'}}</div>
            </div>
            <div class="info-box">
              <div class="other">
                <div class="time">{{item.author.loginname + '发表于' + handleFormatTime(item.create_at)}}</div>
                <div class="feedback">
                  <i class="iconfont icon-vote"></i>
                  <span class="text">{{item.ups.length}}</span>
                </div>
              </div>
              <div v-html="item.content"></div>
            </div>
          </li>
        </ul>
        <div class="nothing-box" v-else>暂无评论，快去抢沙发</div>
      </div>
    </Scroll>
    <Loading v-if="isLoading"></Loading>
  </div>
</template>

<script>
export default {
  name: 'Topic',
  data() {
    return {
      title: '详情',
      article: {},
      isAjax: false,
      isLoading: true,
      top: require('./img/good.gif'),
      good: require('./img/good.gif')
    };
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
    handleUpdateTitle() {
      if (this.$refs.message) {
        let obj = this.$refs.message.getBoundingClientRect();
        this.title = obj.top > 50 ? '详情' : '留言';
      }
    },
    async handleFetchData() {
      if (this.isAjax) {
        return;
      }

      try {
        this.isAjax = true;
        let res = await this.$http({
          url: `${this.$api.topic}/${this.$route.params.id}`
        });
        this.isAjax = false;

        if (res.success) {
          this.isLoading = false;
          this.article = res.data;
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
.topic-wrap {
  height: 100vh;
  font-size: 14px;
  .content-box {
    .title {
      text-align: justify;
      line-height: 1.3;
      padding: 10px 10px 0;
      font-size: 18px;
      font-weight: bold;
    }
    .user-bar {
      position: relative;
      @include frow(space-between);
      padding: 10px;
      .user-box {
        @include frow(flex-start);
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
        .other {
          margin-left: 10px;
          .time {
            margin-top: 8px;
          }
        }
      }
      .view-box {
        .text {
          margin-left: 5px;
        }
      }
      .tag {
        position: absolute;
        right: 10px;
        top: -30px;
        width: 90px;
      }
    }
  }
  .reply-box {
    .title {
      @include frow(flex-start);
      height: 30px;
      padding-left: 0.5em;
      font-size: 16px;
      font-weight: bold;
      border-left: 5px solid $bde43;
    }
    .list-box {
      padding: 0 10px;
      .item-box {
        padding: 15px 0;
        @include frow(space-between, flex-start);
        &:nth-of-type(n + 2) {
          border-top: 1px dashed $bdccc;
        }
        .user-box {
          width: 40px;
          .avatar-box {
            position: relative;
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
            .tag {
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              text-align: center;
              padding-bottom: 2px;
              font-size: 12px;
              color: $fswhite;
              background: $bge43;
            }
          }
          .floor {
            margin-top: 10px;
            text-align: center;
          }
        }
        .info-box {
          flex: 1;
          margin-left: 10px;
          overflow: hidden;
          .other {
            @include frow(space-between);
            padding-bottom: 5px;
            .time {
              font-size: 12px;
            }
            .text {
              margin-left: 5px;
            }
          }
        }
      }
    }
    .nothing-box {
      @include frow();
      height: 100px;
    }
  }
}
</style>
