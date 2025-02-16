<template>
  <Navbar :key="componentKey" />
</template>
<script>
import Navbar from "@/components/navbar.vue";
export default {
  name: "App",
  components: {
    Navbar,
  },
  data() {
    return {
      componentKey: 0,
    };
  },
  watch: {
    $route() {
      this.forceRerender();
    },
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: rgba(255, 255, 255, 0.633);
}
body {
  background: rgb(35, 39, 46);
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #ffffff;
}

nav a.router-link-exact-active {
  color: #42b983;
}
.scroll {
  text-transform: uppercase;
  font-weight: 500;
  margin-top: 50px;
  letter-spacing: 2px;
  position: relative;
}

.scroll:after {
  content: "";
  position: absolute;
  width: 2px;
  height: 50px;
  background: white;
  border-radius: 4px;
  left: 50%;
  top: calc(100% + 10px);
}
</style>
