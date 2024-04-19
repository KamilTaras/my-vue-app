<!-- NavigationBar.vue -->
<template>
  <nav class="bg-gray-900 px-5 py-3 flex justify-between items-center">
    <span class="text-xl font-bold text-white">
        <RouterLink to ="/">CodeSnippet</RouterLink>
    </span>
    <div>
      <RouterLink to="/" class="text-green-300 hover:text-white px-3">Create</RouterLink>
      <RouterLink to="/explore" class="text-gray-300 hover:text-white px-3">Explore snippets</RouterLink>
      <a href="#my-snippets" class="text-gray-300 hover:text-white px-3">My snippets</a>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavigationBar'
}
</script>
