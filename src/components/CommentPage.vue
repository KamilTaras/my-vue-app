<template>
    <div>
      <h1>{{ snippetTitle }}</h1>
      <div v-for="(line, index) in lines" :key="index" class="line-container">
        <p @click="selectLine(index)">
          {{ line }}
        </p>
        <div v-if="selectedLineIndex === index" class="comment-container">
          <input v-if="!comments[index]" type="text" v-model="editableComments[index]" placeholder="Comment on this line" />
          <button v-if="!comments[index]" @click="submitComment(index)">Submit Comment</button>
        </div>
        <!-- Show the submitted comment regardless of whether the line is selected -->
        <p v-if="comments[index]" class="submitted-comment">
          {{ comments[index] }}
        </p>
      </div>
      <div class="technologies">
        {{ technologies }}
      </div>
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
        this.comments[index] = this.editableComments[index].trim() + ' ~~Anonymous Commenter';
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
.line-container p {
  cursor: pointer;
}

h1 {
    text-align: center;
  }
  
  .technologies {
    text-align: center;
    margin-top: 20px;
    font-style: italic;
  }

.line-container p:hover {
  background-color: #f0f0f0;
}

.comment-container {
  margin-top: 10px;
}

.submitted-comment {
  color: grey;
}

/* Add additional styling as needed */
</style>
