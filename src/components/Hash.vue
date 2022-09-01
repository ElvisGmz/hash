<template>
    <div class="relative flex flex-col gap-6">
      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium leading-5 text-blue-900" for="text">
            Text
          </label>
          <input id="text" name="text" type="text" class="w-full px-4 py-2.5 rounded-lg"
            placeholder="Write a text to hash" />
        </div>
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-colors duration-300 ease-in-out">Submit</button>
      </form>
      <div class="relative overflow-y-scroll h-full">
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
import { getHash } from '../queries/hash.js';

export default {
  name: 'Hash',
  data() {
    return {
      hashes: [],
      isCopied: false,
    }
  },
  methods: {
    async handleSubmit(e) {
      const formData = new FormData(e.target);
      const text = formData.get('text');
      if (!text) {
        this.hashes = [];
        return;
      }
      this.hashes = [];
      const hashTypes = ['md4', 'md5', 'sha1', 'sha256', 'sha512'];
      hashTypes.forEach(async (hashType) => {
        const hash = await getHash(text, hashType);
        this.hashes.push(hash);
      });
      console.log(this.hashes);
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
  },
}
</script>