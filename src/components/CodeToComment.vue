<template>
    <div class="max-w-2xl mx-auto bg-gray-700 rounded p-5 my-5" @mousedown="startSelection" @mouseup="stopSelection">
        <div class="flex justify-between items-center mb-5">
            <div>
                <h1 class="text-2xl font-semibold">
                    {{ this.Title }}
                </h1>
                <p class="text-gray-400">@{{ this.Username }}</p>
            </div>
            <div class="flex space-x-2">
                <button title="Copy" class="p-2 pl-3 pr-3 bg-gray-900 hover:bg-green-700 text-white rounded-sm" @click="copySnippet($event)">
                    <i class="fas fa-copy"></i>
                </button>
                <button title="Share" class="p-2 pl-3 pr-3 bg-gray-900 hover:bg-blue-700 text-white rounded-sm ml-4" @click="shareSnippet($event)">
                    <i class="fas fa-share"></i>
                </button>
                <button title="Generate AI review" class="p-2 pl-3 pr-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-sm ml-4" @click="generateCodeReview()">
                    <i class="fas fa-wand-magic-sparkles"></i>
                </button>
            </div>
        </div>
        <div class='bg-black p-2 rounded mb-5'>
            <div v-for="(line, index) in Text.split('\n')" :key="index" 
                :class="{ 'bg-blue-800': (selectedLines[0] <= index + 1 && index + 1 <= selectedLines[1]) || (selectedLines[0] >= index + 1 && index + 1 >= selectedLines[1])||(lastSelectedLines[0] <= index + 1 && index + 1 <= lastSelectedLines[1]) || (lastSelectedLines[0] >= index + 1 && index + 1 >= lastSelectedLines[1])}"
                :data-line="index + 1" @mouseenter="addToSelection" 
                @mousedown = "firstAddToSelection" >
                <pre>{{index+1}}	{{ line }}</pre>
            </div>
        </div>
        <div v-if="showLoading" class="items-center justify-items-center">
            <img height="100px" width="100px" src="@/assets/loading.gif">
        </div>
        <div v-if="this.generatedReview" class="w-full p-4 text-gray-300 bg-gray-800 rounded">
            <h3 class="text-right text-yellow-600"><i class="fas fa-wand-magic-sparkles"></i> AI Review</h3><br>
            <p>{{ this.generatedReview }}</p>
        </div>
        <div class="flex justify-between">
            <p class="text-gray-400 mt-3">{{ convertToReadableFormat(CreatedAt) }}</p>
        </div>
        <div v-if="showCopyNotification" class="fixed bg-gray-800 text-white p-2 rounded text-sm" :style="notificationStyle">
            Code snippet copied!
        </div>
        <div v-if="showShareNotification" class="fixed bg-gray-800 text-white p-2 rounded text-sm" :style="notificationStyle">
            Link copied!
        </div>
    </div>
</template>

<script>
import { BedrockRuntimeClient, InvokeModelWithResponseStreamCommand } from "@aws-sdk/client-bedrock-runtime";

