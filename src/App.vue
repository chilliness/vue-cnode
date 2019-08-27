<template>
  <div id="app">
    <keep-alive :include="['Home']">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  watch: {
    $route: {
      handler() {
        document
          .querySelectorAll('.confirm-wrap')
          .forEach(item => document.body.removeChild(item));
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style lang="scss"></style>
