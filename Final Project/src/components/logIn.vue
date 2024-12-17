<template>
  <div class="infosCustomer">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Username:</label>
        <input
          type="text"
          id="username"
          v-model="username"
          placeholder="Enter your username"
          required
        />
      </div>

      <div>
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Enter your password"
          required
        />
      </div>

      <p class="button-link">
        <button type="submit">Login</button>
      </p>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post("http://localhost:3000/login", {
          username: this.username,
          password: this.password,
        });

        const { role } = response.data;

        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("role", role);

        this.$router.push({ name: "Menu" });
      } catch (error) {
        console.log(error); 
        this.errorMessage = error.response?.data?.error || "Login failed. Please try again.";
      }
    },
  },
};
</script>

<style>
  label, #totalPrice, .subtitleStyle{
  font-family: 'Arial Black', sans-serif;
  font-size: 1.5rem;
  color: #1e3a8a;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 5px;
  }
</style>