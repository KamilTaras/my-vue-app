<template>
  <div class="min-h-screen bg-gray-800 text-white">
    <NavigationBar></NavigationBar>
    <div id="app">
      <router-view/>
    </div>
    <FooterBar></FooterBar>
  </div>
</template>

<script>
import NavigationBar from './components/NavigationBar.vue';
import FooterBar from './components/FooterBar.vue';

export default {
  name: 'App',
  components: {
    NavigationBar,
    FooterBar,
}
}
</script>
