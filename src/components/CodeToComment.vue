<template>
    <div>
        <!-- Notification -->
        <div v-if="showNotification" class="fixed top-0 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded mt-2 z-50">
            Snippet copied to clipboard!
        </div>
        <div v-if="showLinkNotification" class="fixed top-0 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded mt-2 z-50">
            Link copied to clipboard!
        </div>
        
        <div class="max-w-2xl mx-auto bg-gray-700 rounded p-5 my-5" @mousedown="startSelection" @mouseup="stopSelection">
            <p class="text-gray-400 mb-4">@{{ this.Username }}</p>
            <div class='bg-black p-2 rounded'>
                <div v-for="(line, index) in Text.split('\n')" :key="index" 
                    :class="{ 'bg-blue-800': selectedLines.includes(index + 1) || lastSelectedLines.includes(index + 1)}"
                    :data-line="index + 1" @mouseenter="addToSelection" 
                    @mousedown="firstAddToSelection">
                    <pre>{{index+1}}    {{ line }}</pre>
                </div>
            </div>
            <div class="flex justify-between items-center mt-3">
                <p class="text-gray-400">{{ convertToReadableFormat(CreatedAt) }}</p>
                <div class="flex space-x-3">
                    <button @click="copyToClipboard" class="bg-blue-500 text-white px-4 py-2 rounded">Copy to Clipboard</button>
                    <button @click="showShareDialog" class="bg-green-500 text-white px-4 py-2 rounded">Share</button>
                </div>
            </div>

            <!-- Share Dialog -->
            <div v-if="shareDialogVisible" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                <div class="bg-white p-5 rounded shadow-lg w-96">
                    <h3 class="text-lg font-bold mb-3">Share this snippet</h3>
                    <button @click="copyLinkToClipboard" class="bg-blue-500 text-white px-3 py-2 rounded mb-2 w-full">Copy Link</button>
                    <button @click="shareOnPlatform('twitter')" class="bg-blue-400 text-white px-3 py-2 rounded mb-2 w-full">Share on Twitter</button>
                    <button @click="shareOnPlatform('reddit')" class="bg-orange-500 text-white px-3 py-2 rounded mb-2 w-full">Share on Reddit</button>
                    <button @click="hideShareDialog" class="bg-gray-500 text-white px-3 py-2 rounded w-full">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CodeToComment',
    props: {
        Text: String,
        CreatedAt: String,
        Username: String,
    },
    data() {
        return {
            selectedLines: [],
            lastSelectedLines: [],
            mouseIsDown: false,
            shareDialogVisible: false,
            showNotification: false, // Notification for copying snippet
            showLinkNotification: false, // Notification for copying link
        };
    },
    methods: {
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
            this.selectedLines.push(lineNumber);
        },
        addToSelection(event) {
            if (this.mouseIsDown) {
                const lineNumber = parseInt(event.currentTarget.getAttribute('data-line'));
                if (!this.selectedLines.includes(lineNumber)) {
                    this.selectedLines.push(lineNumber);
                }
            }
        },
        getSelectedLines() {
            this.$emit("lines", this.selectedLines);
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
