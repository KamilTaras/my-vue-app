<template>
  <div class="max-w-2xl mx-auto bg-gray-700 rounded p-5 my-5">
    <div class="flex justify-between items-center mb-2">
      <h1 class="text-2xl font-semibold">{{ title }}</h1>
      <span class="text-xs font-semibold text-blue-100 bg-blue-600 px-2 py-1 rounded">{{ language }}</span>
    </div>
    <p class="text-gray-400 mb-4">@{{ username }}</p>
    <pre class="bg-gray-600 p-3 rounded font-mono text-sm overflow-auto">
<code>{{ code }}</code>
    </pre>
    <div class="flex justify-between">
      <a href="#full-code" class="text-blue-400 hover:text-blue-300 mt-3 inline-block">View full code</a>
      <p class="text-gray-400 mt-3">{{ date }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CodeSnippetPreview',
  props: {
    title: String,
    username: String,
    code: String,
    date: String,
    language: String
  }
}
</script>
