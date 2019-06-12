<template>
  <div class="notFound-wrap">
    <Header>404</Header>
    <div class="box"></div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
};
</script>

<style lang="scss" scoped>
.notFound-wrap {
  @include fcol(flex-start, stretch);
  width: 100vw;
  height: 100vh;
  .box {
    flex: 1;
    background: url(./img/bg.jpg) no-repeat center;
    background-size: contain;
  }
}
</style>
