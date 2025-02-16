<template>
  <form @submit.prevent="myLoginFunction">
    <h3>Login</h3>
    <p class="errorMessage hidden">Mot de passe ou Email incorrect</p>
    <label for="email">Email</label>
    <input
      type="text"
      placeholder="Email"
      v-model="email"
      id="email"
      name="email"
      autocomplete="on"
    />

    <label for="password">Mot de passe</label>
    <input
      type="password"
      placeholder="Mot de passe"
      v-model="password"
      id="password"
      name="password"
      autocomplete="on"
    />
    <button type="submit">Login</button>
  </form>
</template>
<script>
import axios from "axios";
import App from "@/App.vue";
export default {
  name: "Connexion",
  props: {},
  data() {
    return {
      email: "",
      password: "",
    };
  },
  components: {
    App,
  },
  methods: {
    async myLoginFunction() {
      console.log(process.env.VUE_APP_API_URL)
      await axios
        .post(`${process.env.VUE_APP_API_URL}/auth/login`, {
          email: this.email,
          password: this.password,
        })
        .then(function (response) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.token}`;
        })
        .catch(function () {
          document.querySelector(".errorMessage").classList.remove("hidden");
          document.querySelector(".errorMessage").classList.add("visible");
          setTimeout(() => {
            document.querySelector(".errorMessage").classList.remove("visible");
            document.querySelector(".errorMessage").classList.add("hidden");
          }, 5000);
        });
      if (axios.defaults.headers.common["Authorization"]) {
        this.$router.push("/");
      }
    },
  },
};

//------------------------------------------------------------------------------------------------
</script>

<style scooped>
template *,
template *:before,
template *:after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.errorMessage {
  background-color: rgba(145, 2, 2, 0.495);
  border-radius: 5px;
  padding: 5px;
}

.visible {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.6s linear;
}

.hidden {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 0.6s, opacity 0.6s linear;
}

template {
  height: 520px;
  width: 400px;
}
form {
  width: 50%;
  margin: auto;
}
form * {
  font-family: "Poppins", sans-serif;
  color: #ffffff;
  letter-spacing: 0.5px;
  outline: none;
  border: none;
}
form h3 {
  font-size: 32px;
  font-weight: 500;
  line-height: 42px;
  text-align: center;
}

label {
  display: block;
  margin-top: 30px;
  font-size: 16px;
  font-weight: 500;
}
input {
  display: block;
  height: 50px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 3px;
  padding: 0 10px;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 300;
}
::placeholder {
  color: #e5e5e5;
}
button {
  margin-top: 50px;
  width: 100%;
  background-color: #ffffff;
  color: #080710;
  padding: 15px 0;
  font-size: 18px;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
}
</style>
