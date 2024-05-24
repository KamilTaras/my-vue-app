<template>
    <div>
        <div v-if="codeSnippet">
            <div v-for="codeSnippetVersion in codeSnippet.CodeSnippetVersions"
                :key="codeSnippetVersion.CodeSnippetVersionID">
                <code-to-comment :Text="codeSnippetVersion.Text" :CreatedAt="codeSnippet.CreatedAt"
                    :Username="codeSnippet.User ? codeSnippet.User.username : 'anonymous'"
                    @lines="getLines"></code-to-comment>
                <div v-for="comment in comments[codeSnippetVersion.CodeSnippetVersionID]" :key="comment.id"
                :class="{'max-w-2xl mx-auto bg-gray-700 rounded p-5 my-5': true, 'border-2 border-blue-500': answering === comment.id}"
                >
                    <p class="text-gray-400 mb-4">@{{ comment.username }}</p>
                    <p><span class="text-xs font-semibold text-blue-100 bg-blue-600 px-2 py-1 rounded">Line: {{
            comment.lines[0] }}-{{ comment.lines[comment.lines.length - 1] }}</span></p>
                    <div class="w-full p-2 text-gray-300 bg-gray-800 rounded">
                        {{ comment.text }}

                    </div>
                    <div class="flext">
                        
                        <p class="text-gray-400 mt-3">{{ comment.date }}                        
                            <button @click="startAnswering(comment.id)" class="text-xs text-blue-100 font-semibold bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded float-right">Answer</button>
                        </p>
                    </div>
                </div>

                <div class="max-w-2xl mx-auto bg-gray-700 rounded p-5 my-5">
                    <div class="flex flex-col space-y-4">
                        <textarea
                            class="w-full p-2 text-gray-300 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Add a comment..." v-model="commentText"></textarea>
                        <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                            @click="submitComment(codeSnippetVersion.CodeSnippetVersionID)">Submit Comment</button>
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
import { comment } from 'postcss';
export default {
    name: "CodeSnippetPage",
    data() {
        return {
            codeSnippet: null,
            commentText: "",
            lines: [1],
            comments: {},
            answering: "",
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
        //         "codeSnippetVersionID": "string",
        //   "commentID": "string",
        //   "createdAt": "string",
        //   "isGenerated": true,
        //   "line": 0,
        //   "replyComment": "string",
        //   "replyCommentID": "string",
        //   "text": "string",
        //   "updatedAt": "string",
        //  "userID": "string"
        startAnswering(commentID) {
            this.answering = commentID;
            console.log(this.answering);
            console.log(this.comments);
        },
        submitComment(codeSnippetVersionID) {
            if (this.commentText !== '') {
                axios.post(Config.BACKEND_URL + '/api/v1/review_comment/', {
                    "codeSnippetVersionID": codeSnippetVersionID,
                    "text": this.commentText,
                    "line": this.lines[0],
                    "isGenerated": false,
                    "userID": localStorage.getItem('user_id'),
                    "replyCommentID": this.answering,
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
            console.log(this.$route.params.code_snippet_id);
            axios.get(Config.BACKEND_URL + '/api/v1/code_snippet/' + this.$route.params.code_snippet_id)
                .then(response => {
                    console.log(response.data.data);
                    this.codeSnippet = response.data.data;
                    this.comments = response.data.data.CodeSnippetVersions.reduce((acc, version) => {
                        var comments = version.ReviewComments.map(comment => {
                            return {
                                "id": comment.CommentID,
                                "text": comment.Text,
                                "lines": [comment.Line, comment.Line],
                                "date": this.convertToReadableFormat(comment.CreatedAt),
                                "username": comment.User ? comment.User.username : "anonymous",
                                "answering": comment.ReplyCommentID,
                            };
                        });
                        acc[version.CodeSnippetVersionID] = comments;
                        return acc;
                    }, {});
                    for (comment in this.comments[version.CodeSnippetVersionID]) {
                        console.log(comment);
                    }
                        
                    console.log(this.comments);
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

<style scoped></style>
