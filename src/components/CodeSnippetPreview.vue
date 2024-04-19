<template>
  <div class="max-w-2xl mx-auto bg-gray-700 rounded p-5 my-5">
    <div class="flex justify-between items-center mb-2">
      <h1 class="text-2xl font-semibold">
        <RouterLink :to="`/code_snippet/${snippetId}/`">{{ title }}</RouterLink>
      </h1>
      <span class="text-xs font-semibold text-blue-100 bg-blue-600 px-2 py-1 rounded">{{ language }}</span>
    </div>
    <p class="text-gray-400 mb-4">@{{ username }}</p>
    <highlightjs 
        :language="language"
        :code="code" />
    <div class="flex justify-between">
      <RouterLink :to="`/code_snippet/${snippetId}/`" class="text-blue-400 hover:text-blue-300 mt-3 inline-block">View full code</RouterLink>
      <p class="text-gray-400 mt-3">{{ date }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CodeSnippetPreview',
  props: {
    snippetId: String,
    title: String,
    username: String,
    code: String,
    date: String,
    language: String
  }
}
</script>
