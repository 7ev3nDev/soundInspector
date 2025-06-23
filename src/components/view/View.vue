<script setup>
import { useAudioStore } from "@/stores/audioStore.ts";
import {useRouter} from "vue-router";
import {onMounted, onUnmounted, shallowRef} from "vue";
import {useHeaderStore} from "@/stores/headerStore.js";
import ViewMenu from "@/components/view/ViewMenu.vue";
import { ref } from 'vue'

const audioStore = useAudioStore();
const headerStore = useHeaderStore();
const router = useRouter();

import WaveSurfer from 'wavesurfer.js'
import SpectrogramPlugin from 'wavesurfer.js/dist/plugins/spectrogram.esm.js'
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'

const waveformRef = ref(null)
let wavesurfer = null

// TODO: add zoom support

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
      downloadWav(audioStore.convertedWavBytes, audioStore.name);
    }
  })

  if (audioStore.convertedWavBytes) {
    const blob = new Blob([audioStore.convertedWavBytes], { type: 'audio/wav' })
    const url = URL.createObjectURL(blob)

    wavesurfer = WaveSurfer.create({
      container: waveformRef.value,
      waveColor: '#8ecae6',
      progressColor: '#219ebc',
      height: 128,
      scrollParent: true,
      autoCenter: true,
      dragToSeek: true,
      fillParent: true,
      mediaControls: true,
      autoScroll: true,
      plugins: [
        SpectrogramPlugin.create({
          labels: true,
          height: 200,
          scale: 'mel'
        }),
        Hover.create({
          lineColor: '#ff0000',
          lineWidth: 2,
          labelBackground: '#555',
          labelColor: '#fff',
          labelSize: '11px',
        }),
      ]
    })

    wavesurfer.load(url)
  }
});

onUnmounted(() => {
  document.querySelector("div#app").classList.remove("active");
  headerStore.clear()
  audioStore.clear()
  if (wavesurfer) wavesurfer.destroy()
})

</script>

<template>
  <div class="container">
    <span>Audio Viewer - Wave + Spectogram</span>
    <div class="content waveform" ref="waveformRef"></div>
  </div>
  
  <div class="container">
    <span>Printable Characters</span>
    <div class="content">
      <p>{{ audioStore.decodedText.split('').filter(c => c.charCodeAt(0) >= 32 && c.charCodeAt(0) <= 126).join('') }}</p>
    </div>
  </div>
  
  <div class="container credits">
    <div class="content ">
      Made with <3 by Paolones - Using wavesurfer.js
    </div>
  </div>
</template>

<style>

.waveform, .spectrogram {
  width: 100%;

  & > div {
    width: 100%;
  }
}
</style>

<style scoped>
div.container {
  display: flex;
  flex-direction: column;

  margin-bottom: 16px;
}

.content {
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 100%;
  flex: 1;
  
}

.waveform {
  max-height: unset!important;
}

.credits {
  max-width: fit-content;
}

</style>