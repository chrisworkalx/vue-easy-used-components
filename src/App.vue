<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/transition">Transition</router-link> |
      <router-link to="/throttle">Throttle</router-link> |
      <router-link to="/watermark">WaterMark</router-link>
    </nav>
    <main>
      <easy-used-water-mark
        text="禁止转载"
        :font-size="20"
        :gap="40"
        font-style="#f40"
        :rotate-deg="135"
        :is-show-water-mark="isShowWaterMark"
        @violation="handleViolation"
      >
        <router-view />
      </easy-used-water-mark>
    </main>
  </div>
</template>

<script>
export default {
  methods: {
    handleViolation() {
      alert('违规了！');
    }
  },
  computed: {
    isShowWaterMark() {
      return this.$route.meta.showWaterMark || false;
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
main {
  flex: 1;
}
</style>
