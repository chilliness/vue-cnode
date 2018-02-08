<template>
  <i class="top-wrap" @click="onResetTop()" v-show="nowPos < minPos"></i>
</template>

<script>
export default {
  props: {
    nowPos: {
      type: Number,
      default: 0
    },
    minPos: {
      type: Number,
      default: -150
    }
  },
  methods: {
    onResetTop() {
      this.$emit('top');
    }
  }
};
</script>

<style lang="scss" scoped>
.top-wrap {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 40px;
  height: 40px;
  background: url(./top.png) no-repeat center;
  background-size: contain;
}
</style>

