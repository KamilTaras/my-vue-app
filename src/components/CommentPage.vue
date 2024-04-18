<template>
    <div id="app">
      <nav class="navbar">
        <div class="logo">SnippetSavvy</div>
        <div class="menu">
          <!-- You can add links or buttons here for navigation -->
        </div>
      </nav>
      <main>
        <h1>{{ snippetTitle }}</h1>
        <div v-for="(line, index) in lines" :key="index" class="line-container">
          <p @mouseover="hover = index" @mouseleave="hover = null" @click="selectLine(index)">
            {{ line }}
          </p>
          <div v-if="selectedLineIndex === index" class="comment-container">
            <input v-if="!comments[index]" type="text" v-model="editableComments[index]" placeholder="Comment on this line" />
            <button v-if="!comments[index]" class="submit-btn" @click="submitComment(index)">Submit Comment</button>
          </div>
          <!-- Show the submitted comment regardless of whether the line is selected -->
          <p v-if="comments[index]" class="submitted-comment">
            {{ comments[index] }}
          </p>
        </div>
        <div class="technologies">
          {{ technologies }}
        </div>
      </main>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        snippetTitle: '',
        technologies: '',
        lines: [],
        editableComments: {},
        comments: {},
        selectedLineIndex: null,
        hover: null, // For tracking hover state on lines
      };
    },
    methods: {
      selectLine(index) {
        // Toggle selection only if there's no comment for the line
        if (!this.comments[index]) {
          this.selectedLineIndex = this.selectedLineIndex === index ? null : index;
        }
      },
      submitComment(index) {
        // Use '~~Anonymous Commenter' if no input was given
        this.comments[index] = this.editableComments[index].trim() ? this.editableComments[index] + ' ~~Anonymous Commenter' : '~~Anonymous Commenter';
        this.editableComments[index] = ''; // Clear the editable comment
        this.selectedLineIndex = null; // Deselect the line after submitting the comment
      }
    },
    created() {
      const text = this.$route.query.text;
      this.snippetTitle = this.$route.query.title || 'Untitled Snippet';
      this.technologies = this.$route.query.technologies || 'Unknown Technologies';
      if (text) {
        this.lines = text.split('\n');
      }
    },
  };
  </script>
  
  <style scoped>
  /* Style for Navbar */
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
    text-align: left; /* Align text to the left */
  }
  
  .main {
    margin-top: 1rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  input[type="text"],
  textarea {
    width: 100%; /* Make it full width for better control */
    padding: 0.5rem;
    margin-top: 0.5rem;
    border: 1px solid rgba(0, 0, 0, 0.1); /* Light border */
    border-radius: 4px;
  }
  
  textarea {
    min-height: 50px;
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
  
  .line-container p {
    cursor: pointer;
  }
  
  .line-container p:hover {
    background-color: #f0f0f0; /* Highlight when hovered */
  }
  
  .comment-container {
    margin-top: 10px;
  }
  
  .submitted-comment {
    color: grey;
  }
  
  h1 {
    text-align: center;
  }
  
  .technologies {
    text-align: center;
    margin-top: 20px;
    font-style: italic;
  }
  </style>
  