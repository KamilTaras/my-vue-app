<template>
    <div id="app">
      <header>
        <!-- Your header content -->
      </header>
      <main>
        <form @submit.prevent="handleSubmit">
          <input type="text" v-model="snippetTitle" placeholder="Snippet Title" />
          <br>
          <textarea v-model="snippetText" placeholder="Snippet Text"></textarea>
          <input type="text" v-model="languageId" placeholder="Program Language ID" />
          
          <br>
          <label>
            <input type="checkbox" v-model="isPrivate" /> Private Snippet
        <br>  
        </label>
          <br>
          <button type="submit">Post It</button>
        </form>
      </main>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        snippetTitle: '',
        snippetText: '',
        languageId: '',
        isPrivate: false,
      };
    },
    methods: {
      handleSubmit() {
        this.$router.push({ path: '/comments', query: { text: this.snippetText } });
      },
    },
  };
  </script>
  