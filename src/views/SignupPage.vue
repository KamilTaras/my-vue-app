<template>
    <div class="max-w-max mx-auto bg-gray-700 rounded-lg shadow-lg p-6 my-5">

        <!-- Error Dialog Box -->
        <div v-if="showError" class="bg-red-500 text-gray-100 px-4 py-3 rounded relative mb-4" role="alert">
            <span class="block sm:inline">{{ errorMessage }}</span>
            <button @click="dismissError" class="absolute top-0 bottom-0 right-0 px-4 py-3 text-lg">&times;</button>
        </div>

        <!-- Registration Form -->
        <div class="mb-4">
            <label class="block text-gray-100 text-sm font-bold mb-2" for="username">Username</label>
            <input v-model="username" id="username" type="text" placeholder="Username" class="bg-gray-600 shadow appearance-none rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline" />
        </div>

        <div class="mb-4">
            <label class="block text-gray-100 text-sm font-bold mb-2" for="first_name">First Name</label>
            <input v-model="first_name" id="first_name" type="text" placeholder="First Name" class="bg-gray-600 shadow appearance-none rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline" />
        </div>

        <div class="mb-4">
            <label class="block text-gray-100 text-sm font-bold mb-2" for="last_name">Last Name</label>
            <input v-model="last_name" id="last_name" type="text" placeholder="Last Name" class="bg-gray-600 shadow appearance-none rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline" />
        </div>

        <div class="mb-6">
            <label class="block text-gray-100 text-sm font-bold mb-2" for="password">Password</label>
            <input v-model="password" id="password" type="password" placeholder="Password" class="bg-gray-600 shadow appearance-none rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline" />
        </div>

        <div class="mb-6">
            <label class="block text-gray-100 text-sm font-bold mb-2" for="confirmPassword">Confirm Password</label>
            <input v-model="confirmPassword" id="confirmPassword" type="password" placeholder="Confirm Password" class="bg-gray-600 shadow appearance-none rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline" />
        </div>

        <div class="flex items-center justify-between">
            <button @click="register" class="bg-blue-500 hover:bg-blue-700 text-gray-100 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                Sign Up
            </button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Config from "../config.js";

export default {
    name: "SignupPage",
    data() {
        return {
            first_name: "",
            last_name: "",
            username: "",
            password: "",
            confirmPassword: "",
            showError: false,
            errorMessage: ""
        };
    },
    methods: {
        register() {
            // Ensure passwords match before sending the registration request
            if (this.password !== this.confirmPassword) {
                this.showError = true;
                this.errorMessage = "Passwords do not match!";
                return;
            }

            if (this.first_name == "" || this.last_name == "") {
                this.showError = true;
                this.errorMessage = "First name and last name should be filled out";
                return;
            }

            const registrationData = {
                username: this.username,
                password: this.password,
                first_name: this.first_name,
                last_name: this.last_name,
            };

            // Send the registration request to the backend
            axios
                .post(Config.BACKEND_URL + '/api/v1/register/', registrationData)
                .then(() => {
                    // On successful registration, immediately log in the user
                    return axios.post(Config.BACKEND_URL + '/api/v1/login/', {
                        username: this.username,
                        password: this.password,
                    });
                })
                .then((response) => {
                    const data = response.data;
                    localStorage.setItem('user-token', data.token); // Store the token in localStorage
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('user_id', data.user_id);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`; // Set default header for all requests
                    window.location.href = '/'; // Redirect to the root page
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
    },
};
</script>

<style scoped>
</style>
