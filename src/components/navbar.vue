<template>
  <nav class="topnav">
    <router-link to="/">Expérience</router-link> |
    <router-link to="/portfolio">Portfolio</router-link>
    <router-link v-if="this.toCheck" to="/admin"> | Administration</router-link>
    <div class="topnav-right">
      <router-link v-if="!this.toCheck" to="/connexion">Connexion</router-link>
    </div>
  </nav>
  <router-view />
</template>
<script>
import axios from "axios";
export default {
  name: "Navbar",
  data() {
    return {
      toCheck: axios.defaults.headers.common["Authorization"]
        ? axios.defaults.headers.common["Authorization"]
        : "",
    };
  },
};
</script>
<style>
.topnav-right {
  float: right;
}
</style>
