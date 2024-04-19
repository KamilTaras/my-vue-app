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
                </div>
            </div>

            <div class="max-w-2xl mx-auto bg-gray-700 rounded p-5 my-5" 
            v-for="comment in comments"
            :key="comment.id">
                <p class="text-gray-400 mb-4">@anonymous</p>
                <p><span class="text-xs font-semibold text-blue-100 bg-blue-600 px-2 py-1 rounded">Line: {{ comment.lineNumber }}</span></p>
                <div class="w-full p-2 text-gray-300 bg-gray-800 rounded">
                    {{ comment.text }}
                </div>
                <div class="flext">
                 <p class="text-gray-400 mt-3">{{ comment.date }}</p>
                </div>
            </div>

            <div class="max-w-2xl mx-auto bg-gray-700 rounded p-5 my-5">
                <div class="flex flex-col space-y-4">
                    <textarea class="w-full p-2 text-gray-300 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Add a comment..."
                              v-model="commentText"></textarea>
                    <input type="number" 
                           class="w-full p-2 text-gray-300 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="Line number"
                           v-model="lineNumber" min=1/>
                    <button class="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
                            @click="submitComment()">Submit Comment</button>
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
            commentText: "",
            lineNumber: 1,
            comments: [],
        };
    },
    created() {
        this.fetchCodeSnippet();
    },
    methods: {
        submitComment() {
            if (this.commentText !== '') {
                this.comments.push(
                    {
                        "id": Math.random() * (15 - 0) + 0,
                        "text": this.commentText,
                        "lineNumber": this.lineNumber,
                        "date": new Date().toLocaleDateString(),
                    }
                );
                this.commentText = "";
                this.lineNumber = 1;
            }
        },

        fetchCodeSnippet() {
            console.log(this.$route.params.code_snippet_id);
            axios.get('http://52.211.23.142/api/v1/code_snippet/' + this.$route.params.code_snippet_id)
                .then(response => {
                        console.log(response.data.data);
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
