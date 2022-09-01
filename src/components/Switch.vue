<template>
    <div class="grid grid-cols-2 border rounded-lg divide-x overflow-hidden">
        <button 
            @click="setSelected('text')"
            class="px-4 py-2.5 transition-all duration-300 ease-in-out" 
            :class="{
                'bg-blue-500 text-white': selected === 'text',
                'bg-blue-200 text-blue-700': selected === 'file',
            }"
        >
            Text
        </button>
        <button 
            @click="setSelected('file')"
            class="px-4 py-2.5 transition-all duration-300 ease-in-out" 
            :class="{
                'bg-blue-500 text-white': selected === 'file',
                'bg-blue-200 text-blue-900': selected === 'text',
            }"
        >
            File
        </button>
    </div>
</template>

<script>
export default {
    name: 'Switch',
    data() {
        return {
            selected: 'text'
        }
    },
    methods: {
        setSelected(value) {
            this.selected = value
            this.$emit('selected', value)
        },
    },
}
</script>
