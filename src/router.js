import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';
import CommentPage from './components/CommentPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/comments', component: CommentPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
