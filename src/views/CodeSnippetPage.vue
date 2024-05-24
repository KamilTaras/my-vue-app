<template>
    <div>
        <div v-if="codeSnippet">
            <div v-for="codeSnippetVersion in codeSnippet.CodeSnippetVersions" :key="codeSnippetVersion.CodeSnippetVersionID">
                <!-- Copy and share snippet buttons -->
                <div class="flex justify-center mb-5">
                    <div class="max-w-2xl bg-gray-700 rounded p-5">
                        <button class="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded" @click="copySnippet(codeSnippetVersion.CodeSnippetVersionID, codeSnippetVersion.Text)">Copy Snippet</button>
                        <button class="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded ml-4" @click="shareSnippet(codeSnippetVersion.CodeSnippetVersionID)">Share Snippet</button>
                    </div>
                </div>

                <!-- Code snippet display -->
                <code-to-comment :Text="codeSnippetVersion.Text" :CreatedAt="codeSnippet.CreatedAt" :Username="codeSnippet.User ? codeSnippet.User.username : 'anonymous'" @lines="getLines"></code-to-comment>

                <!-- Comments section -->
                <div class="max-w-2xl mx-auto bg-gray-700 rounded p-5 my-5" v-for="comment in comments[codeSnippetVersion.CodeSnippetVersionID]" :key="comment.id">
                    <!-- Comment details -->
                    <p class="text-gray-400 mb-4">@{{ comment.username }}</p>
                    <p><span class="text-xs font-semibold text-blue-100 bg-blue-600 px-2 py-1 rounded">Line: {{ comment.lines[0] }}-{{ comment.lines[comment.lines.length - 1] }}</span></p>
                    <div class="w-full p-2 text-gray-300 bg-gray-800 rounded">
                        {{ comment.text }}
                    </div>
                    <div class="flext">
                        <p class="text-gray-400 mt-3">{{ comment.date }}</p>
                    </div>
                </div>

                <!-- Add comment section -->
                <div class="max-w-2xl mx-auto bg-gray-700 rounded p-5 my-5">
                    <div class="flex flex-col space-y-4">
                        <textarea class="w-full p-2 text-gray-300 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Add a comment..." v-model="commentText"></textarea>
                        <button class="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded" @click="submitComment(codeSnippetVersion.CodeSnippetVersionID)">Submit Comment</button>
                    </div>
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
import Config from '../config.js';
import CodeToComment from '../components/CodeToComment.vue';

export default {
    name: "CodeSnippetPage",
    data() {
        return {
            codeSnippet: null,
            commentText: "",
            lines: [1],
            comments: {},
            snippetURL: "",
        };
    },
    created() {
        this.fetchCodeSnippet();
    },
    components: {
        CodeToComment,
    },
    methods: {
        getLines(lines) {
            this.lines = lines;
        },
        submitComment(codeSnippetVersionID) {
            if (this.commentText !== '') {
                axios.post(Config.BACKEND_URL + '/api/v1/review_comment/', {
                    "codeSnippetVersionID": codeSnippetVersionID,
                    "text": this.commentText,
                    "line": this.lines[0],
                    "isGenerated": false,
                    "userID": localStorage.getItem('user_id'),
                })
                .then(response => {
                    console.log(response.data);
                    this.fetchCodeSnippet()
                })
                .catch(error => {
                    console.error('There was an error posting the comment:', error);
                });
            }
            this.commentText = "";
        },
        fetchCodeSnippet() {
            axios.get(Config.BACKEND_URL + '/api/v1/code_snippet/' + this.$route.params.code_snippet_id)
            .then(response => {
                console.log(response.data.data);
                this.codeSnippet = response.data.data;
                this.snippetURL = window.location.href; // Get the current URL
                this.comments = response.data.data.CodeSnippetVersions.reduce((acc, version) => {
                    var comments = version.ReviewComments.map(comment => {
                        return {
                            "id": comment.ReviewCommentID,
                            "text": comment.Text,
                            "lines": [comment.Line, comment.Line],
                            "date": this.convertToReadableFormat(comment.CreatedAt),
                            "username": comment.User ? comment.User.username : "anonymous",
                        };
                    });
                    acc[version.CodeSnippetVersionID] = comments;
                    return acc;
                }, {});
                console.log(this.comments);
            })
            .catch(error => {
                console.error('There was an error fetching the code snippet:', error);
            });
        },
        convertToReadableFormat(datetimeStr) {
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
            const date = new Date(datetimeStr);
            return date.toLocaleDateString('en-US', options);
        },
        shareSnippet(codeSnippetVersionID, snippetText) {
    // Create a temporary textarea element to copy the snippet code
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = snippetText;
    document.body.appendChild(tempTextarea);

    // Select the text within the textarea
    tempTextarea.select();
    tempTextarea.setSelectionRange(0, 99999); /* For mobile devices */

    // Copy the selected text
    document.execCommand('copy');

    // Remove the textarea element
    document.body.removeChild(tempTextarea);

    // Compose the message to be shared on Reddit
    const redditMessage = `Check out this snippet!\n\n${snippetText}\n\n${this.snippetURL}`;

    // Show a dialog with the snippet URL and option to share on Reddit
    const shareDialog = confirm(`Share this snippet: ${this.snippetURL}\n\nWould you like to share it on Reddit?`);
    if (shareDialog) {
        // If user wants to share on Reddit, navigate to Reddit share URL
        const redditShareURL = `https://www.reddit.com/submit?title=SnippetCode&textbox=${encodeURIComponent(redditMessage)}`;
        window.open(redditShareURL, "_blank");
    }
},

        copySnippet(codeSnippetVersionID, snippetText) {
            // Create a temporary textarea element
            const tempTextarea = document.createElement('textarea');
            tempTextarea.value = snippetText;
            document.body.appendChild(tempTextarea);
            
            // Select the text within the textarea
            tempTextarea.select();
            tempTextarea.setSelectionRange(0, 99999); /* For mobile devices */
            
            // Copy the selected text
            document.execCommand('copy');
            
            // Remove the textarea element
            document.body.removeChild(tempTextarea);
            
            // Optionally, provide feedback to the user
            alert('Snippet copied to clipboard!');
        }
    }
}
</script>

<style scoped></style>
