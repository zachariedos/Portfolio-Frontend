<template>
  <nav class="topnav">
    <div class="nav-links">
      <router-link to="/">Portfolio</router-link>
      <router-link to="/experience">Experience</router-link>
      <router-link v-if="this.toCheck" to="/admin">Administration</router-link>
    </div>
    <div class="github-link">
      <a href="https://github.com/zdossantos" target="_blank">
        <img src="/github.png" alt="github" class="size-12" />
      </a>
    </div>
  </nav>
  <router-view />
</template>

<style>
.topnav {
  position: relative;
}

.nav-links {
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
}

.github-link {
  position: absolute;
  right: 10px;
  top: 10px;
  filter: invert(1);
}

.size-12 {
  width: 50px;
  height: 50px;
}
</style>