import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@/assets/css/style.css';
import hljsVuePlugin from "@highlightjs/vue-plugin";
import 'highlight.js/styles/github-dark.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

const app = createApp(App);
app.use(router);
app.use(hljsVuePlugin);
app.mount('#app');
