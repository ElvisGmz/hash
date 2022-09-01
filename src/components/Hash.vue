<template>
    <div class="relative flex flex-col gap-6">
      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-2">
          <Switch
            @selected="setSelected"
          />
          <h1 class="text-xl pt-4 font-bold font-sans uppercase text-blue-900">
            {{
              selected === 'text' 
              ? 'Escribe algo'
              : 'Selecciona un archivo'
            }}
          </h1>
          <input 
            name="text"
            :type="selected === 'text' ? 'text' : 'hidden'"
            class="w-full px-4 py-2.5 rounded-lg border"
            placeholder="Write a text to hash"
            required
          />
          <input 
            name="file"
            :type="selected === 'file' ? 'file' : 'hidden'"
            class="w-full file:px-4 file:py-2 cursor-pointer file:bg-blue-500 file:hover:bg-blue-700 file:text-white file:rounded-md file:border-0 file:transition-all file:duration-300 file:ease-in-out select-none p-2 bg-white rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-colors duration-300 ease-in-out">Submit</button>
      </form>
      <div class="relative overflow-y-scroll h-full flex flex-col gap-2">
        <h1 class="text-xl pt-4 font-bold font-sans uppercase text-blue-900" :class="{hidden: hashes.length === 0}">
            Resultados
          </h1>
        <div class="flex flex-col gap-4">
          <button v-for="(hash, index) in hashes" :key="index"
            @click="copyToClipboard(hash?.Digest)"
            class="relative group flex select-none items-center border rounded-lg w-full overflow-hidden bg-white" :class="{
              'pointer-events-none': isCopied
            }">
            <span class="px-4 py-2.5 min-w-[100px] h-full border-r text-blue-400 text-left text-sm font-semibold">
              {{ hash.Type }}
            </span>
            <span class="px-4 py-2.5 w-full bg-white text-left overflow-x-auto text-sm">
              {{ hash.Digest }}
            </span>
            <span class="px-2.5 py-2.5 text-blue-500 group-hover:text-blue-900 transition-colors ease-in-out duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
            <div class="absolute top-0 left-0 h-full w-full flex items-center justify-center text-center text-sm text-blue-900 bg-white pointer-events-none transition-all duration-300 ease-in-out" :class="{
              'opacity-0': isCopied !== hash.Digest,
              'opacity-100': isCopied === hash.Digest
            }">
              Copied!
            </div>
          </button>
        </div>
      </div>
    </div>
</template>

<script>
import { getHash, getFileHash } from '../queries/hash.js';
import Switch from './Switch.vue'

export default {
  name: 'Hash',
  components: {
    Switch,
  },
  data() {
    return {
      hashes: [],
      isCopied: false,
      selected: 'text',
    }
  },
  methods: {
    async handleSubmit(e) {
      e.target.reset();
      this.hashes = [];
      const formData = new FormData(e.target);
      const hashTypes = ['md4', 'md5', 'sha1', 'sha256', 'sha512'];

      hashTypes.forEach(async (hashType) => {
        if (this.selected === 'text') {
          const hash = await getHash(formData.get('text'), hashType);
          this.hashes.push(hash);
          return;
        }
        const hash = await getFileHash(formData.get('file'), hashType);
        this.hashes.push(hash);
      });
    },
    copyToClipboard(text) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.isCopied = text;
      setTimeout(() => {
        this.isCopied = false;
      }, 2000);
    },
    setSelected(value) {
      this.hashes = [];
      this.selected = value;
    }
  },
}
</script>