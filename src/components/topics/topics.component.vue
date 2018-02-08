<template>
  <div class="topics-wrap">
    <app-header>
      <span>新建主题</span>
    </app-header>
    <div class="main">
      <div class="login-box">
        <input class="text" type="text" placeholder="请输入话题，不少于十个字符" v-model="title">
        <div class="line"></div>
        <div class="tip">请输入话题，不少于十个字符</div>
        <div class="textarea" contenteditable="true" ref="textarea">请输入内容，不少于十个字符</div>
        <div class="tip-err" v-show="msg">{{msg}}</div>
        <a class="box-login" @click="onRelease()">发布</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      isAjax: false,
      msg: '为防封号，默认发帖到灌水区'
    };
  },
  methods: {
    onRelease() {
      let title = this.title;
      let content = this.$refs.textarea.innerText;
      if (
        this.isAjax ||
        title.replace(/\s/g, '').length < 10 ||
        content.replace(/\s/g, '').length < 10
      ) {
        return;
      }

      this.isAjax = true;
      this.msg = '';

      this.$http
        .post(this.$api.topics, {
          accesstoken: sessionStorage.accesstoken,
          title,
          content,
          tab: 'dev'
        })
        .then(res => {
          if (res.success == this.$api.code) {
            this.title = '';
            this.$refs.textarea.innerText = '请输入内容，不少于十个字符';
            alert('创建话题成功，可前往官网查看');
          }
          this.isAjax = false;
        })
        .catch(() => {
          this.msg = this.$api.tip;
          this.isAjax = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.topics-wrap {
  .main {
    padding-top: 80px;
  }
  .login-box {
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
  .text:focus + .line + .tip {
    top: -24px;
    font-size: 12px;
    opacity: 1;
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
  .textarea {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 22px;
    margin-top: 20px;
    font-size: 16px;
    word-break: break-all;
    overflow: hidden;
    outline: 0 none;
    border: 0 none;
    &:before,
    &:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      border-bottom: 1px solid $bd04;
    }
    &:before {
      border-bottom: 1px solid $bdcc;
    }
    &:after {
      transform: scaleX(0);
      transition: 0.3s;
    }
    &:focus {
      &:after {
        transform: scaleX(1);
      }
    }
  }
  .tip {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    color: $fs04;
    opacity: 0;
    pointer-events: none;
    transition: 0.3s;
  }
  .box-login {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 14px;
    color: $fsff;
    border-radius: 3px;
    background: $bg22;
  }
  .tip-err {
    margin-top: 20px;
    font-size: 16px;
    color: $fscc;
  }
}
</style>
