<template>
    <div>
      <div v-for="(line, index) in lines" :key="index">
        <p>{{ line }}</p>
        <input type="text" v-model="comments[index]" placeholder="Comment on this line" />
      </div>
      <!-- Add buttons or functionality as needed -->
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        lines: [],
        comments: {},
      };
    },
    created() {
      const text = this.$route.query.text;
      if (text) {
        this.lines = text.split('\n');
        // Initialize comments object with empty strings for each line
        this.lines.forEach((_, index) => {
          this.comments[index] = ''; // Direct assignment should work due to Vue 3 reactivity
        });
      }
    },
  };
  </script>
  