<template>
  <div class="loading-wrap">
    <i class="item"></i>
    <i class="item"></i>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.loading-wrap {
  .item {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    &:first-child {
      z-index: 1;
      transform: translate3d(-100%, 0, 0);
      animation: animFirst 1.2s linear infinite;
      background: $bg04;
    }
    &:last-child {
      z-index: 2;
      transform: translate3d(100%, 0, 0);
      animation: animLast 1.2s linear infinite;
      background: $bgfc;
    }
  }
}

@keyframes animFirst {
  0% {
    z-index: 1;
    transform: translate3d(-100%, 0, 0);
  }
  50% {
    transform: translate3d(100%, 0, 0);
  }
  100% {
    z-index: 2;
    transform: translate3d(-100%, 0, 0);
  }
}

@keyframes animLast {
  0% {
    z-index: 2;
    transform: translate3d(100%, 0, 0);
  }
  50% {
    transform: translate3d(-100%, 0, 0);
  }
  100% {
    z-index: 1;
    transform: translate3d(100%, 0, 0);
  }
}
</style>
