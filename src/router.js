import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';
import CommentPage from './components/CommentPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/comments', component: CommentPage, name: 'CommentPage' }, // Make sure the name property is set
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
