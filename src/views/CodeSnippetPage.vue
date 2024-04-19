<template>
    <div>
        <div v-if="codeSnippet">
            <div class="max-w-2xl mx-auto bg-gray-700 rounded p-5 my-5">
                <p class="text-gray-400 mb-4">@anonymous</p>
                <highlightjs 
                    language="python"
                    :code="codeSnippet.Text" />
                <div class="flex justify-between">
                <p class="text-gray-400 mt-3">{{ convertToReadableFormat(codeSnippet.CreatedAt) }}</p>
                <RouterLink :to ="`/comments/${codeSnippetId}`">Add comment</RouterLink>
                </div>
            </div>
        </div>

        <!-- Message when no snippets are found -->
        <div v-else class="text-center text-gray-400 my-5">
            Snippet not found
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "CodeSnippetPage",
    data() {
        return {
            codeSnippet: null,
            codeSnippetId: null,
        };
    },
    created() {
        this.fetchCodeSnippet();
    },
    methods: {
        fetchCodeSnippet() {
            console.log(this.$route.params.code_snippet_id);
            axios.get('http://52.211.23.142/api/v1/code_snippet/' + this.$route.params.code_snippet_id)
                .then(response => {
                        console.log(response.data.data);
                        this.codeSnippetId = this.$route.params.code_snippet_id
                        this.codeSnippet = response.data.data;
                    }
                )
                .catch(error => {
                    console.error('There was an error fetching the code snippet:', error);
                });
        },

        convertToReadableFormat(datetimeStr) {
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
            const date = new Date(datetimeStr);
            return date.toLocaleDateString('en-US', options);
        },
    }
}
</script>

<style scoped>
</style>
