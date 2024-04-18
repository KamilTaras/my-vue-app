<!-- NavigationBar.vue -->
<template>
  <nav class="bg-gray-900 px-5 py-3 flex justify-between items-center">
    <span class="text-xl font-bold">CodeSnippet</span>
    <div>
      <a href="#my-snippets" class="text-green-300 hover:text-white px-3">Create</a>
      <a href="/explore" class="text-gray-300 hover:text-white px-3">Explore snippets</a>
      <a href="#my-snippets" class="text-gray-300 hover:text-white px-3">My snippets</a>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavigationBar'
}
</script>
