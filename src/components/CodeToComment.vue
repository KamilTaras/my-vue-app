<template>
    <div class="max-w-2xl mx-auto bg-gray-700 rounded p-5 my-5" @mousedown="startSelection" @mouseup="stopSelection">
        <p class="text-gray-400 mb-4">@anonymous</p>
        <div v-for="(line, index) in Text.split('\n')" :key="index" 
            :class="{ 'bg-yellow-200': selectedLines.includes(index + 1) || lastSelectedLines.includes(index + 1)}"
            :data-line="index + 1" @mouseenter="addToSelection" 
            @mousedown = "firstAddToSelection" >
            <pre>{{index+1}}	{{ line }}</pre>
        </div>
        <div class="flex justify-between">
            <p class="text-gray-400 mt-3">{{ convertToReadableFormat(CreatedAt) }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CodeToComment',
    props: {
        Text: String,
        CreatedAt: String,
    },
    data() {
        return {
            selectedLines: [],
            lastSelectedLines: [],
            mouseIsDown: false,
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

            //this.addToSelection(event);
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
            // Now you can use the selectedLines array
        }
    }
}
</script>