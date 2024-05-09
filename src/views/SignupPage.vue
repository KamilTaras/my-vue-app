<template>
    <div class="max-w-max mx-auto bg-gray-700 rounded p-5 my-5">
        <!-- Error Dialog Box -->
        <div v-if="showError" class="bg-red-500 text-white px-4 py-3 rounded relative mb-4" role="alert">
            <span class="block sm:inline">{{ errorMessage }}</span>
            <button
                @click="dismissError"
                class="absolute top-0 bottom-0 right-0 px-4 py-3 text-lg"
            >
                &times;
            </button>
        </div>

        <!-- Username input -->
        <div class="items-center mx-auto mt-5 rounded">
            <input
                v-model="username"
                class="bg-gray-600 text-white p-2 rounded outline-none"
                placeholder="Username"
            />
        </div>

        <!-- Password input -->
        <div class="items-center mx-auto mt-5 rounded">
            <input
                type="password"
                v-model="password"
                class="bg-gray-600 text-white p-2 rounded outline-none"
                placeholder="Password"
            />
        </div>

        <!-- Confirm password input -->
        <div class="items-center mx-auto mt-5 rounded">
            <input
                type="password"
                v-model="confirmPassword"
                class="bg-gray-600 text-white p-2 rounded outline-none"
                placeholder="Confirm Password"
            />
        </div>

        <div class="flex pt-5 pb-10">
            <button
                type="submit"
                class="bg-blue-400 hover:bg-blue-600 text-white text-xl font-semibold py-2 px-4 rounded"
                @click="register"
            >
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

            const registrationData = {
                username: this.username,
                password: this.password,
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
