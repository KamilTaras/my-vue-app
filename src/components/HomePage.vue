<template>
    <div id="app">
      <nav class="navbar">
        <div class="logo">SnippetSavvy</div>
        <div class="menu">
          <!-- You can add links or buttons here for navigation -->
        </div>
      </nav>
      <main>
        <form @submit.prevent="handleSubmit" class="snippet-form">
          <div class="form-group">
            <input type="text" v-model="snippetTitle" placeholder="Snippet Title" />
          </div>
          <div class="form-group">
            <textarea v-model="snippetText" @input="autoResizeTextarea" class="autosize" placeholder="Snippet Text"></textarea>
        </div>
          <div class="form-group">
            <input type="text" v-model="languageId" placeholder="Program Language ID" />
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" v-model="isPrivate" /> Private Snippet
            </label>
          </div>
          <button type="submit" class="submit-btn">Post It</button>
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
        this.$router.push({ name: 'CommentPage', query: { text: this.snippetText } });
      },
      autoResizeTextarea(event) {
      event.target.style.height = 'auto';
      event.target.style.height = (event.target.scrollHeight) + 'px';
    },
    },
  };
  </script>
  
  <style scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #4CAF50;
    padding: 1rem;
  }
  
  .navbar .logo {
    font-size: 1.5rem;
    color: white;
  }
  
  .menu {
    /* Style for your menu items */
  }
  
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
  }
  
  .main {
    margin-top: 1rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  input[type="text"],
  textarea {
    width: 50%;
    padding: 0.5rem;
    margin-top: 0.5rem;
    border: 1px solid rgba(0, 0, 0, 0.1); /* Light border */
    border-radius: 4px;
    transition: all 0.2s ease-in-out; /* Smooth transition for size changes */
    resize: vertical; /* Allows vertical resizing, you can use 'both' if horizontal resize is also desired */
  }
  
  textarea {
    min-height: 50px; /* Minimum height before expanding */
    overflow-y: hidden; /* Hide the scrollbar */
  }
  
  /* Additional style to expand the textarea automatically */
  textarea.autosize {
    height: auto; /* Allow the height to grow */
    overflow-y: hidden; /* Prevent scrollbar */
  }
  
  input[type="checkbox"] {
    margin-right: 0.5rem;
  }
  
  .submit-btn {
    background-color: #4CAF50;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .submit-btn:hover {
    background-color: #45a049;
  }
  </style>
  