<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col h-full">
    <div class="p-10">
      <input ref="title" type="text" v-model="snippetTitle" placeholder="Title" class="bg-gray-600 text-white py-2 px-4 rounded outline-none text-2xl font-semibold" />
    </div>
    <div class="flex-grow px-10">
      <code-editor ref="codeEditor" width="100%" height="100%" line-nums="true" v-model="snippetText" theme="github-dark"
        :languages="languages"
        @lang="getLanguage">
      </code-editor>
    </div>
    <div class="flex justify-end px-10 pb-5 pt-10 text-xl">
      <label>
        <input ref="privateCheckbox" type="checkbox" v-model="isPrivate" class="h-4 w-4"/> Private Snippet
      </label>
    </div>
    <div class="flex justify-between px-10 pt-5 pb-10">
      <button type="button" @click="startTutorial" class="bg-blue-500 hover:bg-blue-600 text-white text-2xl font-semibold py-2 px-4 rounded">Start Tutorial</button>
      <button ref="submitButton" type="submit" class="bg-green-500 hover:bg-green-600 text-white text-2xl font-semibold py-2 px-4 rounded">Post It</button>
    </div>
  </form>
</template>

<script>
import axios from 'axios';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import CodeEditor from '../components/codeEditor/CodeEditor.vue';
import Config from '../config.js';

export default {
  components: {
    CodeEditor
  },
  data() {
    return {
      snippetTitle: '',
      snippetText: '',
      languageId: '',
      isPrivate: false,
      languages: [[]],
    };
  },
  mounted() {
    this.fetchLanguages();
  },
  methods: {
    fetchLanguages() {
      axios.get(Config.BACKEND_URL + '/api/v1/program_language/')
        .then(response => {
          this.languages = response.data.data.map(language => [language.ProgramLanguageID, language.Name]);
          this.languageId = this.languages[0][0];
        })
        .catch(error => {
          console.error('Error fetching languages:', error);
        });
    },
    getLanguage(lang) {
      this.languageId = lang;
    },
    sendSnippet() {
      const snippetData = {
        Title: this.snippetTitle,
        UserID: localStorage.getItem('user_id'),
        isArchived: false,
        isDraft: false,
        isPrivate: this.isPrivate
      };
      console.log(snippetData);
      let codeSnippetID = null;
      axios.post(Config.BACKEND_URL + '/api/v1/code_snippet/', snippetData)
        .then(response => {
          codeSnippetID = response.data.data.CodeSnippetID;
          console.log(codeSnippetID);

          const snippetVersionData = {
            CodeSnippetID: codeSnippetID,
            Text: this.snippetText,
            ProgramLanguageID: this.languageId,
          };

          return axios.post(Config.BACKEND_URL + '/api/v1/code_snippet_version/', snippetVersionData);
        })
        .then(response => {
          console.log('Snippet version created:', response.data);
          this.$router.push("/code_snippet/" + codeSnippetID);
        })
        .catch(error => {
          console.error('Error creating snippet:', error);
          return false;
        });

    },
    handleSubmit() {
      if (this.sendSnippet()) {
        this.$router.push({
          name: 'CommentPage',
          query: {
            text: this.snippetText,
            title: this.snippetTitle,
            technologies: this.languageId
          }
        });
      }
    },
    autoResizeTextarea(event) {
      event.target.style.height = 'auto';
      event.target.style.height = (event.target.scrollHeight) + 'px';
    },
    startTutorial() {
      this.$nextTick(() => {
        setTimeout(() => {
          const intro = introJs();
          intro.setOptions({
            steps: [
              {
                element: this.$refs.title,
                intro: "Enter the title of your code snippet here."
              },
              {
                element: this.$refs.codeEditor.$el, // Ensure we reference the actual element
                intro: "Write your code snippet in this editor."
              },
              {
                element: this.$refs.privateCheckbox,
                intro: "Check this box to make your snippet private."
              },
              {
                element: this.$refs.submitButton,
                intro: "Click here to post your snippet."
              }
            ]
          });
          intro.start();
        }, 500); // Adjust the delay as needed
      });
    }
  }
};
</script>

<style scoped>
/* Add any styles if necessary */
</style>
