<template>
  <div class="loading-wrap" :class="{top: isHome}"></div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    isHome: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.loading-wrap {
  position: absolute;
  left: 0;
  top: 50px;
  right: 0;
  bottom: 0;
  background: $bg00a url(./img/loading.gif) no-repeat center;
  &.top {
    top: 95px;
  }
}
</style>
