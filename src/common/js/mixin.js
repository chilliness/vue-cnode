export const resetTopMixin = {
  data() {
    return {
      nowPos: 0
    };
  },
  methods: {
    onResetTop() {
      this.$refs.scroll.onScrollTo(0, 0, 100);
    },
    onNowPos(ev) {
      this.nowPos = ev.y;
    }
  }
};

export const resetLoadingMixin = {
  data() {
    return {
      pullDownRefresh: {
        threshold: 50,
        stop: 50,
        txt: '刷新成功'
      },
      pullUpLoad: {
        threshold: 0,
        txt: {
          more: '加载数据',
          noMore: '我是有底线的'
        }
      }
    };
  }
};

export const formatTimeMixin = {
  methods: {
    onFormatTime(time) {
      return this.$moment(time, 'YYYYMMDD')
        .fromNow()
        .replace(/\s/g, '');
    }
  }
};
