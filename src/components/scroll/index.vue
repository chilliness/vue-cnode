<template>
  <div class="scroll-wrap" :class="{top: isHome}" ref="scrollBoxRef">
    <div>
      <slot></slot>
      <div class="load-box" v-if="pullUpLoad">
        <div class="anim-box" v-if="loadConfig.flag">
          <i class="item" v-for="item in 6" :key="item"></i>
        </div>
        <div class="text-box" v-else>
          <span class="line"></span>
          <span class="text">{{loadConfig.text}}</span>
          <span class="line"></span>
        </div>
      </div>
    </div>
    <div class="refresh-box" v-if="pullDownRefresh" ref="refreshRef">
      <div class="anim-box" v-if="refreshConfig.flag">
        <div class="item-box">
          <i class="item" v-for="item in 9" :key="item"></i>
        </div>
      </div>
      <div class="text-box" v-else>{{refreshConfig.text}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Scroll',
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    click: {
      type: Boolean,
      default: true
    },
    probeType: {
      type: Number,
      default: 3
    },
    observeDOM: {
      type: Boolean,
      default: false
    },
    pullDownRefresh: {
      type: [Boolean, Object],
      default: false
    },
    pullUpLoad: {
      type: [Boolean, Object],
      default: false
    },
    delay: {
      type: Number,
      default: 300
    },
    isHome: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      refreshConfig: {
        flag: false,
        text: '下拉刷新'
      },
      loadConfig: {
        flag: true,
        text: '上拉加载数据'
      }
    };
  },
  mounted() {
    this.handleInitScroll();
  },
  methods: {
    handleInitScroll() {
      if (!this.scroll) {
        this.scroll = new this.$BScroll(this.$refs.scrollBoxRef, {
          click: this.click,
          probeType: this.probeType,
          observeDOM: this.observeDOM,
          pullDownRefresh: this.pullDownRefresh,
          pullUpLoad: this.pullUpLoad
        });

        this.scroll.on('scroll', pos => {
          this.$emit('emitScroll', pos);

          if (this.pullDownRefresh) {
            let height = this.$refs.refreshRef.clientHeight;

            if (pos.y < 10) {
              this.refreshConfig.text = '下拉刷新';
            }

            this.$refs.refreshRef.style.top = `${Math.min(
              pos.y - height,
              height
            )}px`;
          }
        });

        if (this.pullDownRefresh) {
          this.scroll.on('pullingDown', () => {
            this.refreshConfig.flag = true;
            this.$emit('emitRefresh');
          });
        }

        if (this.pullUpLoad) {
          this.scroll.on('pullingUp', () => {
            this.loadConfig.flag = true;
            this.$emit('emitLoad');
          });
        }
      } else {
        this.handleRefresh();
      }
    },
    handleFinshPullDown(text = '刷新完毕') {
      if (this.scroll) {
        this.refreshConfig = { flag: false, text };
        this.timerPullDown = setTimeout(() => {
          clearTimeout(this.timerPullDown);
          this.scroll.finishPullDown();
        }, this.delay);
      }
    },
    handleFinshPullUp(bool = false) {
      if (this.scroll) {
        this.scroll.finishPullUp();
        this.loadConfig = {
          flag: false,
          text: bool ? '我是有底线的' : '上拉加载数据'
        };
      }
    },
    handleScrollTo() {
      if (this.scroll) {
        this.scroll.scrollTo(0, 0, 100);
      }
    },
    handleRefresh() {
      if (this.scroll) {
        this.scroll.refresh();
      }
    }
  },
  watch: {
    data(val, oldVal) {
      clearTimeout(this.timerRefresh);
      this.timerRefresh = setTimeout(() => {
        clearTimeout(this.timerRefresh);
        this.handleRefresh();
      }, this.delay + 10);
    }
  }
};
</script>

<style lang="scss" scoped>
.scroll-wrap {
  position: fixed;
  left: 0;
  top: 50px;
  right: 0;
  bottom: 0;
  overflow: hidden;
  &.top {
    top: 95px;
  }
  .load-box {
    height: 80px;
    font-size: 14px;
    .anim-box {
      @include frow();
      height: 100%;
      .item {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: $bge43;
      }
      .item:first-child {
        animation: anim-drop1 1.5s ease-in infinite;
      }
      .item:last-child {
        animation: anim-drop2 1.5s ease-in infinite;
      }
    }
    .text-box {
      @include frow();
      height: 100%;
      padding: 0 40px;
      .line {
        flex: 1;
        border-top: 1px solid $bdccc;
      }
      .text {
        padding: 0 10px;
      }
    }
  }
  .refresh-box {
    position: absolute;
    left: 0;
    right: 0;
    top: -100%;
    height: 60px;
    z-index: 9;
    font-size: 14px;
    .anim-box {
      @include frow();
      height: 100%;
      .item-box {
        position: relative;
        width: 30px;
        height: 30px;
        .item {
          position: absolute;
          width: 10px;
          height: 10px;
          background: $bge43;
        }
        .item:nth-of-type(1) {
          left: 0;
          top: 0;
          animation: anim-wave 1.5s infinite;
        }
        .item:nth-of-type(2) {
          left: 10px;
          top: 0;
          animation: anim-wave 1.5s 0.25s infinite;
        }
        .item:nth-of-type(3) {
          left: 20px;
          top: 0;
          animation: anim-wave 1.5s 0.5s infinite;
        }
        .item:nth-of-type(4) {
          left: 0;
          top: 10px;
          animation: anim-wave 1.5s 0.25s infinite;
        }
        .item:nth-of-type(5) {
          left: 10px;
          top: 10px;
          animation: anim-wave 1.5s 0.5s infinite;
        }
        .item:nth-of-type(6) {
          left: 20px;
          top: 10px;
          animation: anim-wave 1.5s 0.75s infinite;
        }
        .item:nth-of-type(7) {
          left: 0;
          top: 20px;
          animation: anim-wave 1.5s 0.5s infinite;
        }
        .item:nth-of-type(8) {
          left: 10px;
          top: 20px;
          animation: anim-wave 1.5s 0.75s infinite;
        }
        .item:nth-of-type(9) {
          left: 20px;
          top: 20px;
          animation: anim-wave 1.5s 1s infinite;
        }
      }
    }
    .text-box {
      @include frow();
      height: 100%;
    }
  }
}

@keyframes anim-drop1 {
  0%,
  100% {
    transform: translate3d(-25px, -10px, 0);
  }
  25%,
  75% {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes anim-drop2 {
  0%,
  25%,
  75%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(25px, -10px, 0);
  }
}

@keyframes anim-wave {
  0%,
  100% {
    transform: scale(0);
  }
  50% {
    transform: scale(1);
  }
}
</style>
