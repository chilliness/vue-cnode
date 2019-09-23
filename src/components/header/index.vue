<template>
  <div class="header-wrap">
    <i class="iconfont" :class="[isHome ? 'icon-menu' : 'icon-back']" @click="handleClick"></i>
    <div class="text">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    isHome: { type: Boolean, default: false }
  },
  methods: {
    handleClick() {
      if (this.isHome) {
        return this.$emit('emitToggle');
      }
      this.$router.back();
    }
  }
};
</script>

<style lang="scss" scoped>
.header-wrap {
  position: relative;
  @include frow();
  height: 50px;
  font-size: 16px;
  color: $fswhite;
  background: $bg00a;
  .iconfont {
    position: absolute;
    left: 15px;
    top: 50%;
    font-size: 24px;
    transform: translate3d(0, -50%, 0);
  }
  .text {
    max-width: 70%;
    @include dot();
  }
}
</style>
