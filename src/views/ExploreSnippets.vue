<template>
    <div class="max-w-2xl flex justify-between items-center mx-auto mt-5 rounded">
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
        :title="snippet.title"
        username="anonymous"
        :code="snippet.Text"
        :date="convertToReadableFormat(snippet.CreatedAt)"
        language="python"
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

export default {
    name: "ExploreSnippets",
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
            axios.get('http://52.211.23.142/api/v1/code_snippet/')
                .then(response => {
                        this.codeSnippets = response.data.data.map(snippet => ({
                            ...snippet,
                            title: `Snippet`, 
                        }));
                        this.filteredSnippets = this.codeSnippets;
                    }
                )
                .catch(error => {
                    console.error('There was an error fetching the code snippets:', error);
                });
        },

        fetchProgrammingLanguages() {
            axios.get('http://52.211.23.142/api/v1/program_language/')
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
                return (
                    (this.selectedLanguage ? snippet.ProgramLanguage.Name === this.selectedLanguage : true) &&
                    (
                        (this.searchQuery ? snippet.Text.toLowerCase().includes(this.searchQuery.toLowerCase()) : true) || 
                        (this.searchQuery ? snippet.title.toLowerCase().includes(this.searchQuery.toLowerCase()) : true)
                    )
                );
            });
        },
    }
}
</script>

<style scoped>
</style>
