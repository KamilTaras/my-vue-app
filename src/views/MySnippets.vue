<template>
    <div class="max-w-2xl flex justify-between items-center mx-auto mt-5 rounded">
      <h2>My snippets</h2>
      <!-- Dropdown for languages -->
      <select v-model="selectedLanguage" @change="filterSnippets" class="bg-gray-600 text-white p-2 rounded outline-none">
        <option value="">All Languages</option>
        <option v-for="language in languages" :key="language.ProgramLanguageID" :value="language.Name">{{ language.Name }}</option>
      </select>

      <!-- Search input -->
      <input
        v-model="searchQuery"
        @input="filterSnippets"
        type="search"
        placeholder="Search snippets..."
        class="bg-gray-600 text-white p-2 rounded outline-none"
      />
    </div>
    
    <!-- Code snippets list -->
    <div v-if="filteredSnippets.length">
      <CodeSnippetPreview
        v-for="snippet in filteredSnippets"
        :key="snippet.CodeSnippetID"
        :title="snippet.Title"
        :username="snippet.User ? snippet.User.username : 'anonymous'"
        :code="snippet.CodeSnippetVersions[snippet.CodeSnippetVersions.length - 1].Text"
        :date="convertToReadableFormat(snippet.CreatedAt)"
        :language="snippet.CodeSnippetVersions[snippet.CodeSnippetVersions.length - 1].ProgramLanguage.Name"
        :snippetId="snippet.CodeSnippetID"
      />
    </div>

    <!-- Message when no snippets are found -->
    <div v-else class="text-center text-gray-400 my-5">
      Snippets not found
    </div>

</template>

<script>
import axios from 'axios';

import CodeSnippetPreview from "@/components/CodeSnippetPreview.vue"
import Config from "../config.js"
export default {
    name: "MySnippets",
    components: { CodeSnippetPreview },
    data() {
        return {
            selectedLanguage: '',
            searchQuery: '',
            codeSnippets: [],
            filteredSnippets: [],
            languages: [],
        };
    },
    created() {
        this.fetchCodeSnippets();
        this.fetchProgrammingLanguages();
    },
    methods: {
        fetchCodeSnippets() {
            let user_token = localStorage.getItem('user-token');
            let user_id = localStorage.getItem('user_id');
            axios.defaults.headers.common['Authorization'] = `Bearer ${user_token}`; // Set default header for all requests
            axios.get(Config.BACKEND_URL+'/api/v1/user_code_snippet/'+user_id)
                .then(response => {
                        this.codeSnippets = response.data.data.filter( snippet => {
                            return snippet.CodeSnippetVersions.length > 0
                        });
                        console.log(this.codeSnippets);
                        this.filteredSnippets = this.codeSnippets;
                    }
                )
                .catch(error => {
                    console.error('There was an error fetching the code snippets:', error);
                });
        },

        fetchProgrammingLanguages() {
            axios.get(Config.BACKEND_URL+'/api/v1/program_language/')
                .then(response => {
                        this.languages = response.data.data;
                    }
                )
                .catch(error => {
                    console.error('There was an error fetching the programming languages:', error);
                });
        },

        convertToReadableFormat(datetimeStr) {
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
            const date = new Date(datetimeStr);
            return date.toLocaleDateString('en-US', options);
        },

        filterSnippets() {
            this.filteredSnippets = this.codeSnippets.filter(snippet => {
                const codeSnippetVersion = snippet.CodeSnippetVersions[snippet.CodeSnippetVersions.length - 1];
                return (
                    (this.selectedLanguage ? codeSnippetVersion.ProgramLanguage.Name === this.selectedLanguage : true) &&
                    (
                        (this.searchQuery ? codeSnippetVersion.Text.toLowerCase().includes(this.searchQuery.toLowerCase()) : true) || 
                        (this.searchQuery ? snippet.Title.toLowerCase().includes(this.searchQuery.toLowerCase()) : true)
                    )
                );
            });
        },
    }
}
</script>

<style scoped>
</style>
