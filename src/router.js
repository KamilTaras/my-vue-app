import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './views/HomePage.vue';
import ExploreSnippets from './views/ExploreSnippets.vue';
import CodeSnippetPage from './views/CodeSnippetPage.vue';
import LoginPage from './views/LoginPage.vue';
import MySnippets from './views/MySnippets.vue';
import SignupPage from './views/SignupPage.vue';
import UserProfile from './views/UserProfile.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage},
  { path: '/signup', component: SignupPage},
  { path: '/profile', component: UserProfile},
  { path: '/explore', component: ExploreSnippets },
  { path: '/code_snippet/:code_snippet_id', component: CodeSnippetPage},
  { path: '/my-code-snippets', component: MySnippets}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
