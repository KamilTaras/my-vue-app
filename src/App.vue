<template>
  <div class="flex flex-col h-screen bg-gray-800 text-white">
    <NavigationBar></NavigationBar>
    <div id="app" class="flex-grow bg-gray-800">
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
