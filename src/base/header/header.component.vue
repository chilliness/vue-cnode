<template>
  <header class="header-wrap">
    <i class="icon-back icon-undo2" @click="$router.back()"></i>
    <slot></slot>
  </header>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.header-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  font-size: 18px;
  color: $fsff;
  background: $bg22;
  .icon-back {
    position: absolute;
    left: 10px;
    top: 50%;
    font-size: 24px;
    transform: translate3d(0, -50%, 0);
  }
}
</style>
