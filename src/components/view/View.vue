<script setup>
import { useAudioStore } from "@/stores/audioStore.ts";
import {useRouter} from "vue-router";
import {onMounted, onUnmounted, shallowRef} from "vue";
import {useHeaderStore} from "@/stores/headerStore.js";
import ViewMenu from "@/components/view/ViewMenu.vue";

const audioStore = useAudioStore();
const headerStore = useHeaderStore();
const router = useRouter();

if (!audioStore.name) {
  router.push("/");
}

function downloadWav(uint8array, filename = 'output.wav') {
  const blob = new Blob([uint8array], { type: 'audio/wav' });

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;

  const lastDotIndex = filename.lastIndexOf(".");
  a.download = filename.substring(0, lastDotIndex) + '.wav';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

const viewMenu = shallowRef(ViewMenu);

onMounted(() => {
  document.querySelector("div#app").classList.add("active");
  headerStore.setMenuContent({
    component: viewMenu,
    props: {}
  })
  headerStore.setEmits({
    download: () => {
      downloadWav(audioStore.convertedWavBlob, audioStore.name);
    }
  })
})

onUnmounted(() => {
  document.querySelector("div#app").classList.remove("active");
  headerStore.clear()
  audioStore.clear()
})

</script>

<template>
  <div class="container">
    <span>Printable Characters</span>
    <div class="content">
      <p>{{ audioStore.decodedText.split('').filter(c => c.charCodeAt(0) >= 32 && c.charCodeAt(0) <= 126).join('') }}</p>
    </div>
  </div>

</template>

<style scoped>
div.container {
  min-height: 260px;
  
  & > span {
    
  }
}
</style>