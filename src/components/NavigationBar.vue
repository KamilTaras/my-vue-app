<template>
  <nav class="bg-gray-900 px-5 py-3 flex justify-between items-center">
    <span class="text-xl font-bold text-white">
      <RouterLink to="/">CodeSnippet</RouterLink>
    </span>
    <div class="flex items-center">
      <span class="relative mr-3 flex items-center">
        <button @click.stop="toggleNotifications">
          <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.15V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 5.659 6 8.289 6 11v3.15c0 .415-.152.8-.395 1.145L4 17h5m6 0v2a2 2 0 11-4 0v-2m4 0H9"></path>
          </svg>
          <span class="absolute -top-1 -right-1 block h-3 w-3 rounded-full text-center text-xs text-white bg-red-600" v-if="latestPosts.length > 0">{{ latestPosts.length }}</span>
        </button>
        <div v-if="showNotifications" class="z-50 absolute top-0 left-0 py-2 w-48 bg-white rounded-lg shadow-xl">
          <template v-for="post in latestPosts.slice(0,5)" :key="post.id">
            <a :href="'/code_snippet/' + post.id" class="text-sm block px-4 py-2 text-gray-800 hover:bg-gray-200">
              {{ post.text }}
            </a>
          </template>
          
          <div v-if="latestPosts.length === 0" class="text-center text-gray-400 py-2">
            No new notifications
          </div>
        </div>
      </span>
      <RouterLink to="/" class="text-green-300 hover:text-white px-3">Create</RouterLink>
      <RouterLink to="/explore" class="text-gray-300 hover:text-white px-3">Explore snippets</RouterLink>
      
      <RouterLink v-if="isAuthenticated" to="/my-code-snippets" class="text-gray-300 hover:text-white px-3">My snippets</RouterLink>
      <RouterLink v-if="isAuthenticated" to="/profile" class="text-gray-300 hover:text-white px-3">Profile</RouterLink>
      <a href="#" v-if="isAuthenticated" @click="logout" class="text-gray-300 hover:text-white px-3">Logout</a>
      
      <RouterLink v-if="!isAuthenticated" to="/login" class="text-gray-300 hover:text-white px-3">Login</RouterLink>
      <RouterLink v-if="!isAuthenticated" to="/signup" class="text-gray-300 hover:text-white px-3">Signup</RouterLink>
    </div>
  </nav>
</template>

<script>
import axios from 'axios';
import Config from '../config.js';

export default {
  name: 'NavigationBar',
  data() {
    return {
      showNotifications: false,
      latestPosts: [],
      pollInterval: null,
      username: localStorage.getItem("username"),
    };
  },
  created() {
    this.fetchLatestPosts();
    this.startPolling();

  },
  computed: {
    isAuthenticated() {
      const token = localStorage.getItem('user-token');
      if (!token) {
        return false;
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode payload of the token
        return payload.exp > Date.now() / 1000; // Check if token is expired
      } catch (e) {
        return false; // If there's an error, assume the token is invalid
      }
    }
  },
  methods: {
    
    logout() {
      localStorage.removeItem('user-token');
      localStorage.removeItem('username');
      localStorage.removeItem('user-id');
      window.location.href = '/';
    },
    
    toggleNotifications(event) {
      event.stopPropagation();
      this.showNotifications = !this.showNotifications;
    },
    closeNotifications() {
      if (this.showNotifications) {
        this.showNotifications = false;
      }
    },
    fetchLatestPosts() {
      let userToken = localStorage.getItem('user-token');
      let userId = localStorage.getItem('user_id');
      axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;

      axios
        .get(`${Config.BACKEND_URL}/api/v1/notifications/${userId}`)
        .then((response) => {
          let notifications = Array.isArray(response.data) ? response.data : response.data.data || [];
          this.latestPosts = notifications.map((notification) => ({
            id: notification.NotificationID,
            text: notification.Text,
            author: notification.User && notification.User.username ? notification.User.username : 'Anonymous',
          }));
        })
        .catch((error) => {
          console.error('Error fetching notifications:', error);
        });
    },
    startPolling() {
      // Poll every 30 seconds
      this.pollInterval = setInterval(() => {
        this.fetchLatestPosts();
      }, 30000);
    }

  },
  beforeUnmount() {
    // Clear polling interval
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  },
  mounted() {
    window.addEventListener('click', this.closeNotifications);
  },
  beforbeforeUnmount() {
    window.removeEventListener('click', this.closeNotifications);
  },
}
</script>
