import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './views/HomePage.vue';
import ExploreSnippets from './views/ExploreSnippets.vue';
import CodeSnippetPage from './views/CodeSnippetPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/explore', component: ExploreSnippets },
  { path: '/code_snippet/:code_snippet_id', component: CodeSnippetPage}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
