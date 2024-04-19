<template>
      <form @submit.prevent="handleSubmit" class = "flex flex-col h-full">
        <div class = "p-10">
          <input type="text" v-model="snippetTitle" placeholder="Snippet Title" class = "bg-gray-600 text-white py-2 px-4 rounded outline-none text-2xl font-semibold" />
        </div>
        <div class="flex-grow px-10">
          <code-editor width="100%" height="100%" line-nums="true" v-model="snippetText" theme="github-dark"
            :languages="languages"
            @lang="getLanguage">
          </code-editor>
          <!-- <textarea  @input="autoResizeTextarea" class="autosize" placeholder="Snippet Text"></textarea> -->
        </div>
        <div class="flex justify-end px-10 pb-5 pt-10 text-xl">
          <label>
            <input type="checkbox" v-model="isPrivate" class="h-4 w-4"/> Private Snippet
          </label>
        </div>
        <div class="flex justify-end px-10 pt-5 pb-10">
          <button type="submit" class="bg-green-500 hover:bg-green-600 text-white text-2xl font-semibold py-2 px-4 rounded">Post It</button>
        </div>
      </form>
</template>

<script>
import axios from 'axios';
//import hljs from 'highlight.js';
import CodeEditor from '../components/codeEditor/CodeEditor.vue';
import Config from '../config.js';
//hljs.registerLanguage('javascript', javascript);
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
  computed: {
    // Computed property to get the current language name

  //   currentLanguage() {
  //     if (!this.languages.length) {
  //       return {};
  //     }
  //     return this.languages.find(lang => lang.id === this.languageId);
  //   }
  },
  mounted() {
    this.fetchLanguages();
  },
  methods: {
    fetchLanguages() {
      axios.get(Config.BACKEND_URL+'/api/v1/program_language/')
        .then(response => {
          //this.languages = response.data.data.map(language => [language.ProgramLanguageID, language.Name]);
          this.languages = response.data.data.map(language => ["javascript", language.Name]);//Temporary to test highlighting
          this.languageId = this.languages[0][0]; 
        })
        .catch(error => {
          console.error('Error fetching languages:', error);
        });
    },
    getLanguage(lang) {
      //console.log("The current language is: " + lang);
      this.languageId = lang;
    },
    sendSnippet() {
      const snippetData = {
        Text: this.snippetText,
        ProgramLanguageID: this.languageId,
        isArchived: false, // Assuming default values
        isDraft: false,
        isPrivate: this.isPrivate
      };

      axios.post(Config.BACKEND_URL+'/api/v1/code_snippet/', snippetData)
        .then(response => {
          console.log('Snippet created:', response.data);
          return true
          // Optionally, you can redirect or perform other actions after successful creation
        })
        .catch(error => {
          console.error('Error creating snippet:', error);
          return false;
        });
    },
    handleSubmit() {
      if(this.sendSnippet()){
        this.$router.push({
          name: 'CommentPage',
          query: {
            text: this.snippetText,
            title: this.snippetTitle,
            technologies: this.languageId // or a separate technologies property if you have one
          }
        });
      }
      // Assuming you have data properties for title and technologies in HomePage.vue
      

    }
    ,
    autoResizeTextarea(event) {
      event.target.style.height = 'auto';
      event.target.style.height = (event.target.scrollHeight) + 'px';
    },
  },
};
</script>

<style scoped>





</style>