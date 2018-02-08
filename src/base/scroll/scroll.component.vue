<template>
  <main class="scroll-wrap" ref="scroll">
    <section>
      <slot></slot>
      <div class="load-box" v-if="pullUpLoad">
        <app-loading class="item load-doing" v-if="isLoading.loadFlag"></app-loading>
        <div class="item load-tip" v-else>{{loadText}}</div>
      </div>
    </section>
    <div class="refresh-box" v-if="pullDownRefresh" ref="refresh">
      <app-loading class="item load-doing" v-if="isLoading.refreshFlag"></app-loading>
      <div class="item load-tip" v-else>{{pullDownRefresh && pullDownRefresh.txt}}</div>
    </div>
  </main>
</template>

<script>
export default {
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
    listenScroll: {
      type: Boolean,
      default: true
    },
    pullDownRefresh: {
      type: [Boolean, Object],
      default: false
    },
    pullUpLoad: {
      type: [Boolean, Object],
      default: false
    },
    bufferTime: {
      type: Number,
      default: 20
    },
    isPullOver: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Object,
      default() {
        return {
          loadFlag: false
        };
      }
    }
  },
  computed: {
    loadText() {
      const more =
        (this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.more) ||
        '加载更多';
      const noMore =
        (this.pullUpLoad &&
          this.pullUpLoad.txt &&
          this.pullUpLoad.txt.noMore) ||
        '暂无数据';

      return this.isPullOver ? noMore : more;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.onInitScroll();
    });
  },
  methods: {
    onInitScroll() {
      if (!this.scroll) {
        this.scroll = new this.$BScroll(this.$refs.scroll, {
          probeType: this.probeType,
          click: this.click,
          pullDownRefresh: this.pullDownRefresh,
          pullUpLoad: this.pullUpLoad
        });

        if (this.listenScroll) {
          this.scroll.on('scroll', pos => {
            this.$emit('scroll', pos);

            if (this.pullDownRefresh) {
              let num = Math.min(pos.y - 50, this.$refs.refresh.clientHeight);
              this.$refs.refresh.style.top = num + 'px';
            }
          });
        }

        if (this.pullDownRefresh) {
          this.scroll.on('pullingDown', () => {
            this.$emit('refresh');
          });

          this.scroll.on('scrollEnd', pos => {
            if (pos.y >= 0) {
              this.isLoading.refreshFlag = true;
            }
          });
        }

        if (this.pullUpLoad) {
          this.scroll.on('pullingUp', () => {
            this.$emit('load');
          });
        }
      } else {
        this.onRefresh();
      }
    },
    onDisable() {
      this.scroll && this.scroll.disable();
    },
    onEnable() {
      this.scroll && this.scroll.enable();
    },
    onRefresh() {
      this.scroll && this.scroll.refresh();
    },
    onScrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    onScrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    },
    onFnishPullDown() {
      this.isLoading.refreshFlag = false;
      this.scroll.finishPullDown();
    },
    onFnishPullUp() {
      this.isLoading.loadFlag = false;
      this.scroll.finishPullUp();
    }
  },
  watch: {
    data: {
      handler() {
        setTimeout(() => {
          this.onRefresh();
        }, this.bufferTime);
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.scroll-wrap {
  position: absolute;
  left: 0;
  top: 50px;
  right: 0;
  bottom: 0;
  overflow: hidden;
  .load-box {
    height: 50px;
    font-size: 14px;
    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  }
  .refresh-box {
    position: absolute;
    left: 0;
    right: 0;
    top: -100%;
    height: 50px;
    z-index: 9;
    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  }
}
</style>