export default {
    name: 'CodeToComment',
    props: {
        Title: String,
        Text: String,
        CreatedAt: String,
        Username: String,
        CodeSnippetID: String,
    },
    data() {
        return {
            generatedReview: null,
            selectedLines: [],
            lastSelectedLines: [],
            mouseIsDown: false,
            showShareNotification: false,
            showCopyNotification: false,
            showLoading: false,
            notificationStyle: {
                top: '0px',
                left: '0px'
            },
        };
    },
    methods: {
        copySnippet(event) {
            const codeSnippet = this.Text;
            navigator.clipboard.writeText(codeSnippet).then(() => {
                this.showTempNotification(event, "copy");
            }).catch(err => {
                console.error('Failed to copy code snippet: ', err);
            });
        },

        shareSnippet(event) {
            const link = `https://codereview.com/code_snippet/${this.CodeSnippetID}`;
            navigator.clipboard.writeText(link).then(() => {
                this.showTempNotification(event, "share");
            }).catch(err => {
                console.error('Failed to copy link: ', err);
            });
        },

        showTempNotification(event, notificationType) {
            if (event) {
                const { clientX: x, clientY: y } = event;
                this.notificationStyle.top = `${y}px`;
                this.notificationStyle.left = `${x}px`;
            }
            if (notificationType == "share") {
                this.showShareNotification = true;
            } else {
                this.showCopyNotification = true;
            }
            setTimeout(() => {
                if (notificationType == "share") {
                    this.showShareNotification = false;
                } else {
                    this.showCopyNotification = false;
                }
            }, 2000);
        },

        async generateCodeReview() {
            this.showLoading = true;
            const snippetText = this.Text;
            const client = new BedrockRuntimeClient({ region: "us-east-1", credentials: {accessKeyId: process.env.VUE_APP_AWS_ACCESS_KEY_ID, secretAccessKey: process.env.VUE_APP_AWS_SECRET_ACCESS_KEY} });
            const modelId = "meta.llama2-13b-chat-v1";
            const userMessage = `Please review the following code and provide feedback:\n\n${snippetText}
                                DO NOT PROVIDE ANY CODE. DO NOT USE markdown syntax. 
                                DO NOT START YOUR RESPONSE WITH "Sure". Your response should be as one paragraph without 
                                new lines`;
            const prompt = `<s>[INST] ${userMessage} [/INST]`;

            const request = {
                prompt,
                max_gen_len: 512,
                temperature: 0.5,
                top_p: 0.9,
            };

            try {
                const responseStream = await client.send(
                new InvokeModelWithResponseStreamCommand({
                    contentType: "application/json",
                    body: JSON.stringify(request),
                    modelId,
                })
                );

                this.generatedReview = "";
                for await (const event of responseStream.body) {
                    const chunk = JSON.parse(new TextDecoder().decode(event.chunk.bytes));
                    if (chunk.generation) {
                        this.generatedReview += chunk.generation;
                        this.showLoading = false;
                    }
                }
            } catch (error) {
                console.error('Error generating code review:', error);
            }
        },

        convertToReadableFormat(datetimeStr) {
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
            const date = new Date(datetimeStr);
            return date.toLocaleDateString('en-US', options);
        },
        startSelection() {
            this.lastSelectedLines = [];
            this.mouseIsDown = true;
        },
        stopSelection() {
            this.mouseIsDown = false;
            this.getSelectedLines();
        },
        firstAddToSelection(event) {
            const lineNumber = parseInt(event.currentTarget.getAttribute('data-line'));
            this.selectedLines[0]=lineNumber;
        },
        addToSelection(event) {
            if (this.mouseIsDown) {
                const lineNumber = parseInt(event.currentTarget.getAttribute('data-line'));
                this.selectedLines[1] = lineNumber;
                
            }
        },
        getSelectedLines() {
            this.$emit("lines", this.selectedLines.sort());
            console.log(this.selectedLines);
            this.lastSelectedLines = this.selectedLines;
            this.selectedLines = [];
        },
        copyToClipboard() {
            const lines = this.Text.split('\n');
            const selectedText = this.lastSelectedLines.map(lineNumber => lines[lineNumber - 1]).join('\n');

            const textarea = document.createElement('textarea');
            textarea.value = selectedText;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            this.showNotification = true; // Show notification
            setTimeout(() => {
                this.showNotification = false; // Hide notification after 2 seconds
            }, 2000);
        },
        showShareDialog() {
            this.shareDialogVisible = true;
        },
        hideShareDialog() {
            this.shareDialogVisible = false;
        },
        copyLinkToClipboard() {
            const link = window.location.href; // Example link, you can customize this
            const textarea = document.createElement('textarea');
            textarea.value = link;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            this.showLinkNotification = true; // Show link notification
            setTimeout(() => {
                this.showLinkNotification = false; // Hide link notification after 2 seconds
            }, 2000);
        },
        shareOnPlatform(platform) {
            const link = encodeURIComponent(window.location.href); // Example link, you can customize this
            let url = '';
            if (platform === 'twitter') {
                url = `https://twitter.com/intent/tweet?url=${link}`;
            } else if (platform === 'reddit') {
                url = `https://www.reddit.com/submit?url=${link}`;
            }
            window.open(url, '_blank');
        }
    }
}
</script>
