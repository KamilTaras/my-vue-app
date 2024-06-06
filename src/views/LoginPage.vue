<template>
    <div class="max-w-max mx-auto bg-gray-700 rounded-lg shadow-lg p-6 my-5">

        <!-- Error Dialog Box -->
        <div v-if="showError" class="bg-red-500 text-gray-100 px-4 py-3 rounded relative mb-4" role="alert">
            <span class="block sm:inline">{{ errorMessage }}</span>
            <button @click="dismissError" class="absolute top-0 bottom-0 right-0 px-4 py-3 text-lg">&times;</button>
        </div>

        <!-- Login Form -->
        <div class="mb-4">
            <label class="block text-gray-100 text-sm font-bold mb-2" for="username">Username</label>
            <input v-model="username" id="username" type="text" placeholder="Username" class="bg-gray-600 shadow appearance-none rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline" />
        </div>

        <div class="mb-6">
            <label class="block text-gray-100 text-sm font-bold mb-2" for="password">Password</label>
            <input v-model="password" id="password" type="password" placeholder="Password" class="bg-gray-600 shadow appearance-none rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline" />
        </div>

        <div class="flex items-center justify-between">
            <button @click="login" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
            Sign In
            </button>
            <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
            Forgot Password?
            </a>
        </div>

        <div class="mt-4 text-center">
            <p class="text-gray-100">Or continue with</p>
            <div class="flex justify-center mt-2">
            <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l">Google</button>
            <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4">Apple</button>
            <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r">Facebook</button>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Config from "../config.js";
  
  export default {
    name: "LoginPage",
    data() {
      return {
        username: "",
        password: "",
        showError: false,
        errorMessage: "",
      };
    },
    methods: {
      login() {
        const credentials = {
          username: this.username,
          password: this.password,
        };
        axios.post(Config.BACKEND_URL + '/api/v1/login/', credentials)
          .then(response => {
            const data = response.data;
            localStorage.setItem('user-token', data.token); // Store the token in localStorage
            localStorage.setItem('username', data.username);
            localStorage.setItem('user_id', data.user_id);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`; // Set default header for all requests
            window.location.href = '/';
          })
          .catch((error) => {
            if (error.response && error.response.data) {
              const responseError = error.response.data;
              this.errorMessage = responseError.message || 'An unexpected error occurred';
            } else {
              this.errorMessage = 'An unexpected error occurred';
            }
            this.showError = true;
          });
      },
  
      dismissError() {
        this.showError = false;
        this.errorMessage = "";
      }
    }
  }
  </script>
  
  <style scoped>
  </style>
  